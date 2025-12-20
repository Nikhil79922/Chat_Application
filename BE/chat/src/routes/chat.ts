import express from "express";
import { createNewChat, getAllChats, sendMessage,getMessagesByChat } from "../controller/chat.js";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
const route = express.Router()

route.post("/chat/new", isAuth, createNewChat);
route.get("/chat/all", isAuth, getAllChats);
route.post("/message", isAuth, upload.single("image"), sendMessage);
route.get("/allMessages/:chatId", isAuth, getMessagesByChat);

export default route;