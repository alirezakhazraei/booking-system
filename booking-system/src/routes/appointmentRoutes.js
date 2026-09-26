const express = require('express');
const {
  createAppointment,
  getAppointment,
  myAppointmentsAsCustomer,
  myAppointmentsAsProvider,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

const router = express.Router();

// All appointment routes require authentication
router.use(protect);

router.post('/', restrictTo('customer'), createAppointment);
router.get('/customer/me', restrictTo('customer'), myAppointmentsAsCustomer);
router.get('/provider/me', restrictTo('provider'), myAppointmentsAsProvider);
router.get('/:id', getAppointment);
router.patch('/:id/status', updateAppointmentStatus);

module.exports = router;
