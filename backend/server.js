import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import auth from './controllers/auth.js'
import group from './controllers/group.js'
import submission from './controllers/submission.js'
import leaderBoard from './controllers/leaderBoard.js'
import global from './controllers/globalController.js'
import cron from 'node-cron'
import {calculateGlobalWinner, generateDailyGlobalPrompt} from './controllers/globalController.js'
import { calculateGroupWinners } from "./controllers/leaderBoard.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import helmet from "helmet";
import cors from 'cors'
import Group from "./models/groupModel.js";

connectDB();

const app = express();

app.use(cors())
app.use(express.json())
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', apiLimiter, auth)
app.use('/group', group)
app.use('/submission', apiLimiter, submission)
app.use('/leaderboard', leaderBoard)
app.use('/global', global)

cron.schedule(
  "0 0 * * *",
  () => {
    console.log("Generating global prompt");
    generateDailyGlobalPrompt();
  },
  {
    timezone: "Asia/Kolkata",
  }
);

cron.schedule(
  "0 21 * * *",
  () => {
    console.log("Calculating global winner (IST)...");
    calculateGlobalWinner();
  },
  {
    timezone: "Asia/Kolkata",
  }
);

cron.schedule(
  "5 21 * * *",
  async () => {
    try {
      console.log("Calculating group winners");
      const groups = await Group.find();
      for (const group of groups) {
        await calculateGroupWinners(group._id);
      }
      console.log("Group leaderboard update completed");
    } catch (err) {
      console.error(" Group cron failed:", err);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
