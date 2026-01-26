import mongoose,{ isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

//----Create Tweet----
const createTweet = asyncHandler( async (req,res)=>{
  const { content } = req.body

  // Validate Content
  if(!content || content.trim() === ""){
    throw new ApiError(400, "Tweet Content is required")
  }

  // Create tweet
  const tweet = await Tweet.create({
    content,
    author: req.user._id
  })

  // Populate author data before sending response
  const populatedTweet = await Tweet.findById(tweet._id)
    .populate("author", "name email avatar socialLinks")

  // Send response
  return res.status(201).json(
    new ApiResponse(201, populatedTweet, "Tweet created successfully")
  )
})

//-----Get All Tweets-----
const getAllTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

  const tweets = await Tweet.aggregate([
    // 1. Join Author
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" },

    // 2. Join Likes
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes"
      }
    },

    // 3. Join Comments (This was missing!)
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",
        as: "tweetComments"
      }
    },

    // 4. Compute fields (Count the comments here)
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$tweetComments" }, // <--- Adds the count field
        isLiked: userId
          ? { $in: [userId, "$likes.user"] }
          : false
      }
    },

    // 5. Cleanup response
    {
      $project: {
        likes: 0,
        tweetComments: 0, // Remove the heavy comments array
        "author.password": 0,
        "author.refreshToken": 0,
        "__v": 0
      }
    },

    { $sort: { createdAt: -1 } }
  ]);

  return res.status(200).json(
    new ApiResponse(200, tweets, "All tweets fetched successfully")
  );
});

//-----Get User Tweets-----
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId: profileUserId } = req.params;

  if (!isValidObjectId(profileUserId)) {
    throw new ApiError(400, "Invalid User Id");
  }

  const userExists = await User.exists({ _id: profileUserId });
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  const loggedInUserId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

  const tweets = await Tweet.aggregate([
    {
      $match: {
        author: new mongoose.Types.ObjectId(profileUserId)
      }
    },

    // join author
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author"
      }
    },
    { $unwind: "$author" },

    // join likes
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "tweet",
        as: "likes"
      }
    },

    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "tweet",  
        as: "tweetComments"
      }
    },

    {
      $addFields: {
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$tweetComments" },
        isLiked: loggedInUserId
          ? { $in: [loggedInUserId, "$likes.user"] }
          : false
      }
    },

    {
      $project: {
        likes: 0,
        tweetComments: 0,
        "author.password": 0,
        "author.refreshToken": 0,
        "__v": 0
      }
    },

    { $sort: { createdAt: -1 } }
  ]);

  return res.status(200).json(
    new ApiResponse(200, tweets, "User tweets fetched successfully")
  );
});

//-----Update Tweet-----
const updateTweet = asyncHandler( async(req,res)=>{
  const { tweetId } = req.params
  const { content } = req.body

  // Validate tweetId
  if(!isValidObjectId(tweetId)){
    throw new ApiError(400, "Invalid Tweet Id")
  }

  // Validate Content
  if(!content || content.trim() === ""){
    throw new ApiError(400, "Tweet content is required")
  }

  // Find tweet
  const tweet = await Tweet.findById(tweetId)
  if(!tweet){
    throw new ApiError(404, "Tweet not found")
  }

  // ownership check
  if(tweet.author.toString() !== req.user._id.toString()){
    throw new ApiError(403, "You are not allowed to update this tweet")
  }

  // Update tweet
  tweet.content = content
  await tweet.save()

  // Send Response
  return res.status(200).json(
    new ApiResponse(200, tweet, "Tweet updated successfully")
  )
})

//------Delete tweet-----
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet Id");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this tweet");
  }

  // 1. Delete associated Comments
  await Comment.deleteMany({ tweet: tweetId });

  // 2. Delete associated Likes
  await Like.deleteMany({ tweet: tweetId });

  // 3. Delete the Tweet
  await tweet.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Tweet deleted successfully")
  );
});

export {
  createTweet,
  getAllTweets,
  getUserTweets,
  updateTweet,
  deleteTweet
}

