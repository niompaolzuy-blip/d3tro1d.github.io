import express from "express";
import { unifiedSearch } from "../services/musicSources.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const query = req.query.q;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query parameter q is required" });
  }

  const tracks = await unifiedSearch(query);

  return res.json({
    query,
    count: tracks.length,
    tracks,
    notes: [
      "Spotify results may include 30-second previews only (preview_url).",
      "YouTube playback must use embedded player in accordance with YouTube Terms.",
      "Yandex Music is represented as mock data in this MVP."
    ]
  });
});

export default router;
