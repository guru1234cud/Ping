import React,{useEffect} from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
const ChatContainer = () => {

  const {messages,getMessages, isMessageLoading,selectedUser}= useChatStore();
  const {authUser} = useAuthStore();
  if (isMessageLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )
  useEffect(()=>{
    getMessages(selectedUser._id)
    subscribeToMessages();
    return ()=> unscribeToMessages();
  },[selectedUser._id, getMessages])
  
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 flex flex-col overflow-auto'>
        {messages.map((msg)=>(
          <div key={msg._id} className={`chat ${msg.senderId === authUser._id}:chat-start : chat-end`}>
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img 
                src={msg.senderId === authUser._id ? authUser.profilepic || "/avatar.png" : selectedUser.profilepic  || "/avatar.png"}

                alt="profile pic"/>
              </div>
            </div>
            <div className='chat-header mb-1 '>
                <time className='text-xs opacity-50 ml-1'>{formatMessageTime(msg.createdAt)}</time>
              </div>
              <div className='chat-bubble flex flex-col'>
                {msg.image && (
                  <img src={msg.image} alt="attachment" className='sm:max-w-[200px] rounded-md mb-2'/>
                )}
                {msg.text && <p>{msg.text}</p>}
              </div>
          </div>
        ))}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer