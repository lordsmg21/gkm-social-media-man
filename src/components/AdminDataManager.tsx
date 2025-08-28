import React, { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Search, User, Plus, Trash2, Target } from 'lucide-react'

type Status = 'in-progress' | 'review' | 'to-do' | 'completed'

interface Client {
  id: string
  name: string
  email: string
}

interface KPIData {
  revenue: number
  revenueGrowth: number
  projects: number
  projectsGrowth: number
  teamMembers: number
  conversations: number
  conversationsGrowth: number
  facebookReach: number
  facebookReachGrowth: number
  instagramEngagement: number
  instagramEngagementGrowth: number
  messagesReceived: number
  messagesReceivedGrowth: number
  growthRate: number
  clientId?: string
}

interface ChartData {
  name: string
  revenue: number
  conversations: number
  messagesReceived: number
  facebookReach: number
  instagramEngagement: number
  date: string
  clientId?: string
}

interface RecentProject {
  id: string
  name: string
  client: string
  status: Status
  progress: number
  deadline: string
}

type Props = {
  open: boolean
  onClose: () => void
}

export function AdminDataManager({ open, onClose }: Props) {
  const [systemUsers] = useKV<{ id: string; name: string; email: string; role: 'admin' | 'client' }[]>('system-users', [
    { id: '1', name: 'Alex van der Berg', email: 'alex@gkm.nl', role: 'admin' },
    { id: '2', name: 'Sarah de Jong', email: 'sarah@gkm.nl', role: 'admin' },
    { id: '3', name: 'Mike Visser', email: 'mike@client.nl', role: 'client' },
    { id: '4', name: 'Lisa Bakker', email: 'lisa@gkm.nl', role: 'admin' },
    { id: '5', name: 'Jan Peters', email: 'jan@restaurant.nl', role: 'client' },
    { id: '6', name: 'Emma de Vries', email: 'emma@boutique.nl', role: 'client' },
    { id: '7', name: 'Tom Hendriks', email: 'tom@cafe.nl', role: 'client' },
    { id: '8', name: 'Sophie Jansen', email: 'sophie@salon.nl', role: 'client' }
  ])
  
  // Filter to get only clients
  const clients = systemUsers.filter(user => user.role === 'client').map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }))

  const [selectedClient, setSelectedClient] = useState('')
  const [searchClient, setSearchClient] = useState('')
  const [kpiData, setKpiData] = useKV<KPIData[]>('client-kpi-data', [])
  const [chartData, setChartData] = useKV<ChartData[]>('client-chart-data', [])
  const [projectsData, setProjectsData] = useKV<RecentProject[]>('client-projects-data', [])

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchClient.toLowerCase()) ||
      client.email.toLowerCase().includes(searchClient.toLowerCase())
    )
  }, [clients, searchClient])

  const selectedClientData = clients.find((c) => c.id === selectedClient)

  // Get client-specific data
  const clientKpiData = kpiData.find((data) => data.clientId === selectedClient) || {
    revenue: 0,
    revenueGrowth: 0,
    projects: 0,
    projectsGrowth: 0,
    teamMembers: 0,
    conversations: 0,
    conversationsGrowth: 0,
    facebookReach: 0,
    facebookReachGrowth: 0,
    instagramEngagement: 0,
    instagramEngagementGrowth: 0,
    messagesReceived: 0,
    messagesReceivedGrowth: 0,
    growthRate: 0,
    clientId: selectedClient,
  }

  const updateKpiData = (field: keyof KPIData, value: number) => {
    const existingIndex = kpiData.findIndex((data) => data.clientId === selectedClient)
    if (existingIndex >= 0) {
      const updated = [...kpiData]
      updated[existingIndex] = { ...updated[existingIndex], [field]: value }
      setKpiData(updated)
    } else {
      setKpiData([...kpiData, { ...clientKpiData, [field]: value, clientId: selectedClient }])
    }
  }

  // Chart data handlers
  const handleAddChartDataPoint = () => {
    if (!selectedClient) {
      alert('Please select a client first')
      return
    }
    const newDataPoint: ChartData = {
      name: `Week ${chartData.filter(d => d.clientId === selectedClient).length + 1}`,
      revenue: 0,
      conversations: 0,
      messagesReceived: 0,
      facebookReach: 0,
      instagramEngagement: 0,
      date: new Date().toISOString().split('T')[0],
      clientId: selectedClient,
    }
    setChartData([...chartData, newDataPoint])
  }

  const handleUpdateChartData = (
    index: number,
    field: keyof Omit<ChartData, 'name' | 'date' | 'clientId'>,
    value: number
  ) => {
    const updated = [...chartData]
    updated[index] = { ...updated[index], [field]: value }
    setChartData(updated)
  }

  // Project management
  const [newProject, setNewProject] = useState<{
    name: string
    status: Status
    progress: number
    deadline: string
  }>({
    name: '',
    status: 'to-do',
    progress: 0,
    deadline: '',
  })

  const handleAddProject = () => {
    if (!selectedClient || !newProject.name) {
      alert('Please select a client and enter project name')
      return
    }
    const project: RecentProject = {
      id: Date.now().toString(),
      name: newProject.name,
      client: clients.find((c) => c.id === selectedClient)?.name || '',
      status: newProject.status,
      progress: newProject.progress,
      deadline: newProject.deadline,
    }
    setProjectsData([...projectsData, project])
    setNewProject({ name: '', status: 'to-do', progress: 0, deadline: '' })
  }

  const handleDeleteProject = (projectId: string) => {
    setProjectsData(projectsData.filter((p) => p.id !== projectId))
  }

  const clientChartData = chartData.filter((d) => d.clientId === selectedClient)
  const clientProjects = projectsData.filter((p) => p.client === selectedClientData?.name)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-4xl max-h-[90vh] overflow-y-auto border-primary/20">
        <DialogHeader className="pb-6">
          <DialogTitle className="font-heading text-2xl text-foreground">
            Manage Client Dashboard Data
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add and update KPI data, chart metrics, and projects for your clients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Select Client</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="pl-10 glass-card border-border/50 focus:border-primary/50"
                />
              </div>
            </div>

            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="glass-card border-border/50 focus:border-primary/50">
                <SelectValue placeholder="Choose a client to manage data for..." />
              </SelectTrigger>
              <SelectContent className="glass-modal border-border/50">
                {filteredClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{client.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({client.email})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClient && selectedClientData && (
            <Card className="glass-card border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedClientData.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedClientData.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedClient && (
            <Tabs defaultValue="kpi" className="w-full">
              <TabsList className="glass-card border-border/30 grid w-full grid-cols-3">
                <TabsTrigger value="kpi" className="font-medium">
                  KPI Data
                </TabsTrigger>
                <TabsTrigger value="charts" className="font-medium">
                  Chart Data
                </TabsTrigger>
                <TabsTrigger value="projects" className="font-medium">
                  Projects
                </TabsTrigger>
              </TabsList>

              {/* KPI Management */}
              <TabsContent value="kpi" className="space-y-6">
                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">KPI Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Revenue ($)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.revenue || ''}
                          onChange={(e) => updateKpiData('revenue', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Revenue Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.revenueGrowth || ''}
                          onChange={(e) => updateKpiData('revenueGrowth', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Active Projects</Label>
                        <Input
                          type="number"
                          value={clientKpiData.projects || ''}
                          onChange={(e) => updateKpiData('projects', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Started Conversations</Label>
                        <Input
                          type="number"
                          value={clientKpiData.conversations || ''}
                          onChange={(e) => updateKpiData('conversations', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Facebook Reach</Label>
                        <Input
                          type="number"
                          value={clientKpiData.facebookReach || ''}
                          onChange={(e) => updateKpiData('facebookReach', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Instagram Engagement (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.instagramEngagement || ''}
                          onChange={(e) => updateKpiData('instagramEngagement', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chart Data Management */}
              <TabsContent value="charts" className="space-y-6">
                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Chart Data Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clientChartData.map((data, index) => (
                        <Card key={index} className="glass-card border-border/20">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <Label className="text-xs text-muted-foreground">Revenue</Label>
                                <Input
                                  type="number"
                                  value={data.revenue}
                                  onChange={(e) =>
                                    handleUpdateChartData(
                                      chartData.findIndex(d => d === data),
                                      'revenue',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="glass-card border-border/50 focus:border-primary/50"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Conversations</Label>
                                <Input
                                  type="number"
                                  value={data.conversations}
                                  onChange={(e) =>
                                    handleUpdateChartData(
                                      chartData.findIndex(d => d === data),
                                      'conversations',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="glass-card border-border/50 focus:border-primary/50"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">Instagram Engagement</Label>
                                <Input
                                  type="number"
                                  value={data.instagramEngagement}
                                  onChange={(e) =>
                                    handleUpdateChartData(
                                      chartData.findIndex(d => d === data),
                                      'instagramEngagement',
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="glass-card border-border/50 focus:border-primary/50"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {clientChartData.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No chart data points yet. Add your first data point to get started.</p>
                        </div>
                      )}

                      <div className="flex justify-center">
                        <Button
                          onClick={handleAddChartDataPoint}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Data Point
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Projects Management */}
              <TabsContent value="projects" className="space-y-6">
                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Add New Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Project Name</Label>
                        <Input
                          value={newProject.name}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, name: e.target.value }))
                          }
                          placeholder="Enter project name"
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Status</Label>
                        <Select
                          value={newProject.status}
                          onValueChange={(value: Status) =>
                            setNewProject((p) => ({ ...p, status: value }))
                          }
                        >
                          <SelectTrigger className="glass-card border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-modal border-border/50">
                            <SelectItem value="to-do">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Progress (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={newProject.progress}
                          onChange={(e) =>
                            setNewProject((p) => ({
                              ...p,
                              progress: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Deadline</Label>
                        <Input
                          type="date"
                          value={newProject.deadline}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, deadline: e.target.value }))
                          }
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={handleAddProject}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Existing Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clientProjects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-3 glass-card border-border/20 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-foreground">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Status: {project.status} • Progress: {project.progress}% • 
                              Deadline: {project.deadline || 'Not set'}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {clientProjects.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No projects yet. Add your first project to get started.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}