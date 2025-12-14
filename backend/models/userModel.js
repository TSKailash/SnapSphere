import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    groupsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    points: { type: Number, default: 0 },
    globalPoints: { type: Number, default: 0 }
  },
  { timestamps: true }
)

const User=mongoose.model('User', userSchema)
export default User