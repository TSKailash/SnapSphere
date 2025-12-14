import mongoose from "mongoose";

const groupPromptSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  prompt: { type: String, required: true },
  date: { type: Date, required: true }
});

export default mongoose.model("GroupPrompt", groupPromptSchema);
