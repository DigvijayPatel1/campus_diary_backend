import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    toggleInterviewLikes,
    toggleTweetLikes
} from "../controllers/like.controller.js";

const router = Router()

router.route("/toggle/interview/:interviewId").post(verifyJWT, toggleInterviewLikes)
router.route("/toggle/tweet/:tweetId").post(verifyJWT, toggleTweetLikes)

export default router