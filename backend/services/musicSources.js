import { mockYandexTracks } from "../data/mockYandexTracks.js";

let spotifyToken = null;
let spotifyTokenExpires = 0;

function toMmSs(ms) {
  if (!ms) return "--:--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

async function getSpotifyAccessToken() {
  const now = Date.now();
  if (spotifyToken && now < spotifyTokenExpires) return spotifyToken;

  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;

  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) return null;

  const data = await response.json();
  spotifyToken = data.access_token;
  spotifyTokenExpires = now + (data.expires_in - 60) * 1000;
  return spotifyToken;
}

export async function searchSpotify(query) {
  try {
    const token = await getSpotifyAccessToken();
    if (!token) return [];

    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&limit=10&q=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) return [];

    const data = await response.json();
    return (data.tracks?.items || []).map((track) => ({
      id: `spotify-${track.id}`,
      originalId: track.id,
      title: track.name,
      artist: track.artists?.map((a) => a.name).join(", ") || "Unknown",
      source: "spotify",
      thumbnail: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || null,
      duration: toMmSs(track.duration_ms),
      previewUrl: track.preview_url,
      embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
      externalUrl: track.external_urls?.spotify || null
    }));
  } catch {
    return [];
  }
}

export async function searchYouTube(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=10&q=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );

    if (!response.ok) return [];

    const data = await response.json();

    return (data.items || []).map((item) => ({
      id: `youtube-${item.id.videoId}`,
      originalId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      source: "youtube",
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || null,
      duration: "--:--",
      previewUrl: null,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      externalUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch {
    return [];
  }
}

export function searchYandexMock(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return mockYandexTracks.filter(
    (track) => track.title.toLowerCase().includes(q) || track.artist.toLowerCase().includes(q)
  );
}

export async function unifiedSearch(query) {
  const [spotify, youtube] = await Promise.all([searchSpotify(query), searchYouTube(query)]);
  const yandex = searchYandexMock(query);

  return [...spotify, ...youtube, ...yandex];
}
