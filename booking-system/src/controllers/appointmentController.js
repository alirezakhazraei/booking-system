const appointmentService = require('../services/appointmentService');
const asyncHandler = require('../utils/asyncHandler');

const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.user.id, req.body);
  res.status(201).json(appointment);
});

const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getById(req.params.id);
  res.status(200).json(appointment);
});

const myAppointmentsAsCustomer = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.listForCustomer(req.user.id);
  res.status(200).json(appointments);
});

const myAppointmentsAsProvider = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.listForProvider(req.user.id);
  res.status(200).json(appointments);
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await appointmentService.updateStatus(
    req.user.id,
    req.user.role,
    req.params.id,
    status
  );
  res.status(200).json(appointment);
});

module.exports = {
  createAppointment,
  getAppointment,
  myAppointmentsAsCustomer,
  myAppointmentsAsProvider,
  updateAppointmentStatus,
};
