import mongoose from 'mongoose';

// Round Schema
const roundSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  }
})

const interviewSchema = new mongoose.Schema(
  {
    //Author details
    author:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true
    },
    //Company details
    company:{
      type: String,
      required: true,
      index: true
    },
    role:{
      type: String,
      required: true
    },
    type:{
      type: String,
      enum: ["Full Time","Internship"],
      required: true
    },
     
    // Category
    branch:{
      type: String,
      required: true
    },
    domain:{
      type: String,
      enum: ["Tech","Core","Management","Finance","Consulting"],
      required: true
    }, 
    interviewDate:{
      type: String
    },

    // Experience
    rounds:{
      type: [roundSchema]
    },
    hrRound:{
      type: String
    },
    offerDetails:{
      type: String
    },
    tips:{
      type: String,
      required: true
    },

    likesCount: {
      type: Number,
      default: 0
    }
    
  },{timestamps: true}
)

export const Interview = mongoose.model("Interview", interviewSchema)