const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()
const port = 3000;
const dotenv = require('dotenv');
// const  mongoDBConnection  = require('./config.js/db');
dotenv.config('.env')


const demoRoute = require('./routes/demoRoute.js');
const mongoDBConnection = require('./config/db.js');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*'
}));

// // mongodb connection 
// const mongoDBConnection = async (url) => {
//     await mongoose.connect(url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
// };

mongoDBConnection(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDb connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });


    // router
app.use('/api/v1', demoRoute)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})