import mongoose from "mongoose";
const Schema = mongoose.Schema;
const catSchema = new Schema({
    name: { type: String, required: true },
    birthDate: { type: Date, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
export default mongoose.model("Cat", catSchema);
