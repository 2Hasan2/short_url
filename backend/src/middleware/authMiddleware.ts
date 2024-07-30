import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UserRequest } from '../types/userRequest';

export const authenticateToken = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return res.status(401).json({ error: 'Unauthorized: No token provided' });

  try {
    const decoded: { id: string } = jwt.verify(token, JWT_SECRET) as {
      id: string;
    };

    if (!decoded.id) res.status(401).json({ error: 'Unauthorized' });
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
