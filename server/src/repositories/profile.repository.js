const BaseRepository = require('./base/BaseRepository');
const prisma = require('../config/prisma');

class ProfileRepository extends BaseRepository {
  constructor() {
    super('profile');
  }

  async findByAuthId(authId) {
    return prisma.profile.findUnique({
      where: { authId },
    });
  }

  async findByEmail(email) {
    return prisma.profile.findUnique({
      where: { email },
    });
  }

  async findByUsername(username) {
    return prisma.profile.findUnique({
      where: { username },
    });
  }

  async findByIdWithStats(id) {
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            donations: true,
          },
        },
      },
    });
    return profile;
  }

  async updateByAuthId(authId, data) {
    return prisma.profile.update({
      where: { authId },
      data,
    });
  }
}

module.exports = new ProfileRepository();
