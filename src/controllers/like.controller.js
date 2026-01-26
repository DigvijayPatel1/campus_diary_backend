import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Interview } from "../models/interview.model.js"
import { Tweet } from "../models/tweet.model.js"
import mongoose from "mongoose";

// ------ toggle interview likes -------
const toggleInterviewLikes = asyncHandler( async (req, res) => {
    // get the interview id from the user
    const {interviewId} = req.params


    if (!interviewId){
        throw new ApiError(400, "interviewId is required")
    }

    const interview = await Interview.findById(interviewId)

    if(!interview){
        throw new ApiError(404, "Interview not found")
    }

    const filter = {
        user: req.user._id,
        interview: interviewId
    }

    // get the user if already liked
    const existedLike = await Like.findOne(filter)

    if (existedLike){
        await Like.findByIdAndDelete(existedLike._id)

        return res.status(200).json(
            new ApiResponse(200, {liked : false}, "Post unliked successfully")
        )
    }

    // create the like if it is not created already
    const like = await Like.create(filter)

    if (!like){
        throw new ApiError(500, "Unable to like the post")
    }

    res.status(201).json(
        new ApiResponse(201, { liked: true }, "Post liked successfully")
    )

})

// ------ toggle tweet likes -------
const toggleTweetLikes = asyncHandler( async (req, res) => {
    const {tweetId} = req.params

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID");
    }

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized request: User not found");
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    const filter = {
        user: req.user._id,
        tweet: tweetId
    }

    // get the user if already liked
    const existedLike = await Like.findOne(filter)

    if (existedLike){
        await Like.findByIdAndDelete(existedLike._id)

        return res.status(200).json(
            new ApiResponse(200, {liked : false}, "Post unliked successfully")
        )
    }

    // create the like if it is not crested already
    const like = await Like.create(filter)

    if (!like){
        throw new ApiError(500, "Unable to like the post")
    }

    res.status(201).json(
        new ApiResponse(201, { liked: true }, "Post liked successfully")
    )
})

export {
    toggleInterviewLikes,
    toggleTweetLikes,
}