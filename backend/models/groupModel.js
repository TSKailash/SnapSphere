import mongoose from "mongoose";

const groupSchema=new mongoose.Schema({
    groupName:{
        type: String,
        required: true
    },
    groupCode:{
        type: String,
        required: true,
        unique: true
    },
    members:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    dailyPrompt: {
        type: String,
        default: ""
    },
    submissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission"
        }
    ],
    leaderBoard: [
        {
            userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
            points: {type: Number, default: 0}
        }
    ]
},
{timestamps: true}
)

const Group=mongoose.model("Group", groupSchema)

export default Group