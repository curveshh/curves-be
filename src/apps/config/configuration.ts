export default () => ({
  app: {
    name: process.env.APP_NAME,
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT ?? '3030', 10),
    url: process.env.APP_URL,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,

    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  swagger: {
    title: process.env.SWAGGER_TITLE,
    description: process.env.SWAGGER_DESCRIPTION,
    version: process.env.SWAGGER_VERSION,
    path: process.env.SWAGGER_PATH,
  },
});
