const adminService = require("../services/admin.service");
const joiSchemas = require("../validation/admin.schemas");
const userService = require("../services/user.service");

module.exports.admin_post = async (req, res) => {
  try {
    const isAdmin = await userService.isAdmin(req.user.id);
    if (!isAdmin) {
      return res.fail("Unauthorized: Admin access required");
    }
    const adminData = await joiSchemas.admin_post.validateAsync(req.body);
    const foundUser = await userService.getUserByEmail(adminData.email);
    if (foundUser) {
      return res.fail("User with this email already exists");
    }

    const newAdmin = await adminService.createAdmin(adminData);
    return res.success(newAdmin);
  } catch (error) {
    console.error("AdminController [admin_post] Error:", error);
    return res.serverError(error);
  }
};

module.exports.user_post = async (req, res) => {
  try {
    const userData = await joiSchemas.user_post.validateAsync(req.body);
    const foundUser = await userService.getUserByEmail(userData.email);
    if (foundUser) {
      return res.fail("User with this email already exists");
    }
    const newUser = await adminService.createUser(userData);
    console.log("new user created", newUser);
    return res.success(newUser);
  } catch (error) {
    console.error("AdminController [user_post] Error:", error);
    return res.serverError(error);
  }
};
