import { Request, Response } from 'express';
import { UserRequest } from '../types/userRequest';
import { ZodError } from 'zod';
import { URL, URLValidation } from '../models/URL.model';
import { v4 as uuidv4 } from 'uuid';

// Shorten URL
export const shortenUrl = async (req: UserRequest, res: Response) => {
  try {
    const parsedData = URLValidation.parse({
      ...req.body,
      userId: req.user?.id,
    });
    const shortUrl = parsedData.shortUrl || uuidv4();

    const existingUrl = await URL.findOne({ shortUrl });

    if (existingUrl) {
      return res.status(400).json({ error: 'Alias already in use' });
    }

    const newUrl = new URL({ ...parsedData, shortUrl });

    await newUrl.save();
    res.status(201).json({ url: newUrl });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

// Redirect to original URL
export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;

    const url = await URL.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update URL
export const updateUrl = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const url = await URL.findOneAndUpdate(
      { _id: id, userId: req.user?.id },
      updatedData,
      { new: true },
    );

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteUrl = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await URL.findOneAndDelete({
      _id: id,
      userId: req.user?.id,
    });

    if (!result) return res.status(404).json({ error: 'URL not found' });

    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUserShortLinks = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const urls = await URL.find({ userId });

    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get URL analytics
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;

    const url = await URL.findOne({ shortUrl });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.status(200).json({ clicks: url.clicks });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
