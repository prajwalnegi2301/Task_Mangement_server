import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloudinary from "cloudinary";
import { errorMiddleware } from './utils/errorMiddleware.js';
import database from './database/dbConnection.js';


import adminRouter from './routes/admin.routes.js';
import partnerWithUsRouter from './routes/partnerWithUs.routes.js';
import userRouter from './routes/user.routes.js';
import connectWithUsRouter from './routes/connectWithUs.routes.js'
import taskRouter from './routes/task.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/partnerWithUs', partnerWithUsRouter);
app.use('/api/v1/connect', connectWithUsRouter);
app.use('/api/v1/task', taskRouter);

database();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("server is running");
})