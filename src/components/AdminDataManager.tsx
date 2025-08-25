import React, { useMemo, useState } from 'react'

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

// Mock UI components
function Dialog({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div onClick={() => onOpenChange(false)} className="absolute inset-0" />
      <div className="relative">{children}</div>
    </div>
  )
}

function DialogContent({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}

function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-6">{children}</div>
}

function DialogTitle({ className, children }: { className?: string, children: React.ReactNode }) {
  return <h2 className={className}>{children}</h2>
}

function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>
}

function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}

function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={className}>{children}</div>
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}

function Tabs({ defaultValue, className, children }: { defaultValue: string, className?: string, children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  
  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab })
          : child
      )}
    </div>
  )
}

function TabsList({ children, activeTab, setActiveTab }: { children: React.ReactNode, activeTab?: string, setActiveTab?: (tab: string) => void }) {
  return (
    <div className="flex space-x-1 rounded-lg bg-muted p-1">
      {React.Children.map(children, child =>
        React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab })
          : child
      )}
    </div>
  )
}

function TabsTrigger({ value, children, activeTab, setActiveTab }: { value: string, children: React.ReactNode, activeTab?: string, setActiveTab?: (tab: string) => void }) {
  return (
    <button
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === value 
          ? 'bg-background text-foreground shadow-sm' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, className, children, activeTab }: { value: string, className?: string, children: React.ReactNode, activeTab?: string }) {
  if (activeTab !== value) return null
  return <div className={className}>{children}</div>
}

function Select({ value, onValueChange, children }: { value: string, onValueChange: (value: string) => void, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      {React.Children.map(children, child =>
        React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { value, onValueChange, isOpen, setIsOpen })
          : child
      )}
    </div>
  )
}

function SelectTrigger({ children, value, isOpen, setIsOpen }: { children: React.ReactNode, value?: string, isOpen?: boolean, setIsOpen?: (open: boolean) => void }) {
  return (
    <button
      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={() => setIsOpen?.(!isOpen)}
    >
      {children}
      <span>▼</span>
    </button>
  )
}

function SelectValue({ placeholder, value }: { placeholder?: string, value?: string }) {
  return <span>{value || placeholder}</span>
}

function SelectContent({ children, isOpen, onValueChange, setIsOpen }: { children: React.ReactNode, isOpen?: boolean, onValueChange?: (value: string) => void, setIsOpen?: (open: boolean) => void }) {
  if (!isOpen) return null
  
  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
      {React.Children.map(children, child =>
        React.isValidElement(child) 
          ? React.cloneElement(child as React.ReactElement<any>, { onValueChange, setIsOpen })
          : child
      )}
    </div>
  )
}

function SelectItem({ value, children, onValueChange, setIsOpen }: { value: string, children: React.ReactNode, onValueChange?: (value: string) => void, setIsOpen?: (open: boolean) => void }) {
  return (
    <div
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
      onClick={() => {
        onValueChange?.(value)
        setIsOpen?.(false)
      }}
    >
      {children}
    </div>
  )
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode, className?: string }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  )
}

