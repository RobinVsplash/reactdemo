import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
}, { collection: "demo_react" });

const demo_react = mongoose.model("demo_react", schema);

export default demo_react;