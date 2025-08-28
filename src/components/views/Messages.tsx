import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
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
  Hash,
  Download,
  Trash2,
  Archive,
  VolumeX,
  Pin,
  FileText,
  Image as ImageIcon,
  Eye
} from 'lucide-react'
import type { User } from '@/types'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useNotifications } from '@/hooks'

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
  fileSize?: number
  fileType?: string
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
  const [showFilePreview, setShowFilePreview] = useState<Message | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotifications()

  const [users] = useKV<User[]>('system-users', [
    { id: '1', name: 'Alex van der Berg', email: 'alex@gkm.nl', role: 'admin', isOnline: true },
    { id: '2', name: 'Sarah de Jong', email: 'sarah@gkm.nl', role: 'admin', isOnline: true },
    { id: '3', name: 'Mike Visser', email: 'mike@client.nl', role: 'client', isOnline: false },
    { id: '4', name: 'Lisa Bakker', email: 'lisa@gkm.nl', role: 'admin', isOnline: true },
    { id: '5', name: 'Jan Peters', email: 'jan@restaurant.nl', role: 'client', isOnline: true },
    { id: '6', name: 'Emma de Vries', email: 'emma@boutique.nl', role: 'client', isOnline: false },
    { id: '7', name: 'Tom Hendriks', email: 'tom@cafe.nl', role: 'client', isOnline: true },
    { id: '8', name: 'Sophie Jansen', email: 'sophie@salon.nl', role: 'client', isOnline: false }
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
      id: 'conv-4',
      participants: ['1', '6'],
      unreadCount: 0,
      type: 'direct'
    },
    {
      id: 'conv-5',
      participants: ['2', '7'],
      unreadCount: 1,
      type: 'direct'
    },
    {
      id: 'conv-6',
      participants: ['4', '8'],
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

  const [messages, setMessages] = useKV<Message[]>('messages', [
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
    },
    {
      id: 'msg-8',
      senderId: '1',
      conversationId: 'conv-1',
      content: 'design-mockup.png',
      timestamp: '2024-01-20T16:15:00Z',
      read: true,
      type: 'file',
      fileName: 'design-mockup.png',
      fileSize: 2048576,
      fileType: 'image/png',
      fileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    },
    {
      id: 'msg-9',
      senderId: '6',
      conversationId: 'conv-4',
      content: 'Hallo Alex, kunnen we de social media strategie voor volgend kwartaal bespreken?',
      timestamp: '2024-01-19T10:30:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-10',
      senderId: '7',
      conversationId: 'conv-5',
      content: 'Sarah, de laatste Instagram posts hebben geweldige engagement! Dank je wel.',
      timestamp: '2024-01-19T14:15:00Z',
      read: false,
      type: 'text'
    },
    {
      id: 'msg-11',
      senderId: '8',
      conversationId: 'conv-6',
      content: 'Lisa, ik heb wat nieuwe foto\'s van de salon. Kunnen we ze gebruiken voor Facebook?',
      timestamp: '2024-01-18T11:45:00Z',
      read: true,
      type: 'text'
    }
  ])

  // Helper functions - moved above to fix initialization order
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

  // Filter conversations based on user role and sort by recent activity
  const visibleConversations = conversations
    .filter(conv => {
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
    .sort((a, b) => {
      // Sort by most recent message
      const aLastMessage = getLastMessage(a)
      const bLastMessage = getLastMessage(b)
      
      if (!aLastMessage && !bLastMessage) return 0
      if (!aLastMessage) return 1
      if (!bLastMessage) return -1
      
      return new Date(bLastMessage.timestamp).getTime() - new Date(aLastMessage.timestamp).getTime()
    })

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
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      conversationId: selectedConversation,
      content: messageInput,
      timestamp: new Date().toISOString(),
      read: true,
      type: 'text'
    }
    
    setMessages(prev => [...prev, newMessage])
    setMessageInput('')
    
    // Update conversation last message timestamp
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: newMessage }
        : conv
    ))
    
    // Generate notifications for recipients
    const conversation = conversations.find(c => c.id === selectedConversation)
    if (conversation) {
      const recipients = conversation.participants.filter(id => id !== user.id)
      recipients.forEach(recipientId => {
        const recipient = users.find(u => u.id === recipientId)
        if (recipient) {
          addNotification({
            type: 'message',
            title: 'New Message',
            message: `${user.name} sent you a message: "${messageInput.substring(0, 50)}${messageInput.length > 50 ? '...' : ''}"`,
            read: false,
            userId: recipientId,
            actionData: { conversationId: selectedConversation }
          })
        }
      })
    }
    
    toast.success('Message sent')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !selectedConversation) return

    Array.from(files).forEach(file => {
      if (file.size > 200 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (max 200MB)`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}-${Math.random()}`,
          senderId: user.id,
          conversationId: selectedConversation,
          content: file.name,
          timestamp: new Date().toISOString(),
          read: true,
          type: 'file',
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileUrl: e.target?.result as string
        }
        
        setMessages(prev => [...prev, newMessage])
        
        // Update conversation last message
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, lastMessage: newMessage }
            : conv
        ))
        
        toast.success(`File ${file.name} uploaded`)
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImageFile = (fileType: string) => {
    return fileType.startsWith('image/')
  }

  const downloadFile = (message: Message) => {
    if (message.fileUrl && message.fileName) {
      const link = document.createElement('a')
      link.href = message.fileUrl
      link.download = message.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('File downloaded')
    }
  }

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
    toast.success('Message deleted')
  }

  const muteConversation = (conversationId: string) => {
    toast.success('Conversation muted')
  }

  const archiveConversation = (conversationId: string) => {
    setSelectedConversation(null)
    toast.success('Conversation archived')
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
                <Button size="sm" className="gap-2 w-28 text-xs">
                  <Plus className="w-3 h-3" />
                  Start Chat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Start New Conversation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {user.role === 'admin' && (
                    <>
                      {/* Clients Section */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Clients</h3>
                        {getAvailableUsers().filter(u => u.role === 'client').map(availableUser => (
                          <div 
                            key={availableUser.id}
                            onClick={() => handleNewConversation(availableUser.id)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border/50"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={availableUser.avatar} />
                              <AvatarFallback className="bg-primary text-primary-foreground">{availableUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{availableUser.name}</p>
                              <p className="text-sm text-muted-foreground">{availableUser.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Circle className={`w-2 h-2 fill-current ${availableUser.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                              <Badge variant="secondary" className="text-xs">Client</Badge>
                            </div>
                          </div>
                        ))}
                        {getAvailableUsers().filter(u => u.role === 'client').length === 0 && (
                          <p className="text-center text-muted-foreground py-2 text-sm">
                            All clients already have conversations
                          </p>
                        )}
                      </div>
                      
                      {/* Team Members Section */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Team Members</h3>
                        {getAvailableUsers().filter(u => u.role === 'admin').map(availableUser => (
                          <div 
                            key={availableUser.id}
                            onClick={() => handleNewConversation(availableUser.id)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border/50"
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={availableUser.avatar} />
                              <AvatarFallback className="bg-secondary text-secondary-foreground">{availableUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{availableUser.name}</p>
                              <p className="text-sm text-muted-foreground">{availableUser.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Circle className={`w-2 h-2 fill-current ${availableUser.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                              <Badge variant="outline" className="text-xs">Admin</Badge>
                            </div>
                          </div>
                        ))}
                        {getAvailableUsers().filter(u => u.role === 'admin').length === 0 && (
                          <p className="text-center text-muted-foreground py-2 text-sm">
                            All team members already have conversations
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  
                  {user.role === 'client' && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">GKM Team</h3>
                      {getAvailableUsers().map(availableUser => (
                        <div 
                          key={availableUser.id}
                          onClick={() => handleNewConversation(availableUser.id)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border/50"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={availableUser.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground">{availableUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{availableUser.name}</p>
                            <p className="text-sm text-muted-foreground">{availableUser.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Circle className={`w-2 h-2 fill-current ${availableUser.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                            <Badge variant="default" className="text-xs">Team</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {getAvailableUsers().length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      All available users already have active conversations with you.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            {user.role === 'admin' && (
              <Dialog open={showNewGroup} onOpenChange={setShowNewGroup}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 w-20 text-xs">
                    <Users className="w-3 h-3" />
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
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {/* Admin Users Section */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Team Members</h4>
                          {users.filter(u => u.id !== user.id && u.role === 'admin').map(teamUser => (
                            <div 
                              key={teamUser.id}
                              onClick={() => toggleMemberSelection(teamUser.id)}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                selectedMembers.includes(teamUser.id) 
                                  ? 'bg-primary/10 border border-primary' 
                                  : 'hover:bg-muted border border-transparent'
                              }`}
                            >
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={teamUser.avatar} />
                                <AvatarFallback className="text-xs">{teamUser.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{teamUser.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{teamUser.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Circle className={`w-2 h-2 fill-current ${teamUser.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                                <Badge variant="secondary" className="text-xs">Admin</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Client Users Section */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Clients</h4>
                          {users.filter(u => u.id !== user.id && u.role === 'client').map(clientUser => (
                            <div 
                              key={clientUser.id}
                              onClick={() => toggleMemberSelection(clientUser.id)}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                selectedMembers.includes(clientUser.id) 
                                  ? 'bg-primary/10 border border-primary' 
                                  : 'hover:bg-muted border border-transparent'
                              }`}
                            >
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={clientUser.avatar} />
                                <AvatarFallback className="text-xs">{clientUser.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{clientUser.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{clientUser.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Circle className={`w-2 h-2 fill-current ${clientUser.isOnline ? 'text-green-500' : 'text-gray-400'}`} />
                                <Badge variant="outline" className="text-xs">Client</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
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
                          <h4 className="font-medium text-sm text-foreground truncate flex-1 mr-2">
                            {conversationTitle}
                          </h4>
                          {lastMessage && (
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-muted-foreground truncate flex-1 mr-2">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => muteConversation(selectedConversation)}>
                          <VolumeX className="w-4 h-4 mr-2" />
                          Mute conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => archiveConversation(selectedConversation)}>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive conversation
                        </DropdownMenuItem>
                        {selectedConv.type === 'group' && user.id === selectedConv.createdBy && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete group
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                            {message.type === 'file' ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {message.fileType && isImageFile(message.fileType) ? (
                                    <ImageIcon className="w-4 h-4" />
                                  ) : (
                                    <FileText className="w-4 h-4" />
                                  )}
                                  <span className="text-sm font-medium break-all">{message.fileName}</span>
                                </div>
                                {message.fileSize && (
                                  <p className="text-xs opacity-75">{formatFileSize(message.fileSize)}</p>
                                )}
                                {message.fileType && isImageFile(message.fileType) && message.fileUrl && (
                                  <div className="mt-2">
                                    <img 
                                      src={message.fileUrl} 
                                      alt={message.fileName}
                                      className="max-w-full max-h-40 rounded cursor-pointer"
                                      onClick={() => setShowFilePreview(message)}
                                    />
                                  </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <Button 
                                    size="sm" 
                                    variant={isOwn ? "secondary" : "outline"} 
                                    onClick={() => downloadFile(message)}
                                    className="text-xs"
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </Button>
                                  {message.fileType && isImageFile(message.fileType) && (
                                    <Button 
                                      size="sm" 
                                      variant={isOwn ? "secondary" : "outline"}
                                      onClick={() => setShowFilePreview(message)}
                                      className="text-xs"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-3">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                            {isOwn && (
                              <>
                                <Circle className={`w-2 h-2 ${message.read ? 'text-blue-500' : 'text-muted-foreground'}`} />
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                                      <MoreVertical className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => deleteMessage(message.id)} className="text-destructive">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete message
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
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
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.zip,.rar,.7z"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
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
      
      {/* File Preview Modal */}
      <Dialog open={!!showFilePreview} onOpenChange={() => setShowFilePreview(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {showFilePreview?.fileName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {showFilePreview && showFilePreview.fileUrl && (
              <div className="space-y-4">
                {showFilePreview.fileType && isImageFile(showFilePreview.fileType) ? (
                  <img 
                    src={showFilePreview.fileUrl} 
                    alt={showFilePreview.fileName}
                    className="max-w-full max-h-[70vh] object-contain mx-auto"
                  />
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Cannot preview this file type
                    </p>
                    <Button onClick={() => downloadFile(showFilePreview)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                )}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{showFilePreview.fileName}</p>
                    {showFilePreview.fileSize && (
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(showFilePreview.fileSize)}
                      </p>
                    )}
                  </div>
                  <Button onClick={() => downloadFile(showFilePreview)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}