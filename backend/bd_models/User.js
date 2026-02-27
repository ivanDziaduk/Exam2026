import { Schema, model } from "mongoose";

const User = new Schema({
    login: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    role: {
        type: String, 
        required: true,
        default: 'user'
    },
    password: {
        type: String,
        trim: true,
        select: false,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    }
})

export default model('User', User)