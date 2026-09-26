const availabilityService = require('../services/availabilityService');
const asyncHandler = require('../utils/asyncHandler');

const createAvailability = asyncHandler(async (req, res) => {
  const availability = await availabilityService.createAvailability(req.user.id, req.body);
  res.status(201).json(availability);
});

const listMyAvailability = asyncHandler(async (req, res) => {
  const slots = await availabilityService.listProviderAvailability(req.user.id);
  res.status(200).json(slots);
});

const listProviderAvailability = asyncHandler(async (req, res) => {
  const slots = await availabilityService.listProviderAvailability(req.params.providerId);
  res.status(200).json(slots);
});

const deleteAvailability = asyncHandler(async (req, res) => {
  await availabilityService.deleteAvailability(req.user.id, req.params.id);
  res.status(200).json({ message: 'Availability slot deleted' });
});

module.exports = {
  createAvailability,
  listMyAvailability,
  listProviderAvailability,
  deleteAvailability,
};
