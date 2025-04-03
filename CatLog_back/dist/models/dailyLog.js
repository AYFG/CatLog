import mongoose from "mongoose";
const Schema = mongoose.Schema;
const dailyLogSchema = new Schema({
    defecation: {
        type: Boolean,
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
        type: Schema.Types.ObjectId,
        ref: "Cat",
    },
    logDate: {
        type: String,
        required: true,
    },
});
export default mongoose.model("DailyLog", dailyLogSchema);
