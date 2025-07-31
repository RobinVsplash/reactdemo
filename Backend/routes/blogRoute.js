import express from 'express';
import Blog from '../module/blog.js';
import upload from './multerConfig.js';

const router = express.Router();

// CREATE Blog
router.post('/blog', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        // console.log(req.get('host'));
        let imageUrl = '';
        if (req.file) {
            // if (req.get('host').includes('localhost')) {
            //     imageUrl = `/uploads/${req.file.filename}`;
            // } else {
                imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            // }
        }
        const blog = await Blog.create({ title, content, author, imageUrl });
        res.status(201).json({ status: 'success', data: blog });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// READ all Blogs
router.get('/blog', async (req, res) => {
    try {
        // console.log(req.get('host'));
        const blogs = await Blog.find();
        res.status(200).json({ status: 'success', data: blogs });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// READ single Blog
router.get('/blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ status: 'error', message: 'Blog not found' });
        res.status(200).json({ status: 'success', data: blog });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// UPDATE Blog
router.patch('/blog/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        let updateData = { title, content, author };

        if (req.file) {
            // if (req.get('host').includes('localhost')) {
            //     updateData.imageUrl = `/uploads/${req.file.filename}`;
            // } else {
                updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            // }
        }
        const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!blog) return res.status(404).json({ status: 'error', message: 'Blog not found' });
        res.status(200).json({ status: 'success', data: blog });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// DELETE Blog
router.delete('/blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ status: 'error', message: 'Blog not found' });

        // Remove associated image file if it exists
        if (blog.imageUrl) {
            // Extract the filename from the imageUrl
            let filename = '';
            if (blog.imageUrl.startsWith('/uploads/')) {
                // Localhost or relative URL
                filename = blog.imageUrl.replace('/uploads/', '');
            } else {
                // Full URL, extract after last '/uploads/'
                const idx = blog.imageUrl.lastIndexOf('/uploads/');
                if (idx !== -1) {
                    filename = blog.imageUrl.substring(idx + 9);
                }
            }
            if (filename) {
                const fs = await import('fs');
                const path = await import('path');
                const uploadPath = path.resolve('public/uploads', filename);
                fs.unlink(uploadPath, (err) => {
                    if (err) {
                        console.error('Failed to delete image:', uploadPath, err.message);
                    }
                });
            }
        }
        res.status(200).json({ status: 'success', message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

export default router;
