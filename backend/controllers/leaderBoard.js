import Group from "../models/groupModel.js";
import Submission from "../models/submissionModel.js";
import express from 'express'
import protect from "../middleware/authMiddleware.js";

const router=express.Router()

export const calculateGroupWinners = async (groupId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const group = await Group.findById(groupId);

  if (group.lastCalculatedAt && group.lastCalculatedAt >= today) {
    return { message: "Already calculated today" };
  }

  const submissions = await Submission.find({
    groupId,
    createdAt: { $gte: today }
  }).sort({ votes: -1 });

  if (submissions.length === 0) return { message: "No submissions today" };

  const winnerUpdates = [];

  const scoring = [10, 5, 2]; 

  submissions.slice(0, 3).forEach((submission, index) => {
    const userId = submission.userId;
    const points = scoring[index];

    winnerUpdates.push({ userId, points });
  });

  for (const update of winnerUpdates) {
    await Group.findByIdAndUpdate(groupId, {
      $inc: { "leaderBoard.$[elem].points": update.points }
    }, {
      arrayFilters: [{ "elem.userId": update.userId }]
    });
  }
  group.lastCalculatedAt = new Date();
  await group.save();

  return { message: "Leaderboard updated", winners: winnerUpdates };
};


router.post("/calculate/:groupId", protect, async (req, res) => {
  try {
    const result = await calculateGroupWinners(req.params.groupId);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error calculating winners" });
  }
});

router.get("/:groupId", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("leaderBoard.userId", "username email");

    res.json(group.leaderBoard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cannot fetch leaderboard" });
  }
});

export default router