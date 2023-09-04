import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductCategorySchema = mongoose.model('ProductCategory',
  new Schema({
    name: {
      type: String,
      required: true,

    },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],

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


export default ProductCategorySchema