import { useEffect, useRef, useState, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import rrulePlugin from '@fullcalendar/rrule'
import { EventClickArg } from '@fullcalendar/core'
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CircleCheckBig, Clipboard, Trash2, X, Download, Upload } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { addMinutes, format } from "date-fns"
import { Button } from '@/components/custom/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarEvent } from '../data/schema'
import { eventTypes, initialEvents, participants } from '../data/calendar'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null)
  const [filterBy, setFilterBy] = useState<string>('all')
  const [calendarView, setCalendarView] = useState<string>("dayGridMonth")
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false)
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null)
  const [calendarTitle, setCalendarTitle] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false)
  const [importData, setImportData] = useState<string>('')
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState<boolean>(false)
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event
    setCurrentEvent({
      id: event.id,
      title: event.title,
      start: event.start || new Date(),
      end: event.end || new Date(),
      type: event.extendedProps.type || 'meeting',
      user: event.extendedProps.user || '',
      googleMeetLink: event.extendedProps.googleMeetLink || '',
      description: event.extendedProps.description || '',
      reminder: event.extendedProps.reminder || 0,
      attendees: event.extendedProps.attendees || [],
    })
    setIsEventModalOpen(true)
  }

  const handleDateClick = (arg: any) => {
    const endTime = addMinutes(arg.date, 60)
    setCurrentEvent({
      id: '',
      title: '',
      start: arg.date,
      end: endTime,
      type: 'meeting',
      user: '',
      googleMeetLink: '',
      description: '',
      reminder: 0,
      attendees: [],
    })
    setIsEventModalOpen(true)
  }

  const handleSaveEvent = () => {
    if (!currentEvent) return

    setEvents(prevEvents => {
      const updatedEvents = currentEvent.id
        ? prevEvents.map(e => e.id === currentEvent.id ? currentEvent : e)
        : [...prevEvents, { ...currentEvent, id: Date.now().toString() }];
      return filterAndSearchEvents(updatedEvents);
    });

    setIsEventModalOpen(false)
    setCurrentEvent(null)
    toast({
      title: "Event saved successfully!",
    })
  }

  const handleDeleteEvent = () => {
    if (currentEvent && currentEvent.id) {
      setEvents(prevEvents => {
        const updatedEvents = prevEvents.filter(e => e.id !== currentEvent.id);
        return filterAndSearchEvents(updatedEvents);
      });
      setIsEventModalOpen(false)
      setCurrentEvent(null)
      toast({
        title: "Event deleted successfully!",
      })
    }
  }

  const handleViewChange = (view: string) => {
    setCalendarView(view)
    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.changeView(view)
  }

  const handleCopyGoogleMeetLink = () => {
    if (currentEvent?.googleMeetLink) {
      navigator.clipboard.writeText(currentEvent.googleMeetLink)
      setCopySuccess('Copied!')
      setTimeout(() => setCopySuccess(''), 2000)
    }
  }

  const filterAndSearchEvents = useCallback((allEvents: CalendarEvent[]) => {
    return allEvents.filter(event =>
      (filterBy === 'all' || event.type === filterBy) &&
      (!searchTerm ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [filterBy, searchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      setEvents(initialEvents);
    } else {
      setEvents(filterAndSearchEvents(initialEvents));
    }
  }, [filterBy, searchTerm, initialEvents, filterAndSearchEvents]);

  const updateCalendarTitle = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setCalendarTitle(calendarApi.view.title);
    }
  }, []);

  const changeCalendarView = useCallback((direction: 'prev' | 'next') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (direction === 'prev') {
        calendarApi.prev();
      } else {
        calendarApi.next();
      }
      updateCalendarTitle();
    }
  }, [updateCalendarTitle]);

  const goToToday = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(new Date());
      updateCalendarTitle();
    }
  }, [updateCalendarTitle]);

  const handleExportEvents = () => {
    const eventsToExport = events.map(event => ({
      ...event,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
    }))
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(eventsToExport))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "calendar_events.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImportEvents = () => {
    try {
      const importedEvents = JSON.parse(importData);
      const newEvents = importedEvents.map((event: CalendarEvent) => ({
        ...event,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(prevEvents => {
        const updatedEvents = [...prevEvents, ...newEvents];
        return filterAndSearchEvents(updatedEvents);
      });
      setIsImportModalOpen(false);
      setImportData('');
      toast({
        title: "Events imported successfully!",
      });
    } catch (error) {
      toast({
        title: "Error importing events",
        description: "Please check the format of your import data",
        variant: "destructive",
      });
    }
  }

  const checkUpcomingEvents = useCallback(() => {
    const now = new Date()
    const upcoming = events.filter(event => {
      const eventStart = new Date(event.start)
      const timeDiff = eventStart.getTime() - now.getTime()
      const minutesDiff = Math.floor(timeDiff / (1000 * 60))
      return minutesDiff > 0 && minutesDiff <= (event.reminder || 0)
    })
    setUpcomingEvents(upcoming)
    if (upcoming.length > 0) {
      setIsReminderDialogOpen(true)
    }
  }, [events])

  useEffect(() => {
    updateCalendarTitle();
    const intervalId = setInterval(checkUpcomingEvents, 60000)
    return () => clearInterval(intervalId)
  }, [updateCalendarTitle, checkUpcomingEvents]);


  const renderEventContent = (eventInfo: any) => {
    const event = eventInfo.event
    const type = eventTypes[event.extendedProps.type] || eventTypes.meeting

    const startDate = event.start instanceof Date ? event.start : new Date(event.start)
    const endDate = event.end instanceof Date ? event.end : new Date(event.end)

    const isValidDate = (date: Date) => !isNaN(date.getTime())
    return (
      <>
        <div className={`p-1 rounded w-full`} style={{ backgroundColor: type.color }}>
          <p className="font-bold">{event.title}</p>
          <p>{event.extendedProps.user}</p>
          <p>
            {isValidDate(startDate) ? format(startDate, 'HH:mm') : 'Invalid start'} -
            {isValidDate(endDate) ? format(endDate, 'HH:mm') : 'Invalid end'}
          </p>
          <div className='flex'>
            {event.extendedProps.attendees && event.extendedProps.attendees.map((attendee: string, index: number) => (
              <Avatar key={index} className="w-8 h-8 border-2 border-white -ml-2 first:ml-0">
                <AvatarImage src={participants.find(p => p.name === attendee)?.image} />
                <AvatarFallback>{attendee.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </>
    )
  }



  return (
    <div className="flex h-screen overflow-auto no-scrollbar">
      <div className="flex-1 p-4">
        <div className="rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4 gap-2">
            <div className="flex items-center space-x-2">
              <Button variant='outline' onClick={() => changeCalendarView('prev')}>Prev</Button>
              <Button variant='outline'>{calendarTitle}</Button>
              <Button variant='outline' onClick={() => changeCalendarView('next')}>Next</Button>
              <Button variant='outline' onClick={goToToday}>Today</Button>
            </div>
            <div className="space-x-2 flex items-center">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="md:w-[180px]">
                  <SelectValue placeholder="Filter by event type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(eventTypes).map(type => (
                    <SelectItem key={type} value={type}>
                      {eventTypes[type].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={calendarView === 'dayGridDay' ? 'destructive' : 'outline'}
                onClick={() => handleViewChange('dayGridDay')}
              >
                Daily
              </Button>
              <Button
                variant={calendarView === 'timeGridWeek' ? 'destructive' : 'outline'}
                onClick={() => handleViewChange('timeGridWeek')}
              >
                Weekly
              </Button>
              <Button
                variant={calendarView === 'dayGridMonth' ? 'destructive' : 'outline'}
                onClick={() => handleViewChange('dayGridMonth')}
              >
                Monthly
              </Button>
              <Button
                variant={calendarView === 'listWeek' ? 'destructive' : 'outline'}
                onClick={() => handleViewChange('listWeek')}
              >
                List
              </Button>
              <Button variant="outline">Availability</Button>
              <Button variant='outline' onClick={() => handleDateClick({ date: new Date() } as any)}>+ Add Event</Button>
              <Button variant='outline' onClick={handleExportEvents}><Download className="w-4 h-4 mr-2" /> Export</Button>
              <Button variant='outline' onClick={() => setIsImportModalOpen(true)}><Upload className="w-4 h-4 mr-2" /> Import</Button>
            </div>
          </div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin, listPlugin]}
            initialView={calendarView}
            headerToolbar={false}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            height="auto"
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
          />
        </div>
      </div>

      {isEventModalOpen && currentEvent && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentEvent.id ? 'Edit Event' : 'Add Event'}</h3>
              <Button variant="ghost" onClick={() => setIsEventModalOpen(false)}><X /></Button>
            </div>
            <Input
              className="mb-4"
              placeholder="Event Title"
              value={currentEvent.title}
              onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mb-4",
                    !currentEvent.start && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentEvent.start ? format(new Date(currentEvent.start), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(currentEvent.start)}
                  onSelect={(date) => date && setCurrentEvent({ ...currentEvent, start: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              className="mb-4"
              placeholder="Start Time"
              type="time"
              value={format(new Date(currentEvent.start), "HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':')
                const newStart = new Date(currentEvent.start)
                newStart.setHours(parseInt(hours), parseInt(minutes))
                setCurrentEvent({ ...currentEvent, start: newStart })
              }}
            />
            <Input
              className="mb-4"
              placeholder="End Time"
              type="time"
              value={format(new Date(currentEvent.end), "HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':')
                const newEnd = new Date(currentEvent.end)
                newEnd.setHours(parseInt(hours), parseInt(minutes))
                setCurrentEvent({ ...currentEvent, end: newEnd })
              }}
            />
            <select
              className="mb-4 w-full p-2 border rounded"
              value={currentEvent.type}
              onChange={(e) => setCurrentEvent({ ...currentEvent, type: e.target.value })}
            >
              {Object.entries(eventTypes).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <select
              className="mb-4 w-full p-2 border rounded"
              value={currentEvent.user}
              onChange={(e) => setCurrentEvent({ ...currentEvent, user: e.target.value })}
            >
              <option value="">Select a participant</option>
              {participants.map((participant) => (
                <option key={participant.email} value={participant.name}>
                  {participant.name}
                </option>
              ))}
            </select>
            <div className="flex items-center mb-4">
              <Input
                className="flex-1"
                placeholder="Google Meet Link"
                value={currentEvent.googleMeetLink}
                onChange={(e) => setCurrentEvent({ ...currentEvent, googleMeetLink: e.target.value })}
              />
              <Button variant="outline" onClick={handleCopyGoogleMeetLink} className="ml-2">
                {copySuccess ? <CircleCheckBig className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea
              className="mb-4"
              placeholder="Event Description"
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
            />
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="reminder">Set Reminder</Label>
              <Select
                value={currentEvent.reminder?.toString()}
                onValueChange={(value) => setCurrentEvent({ ...currentEvent, reminder: parseInt(value) })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No reminder</SelectItem>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="recurring">Recurring Event</Label>
              <Switch
                id="recurring"
                checked={!!currentEvent.rrule}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setCurrentEvent({
                      ...currentEvent,
                      rrule: {
                        freq: 'weekly',
                        dtstart: format(new Date(currentEvent.start), "yyyy-MM-dd'T'HH:mm:ss"),
                        until: format(addMinutes(new Date(currentEvent.start), 30 * 24 * 60), "yyyy-MM-dd'T'HH:mm:ss"),
                      }
                    })
                  } else {
                    const { rrule, ...eventWithoutRrule } = currentEvent
                    setCurrentEvent(eventWithoutRrule)
                  }
                }}
              />
            </div>
            {currentEvent.rrule && (
              <div className="mb-4">
                <Select
                  value={currentEvent.rrule.freq}
                  onValueChange={(value) => setCurrentEvent({
                    ...currentEvent,
                    rrule: { ...currentEvent.rrule, freq: value }
                  })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="mb-4">
              <Label>Attendees</Label>
              {participants.map((participant) => (
                <div key={participant.email} className="flex items-center mt-2">
                  <Checkbox
                    id={participant.email}
                    checked={currentEvent.attendees?.includes(participant.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCurrentEvent({
                          ...currentEvent,
                          attendees: [...(currentEvent.attendees || []), participant.name]
                        })
                      } else {
                        setCurrentEvent({
                          ...currentEvent,
                          attendees: currentEvent.attendees?.filter(name => name !== participant.name)
                        })
                      }
                    }}
                  />
                  <Label htmlFor={participant.email} className="ml-2">{participant.name}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-between space-x-2">
              <Button onClick={handleDeleteEvent} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <div>
                <Button onClick={() => setIsEventModalOpen(false)} variant="outline" className="mr-2">Cancel</Button>
                <Button onClick={handleSaveEvent}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Events</DialogTitle>
            <DialogDescription>
              Paste your JSON formatted events data here.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste your JSON data here..."
            rows={10}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
            <Button onClick={handleImportEvents}>Import</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upcoming Events</DialogTitle>
            <DialogDescription>
              You have the following events coming up:
            </DialogDescription>
          </DialogHeader>
          <ul>
            {upcomingEvents.map(event => (
              <li key={event.id} className="mb-2">
                <strong>{event.title}</strong> - {format(new Date(event.start), "HH:mm")}
              </li>
            ))}
          </ul>
          <Button onClick={() => setIsReminderDialogOpen(false)}>Dismiss</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}