const { supabaseAdmin } = require('../config/supabase');
const ApiError = require('../utils/ApiError');

/**
 * Supabase Storage Service
 * Dosya yükleme, silme ve URL oluşturma işlemleri
 */
class StorageService {
  constructor() {
    this.bucket = 'uploads';
  }

  /**
   * Dosya yükle
   * @param {Buffer} fileBuffer - Dosya buffer'ı
   * @param {string} fileName - Dosya adı
   * @param {string} folder - Klasör (avatars, posts, bowls, vb.)
   * @param {string} contentType - MIME type
   */
  async upload(fileBuffer, fileName, folder = 'general', contentType = 'image/jpeg') {
    const filePath = `${folder}/${Date.now()}-${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      throw ApiError.internal('Dosya yüklenirken hata oluştu');
    }

    // Public URL oluştur
    const { data: urlData } = supabaseAdmin.storage
      .from(this.bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  }

  /**
   * Dosya sil
   */
  async delete(filePath) {
    const { error } = await supabaseAdmin.storage
      .from(this.bucket)
      .remove([filePath]);

    if (error) {
      throw ApiError.internal('Dosya silinirken hata oluştu');
    }

    return { message: 'Dosya silindi' };
  }

  /**
   * Signed URL oluştur (private dosyalar için)
   */
  async getSignedUrl(filePath, expiresIn = 3600) {
    const { data, error } = await supabaseAdmin.storage
      .from(this.bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw ApiError.internal('URL oluşturulamadı');
    }

    return data.signedUrl;
  }
}

module.exports = new StorageService();
