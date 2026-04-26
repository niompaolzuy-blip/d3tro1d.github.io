import express from "express";
import { randomUUID } from "node:crypto";
import { db } from "../data/store.js";

const router = express.Router();

router.get("/", (req, res) => {
  const playlists = db.playlists.filter((p) => p.userId === req.user.id);
  res.json(playlists);
});

router.post("/", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Playlist name is required" });

  const playlist = {
    id: randomUUID(),
    userId: req.user.id,
    name,
    tracks: []
  };

  db.playlists.push(playlist);
  res.status(201).json(playlist);
});

router.post("/:id/tracks", (req, res) => {
  const playlist = db.playlists.find((p) => p.id === req.params.id && p.userId === req.user.id);
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  const { track } = req.body;
  if (!track?.id) return res.status(400).json({ message: "Track payload is required" });

  if (!playlist.tracks.some((t) => t.id === track.id)) {
    playlist.tracks.push(track);
  }

  res.json(playlist);
});

router.delete("/:id/tracks/:trackId", (req, res) => {
  const playlist = db.playlists.find((p) => p.id === req.params.id && p.userId === req.user.id);
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  playlist.tracks = playlist.tracks.filter((t) => t.id !== req.params.trackId);
  res.json(playlist);
});

export default router;
