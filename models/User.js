import mongoose from "mongoose";
import isEmail from "validator/lib/isemail.js";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = mongoose.model('User',
    new Schema({
        //_id: tự động tạo

        username: {
            type: String,
            required: true,

        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            validate: {
                validator: (value) => {
                    return isEmail
                },
                messages: "email is correct format"
            },
        },

        phoneNumber: {
            type: String,
        },

        address: {
            type: String,
        },

        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

        admin: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        token: {
            type: String,
            default: ''
        }


    })
)
export default User