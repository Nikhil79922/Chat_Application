import TryCatch from "../config/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../model/Chat.js";
import { Messages } from "../model/Message.js";
import axios from "axios"

export const createNewChat = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
        res.status(400).json({
            message: "Other UserId is Required"
        })
    }

    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 }
    })

    if (existingChat) {
        res.json({
            message: "Chat already exists",
            chatId: existingChat._id
        })
        return;
    }

    const newChat = await Chat.create({
        users: [userId, otherUserId],
    })

    res.status(201).json({
        message: "New Chat created",
        chatid: newChat._id
    })
})

export const getAllChats = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;

    if (!userId) {
        res.status(400).json({
            message: "User Id Missing"
        })
        return;
    }

    const chats = await Chat.find({
        users: userId
    }).sort({ updated: -1 });


    const chatWithUserData = await Promise.all(chats.map(async (chat) => {
        const otherUserId = chat.users.find((id) => {return id !== userId })
        const unseenCount = await Messages.countDocuments({
            chatId: chat._id,
            sender: { $ne: userId },
            seen: false,
        });


        try {
            const { data } = await axios.get(
                `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`
            )

            return {
                user: data,
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        } catch (error) {
            console.error("Error in chatWithUserData function ", error);
            return {
                user: { _id: otherUserId, name: "Unknown User" },
                chat: {
                    ...chat.toObject(),
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                }
            }
        }
    }))
    res.json({
        chats: chatWithUserData,
    })
})

export const sendMessage = TryCatch(async (req: AuthenticatedRequest, res) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;

    const imageFile = req.file;
    if (!senderId) {
        res.status(401).json({
            message: "Unauthorised"
        })
        return;
    }
    if (!chatId) {
        res.status(400).json({
            message: "chatId Required"
        })
        return;
    }
    if (!text && !imageFile) {
        res.status(400).json({
            message: "Either Text or Image is Required"
        })
        return;
    }
    const chat = await Chat.findById(chatId)
    if (!chat) {
        res.status(404).json({
            message: "Chat not found"
        })
        return;
    }
    const isUserInChat = chat.users.some(
        (userId) => userId.toString() === senderId.toString()
    )
    if (!isUserInChat) {
        res.status(403).json({
            message: "You are not the participants of this chat"
        })
        return;
    }
    const otherUserId = chat.users.find(id => id.toString() !== senderId.toString())
    if (!otherUserId) {
        res.status(401).json({
            message: "No other User found"
        })
        return;
    }

    /*
    Socket Setup is remaining
    */

    let messageData: any = {
        chatId,
        sender: senderId,
        seen: false,
        seenAt: undefined,
    }

    if (imageFile) {
        messageData.image = {
            url: imageFile.path,
            publicId: imageFile.filename
        }
        messageData.messageType = 'image';
        messageData.text = text || "";
    } else {
        messageData.messageType = 'text';
        messageData.text = text;
    }

    const message = new Messages(messageData);
    const savedMessage = await message.save();

    const lastestMessageText = imageFile ? "📷 Image" : text

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: {
            text: lastestMessageText,
            sender: senderId
        },
        updatedAt: new Date()
    }, { new: true })

    /*
   emit socket
       */
res.status(201).json({
    message:savedMessage,
    sender:senderId
})
})

export const getMessagesByChat =TryCatch(async (req: AuthenticatedRequest, res) => {
const userId = req.user?._id;
console.log("working")
const {chatId} = req.params;

if (!userId) {
    res.status(401).json({
        message: "Unauthorised"
    })
    return;
}
if (!chatId) {
    res.status(400).json({
        message: "chatId Required"
    })
    return;
}

const chat= await Chat.findById(chatId)
if (!chat) {
    res.status(400).json({
        message: "Chat not Found"
    })
    return;
}
const isUserInChat = chat.users.some(
    (id) => id.toString() === userId.toString()
)
if (!isUserInChat) {
    res.status(403).json({
        message: "You are not the participants of this chat"
    })
    return;
}

const messagesToMarkSeen= await Messages.find({
    chatId,
    sender:{$ne : userId},
    seen:false
})

await Messages.updateMany({
    chatId,
    sender:{$ne : userId},
    seen:false
},{
    seen:true,
    seenAt: new Date()
})

const messages = await Messages.find({chatId}).sort({
    createdAt: 1
})

const otherUserId= chat.users.find(id=> id !== userId);
if (!otherUserId) {
    return res.status(401).json({
        message: "No other User found"
    })
}

try {
    const { data } = await axios.get(
        `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`
    )
    
    /* 
    Socket Work 
     */

    res.json({
        messages,
        user:data,
    })
} catch (error) {
    console.error("Error in getMessagesByChat function ", error);
    return {
        messages,
        user: { _id: otherUserId, name: "Unknown User" },
    }
}

})