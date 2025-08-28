import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { X, Plus, Upload, FileText, Image as ImageIcon, File, Trash2 } from 'lucide-react'
import { User } from '../types'
import { useKV } from '@github/spark/hooks'

interface TaskFile {
  id: string
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
  url: string
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
  projectId?: string
}

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  onTaskCreated: (task: Task) => void
  user: User
  availableClients: User[]
  projects: Project[]
  users: User[]
}

export function CreateTaskModal({ open, onClose, onTaskCreated, user, availableClients, projects, users }: CreateTaskModalProps) {
  // Only allow admins to create tasks
  if (user.role !== 'admin') {
    return null
  }

  const [formData, setFormData] = useState({
    title: '',
    client: 'placeholder',
    platform: 'facebook' as 'facebook' | 'instagram' | 'both',
    priority: 'medium' as 'low' | 'medium' | 'high',
    description: '',
    deadline: '',
    assignedTo: [user.id], // Default assign to current user
    projectId: 'no-project'
  })

  const [uploadedFiles, setUploadedFiles] = useState<TaskFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const resetForm = () => {
    setFormData({
      title: '',
      client: 'placeholder',
      platform: 'facebook',
      priority: 'medium',
      description: '',
      deadline: '',
      assignedTo: [user.id],
      projectId: 'no-project'
    })
    setUploadedFiles([])
    setTags([])
    setTagInput('')
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const handleSubmit = () => {
    // Double-check admin role
    if (user.role !== 'admin') {
      toast.error('Only admins can create tasks')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    if (!formData.client.trim() || formData.client === 'placeholder') {
      toast.error('Please select a client')
      return
    }

    if (!formData.deadline) {
      toast.error('Please set a deadline')
      return
    }

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title.trim(),
      client: availableClients.find(c => c.id === formData.client)?.name || formData.client,
      platform: formData.platform,
      status: 'to-do',
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      deadline: formData.deadline,
      progress: 0,
      description: formData.description.trim() || '',
      tags: tags,
      files: uploadedFiles,
      projectId: formData.projectId === 'no-project' ? undefined : formData.projectId
    }

    onTaskCreated(newTask)
    toast.success(`Task "${newTask.title}" created successfully`)
    handleClose()
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      // Check file size (max 200MB)
      if (file.size > 200 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 200MB.`)
        return
      }

      // Create file URL for preview
      const fileUrl = URL.createObjectURL(file)

      const taskFile: TaskFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString(),
        url: fileUrl
      }

      setUploadedFiles(prev => [...prev, taskFile])
    })

    toast.success(`${files.length} file(s) uploaded successfully`)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />
    if (type === 'application/pdf') return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const handleTagAdd = () => {
    const newTag = tagInput.trim().toLowerCase()
    if (newTag && !tags.includes(newTag)) {
      setTags(prev => [...prev, newTag])
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTagAdd()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl glass-modal mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Instagram Story Campaign - Client Name"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="project">Project</Label>
              {projects && projects.length > 0 ? (
                <Select 
                  value={formData.projectId} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, projectId: value }))
                    // Auto-select client based on project
                    if (value !== 'no-project') {
                      const selectedProj = projects.find(p => p.id === value)
                      if (selectedProj) {
                        setFormData(prev => ({ ...prev, client: selectedProj.clientId }))
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-project">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        <div>
                          <div className="font-medium">No Project</div>
                          <div className="text-xs text-muted-foreground">Create as standalone task</div>
                        </div>
                      </div>
                    </SelectItem>
                    {projects.filter(p => p.status === 'active').map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-xs text-muted-foreground">{project.clientName}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  disabled
                  placeholder="No projects available"
                />
              )}
            </div>

            <div>
              <Label htmlFor="client">Client *</Label>
              {user.role === 'admin' ? (
                <Select value={formData.client} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, client: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      <div className="flex items-center gap-2 opacity-50">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        <div>
                          <div className="font-medium">Select a client...</div>
                          <div className="text-xs text-muted-foreground">Choose from available clients</div>
                        </div>
                      </div>
                    </SelectItem>
                    {availableClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-xs text-muted-foreground">{client.email}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="client"
                  placeholder="e.g., Bakkerij de Korenbloem"
                  value={formData.client}
                  onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Platform *</Label>
              <Select value={formData.platform} onValueChange={(value: 'facebook' | 'instagram' | 'both') => 
                setFormData(prev => ({ ...prev, platform: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">📘 Facebook</SelectItem>
                  <SelectItem value="instagram">📷 Instagram</SelectItem>
                  <SelectItem value="both">📱 Both Platforms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority *</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData(prev => ({ ...prev, priority: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low Priority</SelectItem>
                  <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                  <SelectItem value="high">🔴 High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task objectives and requirements..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Enter a tag (e.g., stories, food, promotion)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleTagAdd}
                  disabled={!tagInput.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs px-2 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => handleTagRemove(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Press Enter or click + to add tags. Click tags to remove them.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label>Assigned Team Members</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {users.filter(u => u.role === 'admin').map((user) => (
                <div 
                  key={user.id}
                  className={`p-2 rounded-lg border cursor-pointer transition-all ${
                    formData.assignedTo.includes(user.id)
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      assignedTo: prev.assignedTo.includes(user.id)
                        ? prev.assignedTo.filter(id => id !== user.id)
                        : [...prev.assignedTo, user.id]
                    }))
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {formData.assignedTo.includes(user.id) && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <X className="w-2 h-2 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <Label>Project Files</Label>
            <div 
              className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-primary/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or{' '}
                <label className="text-primary cursor-pointer hover:underline">
                  browse files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                </label>
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 200MB
              </p>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                      <div className="text-muted-foreground">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}