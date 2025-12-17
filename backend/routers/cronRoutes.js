import express from "express";
import {
  runDailyPrompt,
  runGlobalWinner,
  runGroupWinners
} from "../controllers/cronController.js";

const router = express.Router();

router.use((req, res, next) => {
  if (req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
    return res.status(401).send("Unauthorized");
  }
  next();
});

router.get("/daily-prompt", runDailyPrompt);
router.get("/global-winner", runGlobalWinner);
router.get("/group-winners", runGroupWinners);

export default router;
