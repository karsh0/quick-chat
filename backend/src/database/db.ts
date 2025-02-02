import mongoose, { model, Schema } from "mongoose";

mongoose.connect('mongodb+srv://admin:sdWrBsXuYHdxK3sb@cluster0.plktz.mongodb.net/quick-chat')

const userSchema = new Schema({
    username: String,
    password: String,
})

const roomSchema = new Schema({
    roomId: String
})

export const userModel = model("user", userSchema)
export const roomModel = model("room", roomSchema)