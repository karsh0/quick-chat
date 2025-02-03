import mongoose, { model, Schema } from "mongoose";

mongoose.connect('mongodb+srv://admin:sdWrBsXuYHdxK3sb@cluster0.plktz.mongodb.net/quick-chat')

const userSchema = new Schema({
    username: String,
    password: String,
    rooms: [{type: Schema.Types.ObjectId, ref: "Room"}]
})

const roomSchema = new Schema({
    roomId: Number,
    slug: String,
    AdminId: String,
    chats: [{type: Schema.Types.ObjectId, ref: "Chat"}]
})

const chatSchema = new Schema({
    roomId: String,
    message: String,
})

export const userModel = model("user", userSchema)
export const roomModel = model("room", roomSchema)
export const chatModel = model("chat", chatSchema)