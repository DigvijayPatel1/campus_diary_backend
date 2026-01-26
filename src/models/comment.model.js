import mongoose, { Schema, Types } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    interview: {
        type: Schema.Types.ObjectId,
        ref: "Interview"
    },

    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },

    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    }
    
}, {timestamps: true})

export const Comment = mongoose.model("Comment", commentSchema)