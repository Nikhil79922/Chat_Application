/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import ChatSidebar from '@/src/components/ChatSidebar'
import Loading from '@/src/components/Loading'
import { chat_service, useAppData, User } from '@/src/context/AppContext'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie';
import axios from 'axios'
import ChatHeader from '@/src/components/ChatHeader'
import ChatMessages from '@/src/components/ChatMessages'
import MessageInput from '@/src/components/MessageInput'
import { SocketData } from '@/src/context/SocketContext'

export interface Message {
  _id: string,
  chatId: string,
  sender: string,
  text?: string,
  image?: {
    url: string,
    publicId: string,
  },
  messageType: "text" | "image",
  seen: boolean,
  seenAt?: string,
  createdAt: string,
}
const page = () => {
  const { loading, isAuth, logoutUser, chats, user: loggedInUser, users, fetchChats, setChats } = useAppData()

  const { onlineUsers, socket } = SocketData()
  const router = useRouter()
  const [selectedUser, setselectedUser] = useState<string | null>(null)
  const [message, setmessage] = useState("")
  const [sideBarOpen, setsideBarOpen] = useState(false);
  const [messages, setmessages] = useState<Message[] | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showAllUser, setshowAllUser] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const [typingTimeOut, settypingTimeOut] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login")
    }
  }, [loading, isAuth, router])

  const handleLogout = () => logoutUser();

  async function createChat(u: User) {
    try {
      const token = Cookies.get("token")
      const { data } = await axios.post(`${chat_service}/api/v1/chat/new`, { userId: loggedInUser?._id, otherUserId: u._id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setselectedUser(data.chatId)
      setshowAllUser(false);
      await fetchChats();
    } catch (error) {
      toast.error("Failed to start chat");
    }
  }
  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) return;

    if (!selectedUser) return;

    //Socket work!
    if (typingTimeOut) {
      clearTimeout(typingTimeOut)
      settypingTimeOut(null)
    }

    socket?.emit("stopTyping", {
      chatId: selectedUser,
      userId: loggedInUser?._id
    })

    const token = Cookies.get("token");
    try {
      const formData = new FormData();
      formData.append("chatId", selectedUser)
      if (message.trim()) {
        formData.append("text", message)
      }
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const { data } = await axios.post(`${chat_service}/api/v1/message`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      setmessages((prev) => {
        const currentMessages = prev || [];
        const messageExists = currentMessages.some((msg) => {
          msg._id === data.message._id
        });
        if (!messageExists) {
          return [...currentMessages, data.message]
        }
        return currentMessages
      })
      setmessage("")

      const displayText = imageFile ? "📷 image" : message
      moveChatToTop(selectedUser!,{
        text:displayText,
        sender:data.sender
      },false)
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  const handleTyping = (value: string) => {
    setmessage(value)
    if (!selectedUser || !socket) return
    //Socket Setup
    if (value.trim()) {
      socket.emit("typing", {
        chatId: selectedUser,
        userId: loggedInUser?._id
      })
    }
    if (typingTimeOut) {
      clearTimeout(typingTimeOut)
    }

    const timeOut = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedUser,
        userId: loggedInUser?._id
      })
    }, 2000)
    settypingTimeOut(timeOut)
  }

  useEffect(() => {
   socket?.on("newMessage",(message)=>{
    console.log("Recieved new Message:",message);

    if(selectedUser=== message.chatId){
      setmessages((prev)=>{
        const currentMessages = prev || [];
        const messageExits= currentMessages.some((msg)=>msg._id === message._id)
        if(!messageExits){
          return [...currentMessages,message]
        }
        return currentMessages;
      })
      moveChatToTop(message.chatId,message,false)
    }else{
         moveChatToTop(message.chatId,message,true)
    }
   })

   socket?.on("messagesSeen",(data)=>{
    console.log("message seen by:",data);
    if(selectedUser===data.chatId){
      setmessages((prev)=>{
        if(!prev) return null;
        return prev.map((msg)=>{
          if(msg.sender===loggedInUser?._id && data.messageIds && data.messageIds.includes(msg._id)){
            return{
              ...msg,
              seen:true,
              seenAt:new Date().toString()
            }
          }else if(msg.sender===loggedInUser?._id && !data.messageIds){
            return{
              ...msg,
              seen:true,
              seenAt:new Date().toString()
            }
          }
          return msg;
        })
      })
    }
   })

    socket?.on("userTyping", (data) => {
      console.log("Recieved User Typing", data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setisTyping(true)
      }
    })

    socket?.on("userStoppedTyping", (data) => {
      console.log("Recieved  stop Typing", data);
      if (data.chatId === selectedUser && data.userId !== loggedInUser?._id) {
        setisTyping(false)
      }
    })

    return () => {
      socket?.off("messagesSeen")
      socket?.off("newMessage")
      socket?.off("userTyping")
      socket?.off("userStoppedTyping")
    }
  }, [socket, selectedUser,setChats, loggedInUser?._id])

  const moveChatToTop = (chatId: string, newMessage: any, updatedUnseenCount = true) => {
    setChats((prev) => {
      if (!prev) return null;
      const updatedChats = [...prev];
      const chatIndex = updatedChats.findIndex(
        (chat) => chat.chat._id === chatId
      );
      if (chatIndex !== -1) {
        const [moveChat] = updatedChats.splice(chatIndex, 1);
        const updatedChat = {
          ...moveChat,
          chat: {
            ...moveChat.chat,
            lastestMessage: {
              text: newMessage.text,
              sender: newMessage.sender
            },
            updatedAt: new Date().toString(),
            unseenCount: updatedUnseenCount && newMessage.sender !== loggedInUser?._id ? (moveChat.chat.unseenCount || 0) + 1 : moveChat.chat.unseenCount || 0
          }
        };
        updatedChats.unshift(updatedChat)
      }
      return updatedChats
    })
  }

  const resetUnseenCount=(chatId:string)=>{
    setChats((prev)=>{
      if(!prev) return  null;
      return prev.map((chat)=>{
        if(chat.chat._id===chatId){
          return {
            ...chat,
            chat:{
              ...chat.chat,
              unseenCount:0
            }
          }
        }
        return chat;
      })
    })
  }

  async function fetchChat() {
    try {
      const token = Cookies.get("token")
      const { data } = await axios.get(`${chat_service}/api/v1/allMessages/${selectedUser}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setmessages(data.messages)
      setUser(data.user);
      await fetchChats();
    } catch (error) {
      console.log("Err :", error)
      toast.error("Failed to load messages");
    }
  }

  useEffect(() => {
    if (selectedUser) {
      fetchChat()
      setisTyping(false)
      resetUnseenCount(selectedUser);
      socket?.emit("joinChat", selectedUser)
    }
    return () => {
      socket?.emit("leaveChat", selectedUser)
      setmessages(null)
    }
  }, [selectedUser, socket])

  useEffect(() => {

    return () => {
      if (typingTimeOut) {
        clearTimeout(typingTimeOut)
      }
    }
  }, [typingTimeOut])


  if (loading) return <Loading />
  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
      <ChatSidebar sideBarOpen={sideBarOpen} setsideBarOpen={setsideBarOpen} showAllUsers={showAllUser} setshowAllUsers={setshowAllUser} users={users} loggedInUser={loggedInUser} chats={chats} selectedUser={selectedUser} setselectedUser={setselectedUser} handleLogout={handleLogout} createChat={createChat} onlineUsers={onlineUsers} />
      <div className='flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-[1px] border-white/10 '>
        <ChatHeader user={user} setsideBarOpen={setsideBarOpen} isTyping={isTyping} onlineUsers={onlineUsers} />
        <ChatMessages selectedUser={selectedUser} loggedInUser={loggedInUser} messages={messages} />
        <MessageInput selectedUser={selectedUser} message={message} setmessage={handleTyping} handleMessageSend={handleMessageSend} />
      </div>
    </div>
  )
}

export default page
