export default function PlayerCard({ track }) {
  if (!track) {
    return <p>Select a track from Search or Library.</p>;
  }

  return (
    <section className="card">
      <div className="track-head">
        {track.thumbnail ? <img src={track.thumbnail} alt={track.title} /> : <div className="img-fallback">♪</div>}
        <div>
          <h3>{track.title}</h3>
          <p>{track.artist}</p>
          <p className="chip">{track.source}</p>
        </div>
      </div>

      {track.previewUrl && (
        <audio controls src={track.previewUrl} className="audio-player">
          Your browser does not support audio playback.
        </audio>
      )}

      {!track.previewUrl && track.embedUrl && (
        <iframe
          title="Embedded Player"
          src={track.embedUrl}
          width="100%"
          height="180"
          allow="autoplay; encrypted-media; picture-in-picture"
          loading="lazy"
        />
      )}

      {!track.previewUrl && !track.embedUrl && (
        <p>
          This source does not expose direct playback. Open externally: <a href={track.externalUrl}>Source Link</a>
        </p>
      )}
    </section>
  );
}
