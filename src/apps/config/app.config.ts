import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  env: process.env.NODE_ENV,

  port: parseInt(process.env.PORT ?? '3000', 10),

  url: process.env.APP_URL,
}));
