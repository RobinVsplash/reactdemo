import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import demoRoute from './routes/demoRoute.js';
import blogRoute from './routes/blogRoute.js';
import mongoDBConnection from './config/db.js';

const app = express();


const port = 3000;
// import { mongoDBConnection } from './config.js/db';
dotenv.config('.env');

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
app.use('/uploads', express.static('public/uploads'));

app.use('/api/v1', demoRoute)
app.use('/api/v1', blogRoute)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})