import mongoose, { Schema } from "mongoose";

const developerSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Full Stack Developer"
    },
    photoUrl: {
        type: String
    },
    socialLinks: {
        linkedin: String,
        instagram: String,
        github: String
    }
}, {timestamps: true})

export const Developer = mongoose.model("Developer", developerSchema)