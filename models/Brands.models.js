import mongoose from "mongoose";
const Schema = mongoose.Schema;

const brandSchema = mongoose.model('Brand',
  new Schema({
    name: {
      type: String,
      required: true,

    },
    description: String,
    logo_url: String,
    // products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }

  })
);


export default brandSchema