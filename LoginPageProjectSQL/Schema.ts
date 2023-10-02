
import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    _id:{
        type: String,
    },
    login: {
        type: String,
        // required: true,
        // unique: true
    },
    name: {
        type: String,
        // required: true,
    },
    family: {
        type: String,
        // required: true,
    },
    middleName:{
        type: String,
        // required: true,
    },
    role:{
        type: String,
        // required: true,
    },
    phone:{
        type: String,
        // required: true,
        // unique: true
    },
    email:{
        type: String,
        // required: true,
        // unique: true
    },
    password:{
        type: String,
        // required: true,
    },
    accesstoken:{
        type: String,
        // required: true,
    },
    refreshtoken:{
        type: String,
        // required: true,
    },
    createdAt: { type: Date, default: Date.now, timezone: 'Europe/Moscow' },
    changedAt: { type: Date, default: Date.now,  timezone: 'Europe/Moscow' },
});




module.exports = {UserSchema};