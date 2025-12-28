import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import chatRoute  from "./routes/chat.js"
import cors from 'cors'
import { app,server } from './config/socket.js';
dotenv.config();
connectDB()

const port = process.env.PORT;
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1",chatRoute)

server.listen(port, () => {
    console.log(`Server is Started at port : ${port}`)
})