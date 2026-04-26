import { useState } from "react";
import { api } from "../services/api";

export default function Search({ onPlayTrack, onAddToPlaylist, canSave }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.search(query);
      setTracks(data.tracks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <form onSubmit={handleSearch} className="search-form">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by song or artist"
          required
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="list">
        {tracks.map((track) => (
          <article key={track.id} className="card row">
            {track.thumbnail ? <img src={track.thumbnail} alt={track.title} /> : <div className="img-fallback">♪</div>}
            <div>
              <h3>{track.title}</h3>
              <p>{track.artist}</p>
              <p className="chip">{track.source}</p>
            </div>
            <div className="actions">
              <button onClick={() => onPlayTrack(track)}>Play</button>
              {canSave && <button onClick={() => onAddToPlaylist(track)}>Save</button>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
