import axios from 'axios';

const BASE_URL = 'https://api.musixmatch.com/ws/1.1';

function apiKey(): string {
  const key = process.env.MUSIXMATCH_API_KEY;
  if (!key) throw new Error('MUSIXMATCH_API_KEY is not set');
  return key;
}

export interface Track {
  trackId: string;
  title: string;
  artist: string;
  albumCover: string | null;
}

export async function searchTracks(query: string): Promise<Track[]> {
  const response = await axios.get(`${BASE_URL}/track.search`, {
    params: {
      q_track_artist: query,
      apikey: apiKey(),
      f_has_lyrics: 1,
      s_track_rating: 'desc',
      page_size: 10,
    },
  });

  const trackList = response.data?.message?.body?.track_list ?? [];
  return trackList.map((item: any) => ({
    trackId: String(item.track.track_id),
    title: item.track.track_name,
    artist: item.track.artist_name,
    albumCover: item.track.album_coverart_100x100 || null,
  }));
}

export async function fetchLyrics(trackId: string): Promise<string> {
  const response = await axios.get(`${BASE_URL}/track.lyrics.get`, {
    params: {
      track_id: trackId,
      apikey: apiKey(),
    },
  });

  return response.data?.message?.body?.lyrics?.lyrics_body ?? '';
}
