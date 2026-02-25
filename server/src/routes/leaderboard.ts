import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

type Metric = 'unique_words' | 'most_repetitive' | 'total_words' | 'avg_word_length' | 'newest';

const ORDER_BY: Record<Metric, object> = {
  unique_words:    { uniqueWords: 'desc' },
  most_repetitive: { uniqueRatio: 'asc' },
  total_words:     { totalWords: 'desc' },
  avg_word_length: { avgWordLength: 'desc' },
  newest:          { submittedAt: 'desc' },
};

router.get('/:metric', async (req: Request, res: Response) => {
  const metric = req.params.metric as Metric;
  if (!ORDER_BY[metric]) {
    return res.status(400).json({ error: `Unknown metric: ${metric}` });
  }

  try {
    const songs = await prisma.song.findMany({
      orderBy: ORDER_BY[metric],
      take: 50,
    });
    res.json(songs);
  } catch (err: any) {
    console.error('Leaderboard error:', err.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
