/**
 * Pagination helper
 * Query parametrelerinden sayfalama bilgilerini çıkarır
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Pagination meta bilgisi oluştur
 */
const createPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
});

/**
 * Sorting helper
 * Query parametrelerinden sıralama bilgilerini çıkarır
 */
const parseSort = (query, allowedFields = []) => {
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  // Güvenlik: Sadece izin verilen alanlarda sıralama yap
  if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
    return { createdAt: 'desc' };
  }

  return { [sortBy]: sortOrder };
};

module.exports = {
  parsePagination,
  createPaginationMeta,
  parseSort,
};