function Button({ variant = "default", size = "default", className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost"
  size?: "default" | "sm"
  className?: string
  children: React.ReactNode
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  }
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function ClientDataDialog({ open, onClose, clients }: Props) {
  // client selectie
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

  // Get client-specific KPI data using mock state
  const [clientKpiData, setClientKpiData] = useState<KPIData>({
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

  // Get client-specific chart data
  const [chartData, setChartData] = useState<ChartData[]>([])
  
  // Get client-specific projects
  const [projectsData, setProjectsData] = useState<RecentProject[]>([])

  // Handle KPI Data Updates
  const updateKpiData = (field: keyof KPIData, value: number) => {
    setClientKpiData(current => ({ ...current, [field]: value }))
    alert('KPI data updated successfully!')
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
    alert('New chart data point added!')
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
    alert('Project added successfully!')
  }

  const handleDeleteProject = (projectId: string) => {
    setProjectsData((prev) => prev.filter((p) => p.id !== projectId))
    alert('Project deleted successfully!')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            Manage Client Dashboard Data
          </DialogTitle>
          <DialogDescription>
            Add and update KPI data, chart metrics, and projects for your clients.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-3">
            <Label>Select Client</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">🔍</span>
                <Input
                  placeholder="Search clients..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client to manage data for..." />
              </SelectTrigger>
              <SelectContent>
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
            <Card className="glass-card border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary">👥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedClientData.name}</h3>
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
              <TabsList>
                <TabsTrigger value="kpi">KPI Data</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              {/* KPI Data Management */}
              <TabsContent value="kpi" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Client KPI Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Monthly Revenue ($)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.revenue}
                          onChange={(e) => updateKpiData('revenue', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Revenue Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.revenueGrowth}
                          onChange={(e) => updateKpiData('revenueGrowth', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Active Projects</Label>
                        <Input
                          type="number"
                          value={clientKpiData.projects}
                          onChange={(e) => updateKpiData('projects', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Started Conversations</Label>
                        <Input
                          type="number"
                          value={clientKpiData.conversations}
                          onChange={(e) => updateKpiData('conversations', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Conversations Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.conversationsGrowth}
                          onChange={(e) => updateKpiData('conversationsGrowth', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Facebook Reach</Label>
                        <Input
                          type="number"
                          value={clientKpiData.facebookReach}
                          onChange={(e) => updateKpiData('facebookReach', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Facebook Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.facebookReachGrowth}
                          onChange={(e) => updateKpiData('facebookReachGrowth', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Instagram Engagement (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.instagramEngagement}
                          onChange={(e) => updateKpiData('instagramEngagement', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Instagram Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.instagramEngagementGrowth}
                          onChange={(e) => updateKpiData('instagramEngagementGrowth', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Messages Received</Label>
                        <Input
                          type="number"
                          value={clientKpiData.messagesReceived}
                          onChange={(e) => updateKpiData('messagesReceived', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Messages Growth (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.messagesGrowth}
                          onChange={(e) => updateKpiData('messagesGrowth', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Overall Growth Rate (%)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.growthRate}
                          onChange={(e) => updateKpiData('growthRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Project Budget ($)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.projectBudget}
                          onChange={(e) => updateKpiData('projectBudget', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Budget Used ($)</Label>
                        <Input
                          type="number"
                          value={clientKpiData.budgetUsed}
                          onChange={(e) => updateKpiData('budgetUsed', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Charts Management */}
              <TabsContent value="charts" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Chart Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chartData.map((d, index) => (
                        <Card key={index} className="border p-4">
                          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-0">
                            <div>
                              <Label>Revenue</Label>
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
                              />
                            </div>
                            <div>
                              <Label>Conversations</Label>
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
                              />
                            </div>
                            <div>
                              <Label>Messages Received</Label>
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
                              />
                            </div>
                            <div>
                              <Label>Facebook Reach</Label>
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
                              />
                            </div>
                            <div>
                              <Label>Instagram Engagement</Label>
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
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {chartData.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No chart data points yet. Add some to get started.
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button onClick={handleAddChartDataPoint}>
                          <span className="mr-2">➕</span>
                          Add Data Point
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Projects Management */}
              <TabsContent value="projects" className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Add New Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label>Project Name</Label>
                        <Input
                          value={newProject.name}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, name: e.target.value }))
                          }
                          placeholder="Enter project name..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Status</Label>
                        <Select
                          value={newProject.status}
                          onValueChange={(value: Status) =>
                            setNewProject((p) => ({ ...p, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to-do">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label>Progress (%)</Label>
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
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Deadline</Label>
                        <Input
                          type="date"
                          value={newProject.deadline}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, deadline: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleAddProject}>
                        <span className="mr-2">➕</span>
                        Add Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Current Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {projectsData.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Status: {project.status} • Progress: {project.progress}% • Deadline:{' '}
                              {project.deadline}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <span>🗑️</span>
                          </Button>
                        </div>
                      ))}
                      {projectsData.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No projects added yet.
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