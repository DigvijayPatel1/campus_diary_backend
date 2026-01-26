import { Router } from "express";
import { createInterview, 
    getAllInterviews, 
    getInterviewById, 
    updateInterview, 
    deleteInterview
} from "../controllers/interview.controller.js";
import { verifyJWT, verifyJWTOptional } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(verifyJWT, createInterview)
router.route("/").get(verifyJWTOptional, getAllInterviews)
router.route("/:id").get(verifyJWTOptional, getInterviewById)
router.route("/:id").patch(verifyJWT, updateInterview)
router.route("/:id").delete(verifyJWT, deleteInterview)

export default router