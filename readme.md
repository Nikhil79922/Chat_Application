# 🚀 Real-Time Chat Application

A scalable, production-ready real-time chat application built using a modern microservices architecture with Next.js, Node.js, TypeScript, MongoDB, RabbitMQ, Socket.IO, and KrakenD API Gateway.

This project demonstrates:
- scalable microservice communication
- real-time messaging
- JWT authentication
- RabbitMQ event-driven architecture
- API Gateway routing
- Socket.IO live communication
- cloud-based media uploads
- modern frontend architecture

---

# 📌 Tech Stack

## Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Socket.IO Client
- Context API

---

## Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Socket.IO
- RabbitMQ
- KrakenD API Gateway
- JWT Authentication
- Cloudinary
- Multer

---

# 🏗️ Architecture Overview

```text
Frontend (Next.js)
        ↓
KrakenD API Gateway
        ↓
------------------------------------------------
|               Backend Services               |
------------------------------------------------
| User Service  | Chat Service | Mail Service |
------------------------------------------------
        ↓
MongoDB + RabbitMQ + Socket.IO
```

---

# ⚡ Microservices Architecture

The application follows a distributed microservices architecture.

Each service has its own responsibility.

---

# 📁 Services Overview

| Service | Responsibility |
|---|---|
| User Service | Authentication, users, JWT |
| Chat Service | Real-time chat, messages, sockets |
| Mail Service | Email queue consumer |
| KrakenD Gateway | API routing & aggregation |

---

# 📂 Project Structure

```text
BE/
 ├── chat/
 ├── gateway/
 ├── mail/
 └── user/

FE/
 └── Next.js Frontend
```

---

# 📦 Backend File Structure

```text
BE
├── chat
├── gateway
├── mail
└── user
```

---

# 🔐 User Service

Handles:
- user registration
- login
- JWT authentication
- authorization
- RabbitMQ publishing

### Main Features
- JWT token generation
- protected routes
- auth middleware
- MongoDB user management

### Important Files

```text
user/src/config/generateToken.ts
user/src/middleware/isAuth.ts
user/src/controllers/user.ts
```

---

# 💬 Chat Service

Handles:
- chat rooms
- real-time messaging
- media uploads
- socket events
- chat persistence

### Main Features
- Socket.IO real-time communication
- chat history
- image uploads
- message persistence
- typing events

### Important Files

```text
chat/src/config/socket.ts
chat/src/controller/chat.ts
chat/src/model/Chat.ts
chat/src/model/Message.ts
```

---

# 📧 Mail Service

Handles:
- asynchronous email processing
- RabbitMQ consumers
- event-driven email workflows

### Main Features
- queue consumers
- background processing
- decoupled architecture

### Important Files

```text
mail/src/consumer.ts
mail/src/index.ts
```

---

# 🌐 KrakenD API Gateway

Acts as:
- centralized API entry point
- API aggregation layer
- service routing layer

### Main Features
- service routing
- request forwarding
- centralized API access
- microservice abstraction

### Important Files

```text
gateway/krakenD.json
gateway/docker-compose.yml
```

---

# 🎨 Frontend Architecture

Built using:
- Next.js App Router
- reusable components
- Context API
- Socket.IO client

---

# 📂 Frontend Structure

```text
FE/src
├── app
├── components
└── context
```

---

# 📄 Pages

| Route | Description |
|---|---|
| / | Home Page |
| /login | Authentication |
| /chat | Real-time chat |
| /profile | User profile |
| /verify | OTP verification |

---

# 🧩 Components

| Component | Purpose |
|---|---|
| ChatHeader | Chat topbar |
| ChatMessages | Message rendering |
| ChatSidebar | Conversations |
| MessageInput | Sending messages |
| VerifyOtp | OTP verification |

---

# 🔄 Real-Time Messaging Flow

```text
User Sends Message
        ↓
Socket.IO Event
        ↓
Chat Service
        ↓
Store Message in MongoDB
        ↓
Broadcast via Socket.IO
        ↓
Receiver Gets Message Instantly
```

---

# 🔐 Authentication Flow

```text
User Login/Register
        ↓
JWT Token Generated
        ↓
Frontend Stores Token
        ↓
Protected APIs Use JWT Middleware
        ↓
Authorized Access
```

---

