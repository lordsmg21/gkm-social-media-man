import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, 
  Plus, 
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Circle,
  MessageSquare,
  X,
  Users,
  Settings,
  UserPlus,
  Hash
} from 'lucide-react'
import { User } from '../App'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Message {
  id: string
  senderId: string
  receiverId?: string // Optional for group messages
  conversationId: string
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
  type: 'direct' | 'group'
  name?: string // Only for group chats
  description?: string // Only for group chats
  createdBy?: string
  createdAt?: string
}

interface MessagesProps {
  user: User
}

export function Messages({ user }: MessagesProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [showGroupSettings, setShowGroupSettings] = useState(false)

  const [users] = useKV<User[]>('all-users', [
    { id: '1', name: 'Alex van der Berg', email: 'alex@gkm.nl', role: 'admin', isOnline: true },
    { id: '2', name: 'Sarah de Jong', email: 'sarah@gkm.nl', role: 'admin', isOnline: true },
    { id: '3', name: 'Mike Visser', email: 'mike@client.nl', role: 'client', isOnline: false },
    { id: '4', name: 'Lisa Bakker', email: 'lisa@gkm.nl', role: 'admin', isOnline: true },
    { id: '5', name: 'Jan Peters', email: 'jan@restaurant.nl', role: 'client', isOnline: true }
  ])

  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [
    {
      id: 'conv-1',
      participants: ['1', '3'],
      unreadCount: 2,
      type: 'direct'
    },
    {
      id: 'conv-2', 
      participants: ['1', '5'],
      unreadCount: 1,
      type: 'direct'
    },
    {
      id: 'conv-3',
      participants: ['1', '2'],
      unreadCount: 0,
      type: 'direct'
    },
    {
      id: 'group-1',
      participants: ['1', '2', '4'],
      unreadCount: 3,
      type: 'group',
      name: 'Team GKM',
      description: 'General team discussions',
      createdBy: '1',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'group-2',
      participants: ['1', '2', '4'],
      unreadCount: 0,
      type: 'group',
      name: 'Project Updates',
      description: 'Daily project status and updates',
      createdBy: '2',
      createdAt: '2024-01-18T09:00:00Z'
    }
  ])

  const [messages] = useKV<Message[]>('messages', [
    {
      id: 'msg-1',
      senderId: '3',
      conversationId: 'conv-1',
      content: 'Hi Alex, ik heb feedback op de nieuwe Instagram posts.',
      timestamp: '2024-01-20T14:30:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-2',
      senderId: '1',
      conversationId: 'conv-1',
      content: 'Perfect! Stuur ze maar door, dan kijk ik er direct naar.',
      timestamp: '2024-01-20T14:32:00Z',
      read: true,
      type: 'text'
    },
    {
      id: 'msg-3',
      senderId: '3',
      conversationId: 'conv-1',
      content: 'De kleuren zien er goed uit, maar kunnen we de tekst wat groter maken?',
      timestamp: '2024-01-20T14:35:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-4',
      senderId: '5',
      conversationId: 'conv-2',
      content: 'Hoi Alex, wanneer gaan de Facebook ads live?',
      timestamp: '2024-01-20T15:00:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-5',
      senderId: '2',
      conversationId: 'group-1',
      content: 'Team, laten we de nieuwe campagne bespreken!',
      timestamp: '2024-01-20T16:00:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-6',
      senderId: '4',
      conversationId: 'group-1',
      content: 'Goed idee Sarah! Ik heb wat nieuwe concepten klaar.',
      timestamp: '2024-01-20T16:05:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-7',
      senderId: '1',
      conversationId: 'group-1',
      content: 'Perfect! Kunnen we morgen een meeting plannen?',
      timestamp: '2024-01-20T16:10:00Z',
      read: true,
      type: 'text'
    }
  ])

  // Filter conversations based on user role
  const visibleConversations = conversations.filter(conv => {
    if (conv.type === 'group') {
      // Group chats are only visible to admin users
      return user.role === 'admin' && conv.participants.includes(user.id)
    } else {
      // Direct messages
      if (user.role === 'admin') {
        return conv.participants.includes(user.id)
      } else {
        // Clients can only see conversations with admins
        const otherParticipant = conv.participants.find(p => p !== user.id)
        const otherUser = users.find(u => u.id === otherParticipant)
        return conv.participants.includes(user.id) && otherUser?.role === 'admin'
      }
    }
  })

  const getConversationMessages = (conversationId: string) => {
    return messages.filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const getOtherParticipant = (conversation: Conversation) => {
    const otherParticipantId = conversation.participants.find(p => p !== user.id)
    return users.find(u => u.id === otherParticipantId)
  }

  const getLastMessage = (conversation: Conversation) => {
    const convMessages = getConversationMessages(conversation.id)
    return convMessages[convMessages.length - 1]
  }

  const createGroupChat = () => {
    if (!newGroupName.trim() || selectedMembers.length === 0) {
      toast.error('Vul een groepsnaam in en selecteer deelnemers')
      return
    }

    const newGroup: Conversation = {
      id: `group-${Date.now()}`,
      participants: [user.id, ...selectedMembers],
      unreadCount: 0,
      type: 'group',
      name: newGroupName,
      description: newGroupDescription,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    }

    setConversations(prev => [...prev, newGroup])
    setShowNewGroup(false)
    setNewGroupName('')
    setNewGroupDescription('')
    setSelectedMembers([])
    toast.success('Groepschat aangemaakt!')
  }

  const toggleMemberSelection = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.name || 'Groepschat'
    } else {
      const otherParticipant = getOtherParticipant(conversation)
      return otherParticipant?.name || 'Unknown'
    }
  }

  const getConversationSubtitle = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return `${conversation.participants.length} leden`
    } else {
      const otherParticipant = getOtherParticipant(conversation)
      return otherParticipant?.role === 'admin' ? 'Team' : 'Client'
    }
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

  const handleNewConversation = (targetUserId: string) => {
    // Check if conversation already exists
    const existingConv = conversations.find(conv => 
      conv.type === 'direct' &&
      conv.participants.includes(user.id) && 
      conv.participants.includes(targetUserId)
    )
    
    if (existingConv) {
      setSelectedConversation(existingConv.id)
      setShowNewConversation(false)
      toast.info('Conversation already exists')
      return
    }
    
    // Create new conversation
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [user.id, targetUserId],
      unreadCount: 0,
      type: 'direct'
    }
    
    setConversations(prev => [...prev, newConv])
    setSelectedConversation(newConv.id)
    setShowNewConversation(false)
    toast.success('New conversation started')
  }

  // Get available users for new conversation
  const getAvailableUsers = () => {
    return users.filter(u => {
      if (u.id === user.id) return false
      
      if (user.role === 'admin') {
        // Admins can message anyone
        return true
      } else {
        // Clients can only message admins
        return u.role === 'admin'
      }
    }).filter(u => {
      // Filter out users we already have direct conversations with
      const hasConversation = conversations.some(conv => 
        conv.type === 'direct' &&
        conv.participants.includes(user.id) && 
        conv.participants.includes(u.id)
      )
      return !hasConversation
    })
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
          <div className="flex gap-2">
            <Dialog open={showNewConversation} onOpenChange={setShowNewConversation}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Direct
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    {getAvailableUsers().map(availableUser => (
                      <div 
                        key={availableUser.id}
                        onClick={() => handleNewConversation(availableUser.id)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={availableUser.avatar} />
                          <AvatarFallback>{availableUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{availableUser.name}</p>
                          <p className="text-sm text-muted-foreground">{availableUser.role}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Circle className={`w-2 h-2 fill-current ${availableUser.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                        </div>
                      </div>
                    ))}
                    {getAvailableUsers().length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        No users available for new conversations
                      </p>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {user.role === 'admin' && (
              <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Users className="w-4 h-4" />
                    Group
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Group Chat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Group Name</label>
                      <Input
                        placeholder="Enter group name..."
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description (optional)</label>
                      <Input
                        placeholder="Enter group description..."
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Members</label>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {users.filter(u => u.id !== user.id && u.role === 'admin').map(teamUser => (
                          <div 
                            key={teamUser.id}
                            onClick={() => toggleMemberSelection(teamUser.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedMembers.includes(teamUser.id) 
                                ? 'bg-primary/10 border border-primary' 
                                : 'hover:bg-muted'
                            }`}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={teamUser.avatar} />
                              <AvatarFallback>{teamUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{teamUser.name}</p>
                              <p className="text-xs text-muted-foreground">{teamUser.role}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Circle className={`w-2 h-2 fill-current ${teamUser.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={createGroupChat}
                        className="flex-1"
                        disabled={!newGroupName.trim() || selectedMembers.length === 0}
                      >
                        Create Group
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewGroup(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
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
                const lastMessage = getLastMessage(conversation)
                const conversationTitle = getConversationTitle(conversation)
                const conversationSubtitle = getConversationSubtitle(conversation)
                
                return (
                  <div key={conversation.id}>
                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedConversation === conversation.id ? 'bg-primary/10' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="relative">
                        {conversation.type === 'group' ? (
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <Hash className="w-5 h-5 text-primary-foreground" />
                          </div>
                        ) : (
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={getOtherParticipant(conversation)?.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {getOtherParticipant(conversation)?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {conversation.type === 'direct' && getOtherParticipant(conversation)?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm text-foreground min-w-0 flex-1 mr-2">
                            {conversationTitle}
                          </h4>
                          {lastMessage && (
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground min-w-0 flex-1 mr-2 break-words line-clamp-2">
                            {lastMessage ? (
                              conversation.type === 'group' 
                                ? `${users.find(u => u.id === lastMessage.senderId)?.name}: ${lastMessage.content}`
                                : lastMessage.content
                            ) : 'No messages yet'}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs min-w-[20px] h-5 flex-shrink-0">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        <Badge 
                          variant={conversation.type === 'group' ? 'default' : 'secondary'} 
                          className="text-xs mt-1"
                        >
                          {conversationSubtitle}
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
        {selectedConversation && selectedConv ? (
          <>
            {/* Chat Header */}
            <Card className="glass-card mb-4">
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {selectedConv.type === 'group' ? (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Hash className="w-5 h-5 text-primary-foreground" />
                        </div>
                      ) : (
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={getOtherParticipant(selectedConv)?.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getOtherParticipant(selectedConv)?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {selectedConv.type === 'direct' && getOtherParticipant(selectedConv)?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{getConversationTitle(selectedConv)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConv.type === 'group' ? (
                          selectedConv.description || `${selectedConv.participants.length} leden`
                        ) : (
                          `${getOtherParticipant(selectedConv)?.isOnline ? 'Online' : 'Offline'} • ${getOtherParticipant(selectedConv)?.role === 'admin' ? 'GKM Team' : 'Client'}`
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedConv.type === 'direct' && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {selectedConv.type === 'group' && user.role === 'admin' && (
                      <Dialog open={showGroupSettings} onOpenChange={setShowGroupSettings}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Group Settings</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <h4 className="font-medium mb-2">Group Members</h4>
                              <div className="space-y-2">
                                {selectedConv.participants.map(participantId => {
                                  const participant = users.find(u => u.id === participantId)
                                  if (!participant) return null
                                  return (
                                    <div key={participantId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={participant.avatar} />
                                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <p className="font-medium text-sm">{participant.name}</p>
                                        <p className="text-xs text-muted-foreground">{participant.role}</p>
                                      </div>
                                      {participantId === selectedConv.createdBy && (
                                        <Badge variant="outline" className="text-xs">Admin</Badge>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full gap-2"
                              onClick={() => setShowGroupSettings(false)}
                            >
                              <UserPlus className="w-4 h-4" />
                              Add Member
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
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
                          {selectedConv?.type === 'group' && !isOwn && (
                            <p className="text-xs font-medium text-primary mb-1 px-3">
                              {sender?.name}
                            </p>
                          )}
                          <div className={`p-3 rounded-lg break-words ${
                            isOwn 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-foreground'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-3">
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
                    placeholder={selectedConv?.type === 'group' ? 'Message team...' : 'Type a message...'}
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