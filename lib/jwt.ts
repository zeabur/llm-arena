import 'server-only';
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '365d';

export function generateToken(userId: ObjectId): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    {
      iat: Date.now(),
      sub: userId.toHexString(),
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

export function verifyToken(token: string) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };

  return new ObjectId(decoded.sub);
}
