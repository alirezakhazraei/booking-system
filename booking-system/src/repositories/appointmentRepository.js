const Appointment = require('../models/Appointment');

class AppointmentRepository {
  async create(appointmentData) {
    return Appointment.create(appointmentData);
  }

  async findById(id) {
    return Appointment.findById(id)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title durationMinutes price');
  }

  async findByCustomer(customerId) {
    return Appointment.find({ customer: customerId })
      .populate('provider', 'name email')
      .populate('service', 'title durationMinutes price')
      .sort({ startTime: -1 });
  }

  async findByProvider(providerId) {
    return Appointment.find({ provider: providerId })
      .populate('customer', 'name email')
      .populate('service', 'title durationMinutes price')
      .sort({ startTime: -1 });
  }

  // Finds any appointment for this provider that overlaps the given time range
  // and is not cancelled. Used to prevent double-booking.
  async findOverlapping(providerId, startTime, endTime, excludeAppointmentId = null) {
    const query = {
      provider: providerId,
      status: { $ne: 'cancelled' },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    };

    if (excludeAppointmentId) {
      query._id = { $ne: excludeAppointmentId };
    }

    return Appointment.find(query);
  }

  async updateStatus(id, status) {
    return Appointment.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  }
}

module.exports = new AppointmentRepository();
