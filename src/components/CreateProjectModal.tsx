import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FolderPlus, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { User } from '../App'

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

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onProjectCreated: (project: Project) => void
  user: User
  availableClients: User[]
}

export default function CreateProjectModal({ 
  open, 
  onClose, 
  onProjectCreated, 
  user, 
  availableClients 
}: CreateProjectModalProps) {
  // Only allow admins to create projects
  if (user.role !== 'admin') {
    return null
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trajectory: 'social-media' as Project['trajectory'],
    budget: 0,
    clientId: ''
  })

  const trajectoryOptions = [
    { 
      value: 'social-media', 
      label: '📱 Social Media Marketing',
      description: 'Content creation, community management, and social advertising'
    },
    { 
      value: 'website', 
      label: '💻 Website Development',
      description: 'Website design, development, and maintenance'
    },
    { 
      value: 'branding', 
      label: '🎨 Branding & Design',
      description: 'Logo design, brand identity, and visual materials'
    },
    { 
      value: 'advertising', 
      label: '📢 Digital Advertising',
      description: 'Paid advertising campaigns across multiple platforms'
    },
    { 
      value: 'full-campaign', 
      label: '🚀 Full Campaign',
      description: 'Comprehensive marketing campaign across all channels'
    }
  ]

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trajectory: 'social-media',
      budget: 0,
      clientId: ''
    })
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const handleSubmit = () => {
    // Double-check admin role
    if (user.role !== 'admin') {
      toast.error('Only admins can create projects')
      return
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a project name')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a project description')
      return
    }

    if (!formData.clientId) {
      toast.error('Please select a client')
      return
    }

    if (formData.budget <= 0) {
      toast.error('Please enter a valid budget')
      return
    }

    const selectedClient = availableClients.find(c => c.id === formData.clientId)
    if (!selectedClient) {
      toast.error('Selected client not found')
      return
    }

    const newProject: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      trajectory: formData.trajectory,
      budget: formData.budget,
      clientId: formData.clientId,
      clientName: selectedClient.name,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    onProjectCreated(newProject)
    handleClose()
    toast.success('Project created successfully!')
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl glass-modal mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="project-name">Project Name *</Label>
              <Input
                id="project-name"
                placeholder="e.g., Restaurant X - Summer Campaign 2024"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the project goals, scope, and deliverables..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Client *</Label>
              <Select
                value={formData.clientId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {availableClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex items-center gap-3">
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
            </div>

            <div>
              <Label>Budget *</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="5000"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label>Project Trajectory *</Label>
              <Select 
                value={formData.trajectory} 
                onValueChange={(value: Project['trajectory']) => setFormData(prev => ({ ...prev, trajectory: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {trajectoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="py-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <FolderPlus className="w-4 h-4" />
              Create Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}