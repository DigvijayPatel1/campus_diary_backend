import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    getAllTweetComments,
    getAllInterviewComments,
    addInterviewComment,
    addTweetComment,
    updateTweetComment,
    deleteTweetComment,
    updateInterviewComment,
    deleteInterviewComment,
    replyToInterviewComment,
    replyToTweetComment,
    getCommentReplies

} from "../controllers/comment.controller.js";

const router = Router()

router.use(verifyJWT)

// tweet comments
router.route("/tweet/:tweetId")
    .get(getAllTweetComments)
    .post(addTweetComment)

router.route("/tweet/:tweetId/comment/:commentId")
    .patch(updateTweetComment)
    .delete(deleteTweetComment)

router.route("/tweets/:tweetId/comments/:commentId/reply")
    .post(replyToTweetComment)

// interview comments
router.route("/interview/:interviewId")
    .get(getAllInterviewComments)
    .post(addInterviewComment)

router.route("/interview/:interviewId/comment/:commentId")
    .patch(updateInterviewComment)
    .delete(deleteInterviewComment)

router.route("/interviews/:interviewId/comments/:commentId/reply")
    .post(replyToInterviewComment)

// fetch replies for any comment
router.route("/:commentId/replies").get(getCommentReplies)


export default router