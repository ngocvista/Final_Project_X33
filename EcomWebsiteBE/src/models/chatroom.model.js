// chatroom.model.js
import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Danh sách các user tham gia (Admin, Staff, Customer)
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Khách hàng cụ thể
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // Danh sách các tin nhắn
});

// Tạo model từ schema
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
