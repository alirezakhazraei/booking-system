const User = require('../models/User');

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email, withPassword = false) {
    const query = User.findOne({ email });
    if (withPassword) query.select('+password');
    return query;
  }

  async findById(id) {
    return User.findById(id);
  }

  async findByRole(role) {
    return User.find({ role });
  }
}

module.exports = new UserRepository();
