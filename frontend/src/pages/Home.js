export default function Home({ user }) {
  return (
    <section className="card">
      <h2>Minimal music app MVP</h2>
      <p>Search across Spotify, YouTube, and mocked Yandex Music data in one interface.</p>
      <ul>
        <li>Authentication with JWT</li>
        <li>Unified search results</li>
        <li>Legal playback modes only (previews and embeds)</li>
        <li>Playlist creation and management</li>
      </ul>
      <p>{user ? `Logged in as ${user.email}` : "Login or register to manage playlists."}</p>
    </section>
  );
}
