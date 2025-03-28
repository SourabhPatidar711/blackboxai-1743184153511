const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');

// Get all disasters
router.get('/', async (req, res) => {
  try {
    const disasters = await Disaster.find()
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(disasters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;