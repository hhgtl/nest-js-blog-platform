import jwt, { SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const SECRET = 'MY_SECRET_PASSWORD';

export const jwtAdapter = {
  createToken({
    userId,
    expiresIn = '30d',
  }: {
    userId: string;
    expiresIn?: SignOptions['expiresIn'];
  }) {
    return jwt.sign({ userId }, SECRET, { expiresIn, jwtid: randomUUID() });
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, SECRET) as { userId: string };
    } catch (error) {
      console.error('Token verify some error');
      return null;
    }
  },
};
