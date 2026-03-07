const { supabaseAdmin } = require('../config/supabase');
const profileRepository = require('../repositories/profile.repository');
const ApiError = require('../utils/ApiError');

class AuthService {
  /**
   * Email/Password ile kayıt
   */
  async register({ email, password, fullName }) {
    // Supabase Auth ile kullanıcı oluştur
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Email doğrulamayı atla (geliştirme için)
      user_metadata: { full_name: fullName },
    });

    if (error) {
      if (error.message.includes('already been registered')) {
        throw ApiError.conflict('Bu email adresi zaten kayıtlı');
      }
      throw ApiError.badRequest(error.message);
    }

    // Profil oluştur
    const profile = await profileRepository.create({
      authId: data.user.id,
      email: data.user.email,
      fullName,
    });

    return { user: data.user, profile };
  }

  /**
   * Email/Password ile giriş
   */
  async login({ email, password }) {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw ApiError.unauthorized('Geçersiz email veya şifre');
    }

    // Profil bilgisini çek
    const profile = await profileRepository.findByAuthId(data.user.id);

    return {
      user: data.user,
      session: data.session,
      profile,
    };
  }

  /**
   * Token'ı yenile
   */
  async refreshToken(refreshToken) {
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw ApiError.unauthorized('Oturum yenilenemedi');
    }

    return { session: data.session };
  }

  /**
   * Çıkış yap
   */
  async logout(userId) {
    // Supabase admin ile session'ı sonlandır (opsiyonel)
    // Admin client ile tüm session'ları sonlandırmak isterseniz:
    // await supabaseAdmin.auth.admin.signOut(userId);
    return { message: 'Çıkış başarılı' };
  }

  /**
   * Şifre sıfırlama emaili gönder
   */
  async forgotPassword(email) {
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: 'askidamama://reset-password',
    });

    if (error) {
      throw ApiError.badRequest('Şifre sıfırlama emaili gönderilemedi');
    }

    return { message: 'Şifre sıfırlama emaili gönderildi' };
  }

  /**
   * Şifre güncelle
   */
  async updatePassword(userId, newPassword) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      throw ApiError.badRequest('Şifre güncellenemedi');
    }

    return { message: 'Şifre güncellendi' };
  }

  /**
   * Mevcut kullanıcı bilgilerini getir
   */
  async getMe(authId) {
    const profile = await profileRepository.findByAuthId(authId);
    if (!profile) {
      throw ApiError.notFound('Profil bulunamadı');
    }
    return profile;
  }
}

module.exports = new AuthService();
