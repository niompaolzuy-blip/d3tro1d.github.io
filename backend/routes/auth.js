import express from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { db } from "../data/store.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: "7d"
  });
}

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const exists = db.users.some((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = { id: randomUUID(), email, password };
  db.users.push(user);

  return res.status(201).json({
    token: signToken(user),
    user: { id: user.id, email: user.email }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    token: signToken(user),
    user: { id: user.id, email: user.email }
  });
});

export default router;
