import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Phone = mongoose.model('Product',
  new Schema({
    name: {
      type: String,
      required: true,

    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    dung_luong_pin: {
      type: String,
    },
    mau_sac: {
      type: String,
    },
    bo_nho: {
      type: String,
    },
    kich_thuoc_man_hinh: {
      type: Number,
    },
    camera: {
      type: String,
    },
    CPU: {
      type: String,
    },
    RAM: {
      type: String,
    }
    ,
    ROM: {
      type: String,
    },
    he_dieu_hanh: {
      type: String,
    }
    ,
    stock_quantity: {
      type: Number,
    },
    image_urls: {
      type: Array,
    },
    promotion: {
      type: String,
    },
    category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },

    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },

    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],

    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],

    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }

  })
)


export default Phone

