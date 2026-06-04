import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema({
  question: String,
  keywords: [String],
  answer: String
}, { timestamps: true });

export default mongoose.model("Knowledge", knowledgeSchema);