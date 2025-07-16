const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
}, { collection: "demo_react" })

const demo_react = mongoose.model("demo_react", schema)

module.exports = demo_react