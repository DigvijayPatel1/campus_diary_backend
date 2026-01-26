import { User } from "../models/user.model.js"
import { Interview } from "../models/interview.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import crypto from "crypto"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ALLOWED_AVATARS } from "../constant.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/sendEmail.js"
import { getVerificationTemplate, getPasswordResetTemplate} from "../utils/emailTemplates.js"

// ------ Generate the excess token and refresh token ------
const generateAccessAndRefereshTokens = async (userId) => {
    try {
        // finding the user
        const user = await User.findById(userId)

        // generating the tokens
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        // upading the token generated
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return { refreshToken, accessToken }
    } catch (error) {
        console.log("Error in generateAccessAndRefereshTokens:", error);
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {email, password, name, branch, batch, avatarId} = req.body

    if (!email || !password || !name || !branch || !batch || !avatarId){
        throw new ApiError(400, "All feild is required")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser){
        throw new ApiError(400, "User already exist")
    }

    if (!ALLOWED_AVATARS.includes(avatarId)) {
        throw new ApiError(400, "Invalid avatar selection")
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
        name: name.trim(),
        email,
        password,
        branch,
        batch,
        avatar: avatarId,
        verificationToken,
        verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        isVerified: false,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser){
        throw new ApiError(500, "User not created")
    }

    try {
        const verificationLink = `${process.env.CORS_ORIGIN}/verify-email/${verificationToken}`;

        console.log("------------------------------------------------");
        console.log("📧 VERIFICATION LINK (Click to Verify):");
        console.log(verificationLink);
        console.log("------------------------------------------------");

        // Define HTML Message
        const emailHtml = getVerificationTemplate(verificationLink)

        // Send Email
        await sendEmail(user.email, "Verify your NITConnect Account", emailHtml);
    } catch (emailError) {
        console.error("❌ EMAIL SENDING ERROR:", emailError);
        await User.findByIdAndDelete(user._id);
        throw new ApiError(500, "Failed to send verification email. Please try again.");
    }

    return res.status(201)
    .json(
        new ApiResponse(201, createdUser, "Verification link sent successfully to your email.")
    )

})

//------ login the user -------
const loginUser = asyncHandler( async (req, res) => {
    // getting the email and password from the user
    const {email, password} = req.body

    if (!email || !password){
        throw new ApiError(400, "All fields are required")
    }

    // find user if already exist
    const user = await User.findOne({ email })

    if (!user){
        throw new ApiError(404, "User does not exist")
    }

    // validating the password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid){
        throw new ApiError(401, "Please enter correct password")
    }

    // verify the user
    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email before logging in");
    }

    // getting the access and refreshToken
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    // finding the user
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInUser,"User logged In successfully")
    )

})

// ------- logout the user -------
const logoutUser = asyncHandler( async (req, res) => {
    // find the user and update it
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged Out Successfully")
    )
})

// ------ refreshing the accessToken -------

const refreshAccessToken = asyncHandler( async (req, res) => {
    // get the access token
    const inComingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!inComingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        // verify jwt signature
        const decodedToken = jwt.verify(
            inComingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        // find the user
        const user = await User.findById(decodedToken?._id)

        if (!user){
            throw new ApiError(401, "Invalid refresh token")
        }

        // check if the token given is eqaul or not
        if (inComingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        // generate the tokens
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed Successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

// ------ change password -------
const changeCurrentPassword = asyncHandler( async (req, res) => {
    // take the old password from the user
    const {oldPassword, password} = req.body

    if (!oldPassword || !password) {
        throw new ApiError(400, "Old and new password are required")
    }

    // get the user form the data base
    const user = await User.findById(req.user._id)

    if (!user){
        throw new ApiError(404, "User not found")
    }

    // check if given password is correct or not
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid){
        throw new ApiError(401, "Please enter the correct password")
    }

    // update the password
    user.password = password
    await user.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
    
})

// ------ update the account details -------
const updateAccountDetails = asyncHandler( async (req, res) => {
    // get the new details from the user
    const {name, batch, branch} = req.body

    const updatedUser = {}
 
    if (name) updatedUser.name = name
    if (batch) updatedUser.batch = batch
    if (branch) updatedUser.branch = branch

    if (Object.keys(updatedUser).length === 0){
        throw new ApiError(400, "Atleast one feild is required")
    }

    // update the user with new details
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updatedUser
        },
        {
            new: true
        }
    ).select("-password -refeshToken")

    if (!user){
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Account details updated successfully")
    )

})

// ------ update the avatar -------
const updateAvatar = asyncHandler( async (req, res) => {
    // get the avatar id form the user
    const {avatarId} = req.body

    if (!avatarId){
        throw new ApiError(400, "AvatarId is required")
    }

    if (!ALLOWED_AVATARS.includes(avatarId)) {
        throw new ApiError(400, "Invalid avatar selection")
    }

    // update the avatar
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatarId
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    if (!user){
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "avatar updated successfully")
    )
})

