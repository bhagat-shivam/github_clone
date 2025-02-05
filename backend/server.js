import express from 'express';
import userRoutes from './routes/user.route.js';
import dotenv from 'dotenv';
import cors from 'cors';
import exploreRoutes from './routes/explore.route.js';
import connectMongoDB from './db/connectMongoDB.js';



dotenv.config();

const app = express();
app.use(cors());


app.get("/", (req, res) => {
    res.send("server is ready");
});

app.use("/api/users",userRoutes);
app.use("/api/explore",exploreRoutes);


app.listen(5000,() => {
    console.log('server is running on port 5000');
    connectMongoDB();
})