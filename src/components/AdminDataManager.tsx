import React, { useMemo, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
type Status = 'in-progress' | 'review' | 'to-do
interface Client {

}

  revenueGrowth: n
  projectsGr
  conversation
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
  messagesReceived: numb
  instagramEngagemen
  clientId?: string

  id: string
 

}
type Props = {
  onClose: (open:
}
export default function Cl
  const [selectedClient

    const q = 
      (c) =>
 

  const selectedClientDat
  // Get cli
    revenue: 0
    projects: 0,
    teamMembers:
    conversationsG
    facebookReachG
 

    projectBud
    clientId: s

  const [chartData,
 

  const updateKpiData = (field: keyof KPIData, value: number) => {
  }
  // Chart data handlers
    if (!selectedClient) {

    const newDataPoint: ChartData = {
      revenue: 0,
      messagesReceived: 0,
      instag
      clientId: selectedClient,
    setChartData((prev) => [...prev, newD

    index: number,

    const updated = [...chartData]


  const [newProject, setNewProject] = useState<{
    status: Sta
    deadline: string
    name: '',
    progress: 0,
  })
  const handleAddProj
      alert('Please select 
    }
      id: Date.now().toStri
      client: clients.find(
      progress: newProject.progre
    }
    setNewProject({ na

    setProjectsData((

    <Dialog open={open} onOp
    

          <DialogDescription className="text-muted-foregrou
          </DialogDescription>

          {/* Client Selection */}
            <Label className="text-sm font-medium">Select Client</Label>

                <Input
                  value={searchClient}
                  className="pl-10 glass-card border-border/50 fo
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

                          type
                          onChange={(e) => updateKpiData('i
                        />
                      <div className="space-y-2">
                        <Input
                          
                          clas
                      </div>
                        <Label className="text-sm font-me
                        
                          onCh
                        />
                      <div className="space-y-2">
                        <I
                          valu
                         

                        <Label className=
                          type="number"
                          onChange={(e) => updateKpiData('grow
                        />
                      <div className="space-y-2">
                        <Input
                          value
                          className="glass-card border-border/50 focus:border-primary/50"
                      </div>
                        <Label className="text-sm font-medium">Budget Used ($)</Label>
                          type
                          onChange={(e)
                        />
                    </div>
                </Card>

              <TabsContent v
                  <CardHeader>
                  </CardHeader>
                    <div class
                        <Card key={inde
                            <div>
                              <Input
                                value={d.revenue}
                          
                            
                                  )
                                className="glass-card border-border/50 focus:border-pr
                            </
                              <Label cl
                                type="number"
                                onChange={(e) =>
                                    index,
                          
                            
                              />
                            <div>
                              
                                value={
                                  handleUpdateChartData(
                                    'messagesReceived',
                                  )
                          
                            
                              <Label className="t
                                type="number"
                              
                                    ind
                                    parseFloat(e.target.value) || 0
                                }
                              />
                          
                            
                                value={d.instagra
                                  handleUpdateChartData(
                              
                                  )
                                className="glass-card border-
                            </div>
                        </Card>

                        <div
                          <p>No chart data points
                      )}
                      <div cla
                          onClick={hand
                        >
                          Add Data Point
                      </div>
                  </CardCo
              </TabsContent>
              {/* Projects Management */}
                <Card className="glass-card border-border/30">
                    <CardTitle
                  <CardContent>
                      <div className="space-y-3">
                        <Input
                          onChange={(e) =>
                          
                          cl
                      </div>
                        <Label className="text-sm font-medium">Status</Label>
                          valu
                            setNewProje
                        >
                            <SelectValue />
                          <SelectContent className="glass-modal border-border/50">
                          
                            
                        </Select>
                      <div className="space-y-3">
                        <Input
                          min={0}
                          value={newProject.progress}
                            setNewProject((p) => ({
                              progress: parseFloat(e.target.value) || 0,
                          
                        />
                      <div className="space-y-3">
                        <Input
                          valu
                            setNewProje
                          className="glass-card border-border/
                      </div>
                    <div className="mt-6 flex justify-end">
                        on
                      >
                        Add Project
                    </div>
                </Card>
                <Card className="glass-
                    <CardTitle className="text-foreground"
                  <CardContent>
                      {projectsData.map((project) => (
                          
                        >
                            <h4 className="font-m
                              Status: {project.status} • Progress: {project.progress}% • 
                            </
                          <Button
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            <Trash2 className="w-4 h-4" />
                        </
                      {proje
                          <Target className="w-12
                        </div>
                    </div>
                </Card>
            </Tabs>
        </div>
    </Dialog>
}















































































































































































































































