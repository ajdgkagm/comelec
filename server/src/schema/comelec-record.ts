import mongoose, { mongo } from "mongoose";

interface ComelecRecord{
    userId: string,
    date: Date,
    firstName: string,
    middleName: string,
    lastName: string,
    birthDate: string,
    provincePlace: string,
    cityMunicipality: string,
    precintNumber: string,
    status: string,
    suffix: string,

}
const comelecRecordSchema = new mongoose.Schema<ComelecRecord>({
    userId: {type: String, required: true},
    date: {type: Date, required: true},
    firstName: {type: String, required: true},
    middleName: {type: String, required: true},  
    lastName: {type: String, required: true},
    birthDate: {type: String, required: true},
    provincePlace: {type: String, required: true},
    cityMunicipality: {type: String, required: true},
    precintNumber: {type: String, required: true},
    status: {type: String, required: true},
    suffix: {type: String, required: true}
})

const ComelecRecordModel = mongoose.model<ComelecRecord>('ComelecRecord',comelecRecordSchema)

export default ComelecRecordModel;
