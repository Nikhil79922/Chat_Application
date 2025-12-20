import amql from 'amqplib'

let channel: amql.Channel;

export const connectRabbitMQ = async()=>{
    try{
 const connection = await amql.connect({
    protocol:'amqp',
    hostname:process.env.Rabbitmq_Host,
    port:5672,
    username:process.env.Rabbitmq_Username,
    password:process.env.Rabbitmq_password,
 });
 channel =await connection.createChannel();
 console.log("Connected to RabbitMq")
    }catch(e){
        console.error("Failed to connect to RabbitMq", e)
    }
}

export const publishToQueue = async (queueName:string, message:any) =>{
    if(!channel){
        console.log("RabbitMq channel is not initalized")
        return;
    }
    await channel.assertQueue(queueName, {durable:true})
    channel.sendToQueue(queueName , Buffer.from(JSON.stringify(message)), {
        persistent:true,
    });
}