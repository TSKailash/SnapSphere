import mongoose from "mongoose";

const globalPromptSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  date: { type: Date, required: true }
});

export default mongoose.model("GlobalPrompt", globalPromptSchema);
