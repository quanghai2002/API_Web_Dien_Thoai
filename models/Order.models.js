import mongoose from "mongoose";
import { type } from "os";
const Schema = mongoose.Schema;

const orderSchema = mongoose.model('Order',
  new Schema({
    order_date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: Object,
      default: {
        code: 1,
        state: 'Chờ xác nhận'
      }
    },
    total_price: {
      type: Number,
    },
    shipping_address: {
      type: Object,
    },
    payment_method: {
      type: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    products: {
      type: Object
    },

    // ---TEST ĐỂ LƯU CÁC SẢN PHẨM ------
    products2: {
      type: Array
    },

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