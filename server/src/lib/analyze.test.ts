import { analyzeText } from './analyze';

describe('analyzeText()', () => {
  it('counts total and unique words', () => {
    const result = analyzeText('hello world hello');
    expect(result.totalWords).toBe(3);
    expect(result.uniqueWords).toBe(2);
  });

  it('computes uniqueRatio as a percentage rounded to 2dp', () => {
    const result = analyzeText('hello world hello');
    expect(result.uniqueRatio).toBe(66.67);
  });

  it('reports 100% ratio when all words are unique', () => {
    const result = analyzeText('one two three four');
    expect(result.uniqueRatio).toBe(100);
  });

  it('reports a low ratio for highly repetitive lyrics', () => {
    const result = analyzeText('word word word word');
    expect(result.totalWords).toBe(4);
    expect(result.uniqueWords).toBe(1);
    expect(result.uniqueRatio).toBe(25);
  });

  it('computes average word length', () => {
    // 'hi' (2) + 'hello' (5) = 7 / 2 = 3.5
    const result = analyzeText('hi hello');
    expect(result.avgWordLength).toBe(3.5);
  });

  it('returns all zeros for empty input', () => {
    const result = analyzeText('');
    expect(result).toEqual({ totalWords: 0, uniqueWords: 0, uniqueRatio: 0, avgWordLength: 0 });
  });

  it('handles newline-separated words', () => {
    const result = analyzeText('hello\nworld\nhello');
    expect(result.totalWords).toBe(3);
    expect(result.uniqueWords).toBe(2);
  });

  it('handles comma-separated words', () => {
    const result = analyzeText('hello,world,hello');
    expect(result.totalWords).toBe(3);
    expect(result.uniqueWords).toBe(2);
  });

  it('is case-insensitive when counting unique words', () => {
    const result = analyzeText('Hello HELLO hello');
    expect(result.uniqueWords).toBe(1);
  });

  it('strips the Musixmatch copyright footer before counting', () => {
    const lyrics = 'hello world\n******* This Lyrics is NOT for Commercial use *******';
    const result = analyzeText(lyrics);
    expect(result.totalWords).toBe(2);
    expect(result.uniqueWords).toBe(2);
  });

  it('strips punctuation when computing word lengths', () => {
    // 'hello!' → 'hello' (5 chars), 'world.' → 'world' (5 chars)
    const result = analyzeText('hello! world.');
    expect(result.avgWordLength).toBe(5);
  });
});
