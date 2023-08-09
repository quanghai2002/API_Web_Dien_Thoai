const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import mongoose from "mongoose";

const Course = mongoose.model("Course",
    new Schema({
        id: { type: ObjectId },
        name: {
            type: String,
            required: true,
            maxLength: 255,
            validate: {
                validator: (value) => {
                    return value.length > 3
                },
                messages: "name must be at least 3 characters"
            },
        },
        description: {
            type: String,
            required: true,

        },
        image: {
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

    }));


export default Course;