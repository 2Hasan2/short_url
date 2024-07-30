import { Request, Response } from 'express';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { User, UserValidation } from '../models/user.model';
import { JWT_SECRET } from '../config';
import { UserRequest } from '../types/userRequest';

export const register = async (req: Request, res: Response) => {
  try {
    const parsedData = UserValidation.parse(req.body);

    const existingUser = await User.findOne({ email: parsedData.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const user = new User(parsedData);
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsedData = UserValidation.pick({
      email: true,
      password: true,
    }).parse(req.body);

    const user = await User.findOne({ email: parsedData.email });

    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await user.comparePassword(parsedData.password);
    if (!isMatch) return res.status(400).json({ error: 'Password incorrect' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ user, token });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUser = async (req: UserRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};
