const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    date: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model("Post", postSchema);
