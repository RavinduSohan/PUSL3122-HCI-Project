import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const expire = process.env.JWT_EXPIRE || '7d';
  return jwt.sign(payload, secret, { expiresIn: expire } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JwtPayload;
};
