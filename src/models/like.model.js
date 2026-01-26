import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  interview:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview"
  },
  tweet:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet"
  }
},{timestamps: true})

likeSchema.index(
  { user: 1, interview: 1 },
  { 
    unique: true, 
    partialFilterExpression: { interview: { $type: "objectId" } } 
  }
);

likeSchema.index(
  { user: 1, tweet: 1 },
  { 
    unique: true, 
    partialFilterExpression: { tweet: { $type: "objectId" } } 
  }
);

export const Like = mongoose.model('Like',likeSchema);
