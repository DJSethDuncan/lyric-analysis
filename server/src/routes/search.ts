import { Router, Request, Response } from 'express';
import { searchTracks } from '../lib/musixmatch';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query || query.trim().length === 0) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  try {
    const tracks = await searchTracks(query.trim());
    res.json(tracks);
  } catch (err: any) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Failed to search tracks' });
  }
});

export default router;
