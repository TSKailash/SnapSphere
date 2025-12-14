import mongoose from "mongoose";

const globalLeaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  points: { type: Number, default: 0 }
});

export default mongoose.model("GlobalLeaderboard", globalLeaderboardSchema);
