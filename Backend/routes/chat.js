import express from "express";
import Thread from "../models/Threads.js";
import getOpenAIResponse from "../utils/openai.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Test (Optional - can keep for development)
router.post("/test", authenticateToken, async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing Another Title",
            userId: req.user.id  // ✅ Associate with user
        });
        const responce = await thread.save();
        res.send(responce);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Server Error" });
    }
});

// ✅ Get all threads - PROTECTED
router.get("/thread", authenticateToken, async (req, res) => {
    try {
        // Only get threads of current user
        const threads = await Thread.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.send(threads);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Failed to fetch threads" });
    }
});

// ✅ Get specific thread - PROTECTED
router.get("/thread/:threadId", authenticateToken, async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId, userId: req.user.id });
        if (!thread) {
            return res.status(404).send({ error: "Thread not found" });
        }
        res.send(thread);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Failed to fetch chat" });
    }
});

// ✅ Delete thread - PROTECTED
router.delete("/thread/:threadId", authenticateToken, async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.user.id });
        if (!deletedThread) {
            return res.status(404).send({ error: "Thread not found" });
        }
        res.json({ message: "Thread deleted successfully", threadId });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Failed to delete thread" });
    }
});

// ✅ Chat - PROTECTED
router.post("/chat", authenticateToken, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).send({ error: "missing required fields" });
    }
    try {
        let thread = await Thread.findOne({ threadId, userId: req.user.id });
        
        if (!thread) {
            // Create new thread for user
            thread = new Thread({
                threadId,
                userId: req.user.id,  // ✅ Associate with user
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();
        await thread.save();

        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "something went wrong" });
    }
});

export default router;