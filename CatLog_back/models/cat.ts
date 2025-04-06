import mongoose from "mongoose";
const Schema = mongoose.Schema;

const catSchema = new Schema({
  name: { type: String, required: true },
  birthDate: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  medicalLogs: { type: Schema.Types.ObjectId, ref: "MedicalLog" },
  dailyLog: [{ type: Schema.Types.ObjectId, ref: "DailyLog" }],
});

export default mongoose.model("Cat", catSchema);
