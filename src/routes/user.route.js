import { Router } from "express"
import { registerUser, 
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
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()


router.get("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running properly 🚀",
    time: new Date().toISOString(),
  });
});

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/user/:userId").get(getUserProfile)
router.route("/verify/:token").get(verifyEmail)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)

// secure routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-tokens").post( refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-details").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT, updateAvatar)
router.route("/update-social-links").patch(verifyJWT, updateSocialLinks)
router.patch("/remove-social-links", verifyJWT, removeSocialLinks)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/profile/:userId").get(verifyJWT, getUserProfile)
router.route("/save-post/:postId").post(verifyJWT, savePost)
router.route("/saved-posts").get(verifyJWT, getSavedPosts)
router.route("/my-posts").get(verifyJWT, getMyPosts)



export default router