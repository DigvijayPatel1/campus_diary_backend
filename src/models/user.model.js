import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema({
    // authentication
    email: {
        type: String,
        required: true,
        unique: true,
        match: /@nitc\.ac\.in$/
    },
    password: {
        type: String,
        required: true
    },

    // Email Verification Fields
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },

    // password reset
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },

    // Auth
    refreshToken: {
        type: String
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    // personal details
    name: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true,
        enum: [
            "Computer Science", "Electronics (ECE)", "Electrical (EEE)", "Mechanical", 
            "Civil", "Chemical", "Metallurgy", "Biotech", "Production", "Architecture"
        ]
    },
    batch: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        // required: true,
        enum: [
            "a1","a2","a3","a4","a5","a6","a7","a8","a9","a10"
        ]
    },

    // Social Links
    socialLinks: {
        linkedIn: {type: String, 
            default: "", 
            match: [/^https?:\/\/.+/, "Invalid LinkedIn URL"]
        },
        instagram: {type: String, default: ""}
    },

    // system
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview"
        }
    ]

}, {timestamps: true})

userSchema.pre("save", async function(){
    if (!this.isModified("password")) return 

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    
    const expiryMinutes = parseInt(process.env.RESET_PASSWORD_EXPIRY_MINUTES) || 10;

    this.passwordResetExpires = Date.now() + expiryMinutes * 60 * 1000;

    return resetToken;
}

export const User = mongoose.model("User", userSchema)