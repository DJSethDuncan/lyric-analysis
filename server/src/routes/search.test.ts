import request from 'supertest';
import express from 'express';

const mockSearchTracks = jest.fn();
jest.mock('../lib/musixmatch', () => ({
  searchTracks: mockSearchTracks,
}));

import searchRouter from './search';

const app = express();
app.use('/api/search', searchRouter);

describe('GET /api/search', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when q param is missing', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it('returns 400 when q is an empty string', async () => {
    const res = await request(app).get('/api/search?q=');
    expect(res.status).toBe(400);
  });

  it('returns 400 when q is only whitespace', async () => {
    const res = await request(app).get('/api/search?q=   ');
    expect(res.status).toBe(400);
  });

  it('returns the track list from the Musixmatch client', async () => {
    const tracks = [{ trackId: '1', title: 'Song', artist: 'Artist', albumCover: null }];
    mockSearchTracks.mockResolvedValue(tracks);
    const res = await request(app).get('/api/search?q=daft+punk');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(tracks);
  });

  it('passes the trimmed query to searchTracks', async () => {
    mockSearchTracks.mockResolvedValue([]);
    await request(app).get('/api/search?q=  hello  ');
    expect(mockSearchTracks).toHaveBeenCalledWith('hello');
  });

  it('returns 500 when the Musixmatch client throws', async () => {
    mockSearchTracks.mockRejectedValue(new Error('API unreachable'));
    const res = await request(app).get('/api/search?q=test');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeTruthy();
  });
});
