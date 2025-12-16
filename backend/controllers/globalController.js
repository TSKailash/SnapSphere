import GlobalPrompt from "../models/globalPromptModel.js";
import { globalPrompts } from "../data/globalPrompts.js";
import Submission from "../models/submissionModel.js";
import protect from "../middleware/authMiddleware.js";
import express from 'express'
import GlobalLeaderBoardModel from "../models/globalLeaderBoardModel.js";

const router=express.Router()

export const generateDailyGlobalPrompt = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let existing = await GlobalPrompt.findOne({ date: today });

  if (existing) return existing;

  const randomPrompt = globalPrompts[Math.floor(Math.random() * globalPrompts.length)];

  const prompt = await GlobalPrompt.create({
    prompt: randomPrompt,
    date: today
  });

  return prompt;
};

router.get("/prompt", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let prompt = await GlobalPrompt.findOne({ date: today });

    if (!prompt) {
      prompt = await generateDailyGlobalPrompt();
    }

    res.status(200).json(prompt);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch global prompt" });
  }
});

export const calculateGlobalWinner = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const submissions = await Submission.find({
    isGlobal: true,
    createdAt: { $gte: today }
  }).sort({ votes: -1 });

  if (submissions.length === 0) {
    return { message: "No submissions today" };
  }

  const winner = submissions[0];

  await GlobalLeaderBoardModel.findOneAndUpdate(
    { userId: winner.userId },
    { $inc: { points: 20 } },
    { upsert: true, new: true }
  );

  return {
    message: "Global winner selected",
    winner: {
      userId: winner.userId,
      submissionId: winner._id,
      votes: winner.votes,
      imageUrl: winner.imageUrl
    }
  };
};

router.post("/calculate-winner", protect, async (req, res) => {
  try {
    const result = await calculateGlobalWinner();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to calculate global winner" });
  }
});

router.get("/today-submissions", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submissions = await Submission.find({
      isGlobal: true,
      createdAt: { $gte: today }
    }).populate("userId", "username");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/today-winner", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const winner = await Submission.find({
      isGlobal: true,
      createdAt: { $gte: today }
    })
      .sort({ votes: -1 })
      .limit(1)
      .populate("userId", "username");

    if (!winner.length) {
      return res.json({ message: "No global winner yet" });
    }

    res.json(winner[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/leaderboard", protect, async (req, res) => {
  try {
    const leaderboard = await GlobalLeaderBoardModel.find()
      .sort({ points: -1 })
      .populate("userId", "username");

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error });
  }
});


export default router