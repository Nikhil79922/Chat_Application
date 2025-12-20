/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import ChatSidebar from '@/src/components/ChatSidebar'
import Loading from '@/src/components/Loading'
import { useAppData, User } from '@/src/context/AppContext'
import { useRouter } from 'next/navigation'
import React, { useEffect , useState} from 'react'

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
  const { loading, isAuth, logoutUser , chats, user: loggedInUser, users , fetchChats, setChats } = useAppData()
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
const handleLogout =()=> logoutUser();
  if (loading) return <Loading />
  return (
    <div className='min-h-screen flex bg-gray-900 text-white relative overflow-hidden'>
      <ChatSidebar sideBarOpen={sideBarOpen} setsideBarOpen={setsideBarOpen} showAllUsers={showAllUser}  setshowAllUsers={setshowAllUser} users={users} loggedInUser={loggedInUser} chats={chats} selectedUser={selectedUser} setselectedUser={setselectedUser} handleLogout={handleLogout}  />
    </div>
  )
}

export default page
