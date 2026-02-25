import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should have title "Lyric Analysis"', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Lyric Analysis');
  }));

  it('should render title in an h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Lyric Analysis');
  }));

  it('should initialize with zero counts and empty ratio', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.totalWordCount).toEqual(0);
    expect(app.uniqueWordCount).toEqual(0);
    expect(app.uniqueRatio).toEqual('');
  }));

  it('should render a textarea for input', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('textarea')).toBeTruthy();
  }));

  it('should render an Analyze button', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button').textContent).toContain('Analyze');
  }));

  describe('analyzeText()', () => {
    it('should count total words in a simple phrase', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      app.analyzeText('hello world foo');
      expect(app.totalWordCount).toEqual(3);
    }));

    it('should count unique words correctly', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      app.analyzeText('hello world hello');
      expect(app.uniqueWordCount).toEqual(2);
    }));

    it('should calculate the unique word ratio as a percentage', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      app.analyzeText('hello world hello');
      expect(app.uniqueRatio).toEqual('66.67');
    }));

    it('should report 100% ratio when all words are unique', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      app.analyzeText('one two three four');
      expect(app.totalWordCount).toEqual(4);
      expect(app.uniqueWordCount).toEqual(4);
      expect(app.uniqueRatio).toEqual('100.00');
    }));

    it('should report a low ratio when words are highly repeated', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      app.analyzeText('word word word word');
      expect(app.totalWordCount).toEqual(4);
      expect(app.uniqueWordCount).toEqual(1);
      expect(app.uniqueRatio).toEqual('25.00');
    }));

    it('should split words on newlines', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      app.analyzeText('hello\nworld\nhello');
      expect(app.totalWordCount).toEqual(3);
      expect(app.uniqueWordCount).toEqual(2);
    }));

    it('should split words on commas', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      app.analyzeText('hello,world,hello');
      expect(app.totalWordCount).toEqual(3);
      expect(app.uniqueWordCount).toEqual(2);
    }));

    it('should update the view with word counts after analysis', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      app.analyzeText('hello world hello');
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      const results = compiled.querySelector('.results');
      expect(results.textContent).toContain('3');
      expect(results.textContent).toContain('2');
      expect(results.textContent).toContain('66.67');
    }));
  });
});
