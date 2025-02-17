import mongoose from "mongoose";

const addressBookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu tới User
  recipientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true }, // Thêm trường email
});

// Tạo model từ schema
const AddressBook = mongoose.model("AddressBook", addressBookSchema);

export default AddressBook;
