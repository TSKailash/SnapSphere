import Group from "../models/groupModel.js";
import {
  generateDailyGlobalPrompt,
  calculateGlobalWinner
} from "./globalController.js";
import { calculateGroupWinners } from "./leaderBoard.js";

export const runDailyPrompt = async (req, res) => {
  try {
    console.log("🌅 Running daily prompt cron");
    await generateDailyGlobalPrompt();
    res.status(200).send("Daily prompt generated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Daily prompt failed");
  }
};

export const runGlobalWinner = async (req, res) => {
  try {
    console.log("🏆 Running global winner cron");
    await calculateGlobalWinner();
    res.status(200).send("Global winner calculated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Global winner failed");
  }
};

export const runGroupWinners = async (req, res) => {
  try {
    console.log("👥 Running group winners cron");

    const groups = await Group.find();
    for (const group of groups) {
      await calculateGroupWinners(group._id);
    }

    res.status(200).send("Group winners calculated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Group winner failed");
  }
};
