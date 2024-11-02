import { Schema } from "mongoose";

const chatSchema = new Schema({
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true, });
export { chatSchema };

// export const Chat = model("Chat", chatSchema);