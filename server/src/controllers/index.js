// Barrel file for controllers
const announcementController = require('./announcement.controller');
const authController = require('./auth.controller');
const blogController = require('./blog.controller');
const bowlController = require('./bowl.controller');
const clinicController = require('./clinic.controller');
const donationController = require('./donation.controller');
const eventController = require('./event.controller');
const postController = require('./post.controller');
const userController = require('./user.controller');

module.exports = {
  announcementController,
  authController,
  blogController,
  bowlController,
  clinicController,
  donationController,
  eventController,
  postController,
  userController,
};
