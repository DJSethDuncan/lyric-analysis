import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Track {
  trackId: string;
  title: string;
  artist: string;
  albumCover: string | null;
}

export interface Song {
  id: number;
  trackId: string;
  title: string;
  artist: string;
  albumCover: string | null;
  lyricsSnippet: string;
  totalWords: number;
  uniqueWords: number;
  uniqueRatio: number;
  avgWordLength: number;
  submittedAt: string;
}

@Injectable()
export class SongService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<Track[]> {
    return this.http.get<Track[]>(`/api/search?q=${encodeURIComponent(query)}`);
  }

  submit(track: Track): Observable<Song> {
    return this.http.post<Song>('/api/songs', track);
  }

  getLeaderboard(metric: string): Observable<Song[]> {
    return this.http.get<Song[]>(`/api/leaderboard/${metric}`);
  }
}
