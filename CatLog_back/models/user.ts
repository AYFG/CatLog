import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  cats: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cat",
    },
  ],
});

export default mongoose.model("User", userSchema);
