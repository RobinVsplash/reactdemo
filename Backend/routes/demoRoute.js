import express from 'express';
import demo_react from '../module/demo_react.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Helper for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/add', async (req, res) => {
    const { name, email, age } = req.body;

    const data = await demo_react.create({
        name,
        email,
        age
    })

    return res.status(200).json({
        status: "success",
        data
    })
})

router.get('/get', async (req, res) => {
    const id = req.query.id
    const data = await demo_react.findById(req.query.id)
    return res.status(200).json({
        status: "success",
        data
    })
})

router.get('/getall', async (req, res) => {
    const data = await demo_react.find()
    return res.status(200).json({
        status: "success",
        data
    })
})

router.patch('/update', async (req, res) => {
    try {
        const { id, name, email, age } = req.body;

        if (!id) {
            return res.status(400).json({ status: "error", message: "ID is required" });
        }

        const data = await demo_react.findByIdAndUpdate(id, { name, email, age }, { new: true });

        if (!data) {
            return res.status(404).json({ status: "error", message: "Record not found" });
        }

        return res.status(200).json({ status: "success", message:"Update successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

router.delete('/delete', async (req, res) => {
    const id = req.query.id

    if (!id) {
        return res.status(400).json({ status: "error", message: "ID is required" });
    }
    const data = await demo_react.findByIdAndDelete(id)

    if (!data) {
        return res.status(404).json({ status: "error", message: "Record not found" });
    }

    return res.status(200).json({
        status: "success",
        message:"deleted Successfully"
    })
})

export default router;