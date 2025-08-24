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
import { CreateTaskModal } from './CreateTaskModal'

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
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [activeChannel, setActiveChannel] = useState('general')
  const [showFilePreview, setShowFilePreview] = useState<TaskFile | null>(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
  const [showFileUpload, setShowFileUpload] = useState<string | null>(null)
  const [fileDropTask, setFileDropTask] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      files: []
    }
  ])

  const [users] = useKV<User[]>('all-users', [
    { id: '1', name: 'Alex van der Berg', role: 'admin', avatar: '', email: 'alex@gkm.nl', isOnline: true },
    { id: '2', name: 'Sarah de Jong', role: 'admin', avatar: '', email: 'sarah@gkm.nl', isOnline: true },
    { id: '3', name: 'Mike Visser', role: 'admin', avatar: '', email: 'mike@gkm.nl', isOnline: false },
    { id: '4', name: 'Lisa Bakker', role: 'admin', avatar: '', email: 'lisa@gkm.nl', isOnline: true }
  ])

  const [chatMessages] = useKV<ChatMessage[]>('team-chat-messages', [
    {
      id: 'chat-1',
      channel: 'general',
      senderId: '2',
      content: 'Heeft iemand al feedback gehad op de Korenbloem campagne?',
      timestamp: new Date().toISOString(),
      type: 'text'
    },
    {
      id: 'chat-2',
      channel: 'projects',
      senderId: '1',
      content: 'Bella Vista project is nu in review fase',
      timestamp: new Date().toISOString(),
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

  // Drag and drop handlers with comprehensive null checks
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    try {
      setDraggedTask(task)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/html', e.currentTarget.outerHTML)
      
      // Add visual feedback with extensive null checks
      const currentElement = e.currentTarget as HTMLElement
      if (currentElement && currentElement.style) {
        try {
          const dragImage = currentElement.cloneNode(true) as HTMLElement
          if (dragImage && dragImage.style) {
            dragImage.style.transform = 'rotate(5deg)'
            dragImage.style.opacity = '0.8'
            e.dataTransfer.setDragImage(dragImage, 0, 0)
          }
        } catch (dragImageError) {
          console.warn('Could not create drag image:', dragImageError)
        }
        
        // Make original semi-transparent with additional safety
        setTimeout(() => {
          if (currentElement && currentElement.style && currentElement.isConnected) {
            currentElement.style.opacity = '0.5'
            currentElement.style.transform = 'scale(0.95)'
          }
        }, 0)
      }
    } catch (error) {
      console.warn('Drag start error:', error)
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    try {
      const element = e.currentTarget as HTMLElement
      if (element && element.style && element.isConnected) {
        element.style.opacity = '1'
        element.style.transform = 'scale(1)'
      }
    } catch (error) {
      console.warn('Drag end error:', error)
    } finally {
      setDraggedTask(null)
      setDraggedOverColumn(null)
    }
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
    const relatedTarget = e.relatedTarget as Node
    if (relatedTarget && !e.currentTarget.contains(relatedTarget)) {
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
    if (!files || !Array.isArray(files)) {
      toast.error('No files to upload')
      return
    }

    const newFiles: TaskFile[] = files.map(file => ({
      id: `f${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file) // In real app, this would be the server URL
    }))

    const updatedTasks = (tasks || []).map(task => 
      task.id === taskId 
        ? { ...task, files: [...(task.files || []), ...newFiles] }
        : task
    )
    setTasks(updatedTasks)
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
    const relatedTarget = e.relatedTarget as Node
    if (relatedTarget && !e.currentTarget.contains(relatedTarget)) {
      setFileDropTask(null)
    }
  }

  // Cleanup function for URL objects
  const cleanupFileURL = (url: string) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  }

  const handleFileDelete = (taskId: string, fileId: string) => {
    // Find the file first to cleanup URL
    const task = (tasks || []).find(t => t.id === taskId)
    const file = (task?.files || []).find(f => f.id === fileId)
    
    if (file) {
      cleanupFileURL(file.url)
    }
    
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

  const getTaskFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />
    return <Paperclip className="w-4 h-4" />
  }

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return
    // In a real app, this would send the message to the server
    setChatMessage('')
  }

  const formatChatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Handle new task creation
  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...(prevTasks || []), newTask])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] space-y-6 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">Board View</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Drag and drop projects between phases • {user.role === 'admin' ? 'Team collaboration view' : 'Project progress tracking'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => setShowCreateTaskModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          )}
        </div>
      </div>

      {/* Board Section - Takes 70% of screen on desktop, responsive on mobile */}
      <div className="flex-1 board-section" style={{ minHeight: '60vh' }}>
        <Card className="glass-card h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-base md:text-lg font-semibold text-foreground">Project Board</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] p-2 md:p-6">
            <div className="w-full h-full overflow-x-auto overflow-y-hidden">
              <div className="flex gap-3 md:gap-6 pb-4 min-w-max" style={{ width: 'max-content' }}>
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
                                
                                {/* File previews in task cards */}
                                {(task.files || []).length > 0 && (
                                  <div className="grid grid-cols-2 gap-1 mb-3">
                                    {(task.files || []).slice(0, 2).map((file) => (
                                      <div 
                                        key={file.id}
                                        className="aspect-square bg-muted rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
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
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center">
                                            {getTaskFileIcon(file.type)}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                    {(task.files || []).length > 2 && (
                                      <div className="aspect-square bg-muted rounded flex items-center justify-center border-2 border-dashed">
                                        <span className="text-xs text-muted-foreground">+{(task.files || []).length - 2}</span>
                                      </div>
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
                            onClick={() => setShowCreateTaskModal(true)}
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

      {/* Team Chat Section - Takes 30% of screen on desktop, responsive on mobile (Admin Only) */}
      {user.role === 'admin' && (
        <div className="chat-section" style={{ minHeight: '30vh' }}>
          <Card className="glass-card h-full">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                Team Chat
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {users.slice(0, 3).map((teamMember) => (
                    <div key={teamMember.id} className="relative">
                      <Avatar className="w-5 h-5 md:w-6 md:h-6 border-2 border-background">
                        <AvatarImage src={teamMember.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {teamMember.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {teamMember.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border border-background"></div>
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">{users.filter(u => u.isOnline).length} online</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col h-[calc(100%-4rem)] p-2 md:p-6">
              {/* Channel Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button 
                  variant={activeChannel === 'general' ? 'default' : 'outline'} 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setActiveChannel('general')}
                >
                  <Target className="w-3 h-3 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">#</span>general
                </Button>
                <Button 
                  variant={activeChannel === 'projects' ? 'default' : 'outline'} 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setActiveChannel('projects')}
                >
                  <Users className="w-3 h-3 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">#</span>projects
                </Button>
                <Button 
                  variant={activeChannel === 'urgent' ? 'default' : 'outline'} 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setActiveChannel('urgent')}
                >
                  <AlertCircle className="w-3 h-3 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">#</span>urgent
                </Button>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-3 p-2">
                  {chatMessages
                    .filter(msg => msg.channel === activeChannel)
                    .map((message) => {
                      const sender = users.find(u => u.id === message.senderId)
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
                            <p className="text-xs md:text-sm text-foreground">{message.content}</p>
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
              <div className="flex items-center gap-2 md:gap-3">
                <Input
                  placeholder={`Message #${activeChannel}...`}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  className="flex-1 text-sm"
                />
                <Button size="sm" onClick={handleSendChatMessage} disabled={!chatMessage.trim()}>
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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

              {/* Files Section with Preview */}
              <div>
                <div className="flex items-center justify-between mb-3">
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

                {/* File Preview Grid */}
                {(selectedTask.files || []).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {(selectedTask.files || []).slice(0, 4).map((file) => (
                      <div 
                        key={file.id} 
                        className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
                        onClick={() => setShowFilePreview(file)}
                      >
                        {file.type.startsWith('image/') ? (
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getTaskFileIcon(file.type)}
                            <div className="mt-2 text-center">
                              <p className="text-xs font-medium truncate px-2">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ))}
                    {(selectedTask.files || []).length > 4 && (
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                        <div className="text-center">
                          <Plus className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">+{(selectedTask.files || []).length - 4} more</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {(selectedTask.files || []).length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(selectedTask.files || []).map((file) => {
                      const uploader = users.find(u => u.id === file.uploadedBy)
                      return (
                        <div key={file.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 flex-1">
                            {getTaskFileIcon(file.type)}
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
                  <Button>Save Task</Button>
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
              {showFilePreview && getTaskFileIcon(showFilePreview.type)}
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
                  <img 
                    src={showFilePreview.url} 
                    alt={showFilePreview.name}
                    className="max-w-full max-h-[500px] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (target) {
                        target.style.display = 'none'
                      }
                    }}
                  />
                ) : (
                  <div className="text-center p-8">
                    {getTaskFileIcon(showFilePreview.type)}
                    <p className="text-sm text-muted-foreground mt-2">
                      Preview not available for this file type
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click download to view the file
                    </p>
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

      {/* Create Task Modal */}
      <CreateTaskModal
        open={showCreateTaskModal}
        onOpenChange={setShowCreateTaskModal}
        onTaskCreated={handleTaskCreated}
        users={users}
        currentUser={user}
      />
    </div>
  )
}