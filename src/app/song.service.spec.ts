import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SongService, Track, Song } from './song.service';

const mockTrack: Track = {
  trackId: '123',
  title: 'Around the World',
  artist: 'Daft Punk',
  albumCover: null,
};

const mockSong: Song = {
  id: 1,
  trackId: '123',
  title: 'Around the World',
  artist: 'Daft Punk',
  albumCover: null,
  lyricsSnippet: 'around the world...',
  totalWords: 432,
  uniqueWords: 4,
  uniqueRatio: 0.93,
  avgWordLength: 5.2,
  submittedAt: '2024-01-01T00:00:00.000Z',
};

describe('SongService', () => {
  let service: SongService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SongService],
    });
    service = TestBed.inject(SongService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('search()', () => {
    it('sends a GET request to /api/search with the encoded query', () => {
      service.search('daft punk').subscribe();
      const req = httpMock.expectOne('/api/search?q=daft%20punk');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('returns the track array from the response', () => {
      let result: Track[] | undefined;
      service.search('test').subscribe(t => result = t);
      httpMock.expectOne('/api/search?q=test').flush([mockTrack]);
      expect(result).toEqual([mockTrack]);
    });

    it('URL-encodes special characters in the query', () => {
      service.search('AC/DC').subscribe();
      const req = httpMock.expectOne('/api/search?q=AC%2FDC');
      req.flush([]);
    });
  });

  describe('submit()', () => {
    it('sends a POST request to /api/songs with the track as the body', () => {
      service.submit(mockTrack).subscribe();
      const req = httpMock.expectOne('/api/songs');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockTrack);
      req.flush(mockSong);
    });

    it('returns the created song from the response', () => {
      let result: Song | undefined;
      service.submit(mockTrack).subscribe(s => result = s);
      httpMock.expectOne('/api/songs').flush(mockSong);
      expect(result).toEqual(mockSong);
    });
  });

  describe('getLeaderboard()', () => {
    it('sends a GET request to /api/leaderboard/:metric', () => {
      service.getLeaderboard('unique_words').subscribe();
      const req = httpMock.expectOne('/api/leaderboard/unique_words');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('uses the exact metric string in the URL', () => {
      service.getLeaderboard('most_repetitive').subscribe();
      httpMock.expectOne('/api/leaderboard/most_repetitive').flush([]);
    });

    it('returns the song array from the response', () => {
      let result: Song[] | undefined;
      service.getLeaderboard('newest').subscribe(s => result = s);
      httpMock.expectOne('/api/leaderboard/newest').flush([mockSong]);
      expect(result).toEqual([mockSong]);
    });
  });
});
