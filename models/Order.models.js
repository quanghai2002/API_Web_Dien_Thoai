import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = mongoose.model('Order',
  new Schema({
    order_date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: "Đang xử lý"
    },
    total_price: {
      type: Number,
    },
    shipping_address: {
      type: String,
    },
    payment_method: {
      type: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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


export default orderSchema