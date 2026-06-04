import express from "express";
import Knowledge from "../models/knowledge.model.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const data = await Knowledge.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;