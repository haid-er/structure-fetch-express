const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().min(2).required(),
});

const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(2).required(),
  password: Joi.string().min(6).required(),
});

const logoutSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const refreshAccessTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const changeCurrentPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

const updateCurrentUserSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  logoutSchema,
  refreshAccessTokenSchema,
  changeCurrentPasswordSchema,
  updateCurrentUserSchema,
};
