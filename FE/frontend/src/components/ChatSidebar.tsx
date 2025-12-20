/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { User } from '../context/AppContext';
import { MessageCircle, Plus, X, XIcon } from 'lucide-react';

interface ChatSidebarProps {
    sideBarOpen: boolean;
    setsideBarOpen: (open: boolean) => void;
    showAllUsers: boolean;
    setshowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
    users: User[] | null;
    loggedInUser: User | null;
    chats: any[] | null;
    selectedUser: string | null;
    setselectedUser: (userId: string | null) => void
    handleLogout: () => void;
}

const ChatSidebar = ({ sideBarOpen, setsideBarOpen, showAllUsers, setshowAllUsers, users, loggedInUser, chats, selectedUser, setselectedUser, handleLogout }: ChatSidebarProps) => {
    const [searchQuery, setsearchQuery] = useState("")
    return (

        <div>
            <aside className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform ${sideBarOpen? "translate-x-0":"-translate-x-full"}  sm:translate-x-0 transition-transform duration-300 flex flex-col` }>

                {/* Header  */}
                <div className=' p-6 border-b border-gray-700 '>
                    <div className=' sm:hidden flex justify-end mb-0 '>
                        <button onClick={()=> setsideBarOpen(false)} className='p-2 hover:bg-gray-700 rounded-lg transition-colors ' > <X className=' w-5 h-5 text-gray-300  '/> </button>
                    </div>
                    <div className='flex items-center justify-between '>
                        <div className='flex item-center gap-3' >
                            <div className='p-2 bg-blue-600 justify-between '>
                                <MessageCircle className='w-5 h-5 text-white' />
                            </div>
                            <h2 className='text-xl font-bold '>{showAllUsers? "New Chat" :"Messages"}</h2>
                        </div>

                        <button onClick={()=> setshowAllUsers((prev)=> !prev)} className={`p-2.5 rounded-lg transition-colors ${showAllUsers? "bg-red-600 hover:bg-red-700 text-white":"bg-green-600 hover:bg-green-700 text-white"} `}>
                            {showAllUsers? <X className='w-4 h-4'/> : <Plus className='w-4 h-4'/>}
                        </button>
                    </div>
                </div>

                {/* Content */}
                
            </aside>
        </div>
    )
}

export default ChatSidebar
