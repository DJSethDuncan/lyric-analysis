import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService, Song } from '../song.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  metrics = [
    { key: 'unique_words',    label: 'Most Unique' },
    { key: 'most_repetitive', label: 'Most Repetitive' },
    { key: 'total_words',     label: 'Wordiest' },
    { key: 'avg_word_length', label: 'Most Complex' },
    { key: 'newest',          label: 'Newest' },
  ];

  activeMetric = 'unique_words';
  songs: Song[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private songService: SongService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.activeMetric = params['metric'] || 'unique_words';
      this.loadLeaderboard();
    });
  }

  selectMetric(metric: string) {
    this.router.navigate(['/leaderboard', metric]);
  }

  loadLeaderboard() {
    this.loading = true;
    this.error = '';

    this.songService.getLeaderboard(this.activeMetric).subscribe(
      songs => {
        this.songs = songs;
        this.loading = false;
      },
      () => {
        this.error = 'Failed to load leaderboard.';
        this.loading = false;
      }
    );
  }

  metricValue(song: Song): string {
    switch (this.activeMetric) {
      case 'unique_words':    return `${song.uniqueWords} unique words`;
      case 'most_repetitive': return `${song.uniqueRatio}% unique`;
      case 'total_words':     return `${song.totalWords} total words`;
      case 'avg_word_length': return `${song.avgWordLength} avg chars/word`;
      case 'newest':          return new Date(song.submittedAt).toLocaleDateString();
      default:                return '';
    }
  }
}
