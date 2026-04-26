const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  search: (q) => request(`/search?q=${encodeURIComponent(q)}`),
  getPlaylists: (token) => request("/playlists", { headers: { Authorization: `Bearer ${token}` } }),
  createPlaylist: (token, payload) =>
    request("/playlists", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    }),
  addTrackToPlaylist: (token, playlistId, track) =>
    request(`/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ track })
    }),
  removeTrackFromPlaylist: (token, playlistId, trackId) =>
    request(`/playlists/${playlistId}/tracks/${encodeURIComponent(trackId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
};
