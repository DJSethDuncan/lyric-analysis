import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LeaderboardComponent } from './leaderboard.component';
import { SongService, Song } from '../song.service';

const mockSong: Song = {
  id: 1, trackId: '1', title: 'Bohemian Rhapsody', artist: 'Queen', albumCover: null,
  lyricsSnippet: 'Is this the real life...', totalWords: 365, uniqueWords: 182,
  uniqueRatio: 49.86, avgWordLength: 4.7, submittedAt: '2024-06-15T12:00:00.000Z',
};

class MockSongService {
  getLeaderboard = jasmine.createSpy('getLeaderboard').and.returnValue(of([mockSong]));
}

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;
  let songService: MockSongService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderboardComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: SongService, useClass: MockSongService },
        { provide: ActivatedRoute, useValue: { params: of({ metric: 'unique_words' }) } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    songService = TestBed.inject(SongService) as any;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the leaderboard on init using the metric from route params', () => {
    expect(component.activeMetric).toBe('unique_words');
    expect(songService.getLeaderboard).toHaveBeenCalledWith('unique_words');
    expect(component.songs).toEqual([mockSong]);
    expect(component.loading).toBe(false);
  });

  it('exposes all five metric tabs', () => {
    const keys = component.metrics.map(m => m.key);
    expect(keys).toContain('unique_words');
    expect(keys).toContain('most_repetitive');
    expect(keys).toContain('total_words');
    expect(keys).toContain('avg_word_length');
    expect(keys).toContain('newest');
  });

  describe('selectMetric()', () => {
    it('navigates to /leaderboard/:metric', () => {
      const spy = spyOn(router, 'navigate');
      component.selectMetric('total_words');
      expect(spy).toHaveBeenCalledWith(['/leaderboard', 'total_words']);
    });
  });

  describe('loadLeaderboard()', () => {
    it('sets error and clears loading flag on failure', () => {
      songService.getLeaderboard.and.returnValue(throwError('server error'));
      component.loadLeaderboard();
      expect(component.error).toBeTruthy();
      expect(component.loading).toBe(false);
    });
  });

  describe('metricValue()', () => {
    it('returns unique word count for unique_words', () => {
      component.activeMetric = 'unique_words';
      expect(component.metricValue(mockSong)).toBe('182 unique words');
    });

    it('returns unique ratio for most_repetitive', () => {
      component.activeMetric = 'most_repetitive';
      expect(component.metricValue(mockSong)).toBe('49.86% unique');
    });

    it('returns total word count for total_words', () => {
      component.activeMetric = 'total_words';
      expect(component.metricValue(mockSong)).toBe('365 total words');
    });

    it('returns avg word length for avg_word_length', () => {
      component.activeMetric = 'avg_word_length';
      expect(component.metricValue(mockSong)).toBe('4.7 avg chars/word');
    });

    it('returns a localised date string for newest', () => {
      component.activeMetric = 'newest';
      const result = component.metricValue(mockSong);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns an empty string for an unknown metric', () => {
      component.activeMetric = 'unknown';
      expect(component.metricValue(mockSong)).toBe('');
    });
  });

  describe('template', () => {
    it('renders a tab button for each metric', () => {
      fixture.detectChanges();
      const tabs = fixture.nativeElement.querySelectorAll('.tabs button');
      expect(tabs.length).toBe(5);
    });

    it('marks the active tab with the active class', () => {
      fixture.detectChanges();
      const activeTabs = fixture.nativeElement.querySelectorAll('.tabs button.active');
      expect(activeTabs.length).toBe(1);
      expect(activeTabs[0].textContent.trim()).toBe('Most Unique');
    });

    it('renders a list item for each song', async(() => {
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('.song-item');
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('Bohemian Rhapsody');
      expect(items[0].textContent).toContain('Queen');
    }));

    it('shows the error message when error is set', async(() => {
      component.error = 'Failed to load';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.error').textContent)
        .toContain('Failed to load');
    }));
  });
});
