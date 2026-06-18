import jwt, { SignOptions } from 'jsonwebtoken';

const SECRET = 'MY_SECRET_PASSWORD';

export const jwtAdapter = {
  createToken({
    userId,
    expiresIn = '30d',
  }: {
    userId: string;
    expiresIn?: SignOptions['expiresIn'];
  }) {
    return jwt.sign({ userId }, SECRET, { expiresIn });
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
