const appointmentRepository = require('../repositories/appointmentRepository');
const serviceRepository = require('../repositories/serviceRepository');
const availabilityRepository = require('../repositories/availabilityRepository');
const ApiError = require('../utils/ApiError');

class AppointmentService {
  async createAppointment(customerId, data) {
    const { providerId, serviceId, startTime, notes } = data;

    if (!providerId || !serviceId || !startTime) {
      throw new ApiError(400, 'providerId, serviceId and startTime are required');
    }

    const service = await serviceRepository.findById(serviceId);
    if (!service || !service.isActive) {
      throw new ApiError(404, 'Service not found');
    }
    if (service.provider.toString() !== providerId.toString()) {
      throw new ApiError(400, 'This service does not belong to the given provider');
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      throw new ApiError(400, 'startTime must be a valid date');
    }
    if (start < new Date()) {
      throw new ApiError(400, 'startTime cannot be in the past');
    }

    const end = new Date(start.getTime() + service.durationMinutes * 60000);

    // Optional but recommended: check the slot falls within provider's declared availability
    await this._assertWithinAvailability(providerId, start, end);

    // Prevent double-booking: reject if it overlaps an existing non-cancelled appointment
    const overlapping = await appointmentRepository.findOverlapping(providerId, start, end);
    if (overlapping.length > 0) {
      throw new ApiError(409, 'This time slot overlaps with an existing appointment');
    }

    return appointmentRepository.create({
      customer: customerId,
      provider: providerId,
      service: serviceId,
      startTime: start,
      endTime: end,
      notes: notes || '',
    });
  }

  async _assertWithinAvailability(providerId, start, end) {
    const dayOfWeek = start.getDay();
    const slots = await availabilityRepository.findByProviderAndDay(providerId, dayOfWeek);

    // If the provider hasn't defined availability at all, skip the check
    // (keeps things simple for an internship-level project).
    if (slots.length === 0) return;

    const startHHmm = this._toHHmm(start);
    const endHHmm = this._toHHmm(end);

    const fitsInSomeSlot = slots.some(
      (slot) => startHHmm >= slot.startTime && endHHmm <= slot.endTime
    );

    if (!fitsInSomeSlot) {
      throw new ApiError(400, 'Requested time is outside provider availability');
    }
  }

  _toHHmm(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async getById(appointmentId) {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }
    return appointment;
  }

  async listForCustomer(customerId) {
    return appointmentRepository.findByCustomer(customerId);
  }

  async listForProvider(providerId) {
    return appointmentRepository.findByProvider(providerId);
  }

  async updateStatus(userId, userRole, appointmentId, newStatus) {
    const allowedStatuses = ['confirmed', 'cancelled', 'completed'];
    if (!allowedStatuses.includes(newStatus)) {
      throw new ApiError(400, `status must be one of: ${allowedStatuses.join(', ')}`);
    }

    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    const isOwner =
      appointment.customer._id.toString() === userId.toString() ||
      appointment.provider._id.toString() === userId.toString();
    if (!isOwner) {
      throw new ApiError(403, 'You are not part of this appointment');
    }

    // Business rules for who can set what:
    // - provider can confirm, cancel, or complete
    // - customer can only cancel their own appointment
    if (userRole === 'customer' && newStatus !== 'cancelled') {
      throw new ApiError(403, 'Customers can only cancel appointments');
    }

    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      throw new ApiError(400, `Cannot change status of a ${appointment.status} appointment`);
    }

    return appointmentRepository.updateStatus(appointmentId, newStatus);
  }
}

module.exports = new AppointmentService();
