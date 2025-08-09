import mongoose from "mongoose";
const Schema = mongoose.Schema;

const catSchema = new Schema({
  name: { type: String, required: true },
  birthDate: { type: String, required: true },
  catType: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  medicalLogs: { type: Schema.Types.ObjectId, ref: "MedicalLog" },
  dailyLogs: [{ type: Schema.Types.ObjectId, ref: "DailyLog" }],
});

export default mongoose.model("Cat", catSchema);
