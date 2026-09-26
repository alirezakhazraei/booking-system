const availabilityRepository = require('../repositories/availabilityRepository');
const ApiError = require('../utils/ApiError');

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

class AvailabilityService {
  async createAvailability(providerId, data) {
    const { dayOfWeek, startTime, endTime } = data;

    if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
      throw new ApiError(400, 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)');
    }
    if (!TIME_REGEX.test(startTime) || !TIME_REGEX.test(endTime)) {
      throw new ApiError(400, 'startTime and endTime must be in HH:mm format');
    }
    if (startTime >= endTime) {
      throw new ApiError(400, 'startTime must be before endTime');
    }

    return availabilityRepository.create({
      provider: providerId,
      dayOfWeek,
      startTime,
      endTime,
    });
  }

  async listProviderAvailability(providerId) {
    return availabilityRepository.findByProvider(providerId);
  }

  async deleteAvailability(providerId, availabilityId) {
    const slots = await availabilityRepository.findByProvider(providerId);
    const exists = slots.some((s) => s._id.toString() === availabilityId);
    if (!exists) {
      throw new ApiError(404, 'Availability slot not found');
    }
    return availabilityRepository.delete(availabilityId);
  }
}

module.exports = new AvailabilityService();
