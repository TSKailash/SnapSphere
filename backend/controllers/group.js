import express from 'express'
import protect from '../middleware/authMiddleware.js'
import Group from '../models/groupModel.js'
import User from '../models/userModel.js'
import Submission from "../models/submissionModel.js";

const router=express.Router()
import GroupPrompt from "../models/groupPromptModel.js";
import groupPrompts from "../data/groupPrompt.js";

export const generateGroupPrompt = async (groupId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let existing = await GroupPrompt.findOne({ groupId, date: today });
  if (existing) return existing;

  const promptText = groupPrompts[Math.floor(Math.random() * groupPrompts.length)];

  const prompt = await GroupPrompt.create({
    groupId,
    prompt: promptText,
    date: today
  });

  return prompt;
};

router.get("/prompt/:groupId", protect, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let prompt = await GroupPrompt.findOne({ groupId, date: today });

    if (!prompt) prompt = await generateGroupPrompt(groupId);

    res.json(prompt);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch group prompt" });
  }
});

router.get("/submissions/:groupId", protect, async (req, res) => {
  try {
    const submissions = await Submission.find({
      groupId: req.params.groupId,
      isGlobal: false
    }).populate("userId", "username");

    res.json(submissions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get submissions" });
  }
});


router.post('/create-group', protect, async(req, res)=>{
    try {
        const {groupName}=req.body
        if(!groupName){
            res.status(400).json({message: "Group name is needed"})
        }
        const groupCode=Math.random().toString(36).substring(2, 8).toUpperCase();
        const group=await Group.create({    
            groupName,
            groupCode,
            members: [req.user._id],
            leaderBoard: [{userId: req.user._id, points: 0}]
        })
        await User.findByIdAndUpdate(req.user._id,{
            $push: {groupsJoined: group._id}
        })

        res.status(201).json({message: "Group created successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.get('/getGroups', protect, async(req, res)=>{
    try {
        const user = await User.findById(req.user._id).populate("groupsJoined");
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            groups: user.groupsJoined
        });


    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post('/join', protect, async(req, res)=>{
    try {
        const {groupCode}=req.body
        if(!groupCode){
            return res.status(400).json({message: "Group code is necessary"})
        }
        const user_id=req.user._id
        const group=await Group.findOne({groupCode: groupCode})
        
        if(!group){
            return res.status(400).json({message: "Invalid Group Code"})
        }

        if (group.members.includes(user_id)) {
          return res.status(400).json({ message: "You are already in this group" });
        }
        
        group.members.push(user_id)
        group.leaderBoard.push({userId: user_id, points: 0})
        await group.save()
        
        await User.findByIdAndUpdate(user_id, {
            $push: {groupsJoined: group._id}
        })
        return res.status(200).json({message: "Joined group", group})
        
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.get("/:id", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "username email")
      .populate("submissions");

    if (!group)
      return res.status(404).json({ message: "Group not found" });

    res.status(200).json(group);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router