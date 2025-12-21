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
import { Response } from 'express';


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

  async function createChat(u:User){
    try {
      const token=Cookies.get("token")
      const {data}=await axios.post(`${chat_service}/api/v1/chat/new`,{userId:loggedInUser?._id,otherUserId:u._id},{
        headers:{
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
  const handleMessageSend= async (e:any, imageFile?: File | null)=>{
    e.preventDefault();

  if(!message.trim() && !imageFile) return;

  if(!selectedUser) return;
  
  //Socket work!

  const token=Cookies.get("token");
  try {
    const formData= new FormData();
    formData.append("chatId",selectedUser)
    if(message.trim()){
      formData.append("text",message)
    }
    if(imageFile){
      formData.append("image", imageFile)
    }

    const {data}=await axios.post(`${chat_service}/api/v1/message`,formData,{
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type":"multipart/form-data",
      }
    });
    setmessages((prev)=>{
      const currentMessages=prev || [];
      const messageExists= currentMessages.some((msg)=>{
        msg._id=== data.message._id
      });
      if(!messageExists){
        return [...currentMessages, data.message]
      }
      return currentMessages
    })
    setmessage("")

    const displayText = imageFile ? "📷 image" :message
  } catch (error : any) {
    toast.error(error.response.data.message)
  }
      }

  const handleTyping=(value:string)=>{
setmessage(value)
if(!selectedUser) return 

//Socket Setup
  }

  async function fetchChat(){
    try {
      const token=Cookies.get("token")
      const {data}=await axios.get(`${chat_service}/api/v1/allMessages/${selectedUser}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setmessages(data.messages)
      setUser(data.user);
      await fetchChats();
    } catch (error) {
      console.log("Err :",error)
      toast.error("Failed to load messages");
    }
  }

  useEffect(() => {
   if(selectedUser){
   fetchChat()
    }
  }, [selectedUser])
  

  if (loading) return <Loading />
  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
      <ChatSidebar sideBarOpen={sideBarOpen} setsideBarOpen={setsideBarOpen} showAllUsers={showAllUser} setshowAllUsers={setshowAllUser} users={users} loggedInUser={loggedInUser} chats={chats} selectedUser={selectedUser} setselectedUser={setselectedUser} handleLogout={handleLogout} createChat={createChat} />
      <div className='flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-[1px] border-white/10 '>
      <ChatHeader user={user} setsideBarOpen={setsideBarOpen} isTyping={isTyping}/>
      <ChatMessages selectedUser={selectedUser} loggedInUser={loggedInUser} messages={messages} />
      <MessageInput selectedUser={selectedUser} message={message} setmessage={handleTyping} handleMessageSend={handleMessageSend} />
      </div>
    </div>
  )
}

export default page
