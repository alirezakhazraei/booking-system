const Availability = require('../models/Availability');

class AvailabilityRepository {
  async create(data) {
    return Availability.create(data);
  }

  async findByProvider(providerId) {
    return Availability.find({ provider: providerId }).sort({ dayOfWeek: 1, startTime: 1 });
  }

  async findByProviderAndDay(providerId, dayOfWeek) {
    return Availability.find({ provider: providerId, dayOfWeek });
  }

  async delete(id) {
    return Availability.findByIdAndDelete(id);
  }
}

module.exports = new AvailabilityRepository();
