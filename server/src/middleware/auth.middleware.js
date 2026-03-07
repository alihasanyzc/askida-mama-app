const { supabaseAdmin } = require('../config/supabase');
const ApiError = require('../utils/ApiError');
const prisma = require('../config/prisma');

/**
 * Supabase Auth Middleware
 * Authorization header'daki JWT token'ı doğrular
 * ve kullanıcı profilini req.user'a ekler
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token bulunamadı');
    }

    const token = authHeader.split(' ')[1];

    // Supabase ile token doğrula
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw ApiError.unauthorized('Geçersiz veya süresi dolmuş token');
    }

    // Prisma'dan profil bilgisini çek
    let profile = await prisma.profile.findUnique({
      where: { authId: user.id },
    });

    // Profil yoksa oluştur (ilk login)
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          authId: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || null,
          avatarUrl: user.user_metadata?.avatar_url || null,
        },
      });
    }

    // Request'e kullanıcı bilgisini ekle
    req.user = {
      id: profile.id,
      authId: user.id,
      email: profile.email,
      role: profile.role,
      profile,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Kimlik doğrulama başarısız'));
    }
  }
};

/**
 * Opsiyonel Auth Middleware
 * Token varsa doğrular, yoksa devam eder
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      req.user = null;
      return next();
    }

    const profile = await prisma.profile.findUnique({
      where: { authId: user.id },
    });

    req.user = profile
      ? {
          id: profile.id,
          authId: user.id,
          email: profile.email,
          role: profile.role,
          profile,
        }
      : null;

    next();
  } catch {
    req.user = null;
    next();
  }
};

/**
 * Rol bazlı yetkilendirme
 * @param  {...string} roles - İzin verilen roller
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Giriş yapmanız gerekiyor'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Bu işlem için yetkiniz yok'));
    }

    next();
  };
};

module.exports = { authenticate, optionalAuth, authorize };
