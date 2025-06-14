import dotenv from 'dotenv';
import path from 'path'
dotenv.config({path: path.join(process.cwd(), ".env")} )
export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  email: process.env.EMAIL,
  APP_PASS: process.env.APP_PASS,
};