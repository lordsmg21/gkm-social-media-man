import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Plus, 
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Circle,
  MessageSquare
} from 'lucide-react'
import { User } from '../App'
import { useKV } from '@github/spark/hooks'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
  type: 'text' | 'file'
  fileUrl?: string
  fileName?: string
}

interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
}

interface MessagesProps {
  user: User
}

export function Messages({ user }: MessagesProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const [users] = useKV<User[]>('all-users', [
    { id: '1', name: 'Alex van der Berg', email: 'alex@gkm.nl', role: 'admin', isOnline: true },
    { id: '2', name: 'Sarah de Jong', email: 'sarah@gkm.nl', role: 'admin', isOnline: true },
    { id: '3', name: 'Mike Visser', email: 'mike@client.nl', role: 'client', isOnline: false },
    { id: '4', name: 'Lisa Bakker', email: 'lisa@gkm.nl', role: 'admin', isOnline: true },
    { id: '5', name: 'Jan Peters', email: 'jan@restaurant.nl', role: 'client', isOnline: true }
  ])

  const [conversations] = useKV<Conversation[]>('conversations', [
    {
      id: 'conv-1',
      participants: ['1', '3'],
      unreadCount: 2
    },
    {
      id: 'conv-2', 
      participants: ['1', '5'],
      unreadCount: 1
    },
    {
      id: 'conv-3',
      participants: ['1', '2'],
      unreadCount: 0
    }
  ])

  const [messages] = useKV<Message[]>('messages', [
    {
      id: 'msg-1',
      senderId: '3',
      receiverId: '1',
      content: 'Hi Alex, ik heb feedback op de nieuwe Instagram posts.',
      timestamp: '2024-01-20T14:30:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-2',
      senderId: '1',
      receiverId: '3',
      content: 'Perfect! Stuur ze maar door, dan kijk ik er direct naar.',
      timestamp: '2024-01-20T14:32:00Z',
      read: true,
      type: 'text'
    },
    {
      id: 'msg-3',
      senderId: '3',
      receiverId: '1',
      content: 'De kleuren zien er goed uit, maar kunnen we de tekst wat groter maken?',
      timestamp: '2024-01-20T14:35:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-4',
      senderId: '5',
      receiverId: '1',
      content: 'Hoi Alex, wanneer gaan de Facebook ads live?',
      timestamp: '2024-01-20T15:00:00Z',
      read: false,
      type: 'text'
    }
  ])

  // Filter conversations based on user role
  const visibleConversations = conversations.filter(conv => {
    if (user.role === 'admin') {
      return conv.participants.includes(user.id)
    } else {
      // Clients can only see conversations with admins
      const otherParticipant = conv.participants.find(p => p !== user.id)
      const otherUser = users.find(u => u.id === otherParticipant)
      return conv.participants.includes(user.id) && otherUser?.role === 'admin'
    }
  })

  const getConversationMessages = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation) return []
    
    return messages.filter(msg => 
      (conversation.participants.includes(msg.senderId) && 
       conversation.participants.includes(msg.receiverId))
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const getOtherParticipant = (conversation: Conversation) => {
    const otherParticipantId = conversation.participants.find(p => p !== user.id)
    return users.find(u => u.id === otherParticipantId)
  }

  const getLastMessage = (conversation: Conversation) => {
    const convMessages = getConversationMessages(conversation.id)
    return convMessages[convMessages.length - 1]
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return
    
    // In a real app, this would send the message to the server
    setMessageInput('')
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)
  const selectedMessages = selectedConv ? getConversationMessages(selectedConversation) : []
  const otherUser = selectedConv ? getOtherParticipant(selectedConv) : null

  return (
    <div className="h-[calc(100vh-3rem)] flex gap-6">
      {/* Conversations List */}
      <div className="w-80 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-heading font-bold text-2xl text-foreground">Messages</h1>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Conversation List */}
        <Card className="glass-card flex-1">
          <ScrollArea className="h-full">
            <div className="p-2">
              {visibleConversations.map((conversation, index) => {
                const otherParticipant = getOtherParticipant(conversation)
                const lastMessage = getLastMessage(conversation)
                const isSelected = selectedConversation === conversation.id
                
                if (!otherParticipant) return null

                return (
                  <div key={conversation.id}>
                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        isSelected ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={otherParticipant.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {otherParticipant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {otherParticipant.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {otherParticipant.name}
                          </h4>
                          {lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground truncate">
                            {lastMessage ? lastMessage.content : 'No messages yet'}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs min-w-[20px] h-5">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        <Badge 
                          variant={otherParticipant.role === 'admin' ? 'default' : 'secondary'} 
                          className="text-xs mt-1"
                        >
                          {otherParticipant.role === 'admin' ? 'GKM Team' : 'Client'}
                        </Badge>
                      </div>
                    </div>
                    {index < visibleConversations.length - 1 && <Separator className="my-1" />}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && otherUser ? (
          <>
            {/* Chat Header */}
            <Card className="glass-card mb-4">
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={otherUser.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {otherUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {otherUser.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{otherUser.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {otherUser.isOnline ? 'Online' : 'Offline'} • {otherUser.role === 'admin' ? 'GKM Team' : 'Client'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Messages */}
            <Card className="glass-card flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedMessages.map((message) => {
                    const isOwn = message.senderId === user.id
                    const sender = users.find(u => u.id === message.senderId)
                    
                    return (
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                          <div className={`p-3 rounded-lg ${
                            isOwn 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-foreground'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwn && (
                              <Circle className={`w-2 h-2 ${message.read ? 'text-blue-500' : 'text-muted-foreground'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : (
          /* No conversation selected */
          <Card className="glass-card flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg text-foreground mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}