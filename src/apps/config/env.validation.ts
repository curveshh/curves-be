import * as Joi from 'joi';

export const envValidation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

  APP_NAME: Joi.string().required(),

  APP_URL: Joi.string().required(),

  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),

  JWT_REFRESH_SECRET: Joi.string().required(),

  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),

  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  SWAGGER_TITLE: Joi.string().required(),

  SWAGGER_DESCRIPTION: Joi.string().required(),

  SWAGGER_VERSION: Joi.string().required(),

  SWAGGER_PATH: Joi.string().required(),
});