// ------ add socail links -------
const updateSocialLinks = asyncHandler( async (req, res) => {
    // get the social links from user
    const { linkedIn, instagram } = req.body

    const updateFields = {}

    if (linkedIn){
        updateFields["socialLinks.linkedIn"] = linkedIn
    }

    if (instagram) {
        updateFields["socialLinks.instagram"] = instagram
    }

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "At least one social link is required")
    }

    // add or update the social links
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true}
    ).select("-password -refreshToken")

    if (!user){
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "social file added successfully")
    )
})

// ------ remove social links -------
const removeSocialLinks = asyncHandler( async (req, res) => {
    // boolean values is expected from the frontend
    const {linkedIn, instagram} = req.body

    const unsetFields = {}

    if (linkedIn === true) {
        unsetFields["socialLinks.linkedIn"] = "";
    }

    if (instagram === true) {
        unsetFields["socialLinks.instagram"] = "";
    }

    if (Object.keys(unsetFields).length === 0) {
        throw new ApiError(400, "At least one social link must be selected for removal");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $unset: unsetFields },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Social links removed successfully")
    )
})

// ------ get the current user --------
const getCurrentUser = asyncHandler( async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "User fetched successfully")
    )
})

// ------ get the profile of any user ------
const getUserProfile = asyncHandler( async (req, res) => {
    const {userId} = req.params

    const user = await User.findById(userId).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User profile fetched successfully")
    )
})

// ------ save the post -------
const savePost = asyncHandler( async (req, res) => {
    const {postId} = req.params

    const user = await User.findById(req.user?._id)

    if (!user){
        throw new ApiError(404, "User not found")
    }

    // check if the post already saved
    const isSaved = user.savedPosts.some((id) => id.toString() === postId);

    let message = "";

    if (isSaved) {
        user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);
        message = "Post unsaved successfully";
    } else {
        user.savedPosts.push(postId);
        message = "Post saved successfully";
    }

    
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, user.savedPosts, "User post saved successfully")
    )
})

const getSavedPosts = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)
        .populate({
            path: "savedPosts",
            populate: {
                path: "author",
                select: "name branch avatar"
            }
        })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(
        new ApiResponse(200, user.savedPosts || [], "Saved posts fetched successfully")
    )
})

const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Interview.find({ author: req.user._id })
    .populate("author", "name branch avatar")
    .sort({ createdAt: -1 })

  return res.status(200).json(
    new ApiResponse(200, posts, "My posts fetched successfully")
  )
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    // Find user with matching token AND ensure token hasn't expired
    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    // Mark user as verified and clean up token fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Email verified successfully!")
    );
});

const forgotPassword = asyncHandler( async (req, res) => {
    const { email } = req.body

    if (!email){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email });

    if (!user){
        return res.status(404).json({ message: "User with this email does not exist" });
    }

    // get the reset token 
    const resetToken = user.createPasswordResetToken()

    // save the token to the db
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;

    console.log("------------------------------------------------");
    console.log("🔑 PASSWORD RESET LINK (Click to Reset):");
    console.log(resetUrl);
    console.log("------------------------------------------------");

    try {
        await sendEmail(
            user.email, 
            "Reset Password - Campus Diary", 
            getPasswordResetTemplate(user.name, resetUrl)
        );
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        throw new ApiError(500, "Email could not be sent. Please try again later.");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset email sent successfully")
    )
})

const resetPassword = asyncHandler( async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    if (!password) {
        throw new ApiError(400, "New password is required");
    }

    // Hash the token to compare with the one in DB
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Find user with that valid token AND check if it hasn't expired
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
        throw new ApiError(400, "Password reset token is invalid or has expired");
    }

    // set new password
    user.password = password

    // clear the reset fields (so the token can't be used again)
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // save the user
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successfully. You can now login.")
    )

})




export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateAvatar,
    updateSocialLinks,
    getCurrentUser,
    getUserProfile,
    savePost,
    removeSocialLinks,
    getSavedPosts,
    getMyPosts,
    verifyEmail,
    forgotPassword,
    resetPassword
}