import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import type { User } from '../../types'

interface Project {
  id: string
  name: string
  description: string
  clientId: string
  clientName: string
  budget: number
  status: 'to-do' | 'in-progress' | 'review' | 'completed'
  createdBy: string
  createdAt: string
  trajectory: 'branding' | 'social-media' | 'website' | 'marketing'
}

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
  onProjectCreated?: (project: Project) => void
  user: User
  availableClients: Array<{
    id: string
    name: string
    email: string
  }>
}

export default function CreateProjectModal({ 
  open, 
  onClose, 
  onProjectCreated, 
  user, 
  availableClients 
}: CreateProjectModalProps) {
  const [projects, setProjects] = useKV<Project[]>('projects', [])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    budget: '',
    trajectory: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    if (!formData.clientId) {
      toast.error('Please select a client')
      return
    }

    if (!formData.trajectory) {
      toast.error('Please select a trajectory')
      return
    }

    setIsSubmitting(true)

    try {
      const selectedClient = availableClients.find(c => c.id === formData.clientId)
      
      const newProject: Project = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        clientId: formData.clientId,
        clientName: selectedClient?.name || 'Unknown Client',
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        status: 'to-do',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        trajectory: formData.trajectory as Project['trajectory']
      }

      const updatedProjects = [...projects, newProject]
      await setProjects(updatedProjects)

      if (onProjectCreated) {
        onProjectCreated(newProject)
      }

      toast.success('Project created successfully!')
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        clientId: '',
        budget: '',
        trajectory: ''
      })
      
      onClose()
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      clientId: '',
      budget: '',
      trajectory: ''
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-modal max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name..."
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter project description..."
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {user.role === 'admin' && (
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client..." />
                </SelectTrigger>
                <SelectContent>
                  {availableClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Trajectory</Label>
            <Select
              value={formData.trajectory}
              onValueChange={(value) => setFormData(prev => ({ ...prev, trajectory: value }))}
              disabled={isSubmitting}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trajectory..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branding">Branding</SelectItem>
                <SelectItem value="social-media">Social Media</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-budget">Budget ($)</Label>
            <Input
              id="project-budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="Enter budget amount..."
              disabled={isSubmitting}
              min="0"
              step="0.01"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.clientId || !formData.trajectory}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}