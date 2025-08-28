import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Users,
  Target,
  Video,
  Phone,
  MapPin,
  Sync
} from 'lucide-react'
import { User } from '../types'
import { useKV } from '@github/spark/hooks'
import { useNotifications } from './NotificationCenter'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date | string
  end: Date | string
  type: 'deadline' | 'meeting' | 'publication' | 'campaign' | 'standup'
  client?: string
  attendees?: string[]
  location?: string
  isAllDay?: boolean
}

interface CalendarViewProps {
  user: User
}

export function CalendarView({ user }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isGoogleSyncing, setIsGoogleSyncing] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'meeting' as CalendarEvent['type'],
    date: '',
    time: '',
    client: '',
    location: ''
  })

  const { addNotification } = useNotifications()
  
  // Get clients for role-based filtering
  const [clients] = useKV<Array<{id: string, name: string, email: string}>>('users-clients', [])
  
  const [events, setEvents] = useKV<CalendarEvent[]>('calendar-events', [
    {
      id: '1',
      title: 'Client Meeting - De Korenbloem',
      description: 'Discuss Q1 social media strategy and new product launches',
      start: new Date('2024-01-22T10:00:00'),
      end: new Date('2024-01-22T11:00:00'),
      type: 'meeting',
      client: 'De Korenbloem',
      attendees: ['1', '2'],
      location: 'Office Conference Room'
    },
    {
      id: '2',
      title: 'Instagram Campaign Deadline',
      description: 'Final delivery for Bakkerij de Korenbloem Instagram campaign',
      start: new Date('2024-01-25T17:00:00'),
      end: new Date('2024-01-25T17:00:00'),
      type: 'deadline',
      client: 'De Korenbloem'
    },
    {
      id: '3',
      title: 'Facebook Ads Go Live',
      description: 'Restaurant Bella Vista dinner promotion campaign launch',
      start: new Date('2024-01-23T09:00:00'),
      end: new Date('2024-01-23T09:00:00'),
      type: 'publication',
      client: 'Bella Vista'
    },
    {
      id: '4',
      title: 'Team Standup',
      description: 'Weekly team sync and project updates',
      start: new Date('2024-01-22T09:00:00'),
      end: new Date('2024-01-22T09:30:00'),
      type: 'standup',
      attendees: ['1', '2', '3', '4']
    },
    {
      id: '5',
      title: 'Valentine\'s Campaign Launch',
      description: 'Fashion Boutique Valentine\'s Day promotion goes live',
      start: new Date('2024-01-30T08:00:00'),
      end: new Date('2024-01-30T08:00:00'),
      type: 'campaign',
      client: 'Fashion Boutique'
    }
  ])

  // Role-based event filtering
  const filteredEvents = useMemo(() => {
    if (user.role === 'admin') {
      // Admins see all events
      return events || []
    } else {
      // Clients see only their events (events where client matches their name or no client specified for team events)
      return (events || []).filter(event => 
        !event.client || event.client === user.name
      )
    }
  }, [events, user.role, user.name])

  // Filter upcoming events dynamically from filtered events
  const upcomingEvents = filteredEvents
    .filter(event => new Date(event.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3)

  const eventTypeColors = {
    deadline: 'bg-red-500 text-white',
    meeting: 'bg-blue-500 text-white', 
    publication: 'bg-green-500 text-white',
    campaign: 'bg-purple-500 text-white',
    standup: 'bg-orange-500 text-white'
  }

  const eventTypeIcons = {
    deadline: Target,
    meeting: Users,
    publication: CalendarIcon,
    campaign: Target,
    standup: Users
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }
    return days
  }

  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const formatEventTime = (start: Date | string, end: Date | string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    const startTime = startDate.toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    const endTime = endDate.toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    if (startDate.getTime() === endDate.getTime()) {
      return startTime
    }
    return `${startTime} - ${endTime}`
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()

  const handleGoogleCalendarSync = async () => {
    setIsGoogleSyncing(true)
    
    try {
      // Simulate Google Calendar sync process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would:
      // 1. Use Google Calendar API to fetch events
      // 2. Transform the events to your format
      // 3. Merge with existing events
      
      // For now, we'll add a sample synced event
      const syncedEvent: CalendarEvent = {
        id: `google-sync-${Date.now()}`,
        title: 'Synced from Google Calendar',
        description: 'This event was imported from your Google Calendar',
        start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
        type: 'meeting',
        client: user.role === 'client' ? user.name : undefined,
        attendees: [user.id]
      }
      
      setEvents(prev => [...(prev || []), syncedEvent])
      
      addNotification({
        type: 'success',
        title: 'Google Calendar Sync Complete',
        message: 'Successfully synced events from your Google Calendar',
        read: false,
        userId: user.id
      })
      
      toast.success('Google Calendar synced successfully!')
    } catch (error) {
      console.error('Google Calendar sync failed:', error)
      toast.error('Failed to sync with Google Calendar')
    } finally {
      setIsGoogleSyncing(false)
    }
  }

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date || !newEvent.time) {
      toast.error('Please fill in all required fields')
      return
    }

    const eventDate = new Date(`${newEvent.date}T${newEvent.time}`)
    const endDate = new Date(eventDate.getTime() + (60 * 60 * 1000)) // Default 1 hour duration

    const eventToAdd: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description || undefined,
      start: eventDate.toISOString(),
      end: endDate.toISOString(),
      type: newEvent.type,
      client: newEvent.client || (user.role === 'client' ? user.name : undefined),
      location: newEvent.location || undefined,
      attendees: [user.id]
    }

    setEvents(prev => [...(prev || []), eventToAdd])
    
    // Generate notification for new event
    addNotification({
      type: 'deadline',
      title: 'Event Created',
      message: `"${newEvent.title}" scheduled for ${eventDate.toLocaleDateString('nl-NL')} at ${eventDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`,
      read: false,
      userId: user.id,
      actionData: { eventId: eventToAdd.id }
    })
    
    setShowCreateModal(false)
    setNewEvent({
      title: '',
      description: '',
      type: 'meeting',
      date: '',
      time: '',
      client: '',
      location: ''
    })
    toast.success('Event created successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Calendar</h1>
          <p className="text-muted-foreground">
            {user.role === 'admin' 
              ? 'Manage deadlines, meetings, and campaign schedules for all clients' 
              : 'View your project deadlines, meetings, and scheduled content'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleGoogleCalendarSync}
            disabled={isGoogleSyncing}
          >
            <Sync className={`w-4 h-4 ${isGoogleSyncing ? 'animate-spin' : ''}`} />
            {isGoogleSyncing ? 'Syncing...' : 'Sync Google Calendar'}
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="font-heading font-semibold text-xl text-foreground min-w-[200px] text-center">
              {getMonthName(currentDate)}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="glass-card">
            <CardContent className="p-6">
              {/* Month View - Always shown now */}
              <div className="space-y-4">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2">
                    {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                      const dayEvents = getEventsForDay(day)
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                      const isToday = 
                        day.getDate() === today.getDate() &&
                        day.getMonth() === today.getMonth() &&
                        day.getFullYear() === today.getFullYear()
                      
                      return (
                        <div
                          key={index}
                          className={`min-h-[100px] p-2 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                            isCurrentMonth ? 'bg-background' : 'bg-muted/20'
                          } ${isToday ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => {
                            // Handle day click - open create event modal with selected date
                            const dateString = day.toISOString().split('T')[0]
                            setNewEvent(prev => ({ ...prev, date: dateString }))
                            setShowCreateModal(true)
                          }}
                        >
                          <div className={`text-sm font-medium mb-1 ${
                            isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                          } ${isToday ? 'text-primary' : ''}`}>
                            {day.getDate()}
                          </div>
                          
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event) => {
                              const EventIconComponent = eventTypeIcons[event.type]
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 ${eventTypeColors[event.type]}`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedEvent(event)
                                    setShowEventModal(true)
                                  }}
                                >
                                  <div className="flex items-center gap-1">
                                    <EventIconComponent className="w-2 h-2" />
                                    <span className="truncate">{event.title}</span>
                                  </div>
                                </div>
                              )
                            })}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                {user.role === 'admin' ? 'Upcoming Events (All Clients)' : 'Your Upcoming Events'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {user.role === 'admin' ? 'No upcoming events scheduled' : 'No upcoming events for you'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Event
                  </Button>
                </div>
              ) : (
                upcomingEvents.map((event) => {
                  const EventIconComponent = eventTypeIcons[event.type]
                  return (
                    <div 
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedEvent(event)
                        setShowEventModal(true)
                      }}
                    >
                      <div className={`p-2 rounded-lg ${eventTypeColors[event.type]}`}>
                        <EventIconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.start).toLocaleDateString('nl-NL')} • {formatEventTime(event.start, event.end)}
                        </p>
                        {event.client && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {event.client}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Event Types Legend */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(eventTypeColors).map(([type, colorClass]) => {
                const EventIconComponent = eventTypeIcons[type as keyof typeof eventTypeIcons]
                return (
                  <div key={type} className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${colorClass}`}>
                      <EventIconComponent className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-foreground capitalize">
                      {type === 'standup' ? 'Team Standup' : type}
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-lg glass-modal">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${eventTypeColors[selectedEvent.type]}`}>
                  {(() => {
                    const EventIconComponent = eventTypeIcons[selectedEvent.type]
                    return <EventIconComponent className="w-4 h-4" />
                  })()}
                </div>
                <div>
                  <Badge variant="outline" className="capitalize">
                    {selectedEvent.type}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedEvent.start).toLocaleDateString('nl-NL')} • {formatEventTime(selectedEvent.start, selectedEvent.end)}
                    </span>
                  </div>
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="mt-1 text-sm">{selectedEvent.description}</p>
                  </div>
                )}
                
                {selectedEvent.client && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Client</label>
                    <p className="mt-1 text-sm">{selectedEvent.client}</p>
                  </div>
                )}
                
                {selectedEvent.location && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>
                  </div>
                )}
                
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Attendees</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedEvent.attendees.length} attendees</span>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedEvent.type === 'meeting' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Video className="w-4 h-4 mr-2" />
                    Video Call
                  </Button>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowEventModal(false)}>
                  Close
                </Button>
                {user.role === 'admin' && (
                  <Button>Edit Event</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg glass-modal">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">Create New Event</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Title</label>
              <Input 
                placeholder="Event title" 
                className="mt-1" 
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <Select 
                value={newEvent.type} 
                onValueChange={(value: CalendarEvent['type']) => setNewEvent(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="publication">Publication</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="standup">Team Standup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                <Input 
                  type="date" 
                  className="mt-1" 
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Start Time</label>
                <Input 
                  type="time" 
                  className="mt-1" 
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Client (Optional)</label>
              {user.role === 'admin' && clients.length > 0 ? (
                <Select 
                  value={newEvent.client} 
                  onValueChange={(value) => setNewEvent(prev => ({ ...prev, client: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No client</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input 
                  placeholder="Client name" 
                  className="mt-1" 
                  value={newEvent.client}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, client: e.target.value }))}
                  disabled={user.role === 'client'}
                />
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location (Optional)</label>
              <Input 
                placeholder="Meeting location" 
                className="mt-1" 
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <Textarea 
                placeholder="Event description" 
                className="mt-1" 
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent}>Create Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}