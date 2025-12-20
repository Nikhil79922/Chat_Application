import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import {createClient} from 'redis'
import userRoute from './routes/user.js'
import {connectRabbitMQ} from './config/rabbitmq.js'
import cors from 'cors'

dotenv.config();

connectDB();

connectRabbitMQ()

export const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.connect().then(()=>{console.log("Connected to Redis")}).catch((e)=>{
    console.error("Error in connecting to redis:", e)
})

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/",userRoute)

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is Started at port : ${port}`)
})