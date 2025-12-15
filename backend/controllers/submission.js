import Group from '../models/groupModel.js'
import express from 'express'
import protect from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'
import Submission from '../models/submissionModel.js'

const router=express.Router()
router.post('/upload', protect, upload.single('image'), async(req, res)=>{
    try {
        const {prompt, groupId, isGlobal}=req.body;
        if(!req.file){
            return res.status(400).json({message: "File is required"})
        }
        if(!prompt){
            return res.status(400).json({message: "Prompt is required"})
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isGlobal === "true") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const existing = await Submission.findOne({
                userId: req.user._id,
                isGlobal: true,
                createdAt: { $gte: today }
            });

            if (existing) {
                return res.status(400).json({
                message: "You already submitted for today's global challenge."
                });
            }
        }

        if (!isGlobal && groupId) {
            const existing = await Submission.findOne({
                userId: req.user._id,
                groupId,
                createdAt: { $gte: today }
            });

            if (existing) {
                return res.status(400).json({ message: "You already submitted for today's group challenge." });
            }
        }

        const now = new Date();
        const hour = now.getHours();

        if (!isGlobal && groupId && hour >= 21) {
            return res.status(400).json({ message: "Submissions are closed for today (after 9 PM)." });
        }


        const submission=await Submission.create({
            userId: req.user._id,
            groupId: groupId || null,
            prompt,
            imageUrl: req.file.path,
            isGlobal: isGlobal==="true"
        })
    
        if(groupId){
            await Group.findByIdAndUpdate(groupId, {
                $push: {submissions: submission._id}
            })
        }
        res.status(201).json({
            message: "Submission uploaded",
            submission,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Upload failed", error });
    }
})

router.post('/vote/:id', protect, async(req, res)=>{
    try {
        const submissionId=req.params.id
        const userId=req.user._id

        const submission=await Submission.findById(submissionId)

        if(!submission){
            res.status(404).json({message: "Submission not found"})
        }

        if(submission.userId.toString()===userId.toString()){
            res.status(400).json({message: "You cannot vote for yourself..!"})
        }
        
        if(submission.voters.includes(userId)){
            res.status(400).json({message: "You already voted"})
        }

        submission.votes+=1;
        submission.voters.push(userId)

        await submission.save();
        res.status(200).json({
            message: "Vote counted successfully",
            votes: submission.votes,
            voters: submission.voters.length,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }
})

router.get("/today-submissions/:groupId", protect, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submissions = await Submission.find({
      groupId,
      createdAt: { $gte: today }
    }).populate("userId", "username");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/today-winner/:groupId", protect, async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submissions = await Submission.find({
      groupId,
      createdAt: { $gte: today }
    }).sort({ votes: -1 }).limit(1);

    if (!submissions.length) {
      return res.json({ message: "No winner today." });
    }

    res.json(submissions[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
});


export default router