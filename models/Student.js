import mongoose from "mongoose";
import isEmail from "validator/lib/isemail.js";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const Student = mongoose.model('Student',
    new Schema({
        id: { type: ObjectId },
        name: {
            type: String,
            required: true,

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
        languages: {
            type: String
        }
        ,
        gender: {
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
export default Student