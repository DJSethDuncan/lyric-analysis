import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { SearchComponent } from './search.component';
import { SongService, Track, Song } from '../song.service';

const mockTrack: Track = { trackId: '1', title: 'Rap God', artist: 'Eminem', albumCover: null };

const mockSong: Song = {
  id: 1, trackId: '1', title: 'Rap God', artist: 'Eminem', albumCover: null,
  lyricsSnippet: 'I\'m beginning to feel...', totalWords: 1543, uniqueWords: 679,
  uniqueRatio: 44.01, avgWordLength: 4.3, submittedAt: '2024-01-01T00:00:00.000Z',
};

class MockSongService {
  search = jasmine.createSpy('search').and.returnValue(of([mockTrack]));
  submit = jasmine.createSpy('submit').and.returnValue(of(mockSong));
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let songService: MockSongService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [{ provide: SongService, useClass: MockSongService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    songService = TestBed.inject(SongService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise with empty state', () => {
    expect(component.query).toBe('');
    expect(component.results).toEqual([]);
    expect(component.submittedSong).toBeNull();
    expect(component.error).toBe('');
    expect(component.searching).toBe(false);
    expect(component.submitting).toBe(false);
  });

  describe('search()', () => {
    it('does nothing when the query is blank', () => {
      component.query = '   ';
      component.search();
      expect(songService.search).not.toHaveBeenCalled();
    });

    it('populates results on success', () => {
      component.query = 'Eminem';
      component.search();
      expect(component.results).toEqual([mockTrack]);
      expect(component.searching).toBe(false);
      expect(component.error).toBe('');
    });

    it('clears previous results and submittedSong before a new search', () => {
      component.results = [mockTrack];
      component.submittedSong = mockSong;
      component.query = 'new query';
      component.search();
      // results gets replaced with mock return value, submittedSong cleared
      expect(component.submittedSong).toBeNull();
    });

    it('sets an error message when search returns empty results', () => {
      songService.search.and.returnValue(of([]));
      component.query = 'zzzzz';
      component.search();
      expect(component.error).toBeTruthy();
      expect(component.results).toEqual([]);
    });

    it('sets an error message and clears searching flag on HTTP error', () => {
      songService.search.and.returnValue(throwError('network error'));
      component.query = 'test';
      component.search();
      expect(component.error).toBeTruthy();
      expect(component.searching).toBe(false);
    });
  });

  describe('submit()', () => {
    it('calls songService.submit with the given track', () => {
      component.submit(mockTrack);
      expect(songService.submit).toHaveBeenCalledWith(mockTrack);
    });

    it('sets submittedSong and clears results after success', () => {
      component.results = [mockTrack];
      component.submit(mockTrack);
      expect(component.submittedSong).toEqual(mockSong);
      expect(component.results).toEqual([]);
      expect(component.submitting).toBe(false);
    });

    it('sets an error message and clears submitting flag on HTTP error', () => {
      songService.submit.and.returnValue(throwError('server error'));
      component.submit(mockTrack);
      expect(component.error).toBeTruthy();
      expect(component.submitting).toBe(false);
    });
  });

  describe('template', () => {
    it('renders the search input and button', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('input[type="text"]')).toBeTruthy();
      expect(compiled.querySelector('button')).toBeTruthy();
    });

    it('shows the result list when results are populated', async(() => {
      component.results = [mockTrack];
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('.result-item');
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain('Rap God');
      expect(items[0].textContent).toContain('Eminem');
    }));

    it('shows the success card when submittedSong is set', async(() => {
      component.submittedSong = mockSong;
      fixture.detectChanges();
      const card = fixture.nativeElement.querySelector('.success');
      expect(card).toBeTruthy();
      expect(card.textContent).toContain('1543');
      expect(card.textContent).toContain('679');
    }));

    it('shows the error message when error is set', async(() => {
      component.error = 'Something went wrong';
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.error').textContent)
        .toContain('Something went wrong');
    }));
  });
});
