import mongoose, { isValidObjectId } from "mongoose"
import { Interview } from "../models/interview.model.js"
import { Comment } from "../models/comment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js"

//-------Create Interview-------
const createInterview = asyncHandler( async(req,res)=>{
  const {
    company,
    role,
    type,
    domain,
    interviewDate,
    rounds,
    hrRound,
    offerDetails,
    tips,
  } = req.body

  const {branch} = req.user
  
  if(!req.user?._id){
    throw new ApiError(401, "Unauthorized: login required")
  }

  if(!company || !role || !type || !branch || !domain || !tips){
    throw new ApiError(400, 
      "company, role, type, branch, domain, tips are required"
    )
  }

  const interview = await Interview.create({
      author: req.user._id,
      company: company.trim(),
      role: role.trim(),
      type,
      branch: branch.trim(),
      domain,
      interviewDate: interviewDate || "",
      rounds: rounds || [],
      hrRound: hrRound || "",
      offerDetails: offerDetails || "",
      tips: tips.trim(),
  })

  return res.status(201).json(
    new ApiResponse(201, interview, "Interview Created Successfully")
  )
})

//-------Get All Interviews with Search and filter-------
const getAllInterviews = asyncHandler(async (req, res) => {
  const { domain, company, type, branch, role, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (domain && domain !== "All") filter.domain = domain;
  if (type && type !== "All") filter.type = type;
  if (branch && branch !== "All") filter.branch = branch;

  if (company) filter.company = { $regex: company, $options: "i" };
  if (role) filter.role = { $regex: role, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const loggedInUserId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

  const interviews = await Interview.aggregate([
    { $match: filter },

    // join author
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },

    // join likes
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "interview",
        as: "likes",
      },
    },

    // join comments
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "interview",
        as: "comments",
      },
    },

    // compute metrics
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        isLiked: loggedInUserId
          ? { $in: [loggedInUserId, "$likes.user"] }
          : false,
      },
    },

    // cleanup
    {
      $project: {
        likes: 0,
        comments: 0,
        "author.password": 0,
        "author.refreshToken": 0,
        "__v": 0,
      },
    },

    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  const total = await Interview.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page: Number(page),
        limit: Number(limit),
        interviews,
      },
      "Interviews fetched successfully"
    )
  );
});

//-------Get Single Interview with ID-------
const getInterviewById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid interview id");
  }

  const loggedInUserId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

  const interviews = await Interview.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },

    // join author
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },

    // join likes
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "interview",
        as: "likes",
      },
    },

    // join comments
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "interview",
        as: "comments",
      },
    },

    {
      $addFields: {
        likesCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        isLiked: loggedInUserId
          ? { $in: [loggedInUserId, "$likes.user"] }
          : false,
      },
    },

    {
      $project: {
        likes: 0,
        comments: 0,
        "author.password": 0,
        "author.refreshToken": 0,
        "__v": 0,
      },
    },
  ]);

  if (!interviews.length) {
    throw new ApiError(404, "Interview not found");
  }

  return res.status(200).json(
    new ApiResponse(200, interviews[0], "Interview fetched successfully")
  );
});

//-------Update Interview-------
const updateInterview = asyncHandler( async(req,res)=>{
  const{ id } = req.params

  if(!isValidObjectId(id)){
    throw new ApiError(400, "Invalid interview id")
  }

  const interview = await Interview.findById(id)

  if(!interview){
    throw new ApiError(404, "Interview not found")
  }

  if(interview.author.toString() !== req.user?._id.toString()){
    throw new ApiError(403, "Forbidden: You can update only your interview")
  }

  const updatedInterview = await Interview.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).populate("author", "name email avatar branch socialLinks")

  return res.status(200).json(
    new ApiResponse(200, updatedInterview, "Interview updated successfully")
  )
})

//-------Delete Interview-------
const deleteInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid interview id");
  }

  const interview = await Interview.findById(id);

  if (!interview) {
    throw new ApiError(404, "Interview not found");
  }

  // Ownership Check
  if (interview.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden: You can update only your interview");
  }

  // 1. Delete associated Comments
  await Comment.deleteMany({ interview: id });

  // 2. Delete associated Likes
  await Like.deleteMany({ interview: id });

  // 3. Delete the Interview
  await Interview.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Interview deleted successfully")
  );
});


export{
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
}


