import mongoose from "mongoose";
const Schema = mongoose.Schema;
const medicalLogSchema = new Schema({
    healthCheckupDate: {
        type: String,
        required: true,
    },
    healthCycle: {
        type: Number,
        required: true,
    },
    heartWorm: {
        type: String,
        required: true,
    },
    heartWormCycle: {
        type: Number,
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
});
export default mongoose.model("MedicalLog", medicalLogSchema);
