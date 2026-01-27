import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.set("trust proxy", 1);

app.use(express.json({limit: "16kb"}))
app.use(express.static("public"))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

// routes import 
import userRouter from "./routes/user.route.js"
import tweetRouter from "./routes/tweet.route.js"
import interviewRouter from "./routes/interview.route.js"
import developerRouter from "./routes/developer.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import errorMiddleware from "./middlewares/error.middleware.js";

app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/interviews", interviewRouter)
app.use("/api/v1/developers", developerRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use(errorMiddleware);



export { app }