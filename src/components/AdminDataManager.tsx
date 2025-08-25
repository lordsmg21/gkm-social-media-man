// src/components/ClientDataDialog.tsx
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Users, Plus, Trash2, Search } from 'lucide-react'

type Status = 'in-progress' | 'review' | 'to-do' | 'completed'

interface Client {
  id: string
  name: string
  email: string
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

  // chart data
  const [chartData, setChartData] = useState<ChartData[]>([])
  const handleAddChartDataPoint = () => {
    if (!selectedClient) {
      toast.error('Please select a client first')
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
    toast.success('New chart data point added!')
  }
  const handleUpdateChartData = (
    index: number,
    field: keyof Omit<
      ChartData,
      'name' | 'date' | 'clientId'
    >,
    value: number
  ) => {
    const updated = [...chartData]
    updated[index] = { ...updated[index], [field]: value }
    setChartData(updated)
  }

  // projecten
  const [projectsData, setProjectsData] = useState<RecentProject[]>([])
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
      toast.error('Please select a client and enter project name')
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
    toast.success('Project added successfully!')
  }

  const handleDeleteProject = (projectId: string) => {
    setProjectsData((prev) => prev.filter((p) => p.id !== projectId))
    toast.success('Project deleted successfully!')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                    <Users className="w-5 h-5 text-primary" />
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
            <Tabs defaultValue="charts" className="space-y-6">
              <TabsList>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              {/* Charts Management */}
              <TabsContent value="charts" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Chart Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chartData.map((d, index) => (
                        <Card key={index}>
                          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
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
                        <Plus className="w-4 h-4 mr-2" />
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
                            <Trash2 className="w-4 h-4" />
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
