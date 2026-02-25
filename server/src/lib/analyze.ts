export interface AnalysisResult {
  totalWords: number;
  uniqueWords: number;
  uniqueRatio: number;
  avgWordLength: number;
}

export function analyzeText(lyrics: string): AnalysisResult {
  // Strip the Musixmatch free-tier copyright notice
  const cleaned = lyrics.replace(/\*{7}.*$/s, '').trim();

  const words = cleaned
    .split(/[\s,\r\n]+/)
    .map(w => w.replace(/[^a-zA-Z']/g, '').toLowerCase())
    .filter(w => w.length > 0);

  if (words.length === 0) {
    return { totalWords: 0, uniqueWords: 0, uniqueRatio: 0, avgWordLength: 0 };
  }

  const totalWords = words.length;
  const uniqueWords = new Set(words).size;
  const uniqueRatio = parseFloat(((uniqueWords / totalWords) * 100).toFixed(2));
  const avgWordLength = parseFloat(
    (words.reduce((sum, w) => sum + w.length, 0) / totalWords).toFixed(2)
  );

  return { totalWords, uniqueWords, uniqueRatio, avgWordLength };
}
