import { model, Schema, Types } from "mongoose";
import { chatSchema } from "./Chat.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: [chatSchema]
}, {
    timestamps: true,
})

export const User = model("User", userSchema);