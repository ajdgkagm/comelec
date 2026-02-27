import { Router } from "express";
import ComelecRecordModel from "../schema/comelec-record.js";
const router = Router();
router.get("/", async (req, res) => {
    const firstName = req.query.firstName?.trim();
    const lastName = req.query.lastName?.trim();
    if (!firstName || !lastName) {
        return res.status(400).json({ error: "Missing firstName or lastName" });
    }
    try {
        const records = await ComelecRecordModel.find({
            firstName: { $regex: firstName, $options: "i" },
            lastName: { $regex: lastName, $options: "i" },
        });
        res.json(records);
    }
    catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
export default router;
