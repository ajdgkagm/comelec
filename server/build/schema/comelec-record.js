import mongoose from "mongoose";
const comelecRecordSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: String, required: true },
    provincePlace: { type: String, required: true },
    cityMunicipality: { type: String, required: true },
    precintNumber: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], required: true },
    inactiveReason: { type: String, default: "" },
    suffix: { type: String, required: true },
});
const ComelecRecordModel = mongoose.model("ComelecRecord", comelecRecordSchema);
export default ComelecRecordModel;
