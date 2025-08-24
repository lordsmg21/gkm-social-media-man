import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Plus, 
  Calendar, 
  MessageSquare, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Clock,
  Target,
  AlertCircle,
  FileText,
  Image,
  Download,
  Upload,
  X,
  Eye,
  Trash2,
  Paperclip
} from 'lucide-react'
import { User } from '../App'
import { useKV } from '@github/spark/hooks'
import { FileDropZone } from './FileDropZone'

interface TaskFile {
  id: string
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
  url: string // In real app, this would be a proper file URL
}

interface Task {
  id: string
  title: string
  client: string
  platform: 'facebook' | 'instagram' | 'both'
  status: 'to-do' | 'in-progress' | 'final-design' | 'review' | 'completed' | 'scheduled' | 'ads'
  priority: 'low' | 'medium' | 'high'
  assignedTo: string[]
  deadline: string
  progress: number
  description?: string
  tags: string[]
  files: TaskFile[]
  mentionTag?: string // Unique @tag for mentioning in chat
}

interface ChatMessage {
  id: string
  channel: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'file' | 'system'
}

interface ProjectsProps {
  user: User
}

export function Projects({ user }: ProjectsProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [activeChannel, setActiveChannel] = useState('general')
  const [showFilePreview, setShowFilePreview] = useState<TaskFile | null>(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
  const [showFileUpload, setShowFileUpload] = useState<string | null>(null)
  const [fileDropTask, setFileDropTask] = useState<string | null>(null)
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false)
  const [mentionSuggestions, setMentionSuggestions] = useState<Task[]>([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)

  const adminColumns = [
    { id: 'to-do', title: 'To Do', color: 'bg-gray-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'final-design', title: 'Final Design', color: 'bg-purple-500' },
    { id: 'review', title: 'Review', color: 'bg-yellow-500' },
    { id: 'completed', title: 'Completed', color: 'bg-green-500' },
    { id: 'scheduled', title: 'Scheduled', color: 'bg-indigo-500' },
    { id: 'ads', title: 'Ads', color: 'bg-pink-500' }
  ]

  const clientColumns = [
    { id: 'to-do', title: 'To Do', color: 'bg-gray-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'review', title: 'Review', color: 'bg-yellow-500' },
    { id: 'completed', title: 'Completed', color: 'bg-green-500' },
    { id: 'scheduled', title: 'Scheduled', color: 'bg-indigo-500' },
    { id: 'ads', title: 'Ads', color: 'bg-pink-500' }
  ]

  const columns = user.role === 'admin' ? adminColumns : clientColumns

  const [tasks, setTasks] = useKV<Task[]>('project-tasks', [
    {
      id: '1',
      title: 'Instagram Story Campaign - Bakkerij de Korenbloem',
      client: 'De Korenbloem',
      platform: 'instagram',
      status: 'in-progress',
      priority: 'high',
      assignedTo: ['1', '2'],
      deadline: '2024-01-25',
      progress: 75,
      description: 'Create engaging Instagram stories for the bakery\'s new artisan bread line',
      tags: ['stories', 'food', 'artisan'],
      mentionTag: '@korenbloem-stories',
      files: [
        {
          id: 'f1',
          name: 'Brand Guidelines.pdf',
          size: 2048576,
          type: 'application/pdf',
          uploadedBy: '1',
          uploadedAt: new Date().toISOString(),
          url: '#'
        },
        {
          id: 'f2', 
          name: 'Product Photos.zip',
          size: 15728640,
          type: 'application/zip',
          uploadedBy: '2',
          uploadedAt: new Date().toISOString(),
          url: '#'
        }
      ]
    },
    {
      id: '2',
      title: 'Facebook Ad Campaign - Restaurant Bella Vista',
      client: 'Bella Vista',
      platform: 'facebook',
      status: 'review',
      priority: 'medium',
      assignedTo: ['3', '4'],
      deadline: '2024-01-22',
      progress: 90,
      description: 'Dinner promotion campaign targeting local food enthusiasts',
      tags: ['ads', 'restaurant', 'promotion'],
      mentionTag: '@bellavista-ads',
      files: [
        {
          id: 'f3',
          name: 'Menu Photos.png',
          size: 3145728,
          type: 'image/png',
          uploadedBy: '3',
          uploadedAt: new Date().toISOString(),
          url: '#'
        }
      ]
    },
    {
      id: '3',
      title: 'Social Media Strategy - Fitness First',
      client: 'Fitness First',
      platform: 'both',
      status: 'to-do',
      priority: 'low',
      assignedTo: ['1'],
      deadline: '2024-02-01',
      progress: 25,
      description: 'Comprehensive social media strategy for Q1 2024',
      tags: ['strategy', 'fitness', 'planning'],
      mentionTag: '@fitness-strategy',
      files: []
    },
    {
      id: '4',
      title: 'Product Launch - TechStart',
      client: 'TechStart',
      platform: 'both',
      status: 'completed',
      priority: 'high',
      assignedTo: ['2', '4'],
      deadline: '2024-01-15',
      progress: 100,
      description: 'Launch campaign for new SaaS product',
      tags: ['launch', 'tech', 'saas'],
      mentionTag: '@techstart-launch',
      files: [
        {
          id: 'f4',
          name: 'Final Campaign Assets.zip',
          size: 52428800,
          type: 'application/zip',
          uploadedBy: '2',
          uploadedAt: new Date().toISOString(),
          url: '#'
        }
      ]
    },
    {
      id: '5',
      title: 'Holiday Campaign - Fashion Boutique',
      client: 'Fashion Boutique',
      platform: 'instagram',
      status: 'scheduled',
      priority: 'medium',
      assignedTo: ['2'],
      deadline: '2024-01-30',
      progress: 100,
      description: 'Valentine\'s Day fashion promotion',
      tags: ['holiday', 'fashion', 'promotion'],
      mentionTag: '@fashion-valentine',
      files: []
    }
  ])

  const [users] = useKV<User[]>('all-users', [
    { id: '1', name: 'Alex van der Berg', role: 'admin', avatar: '', email: 'alex@gkm.nl', isOnline: true },
    { id: '2', name: 'Sarah de Jong', role: 'admin', avatar: '', email: 'sarah@gkm.nl', isOnline: true },
    { id: '3', name: 'Mike Visser', role: 'admin', avatar: '', email: 'mike@gkm.nl', isOnline: false },
    { id: '4', name: 'Lisa Bakker', role: 'admin', avatar: '', email: 'lisa@gkm.nl', isOnline: true }
  ])

  const [chatMessages, setChatMessages] = useKV<ChatMessage[]>('team-chat-messages', [
    {
      id: 'chat-1',
      channel: 'general',
      senderId: '2',
      content: 'Heeft iemand al feedback gehad op @korenbloem-stories? De client wacht op antwoord.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      type: 'text'
    },
    {
      id: 'chat-2',
      channel: 'direct',
      senderId: '1',
      content: '@bellavista-ads is nu in review fase. Kunnen we morgen de final presentatie doen?',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      type: 'text'
    },
    {
      id: 'chat-3',
      channel: 'general',
      senderId: '4',
      content: 'Team, @fitness-strategy heeft een deadline update nodig. Client heeft timeline verschoven.',
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      type: 'text'
    },
    {
      id: 'chat-4',
      channel: 'direct', 
      senderId: '3',
      content: 'Great work on @techstart-launch! Client is super happy met de resultaten 🎉',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      type: 'text'
    }
  ])

  // Filter tasks based on user role
  const visibleTasks = user.role === 'admin' ? (tasks || []) : (tasks || []).filter(task => 
    task.assignedTo?.includes(user.id) || task.client === 'My Client' // Simplified client filtering
  )

  const getTasksByStatus = (status: string) => {
    return (visibleTasks || []).filter(task => task.status === status)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘'
      case 'instagram': return '📷'
      case 'both': return '📱'
      default: return '📱'
    }
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    return `${diffDays} days left`
  }

  const getAssignedUsers = (userIds: string[]) => {
    if (!userIds || !Array.isArray(userIds)) return []
    return userIds.map(id => users.find(u => u.id === id)).filter((user): user is User => user !== undefined)
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML)
    
    // Add visual feedback
    const element = e.currentTarget as HTMLElement
    if (element) {
      const dragImage = element.cloneNode(true) as HTMLElement
      if (dragImage && dragImage.style) {
        dragImage.style.transform = 'rotate(5deg)'
        dragImage.style.opacity = '0.8'
        e.dataTransfer.setDragImage(dragImage, 0, 0)
      }
      
      // Make original semi-transparent
      setTimeout(() => {
        if (element && element.style) {
          element.style.opacity = '0.5'
          element.style.transform = 'scale(0.95)'
        }
      }, 0)
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement
    if (element && element.style) {
      element.style.opacity = '1'
      element.style.transform = 'scale(1)'
    }
    setDraggedTask(null)
    setDraggedOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDraggedOverColumn(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the column container
    const currentTarget = e.currentTarget
    const relatedTarget = e.relatedTarget as Node
    
    if (currentTarget && (!relatedTarget || !currentTarget.contains(relatedTarget))) {
      setDraggedOverColumn(null)
    }
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    setDraggedOverColumn(null)
    
    if (draggedTask && draggedTask.status !== newStatus) {
      // Update task status
      const updatedTasks = (tasks || []).map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus as Task['status'] }
          : task
      )
      setTasks(updatedTasks)
      
      const columnTitle = columns.find(col => col.id === newStatus)?.title || newStatus
      toast.success(`Task moved to ${columnTitle}`)
      
      // Auto-update progress based on status
      let newProgress = draggedTask.progress
      if (newStatus === 'completed') newProgress = 100
      else if (newStatus === 'scheduled') newProgress = 100
      else if (newStatus === 'in-progress') newProgress = Math.max(newProgress, 25)
      else if (newStatus === 'final-design') newProgress = Math.max(newProgress, 75)
      
      if (newProgress !== draggedTask.progress) {
        const progressUpdatedTasks = updatedTasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, progress: newProgress }
            : task
        )
        setTasks(progressUpdatedTasks)
      }
    }
    setDraggedTask(null)
  }

  // File management functions
  const handleFileUpload = (taskId: string) => {
    setShowFileUpload(taskId)
  }

  // Fix the function signature to match what FileDropZone expects
  const handleFilesUploaded = (files: File[], taskId: string) => {
    if (!files || !Array.isArray(files) || files.length === 0) {
      toast.error('No files to upload')
      return
    }

    const newFiles: TaskFile[] = files.map(file => ({
      id: `f${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file) // In real app, this would be the server URL
    }))

    setTasks((prevTasks) => {
      const updatedTasks = (prevTasks || []).map(task => 
        task.id === taskId 
          ? { ...task, files: [...(task.files || []), ...newFiles] }
          : task
      )
      return updatedTasks
    })
    
    setShowFileUpload(null)
    setFileDropTask(null)
    toast.success(`${files.length} file(s) uploaded successfully`)
  }

  // Handle file drops directly on task cards
  const handleTaskFileDrop = (e: React.DragEvent, taskId: string) => {
    // Only handle file drops, not task drags
    if (draggedTask || !e.dataTransfer.types.includes('Files')) {
      return
    }
    
    e.preventDefault()
    e.stopPropagation()
    setFileDropTask(null)

    if (user.role !== 'admin') return

    const files = e.dataTransfer.files
    if (files.length === 0) return

    // Convert FileList to File array and process
    const fileArray = Array.from(files)
    
    // Filter files by size and type
    const validFiles = fileArray.filter(file => {
      if (file.size > 200 * 1024 * 1024) {
        toast.error(`${file.name}: File size exceeds 200MB limit`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      handleFilesUploaded(validFiles, taskId)
    }
  }

  const handleTaskFileDragOver = (e: React.DragEvent, taskId: string) => {
    // Only handle file drops, not task drags
    if (draggedTask || !e.dataTransfer.types.includes('Files')) {
      return
    }
    
    e.preventDefault()
    if (user.role === 'admin') {
      setFileDropTask(taskId)
    }
  }

  const handleTaskFileDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    const currentTarget = e.currentTarget
    const relatedTarget = e.relatedTarget as Node
    
    if (currentTarget && (!relatedTarget || !currentTarget.contains(relatedTarget))) {
      setFileDropTask(null)
    }
  }

  const handleFileDelete = (taskId: string, fileId: string) => {
    const updatedTasks = (tasks || []).map(task => 
      task.id === taskId 
        ? { ...task, files: (task.files || []).filter(f => f.id !== fileId) }
        : task
    )
    setTasks(updatedTasks)
    toast.success('File deleted')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleChatMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setChatMessage(value)
    setCursorPosition(e.target.selectionStart || 0)
    
    // Check if user is typing a mention
    const atIndex = value.lastIndexOf('@', e.target.selectionStart || 0)
    if (atIndex !== -1) {
      const beforeAt = value.substring(0, atIndex)
      const afterCursor = value.substring(e.target.selectionStart || 0)
      const spaceAfterAt = afterCursor.indexOf(' ')
      const searchTerm = value.substring(atIndex + 1, spaceAfterAt === -1 ? value.length : atIndex + 1 + spaceAfterAt)
      
      if (beforeAt === '' || beforeAt[beforeAt.length - 1] === ' ') {
        // Filter tasks that match the search term
        const filtered = (visibleTasks || []).filter(task => 
          task.mentionTag && 
          task.mentionTag.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5)
        
        setMentionSuggestions(filtered)
        setShowMentionSuggestions(filtered.length > 0 && searchTerm.length >= 0)
      } else {
        setShowMentionSuggestions(false)
      }
    } else {
      setShowMentionSuggestions(false)
    }
  }

  const handleMentionSelect = (task: Task) => {
    if (!task.mentionTag || !chatInputRef.current) return
    
    const input = chatInputRef.current
    const atIndex = chatMessage.lastIndexOf('@', cursorPosition)
    
    if (atIndex !== -1) {
      const beforeAt = chatMessage.substring(0, atIndex)
      const afterCursor = chatMessage.substring(cursorPosition)
      const spaceAfterAt = afterCursor.indexOf(' ')
      const remainingAfter = spaceAfterAt === -1 ? '' : afterCursor.substring(spaceAfterAt)
      
      const newMessage = beforeAt + task.mentionTag + ' ' + remainingAfter
      setChatMessage(newMessage)
      setShowMentionSuggestions(false)
      
      // Focus back to input
      setTimeout(() => {
        input.focus()
        const newCursorPos = beforeAt.length + task.mentionTag.length + 1
        input.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return
    
    const newMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      channel: activeChannel,
      senderId: user.id,
      content: chatMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text'
    }
    
    setChatMessages(prev => [...(prev || []), newMessage])
    setChatMessage('')
    setShowMentionSuggestions(false)
  }

  const formatChatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] space-y-6 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">Board View</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Drag and drop projects between phases • {user.role === 'admin' ? 'Team collaboration view' : 'Project progress tracking'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Content - Board + Chat Layout */}
      <div className={`flex-1 flex ${user.role === 'admin' ? 'gap-6' : ''} overflow-hidden board-chat-layout`}>
        
        {/* Board Section - Takes remaining space */}
        <div className="flex-1 board-section overflow-hidden">
          <Card className="glass-card h-full">
            <CardHeader className="pb-4 flex-shrink-0">
              <CardTitle className="text-base md:text-lg font-semibold text-foreground">Project Board</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 md:p-6 overflow-hidden">
              <div className="w-full h-full">
                <div className="overflow-x-auto h-full">
                  <div className="flex gap-3 md:gap-6 pb-4 h-full" style={{ minWidth: 'max-content' }}>
                    {columns.map((column) => {
                  const columnTasks = getTasksByStatus(column.id)
                  
                  return (
                    <div 
                      key={column.id} 
                      className={`flex-shrink-0 w-72 md:w-80 transition-all duration-200
                        ${draggedOverColumn === column.id ? 'drag-over' : ''}
                      `}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => handleDragEnter(e, column.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, column.id)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                        <h3 className="font-heading font-semibold text-foreground text-sm md:text-base">{column.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {columnTasks.length}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 min-h-[300px] md:min-h-[400px]">
                        {columnTasks.map((task) => {
                          const assignedUsers = getAssignedUsers(task.assignedTo || [])
                          const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed'
                          
                          return (
                            <Card 
                              key={task.id} 
                              className={`relative glass-card task-card-draggable hover:shadow-md transition-all duration-200 group
                                ${draggedTask?.id === task.id ? 'dragging' : ''}
                                ${fileDropTask === task.id ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''}
                              `}
                              draggable={user.role === 'admin'}
                              onDragStart={(e) => handleDragStart(e, task)}
                              onDragEnd={handleDragEnd}
                              onDragOver={(e) => handleTaskFileDragOver(e, task.id)}
                              onDragLeave={handleTaskFileDragLeave}
                              onDrop={(e) => handleTaskFileDrop(e, task.id)}
                              onClick={() => {
                                setSelectedTask(task)
                                setShowTaskModal(true)
                              }}
                            >
                              <CardContent className="p-3 md:p-4">
                                {/* File drop overlay */}
                                {fileDropTask === task.id && user.role === 'admin' && (
                                  <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
                                    <div className="text-center">
                                      <Upload className="w-6 h-6 mx-auto mb-1 text-primary" />
                                      <p className="text-xs text-primary font-medium">Drop files here</p>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{getPlatformIcon(task.platform)}</span>
                                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </div>
                                
                                <h4 className="font-medium text-xs md:text-sm text-foreground mb-2 line-clamp-2">
                                  {task.title}
                                </h4>
                                
                                <p className="text-xs text-muted-foreground mb-3">
                                  {task.client}
                                </p>
                                
                                {/* Task mention tag */}
                                {task.mentionTag && (
                                  <div className="mb-2">
                                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-accent/20 text-accent border-accent/40 font-medium">
                                      {task.mentionTag}
                                    </Badge>
                                  </div>
                                )}

                                {/* File previews */}
                                {(task.files || []).length > 0 && (
                                  <div className="mb-3">
                                    <div className="grid grid-cols-4 gap-1">
                                      {(task.files || []).slice(0, 4).map((file) => (
                                        <div 
                                          key={file.id}
                                          className="aspect-square bg-muted rounded border overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setShowFilePreview(file)
                                          }}
                                        >
                                          {file.type.startsWith('image/') ? (
                                            <img 
                                              src={file.url} 
                                              alt={file.name}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                const parent = target.parentElement
                                                if (parent) {
                                                  target.style.display = 'none'
                                                  // Add fallback icon manually
                                                  const fallback = document.createElement('div')
                                                  fallback.className = "w-full h-full flex items-center justify-center text-muted-foreground"
                                                  fallback.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>'
                                                  parent.appendChild(fallback)
                                                }
                                              }}
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                              {file.type.includes('pdf') ? (
                                                <FileText className="w-4 h-4" />
                                              ) : (
                                                <Paperclip className="w-4 h-4" />
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                    {(task.files || []).length > 4 && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        +{(task.files || []).length - 4} more files
                                      </p>
                                    )}
                                  </div>
                                )}
                                
                                {task.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {task.tags.slice(0, 2).map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {task.tags.length > 2 && (
                                      <Badge variant="outline" className="text-xs px-2 py-0">
                                        +{task.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-muted-foreground">Progress</span>
                                      <span className="font-medium">{task.progress}%</span>
                                    </div>
                                    <Progress value={task.progress} className="h-1" />
                                  </div>
                                  
                                  {/* Files indicator */}
                                  {(task.files || []).length > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Paperclip className="w-3 h-3" />
                                      <span>{(task.files || []).length} file{(task.files || []).length !== 1 ? 's' : ''}</span>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs">
                                      <Clock className="w-3 h-3" />
                                      <span className={`${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        {formatDeadline(task.deadline)}
                                      </span>
                                      {isOverdue && <AlertCircle className="w-3 h-3 text-red-500" />}
                                    </div>
                                    
                                    <div className="flex -space-x-1">
                                      {assignedUsers.slice(0, 2).map((assignedUser) => (
                                        <Avatar key={assignedUser.id} className="w-5 h-5 md:w-6 md:h-6 border-2 border-background">
                                          <AvatarImage src={assignedUser.avatar} />
                                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                            {assignedUser.name.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                      ))}
                                      {assignedUsers.length > 2 && (
                                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                          <span className="text-xs font-medium">+{assignedUsers.length - 2}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                        
                        {/* Add Task Button */}
                        {user.role === 'admin' && (
                          <Card 
                            className={`glass-card border-dashed border-2 cursor-pointer hover:bg-muted/20 transition-colors
                              ${draggedOverColumn === column.id && draggedTask ? 'border-primary bg-primary/10' : ''}
                            `}
                          >
                            <CardContent className="p-3 md:p-4 flex items-center justify-center">
                              <div className="text-center text-muted-foreground">
                                {draggedOverColumn === column.id && draggedTask ? (
                                  <>
                                    <div className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2 border-2 border-dashed border-primary rounded animate-pulse" />
                                    <p className="text-xs md:text-sm text-primary">Drop task here</p>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" />
                                    <p className="text-xs md:text-sm">Add Task</p>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )
                })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Chat Section - Fixed width sidebar (Admin Only) */}
        {user.role === 'admin' && (
          <div className="chat-section flex-shrink-0 w-96 max-w-96">
            <Card className="glass-card h-full">
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Team Chat
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {users.slice(0, 2).map((teamMember) => (
                      <div key={teamMember.id} className="relative">
                        <Avatar className="w-5 h-5 border-2 border-background">
                          <AvatarImage src={teamMember.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {teamMember.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {teamMember.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-background"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{users.filter(u => u.isOnline).length}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col h-[calc(100%-4rem)] p-4">
                {/* Channel Tabs - Simplified to 2 channels */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button 
                    variant={activeChannel === 'general' ? 'default' : 'outline'} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setActiveChannel('general')}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    General
                  </Button>
                  <Button 
                    variant={activeChannel === 'direct' ? 'default' : 'outline'} 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setActiveChannel('direct')}
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Direct
                  </Button>
                </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-3 p-2">
                  {chatMessages
                    .filter(msg => msg.channel === activeChannel)
                    .map((message) => {
                      const sender = users.find(u => u.id === message.senderId)
                      
                      // Parse task mentions in message content
                      const parseTaskMentions = (content: string) => {
                        const mentionRegex = /(@[\w-]+)/g
                        const parts = content.split(mentionRegex)
                        
                        return parts.map((part, index) => {
                          if (part.match(mentionRegex)) {
                            // Find matching task
                            const mentionedTask = (tasks || []).find(task => task.mentionTag === part)
                            if (mentionedTask) {
                              return (
                                <span 
                                  key={index} 
                                  className="bg-primary/20 text-primary px-1 py-0.5 rounded text-xs font-medium cursor-pointer hover:bg-primary/30 transition-colors"
                                  onClick={() => {
                                    setSelectedTask(mentionedTask)
                                    setShowTaskModal(true)
                                  }}
                                >
                                  {part}
                                </span>
                              )
                            }
                          }
                          return part
                        })
                      }
                      
                      return (
                        <div key={message.id} className="flex items-start gap-2 md:gap-3">
                          <Avatar className="w-6 h-6 md:w-8 md:h-8">
                            <AvatarImage src={sender?.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {sender?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs md:text-sm text-foreground">{sender?.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatChatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-foreground">
                              {parseTaskMentions(message.content)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  {chatMessages.filter(msg => msg.channel === activeChannel).length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2" />
                      <p className="text-xs md:text-sm">No messages in #{activeChannel} yet</p>
                      <p className="text-xs">Start the conversation!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="relative">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative flex-1">
                    <Input
                      ref={chatInputRef}
                      placeholder={`Message #${activeChannel}... (Type @ to mention tasks)`}
                      value={chatMessage}
                      onChange={handleChatMessageChange}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !showMentionSuggestions) {
                          handleSendChatMessage()
                        } else if (e.key === 'Escape') {
                          setShowMentionSuggestions(false)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (showMentionSuggestions && ['ArrowUp', 'ArrowDown', 'Tab'].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      className="flex-1 text-sm pr-10"
                    />
                    
                    {/* Mention Suggestions Dropdown */}
                    {showMentionSuggestions && mentionSuggestions.length > 0 && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 bg-popover border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                        <div className="p-2">
                          <p className="text-xs text-muted-foreground mb-2 font-medium">Tasks to mention:</p>
                          {mentionSuggestions.map((task) => (
                            <button
                              key={task.id}
                              className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors text-left"
                              onClick={() => handleMentionSelect(task)}
                            >
                              <span className="text-lg">{getPlatformIcon(task.platform)}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                                    {task.mentionTag}
                                  </Badge>
                                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                </div>
                                <p className="text-sm font-medium truncate mt-1">{task.title}</p>
                                <p className="text-xs text-muted-foreground">{task.client}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button size="sm" onClick={handleSendChatMessage} disabled={!chatMessage.trim()}>
                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </div>
                
                {/* Mention Help Text */}
                {chatMessage.includes('@') && !showMentionSuggestions && (
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Type @ followed by task name to mention projects
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      </div>

      {/* Task Detail Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="max-w-2xl glass-modal mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-heading">
              {selectedTask?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Client</label>
                  <p className="font-medium">{selectedTask.client}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Platform</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPlatformIcon(selectedTask.platform)}</span>
                    <span className="capitalize">{selectedTask.platform}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className="mt-1">{selectedTask.status.replace('-', ' ')}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTask.priority)}`}></div>
                    <span className="capitalize">{selectedTask.priority}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-sm">{selectedTask.description}</p>
              </div>

              {/* Mention Tag */}
              {selectedTask.mentionTag && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Team Chat Mention</label>
                  <div className="mt-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-accent/20 text-accent border-accent/40 font-medium">
                        {selectedTask.mentionTag}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedTask.mentionTag || '')
                          toast.success('Mention tag copied to clipboard')
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>💬 Use this tag in team chat to reference this task</p>
                      <p>📋 Example: "Can we review {selectedTask.mentionTag} today?"</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Progress</label>
                <div className="mt-1 space-y-2">
                  <Progress value={selectedTask.progress} className="h-2" />
                  <span className="text-sm">{selectedTask.progress}% Complete</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned Team</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getAssignedUsers(selectedTask.assignedTo || []).map((assignedUser) => (
                    <div key={assignedUser.id} className="flex items-center gap-2 bg-muted rounded-lg p-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={assignedUser.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {assignedUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignedUser.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Files Section */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Files ({(selectedTask.files || []).length})</label>
                  {user.role === 'admin' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => handleFileUpload(selectedTask.id)}
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </Button>
                  )}
                </div>
                
                {(selectedTask.files || []).length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {(selectedTask.files || []).map((file) => {
                      const uploader = users.find(u => u.id === file.uploadedBy)
                      return (
                        <div key={file.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 flex-1">
                            {file.type.startsWith('image/') ? (
                              <Image className="w-4 h-4" />
                            ) : file.type.includes('pdf') ? (
                              <FileText className="w-4 h-4" />
                            ) : (
                              <Paperclip className="w-4 h-4" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)} • Uploaded by {uploader?.name} • {new Date(file.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-8 h-8 p-0"
                              onClick={() => setShowFilePreview(file)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost" 
                              className="w-8 h-8 p-0"
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = file.url
                                link.download = file.name
                                link.click()
                              }}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            {user.role === 'admin' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="w-8 h-8 p-0 text-destructive"
                                onClick={() => handleFileDelete(selectedTask.id, file.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-3">
                    {user.role === 'admin' ? (
                      <div className="p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-3">No files uploaded yet</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="gap-2"
                          onClick={() => handleFileUpload(selectedTask.id)}
                        >
                          <Upload className="w-3 h-3" />
                          Upload files
                        </Button>
                      </div>
                    ) : (
                      <div className="p-6 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                  Close
                </Button>
                {user.role === 'admin' && (
                  <Button>Edit Task</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <Dialog open={!!showFilePreview} onOpenChange={() => setShowFilePreview(null)}>
        <DialogContent className="max-w-4xl glass-modal mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showFilePreview && (
                showFilePreview.type.startsWith('image/') ? (
                  <Image className="w-5 h-5" />
                ) : showFilePreview.type.includes('pdf') ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <Paperclip className="w-5 h-5" />
                )
              )}
              {showFilePreview?.name}
            </DialogTitle>
          </DialogHeader>
          
          {showFilePreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">File Information</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {formatFileSize(showFilePreview.size)} • Type: {showFilePreview.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {new Date(showFilePreview.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = showFilePreview.url
                      link.download = showFilePreview.name
                      link.click()
                    }}
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </div>

              {/* File Preview Content */}
              <div className="flex items-center justify-center min-h-[300px] bg-muted rounded-lg">
                {showFilePreview.type.startsWith('image/') ? (
                  <div className="w-full h-full max-h-[500px] flex items-center justify-center">
                    <img 
                      src={showFilePreview.url} 
                      alt={showFilePreview.name}
                      className="max-w-full max-h-full object-contain rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement
                        if (fallback) fallback.style.display = 'block'
                      }}
                    />
                    <div className="hidden text-center p-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Image preview not available
                      </p>
                    </div>
                  </div>
                ) : showFilePreview.type === 'application/pdf' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    <FileText className="w-12 h-12 mb-4 text-red-500" />
                    <p className="text-sm font-medium text-foreground mb-2">PDF Document</p>
                    <p className="text-xs text-muted-foreground mb-4 text-center">
                      PDF preview requires download to view
                    </p>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = showFilePreview.url
                        link.download = showFilePreview.name
                        link.click()
                      }}
                    >
                      <Download className="w-3 h-3" />
                      Download PDF
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="flex justify-center mb-4">
                      {showFilePreview && (
                        showFilePreview.type.startsWith('image/') ? (
                          <Image className="w-12 h-12" />
                        ) : showFilePreview.type.includes('pdf') ? (
                          <FileText className="w-12 h-12" />
                        ) : (
                          <Paperclip className="w-12 h-12" />
                        )
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      {showFilePreview.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Preview not available for this file type
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = showFilePreview.url
                        link.download = showFilePreview.name
                        link.click()
                      }}
                    >
                      <Download className="w-3 h-3" />
                      Download File
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* File Upload Modal */}
      <Dialog open={!!showFileUpload} onOpenChange={() => setShowFileUpload(null)}>
        <DialogContent className="max-w-2xl glass-modal mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Files
            </DialogTitle>
          </DialogHeader>
          
          {showFileUpload && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-1">Uploading to:</h4>
                <p className="text-sm text-muted-foreground">
                  {tasks.find(t => t.id === showFileUpload)?.title}
                </p>
              </div>
              
              <FileDropZone 
                onFilesUploaded={(files) => handleFilesUploaded(files, showFileUpload)}
                maxFileSize={200 * 1024 * 1024} // 200MB
              />
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowFileUpload(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.zip,.rar"
      />
    </div>
  )
}