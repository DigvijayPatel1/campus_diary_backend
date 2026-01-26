import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js"
import mongoose from "mongoose";

// ------ get all tweet comments -------
const getAllTweetComments = asyncHandler( async (req, res) => {
    const {tweetId} = req.params
    const { page = 1, limit = 10} = req.query

    if (!tweetId){
        throw new ApiError(400, "Tweet Id is required")
    }

    const pageNumber = Math.max(1, parseInt(page))
    const limitNumber = Math.max(1, parseInt(limit))
    const skip = (pageNumber - 1)*limit

    const comments = await Comment.find({ tweet: tweetId })
        .populate("author", "name avatar socialLinks")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limitNumber)
    
    const totalComments = await Comment.countDocuments({ tweet: tweetId })

    return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "Tweet comments fetched successfully"
        )
    )
})

// ------ get all interview comments -------
const getAllInterviewComments = asyncHandler( async (req, res) => {
    const {interviewId} = req.params
    const { page = 1, limit = 10} = req.query

    if (!interviewId){
        throw new ApiError(400, "interview Id is required")
    }

    const pageNumber = Math.max(1, parseInt(page))
    const limitNumber = Math.max(1, parseInt(limit))
    const skip = (pageNumber - 1)*limitNumber

    const comments = await Comment.find({ interview: interviewId })
        .populate("author", "_id name avatar socialLinks")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limitNumber)
    
    const totalComments = await Comment.countDocuments({ interview: interviewId })

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                totalComments,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalComments / limitNumber)
            },
            "Interview comments fetched successfully"
        )
    )
})

// ------ add tweet comments ---------
const addTweetComment = asyncHandler( async (req, res) => {
    const { content } = req.body
    const {tweetId} = req.params

    if (!content?.trim()){
        throw new ApiError(400, "content is required")
    }

    if (!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400, "Invalid Tweet Id")
    }

    const comment = await Comment.create({
        content: content.trim(),
        author: req.user?._id,
        tweet: tweetId
    })

    const populateComment = await Comment.findById(comment._id)
        .populate("author", "_id name avatar socialLinks")

    return res.status(201).json(
        new ApiResponse(201, populateComment, "Tweet message added successfully")
    )
})

// ------ add interview comments ---------
const addInterviewComment = asyncHandler( async (req, res) => {
    const { content } = req.body
    const {interviewId} = req.params

    if (!content?.trim()){
        throw new ApiError(400, "content is required")
    }

    if (!mongoose.Types.ObjectId.isValid(interviewId)){
        throw new ApiError(400, "Invalid Interview Id")
    }

    const comment = await Comment.create({
        content: content.trim(),
        author: req.user?._id,
        interview: interviewId
    })

    const populateComment = await Comment.findById(comment._id)
        .populate("author", "_id name avatar socialLinks")

    return res.status(201).json(
        new ApiResponse(201, populateComment, "interview post message added successfully")
    )
})

// ----- update tweet comment -------
const updateTweetComment = asyncHandler( async (req, res) => {
    const { content } = req.body
    const { tweetId, commentId } = req.params

    if (content.trim() === ""){
        throw new ApiError(400, "Comment must be given")
    }

    if (
        !mongoose.Types.ObjectId.isValid(tweetId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
    ) {
        throw new ApiError(400, "Invalid tweet or comment id")
    }


    const comment = await Comment.findOne({
        _id: commentId,
        tweet: tweetId,
        author: req.user._id
    });

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    comment.content = content.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
        .populate("author", "name avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Tweet comment updated successfully")
    )
})

