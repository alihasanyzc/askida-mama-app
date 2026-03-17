// Barrel file for services
const announcementService = require('./announcement.service');
const authService = require('./auth.service');
const blogService = require('./blog.service');
const bowlService = require('./bowl.service');
const clinicService = require('./clinic.service');
const donationService = require('./donation.service');
const eventService = require('./event.service');
const postService = require('./post.service');
const storageService = require('./storage.service');
const userService = require('./user.service');

module.exports = {
  announcementService,
  authService,
  blogService,
  bowlService,
  clinicService,
  donationService,
  eventService,
  postService,
  storageService,
  userService,
};
