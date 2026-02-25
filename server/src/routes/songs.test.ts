import request from 'supertest';
import express from 'express';

const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    song: { findUnique: mockFindUnique, create: mockCreate },
  })),
}));

const mockFetchLyrics = jest.fn();
jest.mock('../lib/musixmatch', () => ({
  fetchLyrics: mockFetchLyrics,
}));

import songsRouter from './songs';

const app = express();
app.use(express.json());
app.use('/api/songs', songsRouter);

const track = { trackId: '42', title: 'Around the World', artist: 'Daft Punk', albumCover: null };

describe('POST /api/songs', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when trackId is missing', async () => {
    const res = await request(app).post('/api/songs').send({ title: 'Song', artist: 'Artist' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/songs').send({ trackId: '1', artist: 'Artist' });
    expect(res.status).toBe(400);
  });

  it('returns the existing record without re-fetching if the song is already in the DB', async () => {
    const existing = { id: 1, ...track, totalWords: 432 };
    mockFindUnique.mockResolvedValue(existing);
    const res = await request(app).post('/api/songs').send(track);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(existing);
    expect(mockFetchLyrics).not.toHaveBeenCalled();
  });

  it('fetches lyrics, analyzes, and creates a new song (201)', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockFetchLyrics.mockResolvedValue('around the world around the world');
    const created = { id: 2, ...track, totalWords: 6, uniqueWords: 3, uniqueRatio: 50, avgWordLength: 5 };
    mockCreate.mockResolvedValue(created);

    const res = await request(app).post('/api/songs').send(track);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
    expect(mockFetchLyrics).toHaveBeenCalledWith('42');
    expect(mockCreate).toHaveBeenCalled();
  });

  it('returns 422 when the track has no available lyrics', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockFetchLyrics.mockResolvedValue('');
    const res = await request(app).post('/api/songs').send(track);
    expect(res.status).toBe(422);
  });

  it('returns 500 on an unexpected database error', async () => {
    mockFindUnique.mockRejectedValue(new Error('connection refused'));
    const res = await request(app).post('/api/songs').send(track);
    expect(res.status).toBe(500);
  });
});
