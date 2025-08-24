import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  AlertCircle
} from 'lucide-react'
import { User } from '../App'
import { useKV } from '@github/spark/hooks'

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
}

interface ProjectsProps {
  user: User
}

export function Projects({ user }: ProjectsProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

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

  const [tasks] = useKV<Task[]>('project-tasks', [
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
      tags: ['stories', 'food', 'artisan']
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
      tags: ['ads', 'restaurant', 'promotion']
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
      tags: ['strategy', 'fitness', 'planning']
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
      tags: ['launch', 'tech', 'saas']
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
      tags: ['holiday', 'fashion', 'promotion']
    }
  ])

  const [users] = useKV('all-users', [
    { id: '1', name: 'Alex van der Berg', role: 'admin', avatar: '' },
    { id: '2', name: 'Sarah de Jong', role: 'admin', avatar: '' },
    { id: '3', name: 'Mike Visser', role: 'admin', avatar: '' },
    { id: '4', name: 'Lisa Bakker', role: 'admin', avatar: '' }
  ])

  // Filter tasks based on user role
  const visibleTasks = user.role === 'admin' ? tasks : tasks.filter(task => 
    task.assignedTo.includes(user.id) || task.client === 'My Client' // Simplified client filtering
  )

  const getTasksByStatus = (status: string) => {
    return visibleTasks.filter(task => task.status === status)
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
    return userIds.map(id => users.find(u => u.id === id)).filter(Boolean)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">My Projects</h1>
          <p className="text-muted-foreground">
            Manage your social media projects and track progress
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Team Chat
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                New Task
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Project Board */}
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-6 pb-4">
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.id)
              
              return (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                    <h3 className="font-heading font-semibold text-foreground">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 min-h-[400px]">
                    {columnTasks.map((task) => {
                      const assignedUsers = getAssignedUsers(task.assignedTo)
                      const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed'
                      
                      return (
                        <Card 
                          key={task.id} 
                          className="glass-card cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                          onClick={() => {
                            setSelectedTask(task)
                            setShowTaskModal(true)
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getPlatformIcon(task.platform)}</span>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                              </div>
                              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <h4 className="font-medium text-sm text-foreground mb-2 line-clamp-2">
                              {task.title}
                            </h4>
                            
                            <p className="text-xs text-muted-foreground mb-3">
                              {task.client}
                            </p>
                            
                            {task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {task.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                                {task.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs px-2 py-0">
                                    +{task.tags.length - 3}
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
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs">
                                  <Clock className="w-3 h-3" />
                                  <span className={`${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                                    {formatDeadline(task.deadline)}
                                  </span>
                                  {isOverdue && <AlertCircle className="w-3 h-3 text-red-500" />}
                                </div>
                                
                                <div className="flex -space-x-1">
                                  {assignedUsers.slice(0, 3).map((assignedUser) => (
                                    <Avatar key={assignedUser.id} className="w-6 h-6 border-2 border-background">
                                      <AvatarImage src={assignedUser.avatar} />
                                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                        {assignedUser.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {assignedUsers.length > 3 && (
                                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                      <span className="text-xs font-medium">+{assignedUsers.length - 3}</span>
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
                      <Card className="glass-card border-dashed border-2 cursor-pointer hover:bg-muted/20 transition-colors">
                        <CardContent className="p-4 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <Plus className="w-6 h-6 mx-auto mb-2" />
                            <p className="text-sm">Add Task</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        
        {/* Scroll buttons */}
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Team Chat Section (Admin only) */}
      {user.role === 'admin' && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Team Chat
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {users.slice(0, 4).map((teamMember) => (
                  <div key={teamMember.id} className="relative">
                    <Avatar className="w-6 h-6 border-2 border-background">
                      <AvatarImage src={teamMember.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {teamMember.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background"></div>
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{users.length} online</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Target className="w-4 h-4 mr-2" />
                #general
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                #projects
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <AlertCircle className="w-4 h-4 mr-2" />
                #urgent
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Detail Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent className="max-w-2xl glass-modal">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              {selectedTask?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
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
                <p className="mt-1">{selectedTask.description}</p>
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
                <div className="flex gap-2 mt-2">
                  {getAssignedUsers(selectedTask.assignedTo).map((assignedUser) => (
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
    </div>
  )
}

export { Projects }