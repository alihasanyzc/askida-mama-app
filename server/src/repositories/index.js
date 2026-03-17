// Barrel file for repositories
const announcementRepository = require('./announcement.repository');
const blogRepository = require('./blog.repository');
const bowlRepository = require('./bowl.repository');
const clinicRepository = require('./clinic.repository');
const commentRepository = require('./comment.repository');
const donationRepository = require('./donation.repository');
const eventRepository = require('./event.repository');
const followRepository = require('./follow.repository');
const likeRepository = require('./like.repository');
const postRepository = require('./post.repository');
const profileRepository = require('./profile.repository');
const BaseRepository = require('./base/BaseRepository');

module.exports = {
  announcementRepository,
  blogRepository,
  bowlRepository,
  clinicRepository,
  commentRepository,
  donationRepository,
  eventRepository,
  followRepository,
  likeRepository,
  postRepository,
  profileRepository,
  BaseRepository,
};