// ------ delete tweet --------
const deleteTweetComment = asyncHandler( async (req, res) => {
    const { tweetId, commentId } = req.params

    if (
        !mongoose.Types.ObjectId.isValid(tweetId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
    ) {
        throw new ApiError(400, "Invalid tweet or comment id")
    }

    const comment = await Comment.findOne({
        _id: commentId,
        tweet: tweetId,
        author: req.user._id
    });

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    await Comment.findByIdAndDelete(comment._id)

    return res.status(200).json(
        new ApiResponse(200, {},  "Tweet comment deleted successfully")
    )

})

// ------ update the interview comment -------
const updateInterviewComment = asyncHandler( async (req, res) => {
    const { content } = req.body
    const { interviewId, commentId } = req.params

    if (content.trim() === ""){
        throw new ApiError(400, "Comment must be given")
    }

    if (
        !mongoose.Types.ObjectId.isValid(interviewId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
    ) {
        throw new ApiError(400, "Invalid interview or comment id")
    }


    const comment = await Comment.findOne({
        _id: commentId,
        interview: interviewId,
        author: req.user._id
    });

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    comment.content = content.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
        .populate("author", "name avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Interview comment updated successfully")
    )
})

// ------ delete the interview comment --------
const deleteInterviewComment = asyncHandler( async (req, res) => {
    const { interviewId, commentId } = req.params

    if (
        !mongoose.Types.ObjectId.isValid(interviewId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
    ) {
        throw new ApiError(400, "Invalid interview or comment id")
    }

    const comment = await Comment.findOne({
        _id: commentId,
        interview: interviewId,
        author: req.user._id
    });

    if (!comment) {
        throw new ApiError(404, "Comment not found or unauthorized");
    }

    await Comment.findByIdAndDelete(comment._id)

    return res.status(200).json(
        new ApiResponse(200, {},  "Interview comment deleted successfully")
    )

})

// ------ Replay to tweet comment -------
const replyToTweetComment = asyncHandler( async (req, res) => {
    const { content } = req.body
    const { commentId, tweetId } = req.params

    if (!content?.trim()){
        throw new ApiError(400, "Content is required")
    }

    if (
        !mongoose.Types.ObjectId.isValid(tweetId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
    ) {
        throw new ApiError(400, "Invalid tweet or comment id");
    }

    const parentComment = await Comment.findOne({
        _id: commentId,
        tweet: tweetId
    })

    if (!parentComment){
        throw new ApiError(404, "Parent comment not found")
    }

    const reply = await Comment.create({
        content: content.trim(),
        author: req.user._id,
        tweet: tweetId,
        parentComment: commentId
    })

    const populatedReply = await Comment.findById(reply._id)
        .populate("author", "_id name avatar socialLinks")

    return res.status(201).json(
        new ApiResponse(201, populatedReply, "Reply added successfully")
    )

})

// ----- Reply to interview comment
const replyToInterviewComment = asyncHandler( async (req, res) => {
    const {content} = req.body
    const {commentId, interviewId} = req.params

    if (!content?.trim()){
        throw new ApiError(400, "Content is required")
    }

    if (
        !mongoose.Types.ObjectId.isValid(interviewId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
    ) {
        throw new ApiError(400, "Invalid interview or comment id");
    }

    const parentComment = await Comment.findOne({
        _id: commentId,
        interview: interviewId
    })

    if (!parentComment){
        throw new ApiError(404, "Parent comment not found")
    }

    const reply = await Comment.create({
        content: content.trim(),
        interview: interviewId,
        parentComment: commentId,
        author: req.user?._id
    })

    const populatedReply = await Comment.findById(reply._id)
        .populate("author", "_id name avatar socialLinks")

    return res.status(201).json(
        new ApiResponse(201, populatedReply, "Reply added successfully")
    )
})

// ------ Get replies of the comment ------
const getCommentReplies = asyncHandler( async (req, res) => {
    const {commentId} = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    const replies = await Comment.find({
        parentComment: commentId
    })
        .populate("author", "name avatar")
        .sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, replies, "Replies fetched successfully")
    )
})

export {
    getAllTweetComments,
    getAllInterviewComments,
    addTweetComment,
    addInterviewComment,
    deleteTweetComment,
    updateTweetComment,
    updateInterviewComment,
    deleteInterviewComment,
    replyToTweetComment,
    replyToInterviewComment,
    getCommentReplies
}