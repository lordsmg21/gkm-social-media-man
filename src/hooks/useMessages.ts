import { useKV } from '@github/spark/hooks'
import type { Message, Conversation } from '@/types'

export function useMessages() {
  const [messages, setMessages] = useKV<Message[]>('messages', [])
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    
    setMessages(currentMessages => [...currentMessages, newMessage])
    
    // Update conversation's last message and timestamp
    setConversations(currentConversations => 
      currentConversations.map(conv => 
        conv.id === message.conversationId 
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date().toISOString() }
          : conv
      )
    )
    
    return newMessage
  }

  const getMessagesByConversation = (conversationId: string) => {
    return messages
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const createConversation = (conversation: Omit<Conversation, 'id' | 'updatedAt'>) => {
    const newConversation: Conversation = {
      ...conversation,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString()
    }
    
    setConversations(currentConversations => [...currentConversations, newConversation])
    return newConversation
  }

  const getConversationsByUser = (userId: string) => {
    return conversations
      .filter(conv => conv.participants.includes(userId))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  const deleteConversation = (conversationId: string) => {
    setConversations(currentConversations => 
      currentConversations.filter(conv => conv.id !== conversationId)
    )
    setMessages(currentMessages => 
      currentMessages.filter(message => message.conversationId !== conversationId)
    )
  }

  return {
    messages,
    conversations,
    sendMessage,
    getMessagesByConversation,
    createConversation,
    getConversationsByUser,
    deleteConversation
  }
}