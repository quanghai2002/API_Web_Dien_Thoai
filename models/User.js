import mongoose from "mongoose";
import isEmail from "validator/lib/isemail.js";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = mongoose.model('User',
    new Schema({
        id: {
            type: ObjectId,

        },

        name: {
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
        password: {
            type: String,
            required: true,

        },
        phoneNumber: {
            type: String,
            required: true,

        },
        address: {
            type: String,
            required: true,

        },
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