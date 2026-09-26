const Service = require('../models/Service');

class ServiceRepository {
  async create(serviceData) {
    return Service.create(serviceData);
  }

  async findById(id) {
    return Service.findById(id);
  }

  async findByProvider(providerId) {
    return Service.find({ provider: providerId, isActive: true });
  }

  async findAllActive() {
    return Service.find({ isActive: true }).populate('provider', 'name email');
  }

  async update(id, updates) {
    return Service.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  }

  async delete(id) {
    return Service.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}

module.exports = new ServiceRepository();
