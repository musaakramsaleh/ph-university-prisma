import * as jwt from "jsonwebtoken"
export const generateToken = (payload: any, secret: jwt.Secret, expiresIn: any ) => {
  const token = jwt.sign(
    payload,
    secret,
    {
      algorithm: "HS256",
      expiresIn
    }
  );
  return token;
};

export const verifyToken = (token:string,secret:jwt.Secret)=> {
  return jwt.verify(token,secret) as jwt.JwtPayload
}