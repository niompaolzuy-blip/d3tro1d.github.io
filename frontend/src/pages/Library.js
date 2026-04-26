import { useState } from "react";

export default function Library({ playlists, onCreatePlaylist, onRemoveTrack, onPlayTrack, isAuthenticated }) {
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreatePlaylist(name.trim());
    setName("");
  }

  if (!isAuthenticated) {
    return <p>Please login to manage playlists.</p>;
  }

  return (
    <section>
      <form className="search-form" onSubmit={submit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New playlist" />
        <button type="submit">Create</button>
      </form>

      <div className="list">
        {playlists.map((playlist) => (
          <article key={playlist.id} className="card">
            <h3>{playlist.name}</h3>
            {playlist.tracks.length === 0 && <p>No tracks yet.</p>}
            {playlist.tracks.map((track) => (
              <div key={track.id} className="row compact">
                <span>
                  {track.title} — {track.artist}
                </span>
                <div className="actions">
                  <button onClick={() => onPlayTrack(track)}>Play</button>
                  <button onClick={() => onRemoveTrack(playlist.id, track.id)}>Remove</button>
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
