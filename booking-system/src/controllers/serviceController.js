const serviceService = require('../services/serviceService');
const asyncHandler = require('../utils/asyncHandler');

const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.user.id, req.body);
  res.status(201).json(service);
});

const listAllServices = asyncHandler(async (req, res) => {
  const services = await serviceService.listAllServices();
  res.status(200).json(services);
});

const listMyServices = asyncHandler(async (req, res) => {
  const services = await serviceService.listProviderServices(req.user.id);
  res.status(200).json(services);
});

const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.user.id, req.params.id, req.body);
  res.status(200).json(service);
});

const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.user.id, req.params.id);
  res.status(200).json({ message: 'Service deactivated successfully' });
});

module.exports = {
  createService,
  listAllServices,
  listMyServices,
  updateService,
  deleteService,
};
