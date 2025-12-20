import amqp from 'amqplib'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.Rabbitmq_Host,
            port: 5672,
            username: process.env.Rabbitmq_Username,
            password: process.env.Rabbitmq_password,
            heartbeat: 60 
        });
        
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error', err);
        });

        connection.on('close', () => {
            console.log('RabbitMQ connection closed, retrying in 5 seconds...');
            setTimeout(startSendOtpConsumer, 5000);
        });

        const channel = await connection.createChannel();
        const queueName = 'send-otp';
        await channel.assertQueue(queueName, { durable: true });

        console.log("Mail server consumer started, Listening for otp emails")

        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString())
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.sendgrid.net',
                        port: 587,
                        auth: {
                          user: 'apikey',
                          pass: process.env.SENDGRID_API_KEY
                        }
                    });

                    await transporter.sendMail({
                        from: 'ns94301918@gmail.com',
                        to,
                        subject,
                        text: body
                    })
                    console.log(`OTP mail sent to ${to}`)
                    channel.ack(msg);
                } catch (e) {
                    console.error("Failed to send OTP", e)
                }
            }
        })
        console.log("Connected to RabbitMq")
    } catch (e) {
        console.error("Failed to start RabbitMq consumer", e)
    }
}
