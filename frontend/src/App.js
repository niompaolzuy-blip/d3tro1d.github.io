import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Player from "./pages/Player";
import Library from "./pages/Library";
import { api } from "./services/api";

export default function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : { token: null, user: null };
  });
  const [playlists, setPlaylists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");

  const isAuthenticated = useMemo(() => Boolean(auth.token), [auth.token]);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    if (!auth.token) {
      setPlaylists([]);
      return;
    }
    api.getPlaylists(auth.token).then(setPlaylists).catch(() => setPlaylists([]));
  }, [auth.token]);

  async function handleAuth(mode) {
    setAuthError("");
    try {
      const response = mode === "register" ? await api.register(authForm) : await api.login(authForm);
      setAuth(response);
    } catch (err) {
      setAuthError(err.message);
    }
  }

  async function createPlaylist(name) {
    const playlist = await api.createPlaylist(auth.token, { name });
    setPlaylists((prev) => [...prev, playlist]);
  }

  async function addTrackToFirstPlaylist(track) {
    if (!playlists.length) {
      alert("Create a playlist first.");
      return;
    }
    const updated = await api.addTrackToPlaylist(auth.token, playlists[0].id, track);
    setPlaylists((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  async function removeTrack(playlistId, trackId) {
    const updated = await api.removeTrackFromPlaylist(auth.token, playlistId, trackId);
    setPlaylists((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function playTrack(track) {
    setCurrentTrack(track);
    navigate("/player");
  }

  function logout() {
    setAuth({ token: null, user: null });
    setCurrentTrack(null);
  }

  return (
    <Layout>
      <section className="auth-strip card">
        <input
          value={authForm.email}
          onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="Email"
        />
        <input
          value={authForm.password}
          type="password"
          onChange={(e) => setAuthForm((prev) => ({ ...prev, password: e.target.value }))}
          placeholder="Password"
        />
        <button onClick={() => handleAuth("login")}>Login</button>
        <button onClick={() => handleAuth("register")}>Register</button>
        {isAuthenticated && <button onClick={logout}>Logout</button>}
        {authError && <span className="error">{authError}</span>}
      </section>

      <Routes>
        <Route path="/" element={<Home user={auth.user} />} />
        <Route
          path="/search"
          element={
            <Search
              onPlayTrack={playTrack}
              onAddToPlaylist={addTrackToFirstPlaylist}
              canSave={isAuthenticated}
            />
          }
        />
        <Route path="/player" element={<Player currentTrack={currentTrack} />} />
        <Route
          path="/library"
          element={
            <Library
              playlists={playlists}
              onCreatePlaylist={createPlaylist}
              onRemoveTrack={removeTrack}
              onPlayTrack={playTrack}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
