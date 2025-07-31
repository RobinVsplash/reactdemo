import mongoose from 'mongoose';

const mongoDBConnection = async (url) => {
    try {
        if (!url || !url.startsWith('mongodb://') && !url.startsWith('mongodb+srv://')) {
            throw new Error('Invalid MongoDB URI. Please check your .env file and use a valid connection string.');
        }
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Suppress strictQuery warning for Mongoose 7+
            // strictQuery: false
        });
        // Remove mongoose deprecated warnings
        mongoose.set('strictQuery', false);
    } catch (err) {
        console.error('[MongoDB Connection Error]', err.message);
        throw err;
    }
};

export default mongoDBConnection;