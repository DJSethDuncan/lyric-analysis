import request from 'supertest';
import express from 'express';

const mockFindMany = jest.fn();
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    song: { findMany: mockFindMany },
  })),
}));

import leaderboardRouter from './leaderboard';

const app = express();
app.use('/api/leaderboard', leaderboardRouter);

const songs = [
  { id: 1, title: 'Song A', artist: 'Artist', uniqueWords: 500, uniqueRatio: 55.0, totalWords: 900, avgWordLength: 4.8 },
  { id: 2, title: 'Song B', artist: 'Artist', uniqueWords: 300, uniqueRatio: 20.0, totalWords: 1500, avgWordLength: 3.2 },
];

describe('GET /api/leaderboard/:metric', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 for an unknown metric', async () => {
    const res = await request(app).get('/api/leaderboard/unknown_metric');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/unknown metric/i);
  });

  it('orders by uniqueWords desc for unique_words', async () => {
    mockFindMany.mockResolvedValue(songs);
    const res = await request(app).get('/api/leaderboard/unique_words');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(songs);
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { uniqueWords: 'desc' }, take: 50 });
  });

  it('orders by uniqueRatio asc for most_repetitive', async () => {
    mockFindMany.mockResolvedValue(songs);
    await request(app).get('/api/leaderboard/most_repetitive');
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { uniqueRatio: 'asc' }, take: 50 });
  });

  it('orders by totalWords desc for total_words', async () => {
    mockFindMany.mockResolvedValue(songs);
    await request(app).get('/api/leaderboard/total_words');
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { totalWords: 'desc' }, take: 50 });
  });

  it('orders by avgWordLength desc for avg_word_length', async () => {
    mockFindMany.mockResolvedValue(songs);
    await request(app).get('/api/leaderboard/avg_word_length');
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { avgWordLength: 'desc' }, take: 50 });
  });

  it('orders by submittedAt desc for newest', async () => {
    mockFindMany.mockResolvedValue(songs);
    await request(app).get('/api/leaderboard/newest');
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { submittedAt: 'desc' }, take: 50 });
  });

  it('limits results to 50', async () => {
    mockFindMany.mockResolvedValue([]);
    await request(app).get('/api/leaderboard/newest');
    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ take: 50 }));
  });

  it('returns 500 on a database error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB down'));
    const res = await request(app).get('/api/leaderboard/newest');
    expect(res.status).toBe(500);
  });
});
