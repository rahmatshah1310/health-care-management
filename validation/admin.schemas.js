const Joi = require("joi");
const { USER_ROLES } = require("../constants/index");

exports.admin_post = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

module.exports.user_post = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.string().optional().allow(null),
  role: Joi.string()
    .valid(USER_ROLES.STAFF, USER_ROLES.ADMIN, USER_ROLES.AUDITOR,USER_ROLES.CAREGIVER,USER_ROLES.PATIENT)
    .required(),
});
