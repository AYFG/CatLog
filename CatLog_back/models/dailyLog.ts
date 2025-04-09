import mongoose from "mongoose";
const Schema = mongoose.Schema;

const dailyLogSchema = new Schema({
  defecation: {
    type: String,
    required: true,
  },
  vitamin: {
    type: Date,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  etc: {
    type: String,
  },
  cat: {
    catId: {
      type: Schema.Types.ObjectId,
      ref: "Cat",
      required: true,
    },
    catName: {
      type: String,
      required: true,
    },
  },
  logDate: {
    type: String,
    required: true,
  },
});

export default mongoose.model("DailyLog", dailyLogSchema);
