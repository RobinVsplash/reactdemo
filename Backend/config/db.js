
const mongoose = require('mongoose');

const mongoDBConnection = async (url) => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
};  

module.exports = mongoDBConnection;