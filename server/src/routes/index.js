const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');
const donationRoutes = require('./donation.routes');
const bowlRoutes = require('./bowl.routes');
const announcementRoutes = require('./announcement.routes');
const eventRoutes = require('./event.routes');
const blogRoutes = require('./blog.routes');
const clinicRoutes = require('./clinic.routes');

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Askıda Mama API çalışıyor 🐾',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/donations', donationRoutes);
router.use('/bowls', bowlRoutes);
router.use('/announcements', announcementRoutes);
router.use('/events', eventRoutes);
router.use('/blogs', blogRoutes);
router.use('/clinics', clinicRoutes);

module.exports = router;
