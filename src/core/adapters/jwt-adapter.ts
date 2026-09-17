import jwt, { SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const SECRET = 'MY_SECRET_PASSWORD';

type JwtPayloadType = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
};

export const jwtAdapter = {
  createToken({
    userId,
    deviceId,
    expiresIn = '30d',
  }: {
    userId: string;
    deviceId: string;
    expiresIn?: SignOptions['expiresIn'];
  }) {
    return jwt.sign({ userId, deviceId }, SECRET, {
      expiresIn,
      jwtid: randomUUID(),
    });
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, SECRET) as JwtPayloadType;
    } catch (error) {
      console.error('Token verify some error');
      return null;
    }
  },

  decodeToken(token: string) {
    return jwt.decode(token) as JwtPayloadType;
  },
};
