const profileRepository = require('../repositories/profile.repository');
const followRepository = require('../repositories/follow.repository');
const ApiError = require('../utils/ApiError');

class UserService {
  async getProfile(userId) {
    const profile = await profileRepository.findByIdWithStats(userId);
    if (!profile) {
      throw ApiError.notFound('Kullanıcı bulunamadı');
    }
    return profile;
  }

  async updateProfile(userId, data) {
    // Username kontrolü
    if (data.username) {
      const existing = await profileRepository.findByUsername(data.username);
      if (existing && existing.id !== userId) {
        throw ApiError.conflict('Bu kullanıcı adı zaten kullanılıyor');
      }
    }

    return profileRepository.update(userId, data);
  }

  async follow(followerId, followingId) {
    if (followerId === followingId) {
      throw ApiError.badRequest('Kendinizi takip edemezsiniz');
    }

    const isAlreadyFollowing = await followRepository.isFollowing(followerId, followingId);
    if (isAlreadyFollowing) {
      throw ApiError.conflict('Zaten takip ediyorsunuz');
    }

    // Takip edilen kullanıcının var olduğunu kontrol et
    const targetUser = await profileRepository.findById(followingId);
    if (!targetUser) {
      throw ApiError.notFound('Kullanıcı bulunamadı');
    }

    return followRepository.follow(followerId, followingId);
  }

  async unfollow(followerId, followingId) {
    const isFollowing = await followRepository.isFollowing(followerId, followingId);
    if (!isFollowing) {
      throw ApiError.badRequest('Bu kullanıcıyı takip etmiyorsunuz');
    }

    return followRepository.unfollow(followerId, followingId);
  }

  async getFollowers(userId, pagination) {
    const [followers, total] = await Promise.all([
      followRepository.getFollowers(userId, pagination),
      followRepository.countFollowers(userId),
    ]);
    return { followers, total };
  }

  async getFollowing(userId, pagination) {
    const [following, total] = await Promise.all([
      followRepository.getFollowing(userId, pagination),
      followRepository.countFollowing(userId),
    ]);
    return { following, total };
  }
}

module.exports = new UserService();
