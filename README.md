# Unified Music Streaming MVP (React + Express)

This repository contains a locally runnable MVP music web application with:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Auth:** JWT-based local auth (in-memory for MVP)
- **Music sources in one UI:**
  - Spotify Search API (track metadata + preview URLs where available)
  - YouTube Data API (music video discovery + embed playback)
  - Yandex Music (**mock data source**) for legal/API-limited fallback

> ⚠️ This MVP intentionally respects platform and licensing constraints: no illegal streaming, no scraping, no raw media extraction.

## Core Features

- User registration/login
- Search music across multiple providers
- Playback via official methods:
  - Spotify preview URLs (30s when provided by Spotify)
  - YouTube embeds
  - External links/mock behavior for Yandex
- Playlist creation and management (add/remove tracks)
- Unified source-agnostic UI screens:
  - Home
  - Search
  - Player
  - Library

## Project Structure

```txt
.
├── backend
│   ├── data
│   │   ├── mockYandexTracks.js
│   │   └── store.js
│   ├── middleware
│   │   └── auth.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── playlists.js
│   │   └── search.js
│   ├── services
│   │   └── musicSources.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend
    ├── src
    │   ├── components
    │   │   ├── Layout.js
    │   │   └── PlayerCard.js
    │   ├── pages
    │   │   ├── Home.js
    │   │   ├── Library.js
    │   │   ├── Player.js
    │   │   └── Search.js
    │   ├── services
    │   │   └── api.js
    │   ├── App.js
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    └── package.json
```

## Setup

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
```

Set `.env` values:

- `JWT_SECRET` (required)
- `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` (optional but recommended)
- `YOUTUBE_API_KEY` (optional but recommended)
- `FRONTEND_URL` (default: `http://localhost:5173`)

Run backend:

```bash
npm run dev
```

Backend starts at `http://localhost:4000`.

### 2) Frontend

```bash
cd frontend
npm install
```

(Optional) create `.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

Run frontend:

```bash
npm run dev
```

Frontend starts at `http://localhost:5173`.

## REST API (MVP)

### Auth

- `POST /api/auth/register` `{ email, password }`
- `POST /api/auth/login` `{ email, password }`

### Search

- `GET /api/search?q=<query>`

Returns normalized tracks from Spotify + YouTube + Yandex mock.

### Playlists (JWT required)

- `GET /api/playlists`
- `POST /api/playlists` `{ name }`
- `POST /api/playlists/:id/tracks` `{ track }`
- `DELETE /api/playlists/:id/tracks/:trackId`

## Notes on API limits and compliance

- Spotify search uses Client Credentials flow and can return `preview_url` only for some tracks.
- YouTube uses Data API search and embeds playback using `youtube.com/embed/...`.
- Yandex Music is mocked because public playback/search APIs may be restricted or unavailable for open usage.
- For production use, add persistent DB, password hashing, refresh tokens, rate limiting, and secure session management.

## MVP Limitations

- In-memory data store (resets on backend restart)
- Plain text password storage (for MVP only)
- No advanced queue/history/state sync

