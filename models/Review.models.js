import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = mongoose.model('Review',
  new Schema({
    rating: {
      type: Number
    },
    comment: String,
    timestamp: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

  })
);


export default reviewSchema