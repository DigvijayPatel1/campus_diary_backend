import express from 'express';
import { connectDB } from './db/index.js';
import dotenv from "dotenv"
import { app } from './app.js';


dotenv.config({
    path: "../.env"
})



try {
    await connectDB()
    return app(req, res)
} catch (error) {
    res.status(500).json(
        {
            success: false,
            message: "internal server error"
        }
    )
}

// .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//     })
// })
// .catch((err) => {
//     console.log("MONGO db connection failed !!! ", err);
// })