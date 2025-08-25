import React, { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Search, Plus, Trash2, User, TrendingUp, BarChart3, Target } from 'lucide-react'

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
  messagesGrowth: number
  growthRate: number
  projectBudget: number
  budgetUsed: number
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
  onClose: (open: boolean) => void
  clients: Client[]
}

export default function ClientDataDialog({ open, onClose, clients }: Props) {
  // Client selection
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [searchClient, setSearchClient] = useState<string>('')

  const filteredClients = useMemo(() => {
    const q = searchClient.toLowerCase()
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    )
  }, [clients, searchClient])

  const selectedClientData = clients.find((c) => c.id === selectedClient)

  // Get client-specific KPI data with persistent storage
  const [clientKpiData, setClientKpiData] = useKV<KPIData>(`client-kpi-${selectedClient}`, {
    revenue: 0,
    revenueGrowth: 0,
    projects: 0,
    projectsGrowth: 0,
    teamMembers: 1,
    conversations: 0,
    conversationsGrowth: 0,
    facebookReach: 0,
    facebookReachGrowth: 0,
    instagramEngagement: 0,
    instagramEngagementGrowth: 0,
    messagesReceived: 0,
    messagesGrowth: 0,
    growthRate: 0,
    projectBudget: 0,
    budgetUsed: 0,
    clientId: selectedClient
  })

  // Get client-specific chart data with persistent storage
  const [chartData, setChartData] = useKV<ChartData[]>(`client-chart-${selectedClient}`, [])
  
  // Get client-specific projects with persistent storage
  const [projectsData, setProjectsData] = useKV<RecentProject[]>(`client-projects-${selectedClient}`, [])

  // Handle KPI Data Updates
  const updateKpiData = (field: keyof KPIData, value: number) => {
    setClientKpiData(current => ({ ...current, [field]: value }))
  }

  // Chart data handlers
  const handleAddChartDataPoint = () => {
    if (!selectedClient) {
      alert('Please select a client first')
      return
    }
    const newDataPoint: ChartData = {
      name: `Week ${chartData.length + 1}`,
      revenue: 0,
      conversations: 0,
      messagesReceived: 0,
      facebookReach: 0,
      instagramEngagement: 0,
      date: new Date().toISOString().split('T')[0],
      clientId: selectedClient,
    }
    setChartData((prev) => [...prev, newDataPoint])
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
    setProjectsData((prev) => [...prev, project])
    setNewProject({ name: '', status: 'to-do', progress: 0, deadline: '' })
  }

  const handleDeleteProject = (projectId: string) => {
    setProjectsData((prev) => prev.filter((p) => p.id !== projectId))
  }

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
            <Tabs defaultValue="kpi" className="space-y-6">
              <TabsList className="glass-card bg-muted/30 border-border/50">
                <TabsTrigger value="kpi" className="data-[state=active]:glass-modal data-[state=active]:border-primary/20">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  KPI Data
                </TabsTrigger>
                <TabsTrigger value="charts" className="data-[state=active]:glass-modal data-[state=active]:border-primary/20">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Charts
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:glass-modal data-[state=active]:border-primary/20">
                  <Target className="w-4 h-4 mr-2" />
                  Projects
                </TabsTrigger>
              </TabsList>

              {/* KPI Data Management */}
              <TabsContent value="kpi" className="space-y-4">
                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Client KPI Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Budget Allocated ($)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.revenue}
                          onChange={(e) => updateKpiData('revenue', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Revenue Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.revenueGrowth}
                          onChange={(e) => updateKpiData('revenueGrowth', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Active Projects</Label>
                        <Input
                          type="number"
                          value={clientKpiData.projects}
                          onChange={(e) => updateKpiData('projects', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Started Conversations</Label>
                        <Input
                          type="number"
                          value={clientKpiData.conversations}
                          onChange={(e) => updateKpiData('conversations', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Conversations Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.conversationsGrowth}
                          onChange={(e) => updateKpiData('conversationsGrowth', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Facebook Reach</Label>
                        <Input
                          type="number"
                          value={clientKpiData.facebookReach}
                          onChange={(e) => updateKpiData('facebookReach', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Facebook Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.facebookReachGrowth}
                          onChange={(e) => updateKpiData('facebookReachGrowth', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Instagram Engagement (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.instagramEngagement}
                          onChange={(e) => updateKpiData('instagramEngagement', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Instagram Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.instagramEngagementGrowth}
                          onChange={(e) => updateKpiData('instagramEngagementGrowth', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Messages Received</Label>
                        <Input
                          type="number"
                          value={clientKpiData.messagesReceived}
                          onChange={(e) => updateKpiData('messagesReceived', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Messages Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.messagesGrowth}
                          onChange={(e) => updateKpiData('messagesGrowth', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Overall Growth Rate (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.growthRate}
                          onChange={(e) => updateKpiData('growthRate', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Project Budget ($)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.projectBudget}
                          onChange={(e) => updateKpiData('projectBudget', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Budget Used ($)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.budgetUsed}
                          onChange={(e) => updateKpiData('budgetUsed', parseFloat(e.target.value) || 0)}
                          className="glass-card border-border/50 focus:border-primary/50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Charts Management */}
              <TabsContent value="charts" className="space-y-4">
                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Chart Data Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {chartData.map((d, index) => (
                        <Card key={index} className="glass-card bg-muted/10 border-border/20">
                          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                            <div>
                              <Label className="text-sm font-medium">Revenue</Label>
                              <Input
                                type="number"
                                value={d.revenue}
                                onChange={(e) =>
                                  handleUpdateChartData(
                                    index,
                                    'revenue',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="glass-card border-border/50 focus:border-primary/50"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Conversations</Label>
                              <Input
                                type="number"
                                value={d.conversations}
                                onChange={(e) =>
                                  handleUpdateChartData(
                                    index,
                                    'conversations',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="glass-card border-border/50 focus:border-primary/50"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Messages Received</Label>
                              <Input
                                type="number"
                                value={d.messagesReceived}
                                onChange={(e) =>
                                  handleUpdateChartData(
                                    index,
                                    'messagesReceived',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="glass-card border-border/50 focus:border-primary/50"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Facebook Reach</Label>
                              <Input
                                type="number"
                                value={d.facebookReach}
                                onChange={(e) =>
                                  handleUpdateChartData(
                                    index,
                                    'facebookReach',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="glass-card border-border/50 focus:border-primary/50"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Instagram Engagement</Label>
                              <Input
                                type="number"
                                value={d.instagramEngagement}
                                onChange={(e) =>
                                  handleUpdateChartData(
                                    index,
                                    'instagramEngagement',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="glass-card border-border/50 focus:border-primary/50"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {chartData.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No chart data points yet. Add some to get started.</p>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button 
                          onClick={handleAddChartDataPoint}
                          className="glass-card bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md border-primary/30 text-foreground hover:from-primary/30 hover:to-accent/30 hover:border-primary/50 hover:text-primary transition-all duration-300"
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Project Name</Label>
                        <Input
                          value={newProject.name}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, name: e.target.value }))
                          }
                          placeholder="Enter project name..."
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
                          <SelectTrigger className="glass-card border-border/50 focus:border-primary/50">
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
                        className="glass-card bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md border-primary/30 text-foreground hover:from-primary/30 hover:to-accent/30 hover:border-primary/50 hover:text-primary transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border/30">
                  <CardHeader>
                    <CardTitle className="text-foreground">Current Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {projectsData.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-4 glass-card bg-muted/10 border-border/20 rounded-lg hover:bg-muted/20 transition-all duration-200"
                        >
                          <div>
                            <h4 className="font-medium text-foreground">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Status: {project.status} • Progress: {project.progress}% • Deadline:{' '}
                              {project.deadline}
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
                      {projectsData.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No projects added yet.</p>
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