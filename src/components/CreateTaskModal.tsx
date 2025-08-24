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
import { X, Plus } from 'lucide-react'
import { User } from '../App'

interface TaskFile {
  id: string
  name: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
  url: string
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

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: (task: Task) => void
  users: User[]
  currentUser: User
}

export function CreateTaskModal({ open, onOpenChange, onTaskCreated, users, currentUser }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    platform: 'facebook' as 'facebook' | 'instagram' | 'both',
    priority: 'medium' as 'low' | 'medium' | 'high',
    description: '',
    deadline: '',
    assignedTo: [currentUser.id] // Default assign to current user
  })

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      platform: 'facebook',
      priority: 'medium',
      description: '',
      deadline: '',
      assignedTo: [currentUser.id]
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    if (!formData.client.trim()) {
      toast.error('Please enter a client name')
      return
    }

    if (!formData.deadline) {
      toast.error('Please set a deadline')
      return
    }

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title.trim(),
      client: formData.client.trim(),
      platform: formData.platform,
      status: 'to-do',
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      deadline: formData.deadline,
      progress: 0,
      description: formData.description.trim() || '',
      tags: [],
      files: []
    }

    onTaskCreated(newTask)
    toast.success(`Task "${newTask.title}" created successfully`)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-modal mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                placeholder="e.g., Bakkerij de Korenbloem"
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
              />
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

          <div className="flex justify-end gap-3 pt-4 border-t">
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