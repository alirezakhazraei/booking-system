const express = require('express');
const {
  createService,
  listAllServices,
  listMyServices,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

const router = express.Router();

// Public: browse all active services (customers pick from here)
router.get('/', listAllServices);

// Provider-only
router.post('/', protect, restrictTo('provider'), createService);
router.get('/mine', protect, restrictTo('provider'), listMyServices);
router.put('/:id', protect, restrictTo('provider'), updateService);
router.delete('/:id', protect, restrictTo('provider'), deleteService);

module.exports = router;
