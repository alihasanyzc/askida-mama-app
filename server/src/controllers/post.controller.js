const postService = require('../services/post.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination, createPaginationMeta } = require('../utils/helpers');

const getAll = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { category } = req.query;
  const { posts, total } = await postService.getAll({ category, skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(posts, 'Gönderiler', meta).send(res);
});

const getById = asyncHandler(async (req, res) => {
  const userId = req.user?.id || null;
  const post = await postService.getById(req.params.id, userId);
  ApiResponse.success(post).send(res);
});

const create = asyncHandler(async (req, res) => {
  const post = await postService.create(req.user.id, req.body);
  ApiResponse.created(post, 'Gönderi oluşturuldu').send(res);
});

const update = asyncHandler(async (req, res) => {
  const post = await postService.update(req.params.id, req.user.id, req.body);
  ApiResponse.success(post, 'Gönderi güncellendi').send(res);
});

const remove = asyncHandler(async (req, res) => {
  await postService.delete(req.params.id, req.user.id, req.user.role);
  ApiResponse.success(null, 'Gönderi silindi').send(res);
});

const getByUser = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { posts, total } = await postService.getByUser(req.params.userId, { skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(posts, 'Kullanıcı gönderileri', meta).send(res);
});

// Like
const toggleLike = asyncHandler(async (req, res) => {
  const result = await postService.toggleLike(req.params.id, req.user.id);
  const message = result.liked ? 'Beğenildi' : 'Beğeni kaldırıldı';
  ApiResponse.success(result, message).send(res);
});

const getLikes = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { likes, total } = await postService.getLikes(req.params.id, { skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(likes, 'Beğeniler', meta).send(res);
});

// Comment
const addComment = asyncHandler(async (req, res) => {
  const comment = await postService.addComment(req.params.id, req.user.id, req.body.content);
  ApiResponse.created(comment, 'Yorum eklendi').send(res);
});

const getComments = asyncHandler(async (req, res) => {
  const { skip, page, limit } = parsePagination(req.query);
  const { comments, total } = await postService.getComments(req.params.id, { skip, take: limit });
  const meta = createPaginationMeta(total, page, limit);
  ApiResponse.success(comments, 'Yorumlar', meta).send(res);
});

const deleteComment = asyncHandler(async (req, res) => {
  await postService.deleteComment(req.params.commentId, req.user.id, req.user.role);
  ApiResponse.success(null, 'Yorum silindi').send(res);
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByUser,
  toggleLike,
  getLikes,
  addComment,
  getComments,
  deleteComment,
};
