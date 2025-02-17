// message.model.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Tự động tạo timestamp khi khởi tạo message
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người gửi tin nhắn
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" }, // Phòng chat chứa tin nhắn
});

// Tạo model từ schema
const Message = mongoose.model("Message", messageSchema);

export default Message;
