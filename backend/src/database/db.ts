import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: String,
    password: String,
})

export const userModel = model("user", userSchema)