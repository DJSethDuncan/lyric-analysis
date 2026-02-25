import { Component } from '@angular/core';
import { SongService, Track, Song } from '../song.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  query = '';
  results: Track[] = [];
  submittedSong: Song | null = null;
  searching = false;
  submitting = false;
  error = '';

  constructor(private songService: SongService) {}

  search() {
    if (!this.query.trim()) return;
    this.searching = true;
    this.error = '';
    this.results = [];
    this.submittedSong = null;

    this.songService.search(this.query).subscribe(
      tracks => {
        this.results = tracks;
        this.searching = false;
        if (tracks.length === 0) {
          this.error = 'No songs found. Try a different search.';
        }
      },
      () => {
        this.error = 'Search failed. Please try again.';
        this.searching = false;
      }
    );
  }

  submit(track: Track) {
    this.submitting = true;
    this.error = '';

    this.songService.submit(track).subscribe(
      song => {
        this.submittedSong = song;
        this.results = [];
        this.submitting = false;
      },
      () => {
        this.error = 'Failed to submit song. Please try again.';
        this.submitting = false;
      }
    );
  }
}
