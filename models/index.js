const sequelize = require("../config/database");
const UserModel = require("./user.model");

// Initialize all models here
const User = UserModel(sequelize);

module.exports = {
  sequelize,
  User,
};