# ☁️ Cloudinary Integration

Used for:
- image uploads
- media optimization
- cloud storage

### Features
- image upload
- optimized delivery
- scalable storage

### Important File

```text
chat/src/config/cloudinary.ts
```

---

# 📡 RabbitMQ Integration

RabbitMQ is used for:
- asynchronous processing
- decoupled communication
- background tasks
- event-driven architecture

---

# RabbitMQ Workflow

```text
Producer Service
        ↓
RabbitMQ Queue
        ↓
Consumer Service
        ↓
Background Processing
```

---

# 📦 MongoDB Collections

## User Collection

```js
{
  _id,
  name,
  email,
  password,
  avatar,
  createdAt
}
```

---

## Chat Collection

```js
{
  _id,
  members: [],
  lastMessage,
  createdAt
}
```

---

## Message Collection

```js
{
  _id,
  chatId,
  senderId,
  message,
  image,
  createdAt
}
```

---

# 🔌 Socket.IO Events

| Event | Description |
|---|---|
| connection | User connected |
| disconnect | User disconnected |
| sendMessage | Send message |
| receiveMessage | Receive message |
| typing | Typing indicator |

---

# 🚀 Features

## Authentication
✅ Register  
✅ Login  
✅ JWT Auth  
✅ Protected Routes  

---

## Chat
✅ Real-time messaging  
✅ Persistent chats  
✅ Socket.IO communication  
✅ Image sharing  
✅ Chat history  

---

## Scalability
✅ Microservices architecture  
✅ API Gateway  
✅ RabbitMQ queues  
✅ Event-driven communication  

---

# ⚙️ Environment Variables

## User Service

```env
PORT=
MONGO_URI=
JWT_SECRET=
RABBITMQ_URL=
```

---

## Chat Service

```env
PORT=
MONGO_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Mail Service

```env
RABBITMQ_URL=
```

---

# 🐳 Docker Support

KrakenD gateway includes Docker support.

```bash
docker-compose up
```

---

# ▶️ Installation

## Clone Repository

```bash
git clone <repo-url>
```

---

# Install Dependencies

## Root

```bash
npm install
```

---

## Frontend

```bash
cd FE
npm install
```

---

## Backend Services

```bash
cd BE/user
npm install

cd ../chat
npm install

cd ../mail
npm install
```

---

# ▶️ Running Project

## Frontend

```bash
cd FE
npm run dev
```

---

## User Service

```bash
cd BE/user
npm run dev
```

---

## Chat Service

```bash
cd BE/chat
npm run dev
```

---

## Mail Service

```bash
cd BE/mail
npm run dev
```

---

## KrakenD Gateway

```bash
cd BE/gateway
docker-compose up
```

---

# 📈 Scalability Considerations

This project is designed with scalability in mind.

### Scalability Features
- microservices separation
- API Gateway
- RabbitMQ queues
- event-driven architecture
- real-time socket communication
- isolated services
- async background processing

---

# 🔒 Security Features

✅ JWT Authentication  
✅ Protected Routes  
✅ Middleware Authorization  
✅ Secure File Uploads  
✅ API Gateway Layer  

---

# 🧪 Future Improvements

- Redis caching
- Kafka integration
- message delivery receipts
- typing indicators
- online/offline tracking
- group chats
- read receipts
- push notifications
- Kubernetes deployment
- CI/CD pipelines

---

# 📊 Production Ready Concepts

This project demonstrates:

- scalable architecture
- service isolation
- event-driven systems
- real-time communication
- queue-based processing
- distributed systems design
- authentication systems
- gateway-based routing

---

# 🎯 Learning Outcomes

This project showcases:
- Microservices
- Real-Time Systems
- Distributed Architecture
- Socket.IO
- RabbitMQ
- API Gateway
- JWT Authentication
- MongoDB Design
- Scalable Backend Design
- Event-Driven Architecture

---

# 👨‍💻 Author

Nikhil Singh

GitHub: https://github.com/Nikhil79922

---

# ⭐ Final Notes

This project is a complete modern real-time communication platform built using industry-standard scalable architecture patterns.

It demonstrates both:
- frontend engineering
- backend distributed systems engineering

making it highly valuable for:
- resume projects
- portfolio showcasing
- system design discussions
- backend architecture demonstrations
- full-stack engineering interviews