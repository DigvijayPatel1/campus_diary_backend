import Router from "express"
import { createDeveloper, getAllDevelopers, getDeveloperById, updateDeveloper, deleteDeveloper } from "../controllers/developer.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js" 
import { verifyAdmin } from "../middlewares/admin.middleware.js"

const router = Router()

router.route("/").get(getAllDevelopers)
router.route("/:id").get(getDeveloperById)

router.route("/").post(
    verifyJWT, 
    verifyAdmin, 
    upload.fields([
        { name: "photo", maxCount: 1 },
        {
            name: "photoUrl",
            maxCount: 1
        },
    ]), 
    createDeveloper
)
router.route("/:id").patch(
    verifyJWT, 
    verifyAdmin, 
    upload.fields([
        { name: "photo", maxCount: 1 },
        {
            name: "photoUrl",
            maxCount: 1
        },
    ]), 
    updateDeveloper
)
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteDeveloper)

export default router