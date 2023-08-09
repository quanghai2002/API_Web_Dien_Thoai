import mongoose from "mongoose";
import isEmail from "validator/lib/isemail.js";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const User = mongoose.model('User',
    new Schema({
        id: ObjectId,
        name: {
            type: String,
            required: true,
            validate: {
                validator: (value) => {
                    return value.length > 3
                },
                messages: "User name must be at least 3 characters"
            },
        },
        email: {
            type: String,
            required: true,
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
export default User