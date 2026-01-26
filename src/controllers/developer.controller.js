import mongoose,{ isValidObjectId } from "mongoose";
import { Developer } from "../models/developer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

//------Create Developer-------
const createDeveloper = asyncHandler( async(req,res)=>{

  const{role} = req.body

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  const existingDeveloper = await Developer.findOne({
    owner: req.user._id
  });

  if (existingDeveloper) {
    throw new ApiError(409, "Developer profile already exists for this user");
  }

  let localFilePath;
  if (req.files && req.files.photo && req.files.photo.length > 0) {
      localFilePath = req.files.photo[0].path;
  } else if (req.files && req.files.photoUrl && req.files.photoUrl.length > 0) {
      localFilePath = req.files.photoUrl[0].path;
  }

  if(!localFilePath){
    throw new ApiError(400, "Developer photo is required")
  }
  

  const image = await uploadOnCloudinary(localFilePath)

  const socialLinks = req.body.socialLinks || {};

  const developer = await Developer.create({
    owner: req.user._id,
    name: req.user.name.trim(),
    role: role?.trim() || "Full stack developer",
    photoUrl: image?.url,
    socialLinks: {
      github: socialLinks.github?.trim() || null,
      linkedin: socialLinks.linkedin?.trim() || null,
      instagram: socialLinks.instagram?.trim() || null,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, developer, "Developer created successfully")
  )
})

//-------Get all Developers------
const getAllDevelopers = asyncHandler( async(req,res)=>{
  const developers = await Developer.find().sort({createdAt: -1})

  return res.status(200).json(
    new ApiResponse(200, developers, "Developers fetched successfully")
  )
})

//-------Get Developer by Id------
const getDeveloperById = asyncHandler( async(req,res)=>{
  const { id } = req.params

  if(!isValidObjectId(id)){
    throw new ApiError(400, "Invalid developer id")
  }

  const developer = await Developer.findById(id)

  if(!developer){
    throw new ApiError(404, "Developer not found")
  }

  return res.status(200).json(
    new ApiResponse(200, developer, "Developer fetched successfully")
  )
})

//---------Update Developer---------
const updateDeveloper = asyncHandler( async(req,res)=>{
  const{ id } = req.params

  if(!isValidObjectId(id)){
    throw new ApiError(400, "Invalid developer id")
  }

  const{name, role} = req.body

  const developer = await Developer.findById(id)

  if(!developer){
    throw new ApiError(404, "Developer not found")
  }

  if (typeof name === "string" && name.trim()) {
    developer.name = name.trim();
  }

  if (typeof role === "string" && role.trim()) {
    developer.role = role.trim();
  }

  let localFilePath;
  if (req.files?.photo?.length > 0) {
    localFilePath = req.files.photo[0].path;
  } else if (req.files?.photoUrl?.length > 0) {
    localFilePath = req.files.photoUrl[0].path;
  }

  if (localFilePath) {
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
    if (!cloudinaryResponse?.url) {
      throw new ApiError(500, "Failed to upload photo on Cloudinary");
    }
    developer.photoUrl = cloudinaryResponse.url;
  }

  const github = req.body["socialLinks[github]"] || req.body["socialLinks.github"];
  const linkedin = req.body["socialLinks[linkedin]"] || req.body["socialLinks.linkedin"];
  const instagram = req.body["socialLinks[instagram]"] || req.body["socialLinks.instagram"];

  if (github !== undefined || linkedin !== undefined || instagram !== undefined) {
    developer.socialLinks = {
      github: github ? github.trim() : developer.socialLinks?.github,
      linkedin: linkedin ? linkedin.trim() : developer.socialLinks?.linkedin,
      instagram: instagram ? instagram.trim() : developer.socialLinks?.instagram,
    };
  }

  await developer.save();

  return res.status(200).json(
    new ApiResponse(200, developer, "Developer updated successfully")
  );
})

//--------Delete Developer--------
const deleteDeveloper = asyncHandler( async(req,res)=>{
  const { id } = req.params

  if(!isValidObjectId(id)){
    throw new ApiError(400, "Invalid Developer Id")
  }

  const developer = await Developer.findById(id)

  if(!developer){
    throw new ApiError(404, "Developer not found")
  }

  await Developer.findByIdAndDelete(id)

  return res.status(200).json(
    new ApiResponse(200, null, "Developer deleted successfully")
  )
})

export{
  createDeveloper,
  getAllDevelopers,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper,
}