import React from 'react'
import { useChatStore } from '../store/useChatStore'

const ChatContainer = () => {

  const {messages,getMessages, isMessageLoading,selectedUser}= useChatStore();

  if (isMessageLoading) return <div>loading...</div>
  useEffect(()=>{},[])
  
  return (
    <div>ChatContainer</div>
  )
}

export default ChatContainer