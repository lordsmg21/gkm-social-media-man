import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
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
  Paperclip,
  Send,
  Minimize2,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import type { User } from '../types'
import { useKV } from '@github/spark/hooks'
import { FileDropZone } from './FileDropZone'
import CreateTaskModal from './modals/CreateTaskModal'
import CreateProjectModal from './modals/CreateProjectModal'
import { useNotifications } from '../hooks'

interface TaskFile {
  id: string
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
  url: string // In real app, this would be a proper file URL
}

interface TaskFeedback {
  id: string
  fileId?: string  // Optional: feedback on a specific file
  message: string
  status: 'pending' | 'approved' | 'needs-revision'
  submittedBy: string
  submittedAt: string
  resolvedBy?: string
  resolvedAt?: string
  priority: 'low' | 'medium' | 'high'
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
  feedback?: TaskFeedback[]
  projectId?: string
}

interface Project {
  id: string
  name: string
  description: string
  trajectory: 'social-media' | 'website' | 'branding' | 'advertising' | 'full-campaign'
  budget: number
  clientId: string
  clientName: string
  createdBy: string
  createdAt: string
  status: 'active' | 'completed' | 'on-hold'
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
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | 'all'>('all')
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [activeChannel, setActiveChannel] = useState('general')
  const [showFilePreview, setShowFilePreview] = useState<TaskFile | null>(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)
  const [showFileUpload, setShowFileUpload] = useState<string | null>(null)
  const [fileDropTask, setFileDropTask] = useState<string | null>(null)
  const [showFloatingChat, setShowFloatingChat] = useState(false)
  const [showTaskSuggestions, setShowTaskSuggestions] = useState(false)
  const [taskSuggestions, setTaskSuggestions] = useState<Task[]>([])
  const [userSuggestions, setUserSuggestions] = useState<User[]>([])
  const [mentionStartIndex, setMentionStartIndex] = useState(-1)
  const [mentionType, setMentionType] = useState<'task' | 'user' | null>(null)
  const [deleteTaskDialog, setDeleteTaskDialog] = useState<Task | null>(null)
  const [deleteProjectDialog, setDeleteProjectDialog] = useState<Project | null>(null)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState<'approved' | 'needs-revision'>('needs-revision')
  const [feedbackPriority, setFeedbackPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedFile, setSelectedFile] = useState<TaskFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotifications()

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
      tags: ['stories', 'food', 'artisan', 'bakery'],
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
      ],
      feedback: [],
      projectId: 'project1'
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
      tags: ['ads', 'restaurant', 'promotion', 'dinner'],
      files: [
        {
          id: 'f3',
          name: 'Menu Photos.png',
          size: 3145728,
          type: 'image/png',
          uploadedBy: '3',
          uploadedAt: new Date().toISOString(),
          url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5NZW51IFBob3RvczwvdGV4dD48L3N2Zz4='
        }
      ],
      feedback: [],
      projectId: 'project2'
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
      tags: ['strategy', 'fitness', 'planning', 'q1'],
      files: [],
      feedback: [],
      projectId: 'project3'
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
      tags: ['launch', 'tech', 'saas', 'product'],
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
      ],
      feedback: [],
      projectId: 'project4'
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
      tags: ['holiday', 'fashion', 'promotion', 'valentines'],
      files: [],
      feedback: [],
      projectId: 'project5'
    }
  ])

  const [projects, setProjects] = useKV<Project[]>('projects', [
    {
      id: 'project1',
      name: 'Bakkerij de Korenbloem - Q1 Campaign',
      description: 'Complete social media campaign for artisan bakery including Instagram stories and Facebook posts',
      trajectory: 'social-media',
      budget: 5000,
      clientId: '1',
      clientName: 'De Korenbloem',
      createdBy: '1',
      createdAt: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 'project2',
      name: 'Restaurant Bella Vista - Dinner Promotion',
      description: 'Facebook advertising campaign to promote dinner specials',
      trajectory: 'advertising',
      budget: 3500,
      clientId: '2',
      clientName: 'Bella Vista',
      createdBy: '2',
      createdAt: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 'project3',
      name: 'Fitness First - Social Strategy',
      description: 'Comprehensive social media strategy development for Q1 2024',
      trajectory: 'social-media',
      budget: 8000,
      clientId: '3',
      clientName: 'Fitness First',
      createdBy: '1',
      createdAt: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 'project4',
      name: 'TechStart - Product Launch',
      description: 'Multi-channel launch campaign for new SaaS product',
      trajectory: 'full-campaign',
      budget: 15000,
      clientId: '4',
      clientName: 'TechStart',
      createdBy: '2',
      createdAt: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: 'project5',
      name: 'Fashion Boutique - Holiday Marketing',
      description: 'Valentine\'s Day promotion across Instagram',
      trajectory: 'social-media',
      budget: 2500,
      clientId: '5',
      clientName: 'Fashion Boutique',
      createdBy: '2',
      createdAt: new Date().toISOString(),
      status: 'active'
    }
  ])

  // Get system users
  const [systemUsers] = useKV<User[]>('system-users', [
    { id: '1', name: 'Alex van der Berg', email: 'alex@gkm.nl', role: 'admin', isOnline: true },
    { id: '2', name: 'Sarah de Jong', email: 'sarah@gkm.nl', role: 'admin', isOnline: true },
    { id: '3', name: 'Mike Visser', email: 'mike@client.nl', role: 'client', isOnline: false },
    { id: '4', name: 'Lisa Bakker', email: 'lisa@gkm.nl', role: 'admin', isOnline: true },
    { id: '5', name: 'Jan Peters', email: 'jan@restaurant.nl', role: 'client', isOnline: true },
    { id: '6', name: 'Emma de Vries', email: 'emma@boutique.nl', role: 'client', isOnline: false },
    { id: '7', name: 'Tom Hendriks', email: 'tom@cafe.nl', role: 'client', isOnline: true },
    { id: '8', name: 'Sophie Jansen', email: 'sophie@salon.nl', role: 'client', isOnline: false }
  ])
  
  // Filter to get only clients and admin users
  const availableClients = systemUsers.filter(user => user.role === 'client')
  const adminUsers = systemUsers.filter(user => user.role === 'admin')
  
  // Use system users as main users array
  const users = systemUsers

  const [chatMessages, setChatMessages] = useKV<ChatMessage[]>('team-chat-messages', [
    {
      id: 'chat-1',
      channel: 'general',
      senderId: '2',
      content: 'Heeft iemand al feedback gehad op @stories project? @Alex_van_der_Berg kun jij even kijken?',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      type: 'text'
    },
    {
      id: 'chat-2',
      channel: 'direct-1-2', // Direct chat between Alex (1) and Sarah (2)
      senderId: '1',
      content: 'Hey Sarah, kun je even naar het @ads project kijken? Er zijn wat vragen van de klant.',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      type: 'text'
    },
    {
      id: 'chat-3',
      channel: 'general',
      senderId: '3',
      content: 'Perfect! @launch campaign liep super goed. Kunnen we dit als template gebruiken? @Lisa_Bakker',
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      type: 'text'
    },
    {
      id: 'chat-4',
      channel: 'direct-1-4', // Direct chat between Alex (1) and Lisa (4)
      senderId: '4',
      content: 'Hi Alex! @holiday campaign is klaar voor scheduling. Wanneer kunnen we live gaan?',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      type: 'text'
    },
    {
      id: 'chat-5',
      channel: 'direct-1-2', // Continuation of Alex-Sarah conversation
      senderId: '2',
      content: 'Ja zeker! Ik kijk er nu naar. De @ads campagne ziet er goed uit, alleen de targeting moet nog aangepast.',
      timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      type: 'text'
    },
    {
      id: 'chat-6',
      channel: 'direct-2-3', // Direct chat between Sarah (2) and Mike (3)
      senderId: '3',
      content: 'Sarah, kun je me helpen met de @strategy project? Ik loop vast op de content planning.',
      timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
      type: 'text'
    }
  ])

  // Filter tasks based on user role and selected project
  const filteredTasks = user.role === 'admin' ? (tasks || []) : (tasks || []).filter(task => 
    task.assignedTo?.includes(user.id) || task.client === 'My Client' // Simplified client filtering
  )

  const visibleTasks = selectedProject === 'all' 
    ? filteredTasks 
    : filteredTasks.filter(task => task.projectId === selectedProject)

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
      
      // Generate notification for task status change
      addNotification({
        type: 'task',
        title: 'Task Updated',
        message: `"${draggedTask.title}" has been moved to ${columnTitle}`,
        read: false,
        userId: user.id,
        actionData: { taskId: draggedTask.id }
      })
      
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
    
    // Generate notification for file upload
    const task = (tasks || []).find(t => t.id === taskId)
    if (task) {
      addNotification({
        type: 'file',
        title: 'Files Uploaded',
        message: `${files.length} file(s) uploaded to "${task.title}"`,
        read: false,
        userId: user.id,
        actionData: { taskId: taskId }
      })
    }
    
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
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      channel: activeChannel,
      senderId: user.id,
      content: chatMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    }
    
    setChatMessages(prev => [...(prev || []), newMessage])
    setChatMessage('')
    setShowTaskSuggestions(false)
    setMentionStartIndex(-1)
    setMentionType(null)
    toast.success('Message sent')
  }

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setChatMessage(value)
    
    // Handle @ mentions
    const cursorPosition = e.target.selectionStart || 0
    const textBeforeCursor = value.slice(0, cursorPosition)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1)
      
      // Check if we're in the middle of an @ mention (no spaces after @)
      if (!textAfterAt.includes(' ') && textAfterAt.length >= 0) {
        const searchTerm = textAfterAt.toLowerCase()
        
        // Search tasks by tags and other properties
        const filteredTasks = (tasks || []).filter(task => {
          // Search by tags first (primary method)
          const tagMatches = task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          // Also search by title and client as backup
          const titleMatches = task.title.toLowerCase().includes(searchTerm)
          const clientMatches = task.client.toLowerCase().includes(searchTerm)
          
          return tagMatches || titleMatches || clientMatches
        }).slice(0, 5)
        
        // Search team members
        const filteredUsers = users.filter(user => 
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        ).slice(0, 5)
        
        if (filteredTasks.length > 0 || filteredUsers.length > 0) {
          setTaskSuggestions(filteredTasks)
          setUserSuggestions(filteredUsers)
          setShowTaskSuggestions(true)
          setMentionStartIndex(lastAtIndex)
          // Determine mention type based on what has more results
          setMentionType(filteredTasks.length >= filteredUsers.length ? 'task' : 'user')
        } else {
          setShowTaskSuggestions(false)
          setMentionStartIndex(-1)
          setMentionType(null)
        }
      } else {
        setShowTaskSuggestions(false)
        setMentionStartIndex(-1)
        setMentionType(null)
      }
    } else {
      setShowTaskSuggestions(false)
      setMentionStartIndex(-1)
      setMentionType(null)
    }
  }

  const handleTaskMention = (task: Task) => {
    if (mentionStartIndex === -1) return
    
    // Find the end of the current mention text
    const textAfterAt = chatMessage.slice(mentionStartIndex + 1)
    const spaceIndex = textAfterAt.indexOf(' ')
    const endOfMention = spaceIndex === -1 ? chatMessage.length : mentionStartIndex + 1 + spaceIndex
    
    const beforeMention = chatMessage.slice(0, mentionStartIndex)
    const afterMention = chatMessage.slice(endOfMention)
    
    // Use the first tag as the mention identifier, or fallback to task title
    const taskTag = task.tags.length > 0 ? task.tags[0] : task.title.toLowerCase().replace(/\s+/g, '_')
    const taskMention = `@${taskTag}`
    
    setChatMessage(`${beforeMention}${taskMention} ${afterMention}`)
    setShowTaskSuggestions(false)
    setMentionStartIndex(-1)
    setMentionType(null)
  }

  const handleUserMention = (user: User) => {
    if (mentionStartIndex === -1) return
    
    // Find the end of the current mention text
    const textAfterAt = chatMessage.slice(mentionStartIndex + 1)
    const spaceIndex = textAfterAt.indexOf(' ')
    const endOfMention = spaceIndex === -1 ? chatMessage.length : mentionStartIndex + 1 + spaceIndex
    
    const beforeMention = chatMessage.slice(0, mentionStartIndex)
    const afterMention = chatMessage.slice(endOfMention)
    
    const userMention = `@${user.name.replace(/\s+/g, '_')}`
    
    setChatMessage(`${beforeMention}${userMention} ${afterMention}`)
    setShowTaskSuggestions(false)
    setMentionStartIndex(-1)
    setMentionType(null)
  }

  const renderMessageWithMentions = (content: string) => {
    // Split by @ mentions and render them with special styling
    const parts = content.split(/(@[^\s]+)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const mentionText = part.slice(1) // Remove @ symbol
        
        // First try to find task by tag
        let mentionedTask = (tasks || []).find(task => 
          task.tags.some(tag => tag.toLowerCase() === mentionText.toLowerCase())
        )
        
        // If not found by tag, try by title
        if (!mentionedTask) {
          const taskName = mentionText.replace(/_/g, ' ')
          mentionedTask = (tasks || []).find(task => 
            task.title.toLowerCase().includes(taskName.toLowerCase())
          )
        }
        
        // Check if it's a user mention
        const mentionedUser = users.find(user => 
          user.name.toLowerCase().replace(/\s+/g, '_') === mentionText.toLowerCase()
        )
        
        if (mentionedTask) {
          return (
            <span 
              key={index} 
              className="task-mention cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedTask(mentionedTask!)
                setShowTaskModal(true)
                setShowFloatingChat(false) // Close chat when opening task
              }}
              title={`Click to view task: ${mentionedTask.title}`}
            >
              @{mentionText}
            </span>
          )
        } else if (mentionedUser) {
          return (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              title={`Mentioned: ${mentionedUser.name} (${mentionedUser.email})`}
            >
              @{mentionedUser.name}
            </span>
          )
        } else {
          return (
            <span key={index} className="text-muted-foreground">
              {part}
            </span>
          )
        }
      }
      return part
    })
  }

  const formatChatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Handle task deletion
  const handleDeleteTask = (task: Task) => {
    setTasks(prev => (prev || []).filter(t => t.id !== task.id))
    setDeleteTaskDialog(null)
    toast.success(`Task "${task.title}" deleted successfully`)
    
    // Add notification for task deletion
    addNotification({
      type: 'system',
      title: 'Task Deleted',
      message: `Task "${task.title}" has been deleted`,
      read: false,
      userId: user.id
    })
  }

  // Handle project deletion
  const handleDeleteProject = (project: Project) => {
    const projectTasks = tasks.filter(task => task.projectId === project.id)
    
    // Delete all tasks in the project
    setTasks(prev => (prev || []).filter(task => task.projectId !== project.id))
    
    // Delete the project
    setProjects(prev => (prev || []).filter(p => p.id !== project.id))
    
    // Reset selected project if it was the deleted one
    if (selectedProject === project.id) {
      setSelectedProject('all')
    }
    
    setDeleteProjectDialog(null)
    toast.success(`Project "${project.name}" and ${projectTasks.length} task${projectTasks.length !== 1 ? 's' : ''} deleted successfully`)
    
    // Add notification for project deletion
    addNotification({
      type: 'system',
      title: 'Project Deleted',
      message: `Project "${project.name}" and ${projectTasks.length} task${projectTasks.length !== 1 ? 's' : ''} have been deleted`,
      read: false,
      userId: user.id
    })
  }

  // Handle new task creation
  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...(prevTasks || []), newTask])
  }

  // Handle new project creation
  const handleProjectCreated = (newProject: Project) => {
    setProjects((prevProjects) => [...(prevProjects || []), newProject])
    setSelectedProject(newProject.id) // Automatically switch to the new project
    toast.success(`Project "${newProject.name}" created successfully`)
  }

  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    if (!selectedTask || !feedbackMessage.trim()) {
      toast.error('Please provide feedback message')
      return
    }

    const newFeedback: TaskFeedback = {
      id: Date.now().toString(),
      fileId: selectedFile?.id,
      message: feedbackMessage.trim(),
      status: feedbackStatus,
      submittedBy: user.id,
      submittedAt: new Date().toISOString(),
      priority: feedbackPriority
    }

    // Update task with new feedback
    setTasks(prevTasks => (prevTasks || []).map(task => {
      if (task.id === selectedTask.id) {
        return {
          ...task,
          feedback: [...(task.feedback || []), newFeedback],
          // If needs revision, move back to in-progress
          status: feedbackStatus === 'needs-revision' ? 'in-progress' : task.status
        }
      }
      return task
    }))

    // Close dialog and reset form
    setShowFeedbackDialog(false)
    setFeedbackMessage('')
    setSelectedFile(null)
    setFeedbackStatus('needs-revision')
    setFeedbackPriority('medium')

    // Show success message
    toast.success(`Feedback ${feedbackStatus === 'approved' ? 'approved' : 'submitted'} successfully`)

    // Add notification for the admin team
    addNotification({
      type: feedbackStatus === 'approved' ? 'success' : 'warning',
      title: `Task ${feedbackStatus === 'approved' ? 'Approved' : 'Needs Revision'}`,
      message: `${user.name} ${feedbackStatus === 'approved' ? 'approved' : 'provided feedback on'} "${selectedTask.title}"`,
      read: false,
      userId: 'admin'
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">Board View</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Drag and drop projects between phases • {user.role === 'admin' ? 'Team collaboration view' : 'Project progress tracking'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2"
                onClick={() => setShowCreateProjectModal(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
              </Button>
              <Button 
                size="sm" 
                className="gap-2"
                onClick={() => setShowCreateTaskModal(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
              {selectedProject !== 'all' && (
                <Button 
                  size="sm" 
                  variant="destructive"
                  className="gap-2"
                  onClick={() => {
                    const project = projects.find(p => p.id === selectedProject)
                    if (project) {
                      setDeleteProjectDialog(project)
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete Project</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Project Filter Section */}
      <div className="mb-6">
        <Card className="glass-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">Projects</h3>
              <p className="text-sm text-muted-foreground">
                Select a project to view its tasks or view all tasks across projects
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">All Projects</div>
                        <div className="text-xs text-muted-foreground">Show tasks from all projects</div>
                      </div>
                    </div>
                  </SelectItem>
                  {(projects || []).map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === 'active' ? 'bg-green-500' :
                          project.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {project.clientName} • ${project.budget.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedProject !== 'all' && (
                <div className="text-sm text-muted-foreground">
                  {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Board Section - Full height with proper scrolling */}
      <div className="flex-1 min-h-0">
        <Card className="glass-card h-full bg-background">
          <CardHeader className="pb-4 bg-background">
            <CardTitle className="text-base md:text-lg font-semibold text-foreground">Project Board</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] p-0 bg-background">
            <div className="h-full overflow-x-auto overflow-y-hidden p-4">
              <div className="flex gap-4 pb-4 min-w-max h-full">
                {columns.map((column) => {
                  const columnTasks = getTasksByStatus(column.id)
                  
                  return (
                    <div 
                      key={column.id} 
                      className={`flex-shrink-0 w-80 flex flex-col transition-all duration-200
                        ${draggedOverColumn === column.id ? 'drag-over' : ''}
                      `}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => handleDragEnter(e, column.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, column.id)}
                    >
                      <div className="flex items-center gap-3 mb-4 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                        <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                        <h3 className="font-heading font-semibold text-foreground text-sm md:text-base">{column.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {columnTasks.length}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto space-y-3 pr-2" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
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
                                  <div className="flex items-center gap-1">
                                    {user.role === 'admin' && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="w-6 h-6 p-0 text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setDeleteTaskDialog(task)
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    )}
                                    <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                                      <MoreVertical className="w-3 h-3" />
                                    </Button>
                                  </div>
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

      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg hover:shadow-xl z-50"
        onClick={() => setShowFloatingChat(true)}
      >
        <MessageSquare className="w-5 h-5" />
      </Button>

      {/* Floating Chat */}
      {showFloatingChat && (
        <div className="fixed inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-[480px] h-[600px] glass-modal shadow-2xl flex flex-col">
            <CardHeader className="pb-3 flex-shrink-0 bg-background/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading font-semibold">Team Chat</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFloatingChat(false)}
                  className="w-8 h-8 p-0"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Channel Selector */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant={activeChannel === 'general' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveChannel('general')}
                  className="text-xs"
                >
                  General
                </Button>
                <Button
                  variant={activeChannel.startsWith('direct-') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveChannel(`direct-${user.id}`)}
                  className="text-xs"
                >
                  Direct
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-hidden">
              {/* Chat Messages */}
              <ScrollArea className="h-full pr-3">
                <div className="space-y-3">
                  {(chatMessages || [])
                    .filter(msg => 
                      activeChannel === 'general' ? msg.channel === 'general' : 
                      msg.channel.includes(user.id)
                    )
                    .map((message) => {
                      const sender = users.find(u => u.id === message.senderId)
                      return (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={sender?.avatar} />
                            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                              {sender?.name?.split(' ').map(n => n[0]).join('') || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{sender?.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatChatTime(message.timestamp)}
                              </span>
                            </div>
                            <div className="text-sm text-foreground">
                              {renderMessageWithMentions(message.content)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </ScrollArea>
            </CardContent>

            <CardContent className="p-4 pt-0 flex-shrink-0">
              <div className="relative">
                <Input
                  placeholder="Type a message... Use @ to mention tasks or team members"
                  value={chatMessage}
                  onChange={handleChatInputChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendChatMessage()
                    }
                  }}
                  className="pr-10"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={handleSendChatMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
                
                {/* Mention Suggestions */}
                {showTaskSuggestions && (taskSuggestions.length > 0 || userSuggestions.length > 0) && (
                  <div className="absolute bottom-full mb-2 w-full bg-popover border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {mentionType === 'task' && taskSuggestions.map((task) => (
                      <div
                        key={task.id}
                        className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                        onClick={() => handleTaskMention(task)}
                      >
                        <span className="text-lg">{getPlatformIcon(task.platform)}</span>
                        <div>
                          <div className="text-sm font-medium">{task.tags[0] || task.title}</div>
                          <div className="text-xs text-muted-foreground">{task.client}</div>
                        </div>
                      </div>
                    ))}
                    {mentionType === 'user' && userSuggestions.map((suggestedUser) => (
                      <div
                        key={suggestedUser.id}
                        className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                        onClick={() => handleUserMention(suggestedUser)}
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={suggestedUser.avatar} />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {suggestedUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{suggestedUser.name}</div>
                          <div className="text-xs text-muted-foreground">{suggestedUser.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Task Detail Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="glass-modal max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          {selectedTask && (
            <>
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-2xl">{getPlatformIcon(selectedTask.platform)}</span>
                  <div>
                    <h2 className="text-lg md:text-xl font-heading font-bold">{selectedTask.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedTask.client}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-3">
                  <div className="space-y-6">
                    {/* File previews section */}
                    {(selectedTask.files || []).length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Files ({(selectedTask.files || []).length})</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {(selectedTask.files || []).map((file) => (
                            <div 
                              key={file.id}
                              className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border"
                              onClick={() => setShowFilePreview(file)}
                            >
                              {file.type.startsWith('image/') ? (
                                <img 
                                  src={file.url} 
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                  {getTaskFileIcon(file.type)}
                                  <span className="text-xs text-center mt-2 line-clamp-2">{file.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Task Description */}
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">
                        {selectedTask.description || 'No description provided'}
                      </p>
                    </div>

                    {/* Task Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="secondary" className="capitalize">
                              {selectedTask.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Priority:</span>
                            <Badge 
                              variant={selectedTask.priority === 'high' ? 'destructive' : 
                                      selectedTask.priority === 'medium' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {selectedTask.priority}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Platform:</span>
                            <span className="capitalize">{selectedTask.platform}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Deadline:</span>
                            <span>{new Date(selectedTask.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Progress</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Completion</span>
                              <span className="font-medium">{selectedTask.progress}%</span>
                            </div>
                            <Progress value={selectedTask.progress} className="h-2" />
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground text-sm">Assigned to:</span>
                            <div className="flex gap-2 mt-1">
                              {getAssignedUsers(selectedTask.assignedTo || []).map((assignedUser) => (
                                <div key={assignedUser.id} className="flex items-center gap-2">
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
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedTask.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Existing Feedback Section */}
                    {(selectedTask.feedback || []).length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Feedback History</h3>
                        <div className="space-y-3">
                          {(selectedTask.feedback || []).map((feedback) => {
                            const submitter = users.find(u => u.id === feedback.submittedBy)
                            const resolver = feedback.resolvedBy ? users.find(u => u.id === feedback.resolvedBy) : null
                            
                            return (
                              <div 
                                key={feedback.id} 
                                className={`p-4 border rounded-lg ${
                                  feedback.status === 'approved' ? 'bg-green-50 border-green-200' :
                                  feedback.status === 'needs-revision' ? 'bg-red-50 border-red-200' :
                                  'bg-yellow-50 border-yellow-200'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-1 rounded-full ${
                                      feedback.status === 'approved' ? 'bg-green-100' :
                                      feedback.status === 'needs-revision' ? 'bg-red-100' :
                                      'bg-yellow-100'
                                    }`}>
                                      {feedback.status === 'approved' ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      ) : feedback.status === 'needs-revision' ? (
                                        <XCircle className="w-4 h-4 text-red-600" />
                                      ) : (
                                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm">{submitter?.name || 'Unknown User'}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(feedback.submittedAt).toLocaleString()}
                                        {feedback.fileId && ' • On specific file'}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge 
                                    variant={feedback.priority === 'high' ? 'destructive' : 
                                            feedback.priority === 'medium' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {feedback.priority} priority
                                  </Badge>
                                </div>
                                
                                <p className="text-sm mb-2">{feedback.message}</p>
                                
                                {feedback.resolvedBy && feedback.resolvedAt && (
                                  <div className="text-xs text-muted-foreground pt-2 border-t border-current/10">
                                    Resolved by {resolver?.name || 'Unknown'} on {new Date(feedback.resolvedAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Files List */}
                    {(selectedTask.files || []).length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Attached Files</h3>
                        <div className="space-y-2">
                          {(selectedTask.files || []).map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {getTaskFileIcon(file.type)}
                                <div>
                                  <p className="font-medium text-sm">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowFilePreview(file)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // In real app, this would trigger a download
                                    const link = document.createElement('a')
                                    link.href = file.url
                                    link.download = file.name
                                    link.click()
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                {user.role === 'admin' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10"
                                    onClick={() => handleFileDelete(selectedTask.id, file.id)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* File Upload */}
                    {user.role === 'admin' && (
                      <div>
                        <h3 className="font-semibold mb-3">Upload Files</h3>
                        <FileDropZone
                          onFilesUploaded={(files) => handleFilesUploaded(files, selectedTask.id)}
                          maxFiles={5}
                          maxSize={200 * 1024 * 1024}
                          accept={{
                            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                            'application/pdf': ['.pdf'],
                            'application/zip': ['.zip'],
                            'text/*': ['.txt', '.md'],
                            'application/msword': ['.doc'],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                          }}
                        />
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <DialogFooter className="flex-shrink-0">
                <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                  Close
                </Button>
                {user.role === 'client' && selectedTask.status === 'review' && (
                  <Button 
                    onClick={() => setShowFeedbackDialog(true)}
                    className="gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Provide Feedback
                  </Button>
                )}
                {user.role === 'admin' && (
                  <Button onClick={() => {
                    // In real app, this would save task changes
                    setShowTaskModal(false)
                    toast.success('Task updated successfully')
                  }}>
                    Save Task
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="glass-modal max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Provide Feedback
            </DialogTitle>
            {selectedTask && (
              <p className="text-sm text-muted-foreground">
                Task: {selectedTask.title}
              </p>
            )}
          </DialogHeader>

          <div className="space-y-4">
            {/* Feedback Status */}
            <div>
              <Label className="text-sm font-medium">Decision</Label>
              <RadioGroup 
                value={feedbackStatus} 
                onValueChange={(value) => setFeedbackStatus(value as 'approved' | 'needs-revision')}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approved" id="approved-dialog" />
                  <Label htmlFor="approved-dialog" className="flex items-center gap-2 cursor-pointer">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Approve
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="needs-revision" id="needs-revision-dialog" />
                  <Label htmlFor="needs-revision-dialog" className="flex items-center gap-2 cursor-pointer">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Needs Revision
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Priority Level */}
            <div>
              <Label className="text-sm font-medium">Priority</Label>
              <Select value={feedbackPriority} onValueChange={(value) => setFeedbackPriority(value as 'low' | 'medium' | 'high')}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      High Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback Message */}
            <div>
              <Label className="text-sm font-medium">
                {feedbackStatus === 'approved' ? 'Comments (Optional)' : 'Revision Notes'}
              </Label>
              <Textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder={feedbackStatus === 'approved' ? 
                  "Any additional comments..." : 
                  "Please describe what changes you'd like to see..."}
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleFeedbackSubmit}
              disabled={feedbackStatus === 'needs-revision' && !feedbackMessage.trim()}
            >
              {feedbackStatus === 'approved' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Task
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <Dialog open={!!showFilePreview} onOpenChange={() => setShowFilePreview(null)}>
        <DialogContent className="glass-modal max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          {showFilePreview && (
            <>
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="flex items-center gap-3">
                  {getTaskFileIcon(showFilePreview.type)}
                  <div>
                    <h2 className="text-lg font-heading font-bold">{showFilePreview.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(showFilePreview.size)} • {showFilePreview.type}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-auto">
                <ScrollArea className="h-full">
                  <div className="flex flex-col items-center justify-center min-h-[400px] bg-muted/20 rounded-lg">
                    {showFilePreview.type.startsWith('image/') ? (
                      <img 
                        src={showFilePreview.url} 
                        alt={showFilePreview.name}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    ) : showFilePreview.type === 'application/pdf' ? (
                      <iframe
                        src={showFilePreview.url}
                        className="w-full h-[400px] border rounded"
                        title={showFilePreview.name}
                      />
                    ) : (
                      <div className="text-center">
                        {getTaskFileIcon(showFilePreview.type)}
                        <p className="text-muted-foreground mt-2">
                          Preview not available for this file type
                        </p>
                        <Button
                          variant="outline"
                          className="mt-3"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = showFilePreview.url
                            link.download = showFilePreview.name
                            link.click()
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download File
                        </Button>
                      </div>
                    )}

                    {/* Client feedback section for review status */}
                    {user.role === 'client' && selectedTask && selectedTask.status === 'review' && (
                      <div className="w-full mt-6 p-6 space-y-4">
                        <Separator />
                        <div className="bg-card/50 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Provide Feedback on This File
                          </h3>
                          
                          <div className="space-y-4">
                            {/* Feedback Status */}
                            <div>
                              <Label className="text-sm font-medium">Decision</Label>
                              <RadioGroup 
                                value={feedbackStatus} 
                                onValueChange={(value) => setFeedbackStatus(value as 'approved' | 'needs-revision')}
                                className="flex gap-6 mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="approved" id="approved-preview" />
                                  <Label htmlFor="approved-preview" className="flex items-center gap-2 cursor-pointer">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    Approve
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="needs-revision" id="needs-revision-preview" />
                                  <Label htmlFor="needs-revision-preview" className="flex items-center gap-2 cursor-pointer">
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    Needs Revision
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Priority Level */}
                            <div>
                              <Label className="text-sm font-medium">Priority</Label>
                              <Select value={feedbackPriority} onValueChange={(value) => setFeedbackPriority(value as 'low' | 'medium' | 'high')}>
                                <SelectTrigger className="mt-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">
                                    <span className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                      Low Priority
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="medium">
                                    <span className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                      Medium Priority
                                    </span>
                                  </SelectItem>
                                  <SelectItem value="high">
                                    <span className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                      High Priority
                                    </span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Feedback Message */}
                            <div>
                              <Label className="text-sm font-medium">
                                {feedbackStatus === 'approved' ? 'Comments (Optional)' : 'Revision Notes'}
                              </Label>
                              <Textarea
                                value={feedbackMessage}
                                onChange={(e) => setFeedbackMessage(e.target.value)}
                                placeholder={feedbackStatus === 'approved' ? 
                                  "Any additional comments..." : 
                                  "Please describe what changes you'd like to see..."}
                                className="mt-2 min-h-[100px]"
                              />
                            </div>

                            {/* Submit Feedback Button */}
                            <Button 
                              onClick={() => {
                                setSelectedFile(showFilePreview)
                                handleFeedbackSubmit()
                                setShowFilePreview(null)
                              }}
                              className="w-full"
                              disabled={feedbackStatus === 'needs-revision' && !feedbackMessage.trim()}
                            >
                              {feedbackStatus === 'approved' ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve File
                                </>
                              ) : (
                                <>
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Submit Feedback
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <DialogFooter className="flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = showFilePreview.url
                    link.download = showFilePreview.name
                    link.click()
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setShowFilePreview(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Task Modal */}
      <CreateTaskModal
        open={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onTaskCreated={handleTaskCreated}
        user={user}
        availableClients={availableClients}
        projects={projects}
        users={users}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        open={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onProjectCreated={handleProjectCreated}
        user={user}
        availableClients={availableClients}
      />

      {/* Delete Task Confirmation */}
      <AlertDialog open={!!deleteTaskDialog} onOpenChange={() => setDeleteTaskDialog(null)}>
        <AlertDialogContent className="glass-modal">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTaskDialog?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTaskDialog && handleDeleteTask(deleteTaskDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Project Confirmation */}
      <AlertDialog open={!!deleteProjectDialog} onOpenChange={() => setDeleteProjectDialog(null)}>
        <AlertDialogContent className="glass-modal">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProjectDialog?.name}"? This will also delete all tasks in this project. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProjectDialog && handleDeleteProject(deleteProjectDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )           
}