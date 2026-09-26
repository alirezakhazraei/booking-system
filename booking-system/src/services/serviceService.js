const serviceRepository = require('../repositories/serviceRepository');
const ApiError = require('../utils/ApiError');

class ServiceService {
  async createService(providerId, data) {
    const { title, description, durationMinutes, price } = data;

    if (!title || !durationMinutes || price === undefined) {
      throw new ApiError(400, 'title, durationMinutes and price are required');
    }

    return serviceRepository.create({
      provider: providerId,
      title,
      description,
      durationMinutes,
      price,
    });
  }

  async listAllServices() {
    return serviceRepository.findAllActive();
  }

  async listProviderServices(providerId) {
    return serviceRepository.findByProvider(providerId);
  }

  async updateService(providerId, serviceId, updates) {
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }
    if (service.provider.toString() !== providerId.toString()) {
      throw new ApiError(403, 'You can only update your own services');
    }
    return serviceRepository.update(serviceId, updates);
  }

  async deleteService(providerId, serviceId) {
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new ApiError(404, 'Service not found');
    }
    if (service.provider.toString() !== providerId.toString()) {
      throw new ApiError(403, 'You can only delete your own services');
    }
    return serviceRepository.delete(serviceId);
  }
}

module.exports = new ServiceService();
