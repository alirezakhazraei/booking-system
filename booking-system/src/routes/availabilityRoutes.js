const express = require('express');
const {
  createAvailability,
  listMyAvailability,
  listProviderAvailability,
  deleteAvailability,
} = require('../controllers/availabilityController');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public: customers need to see a provider's availability before booking
router.get('/provider/:providerId', listProviderAvailability);

// Provider-only
router.post('/', protect, restrictTo('provider'), createAvailability);
router.get('/mine', protect, restrictTo('provider'), listMyAvailability);
router.delete('/:id', protect, restrictTo('provider'), deleteAvailability);

module.exports = router;
