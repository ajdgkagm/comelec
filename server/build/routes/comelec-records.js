import express from 'express';
import ComelecRecordModel from '../schema/comelec-record.js';
const router = express.Router();
router.get('/getAllByUserID/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const records = await ComelecRecordModel.find({ userId: userId });
        if (records.length === 0) {
            return res.status(404).send("No Records Found");
        }
        res.status(200).send(records);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.post('/', async (req, res) => {
    try {
        const newRecordBody = req.body;
        const newRecord = new ComelecRecordModel(newRecordBody);
        const savedRecord = await newRecord.save();
        res.status(200).send(savedRecord);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.put("/:id", async (req, res) => {
    try {
        const updated = await ComelecRecordModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch (err) {
        res.status(500).send("Error");
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const record = await ComelecRecordModel.findByIdAndDelete(id);
        if (!record)
            return res.status(404).send();
        res.status(200).send(record);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
export default router;
