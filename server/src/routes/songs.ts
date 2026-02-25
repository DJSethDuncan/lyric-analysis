import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { fetchLyrics } from '../lib/musixmatch';
import { analyzeText } from '../lib/analyze';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response) => {
  const { trackId, title, artist, albumCover } = req.body;

  if (!trackId || !title || !artist) {
    return res.status(400).json({ error: 'trackId, title, and artist are required' });
  }

  try {
    // Return existing entry if already submitted
    const existing = await prisma.song.findUnique({ where: { trackId } });
    if (existing) return res.json(existing);

    const lyrics = await fetchLyrics(trackId);
    if (!lyrics) {
      return res.status(422).json({ error: 'No lyrics available for this track' });
    }

    const analysis = analyzeText(lyrics);
    const song = await prisma.song.create({
      data: {
        trackId,
        title,
        artist,
        albumCover: albumCover ?? null,
        lyricsSnippet: lyrics.substring(0, 300),
        ...analysis,
      },
    });

    res.status(201).json(song);
  } catch (err: any) {
    console.error('Submit error:', err.message);
    res.status(500).json({ error: 'Failed to submit song' });
  }
});

export default router;
