import mongoose from "mongoose";
const Schema = mongoose.Schema;
const medicalLogSchema = new Schema({
    healthCheckup: {
        type: Date,
        required: true,
    },
    healthCheckupCycle: {
        type: Number,
        required: true,
    },
    heartWormInjection: {
        type: Date,
        required: true,
    },
    heartWormInjectionCycle: {
        type: Number,
    },
    cat: {
        type: Schema.Types.ObjectId,
        ref: "Cat",
    },
});
export default mongoose.model("MedicalLog", medicalLogSchema);
