import { CalendarEvent } from "./schema";
import { EventType, Participant } from "../data/schema";

export const eventTypes: { [key: string]: EventType } = {
    all: { color: '#D3D3D3', label: 'All' },
    meeting: { color: '#FFCCCB', label: 'Meeting' },
    sprint: { color: '#E6E6FA', label: 'Sprint' },
    design: { color: '#E0FFFF', label: 'Design' },
    standup: { color: '#FFDAB9', label: 'Standup' },
}

export const participants: Participant[] = [
    { name: "Kristin Watson", email: "kristin@example.com", image: "/placeholder.svg?height=32&width=32" },
    { name: "Cody Fisher", email: "cody@example.com", image: "/placeholder.svg?height=32&width=32" },
    { name: "Esther Howard", email: "esther@example.com", image: "/placeholder.svg?height=32&width=32" },
    { name: "Floyd Miles", email: "floyd@example.com", image: "/placeholder.svg?height=32&width=32" },
    { name: "Akina Christine", email: "akina@example.com", image: "/placeholder.svg?height=32&width=32" },
]


export const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Weekly Meeting', start: '2024-10-10T08:00:00', end: '2024-10-10T09:00:00', type: 'meeting', user: 'Kristin Watson', googleMeetLink: '' },
  { id: '2', title: 'Sprint 1', start: '2024-10-12T10:00:00', end: '2024-10-12T12:00:00', type: 'sprint', user: 'Cody Fisher', googleMeetLink: '' },
  { id: '3', title: 'Review Design', start: '2024-10-15T14:00:00', end: '2024-10-15T15:00:00', type: 'design', user: 'Esther Howard', googleMeetLink: '' },
  { id: '4', title: 'Feedback Design', start: '2024-10-17T08:00:00', end: '2024-10-17T09:00:00', type: 'design', user: 'Floyd Miles', googleMeetLink: '' },
  { id: '5', title: 'Sprint 2', start: '2024-10-20T10:00:00', end: '2024-10-20T11:00:00', type: 'sprint', user: 'Akina Christine', googleMeetLink: '' },
  { id: '6', title: 'Prototyping', start: '2024-10-25T11:00:00', end: '2024-10-25T13:00:00', type: 'design', user: 'Kristin Watson', googleMeetLink: '' },
  { id: '7', title: 'Daily Standup', start: '2024-10-28T13:00:00', end: '2024-10-28T14:00:00', type: 'standup', user: 'Cody Fisher', googleMeetLink: '' },
  { id: '8', title: 'Weekly Meeting', start: '2024-10-30T16:00:00', end: '2024-10-30T17:00:00', type: 'meeting', user: 'Esther Howard', googleMeetLink: '' },
  {
    id: '9',
    title: 'Recurring Meeting',
    rrule: {
      freq: 'weekly',
      dtstart: '2024-10-01T10:00:00',
      until: '2024-12-31'
    },
    duration: '01:00',
    start: '2024-10-01T10:00:00',
    end: '2024-10-01T11:00:00',
    type: 'meeting',
    user: 'Floyd Miles',
    googleMeetLink: ''
  },
  { id: '10', title: 'October Sprint Planning', start: '2024-10-05T09:00:00', end: '2024-10-05T10:30:00', type: 'sprint', user: 'Akina Christine', googleMeetLink: '' },
  { id: '11', title: 'Design Brainstorm', start: '2024-10-14T11:00:00', end: '2024-10-14T12:00:00', type: 'design', user: 'Kristin Watson', googleMeetLink: '' },
  { id: '12', title: 'Team Standup', start: '2024-10-18T09:00:00', end: '2024-10-18T09:30:00', type: 'standup', user: 'Cody Fisher', googleMeetLink: '' },
  { id: '13', title: 'Project Retrospective', start: '2024-11-03T15:00:00', end: '2024-11-03T16:00:00', type: 'meeting', user: 'Esther Howard', googleMeetLink: '' },
  { id: '14', title: 'Sprint 3', start: '2024-11-07T10:00:00', end: '2024-11-07T11:30:00', type: 'sprint', user: 'Cody Fisher', googleMeetLink: '' },
  { id: '15', title: 'New Feature Design', start: '2024-11-10T14:00:00', end: '2024-11-10T15:30:00', type: 'design', user: 'Kristin Watson', googleMeetLink: '' },
  { id: '16', title: 'Weekly Design Review', start: '2024-11-12T11:00:00', end: '2024-11-12T12:00:00', type: 'design', user: 'Akina Christine', googleMeetLink: '' },
  { id: '17', title: 'Standup & Updates', start: '2024-11-14T09:30:00', end: '2024-11-14T10:00:00', type: 'standup', user: 'Floyd Miles', googleMeetLink: '' },
  { id: '18', title: 'November Planning Meeting', start: '2024-11-18T08:00:00', end: '2024-11-18T09:00:00', type: 'meeting', user: 'Kristin Watson', googleMeetLink: '' },
  { id: '19', title: 'Sprint 4', start: '2024-11-20T13:00:00', end: '2024-11-20T14:30:00', type: 'sprint', user: 'Esther Howard', googleMeetLink: '' },
  { id: '20', title: 'Final Design Review', start: '2024-11-25T10:00:00', end: '2024-11-25T11:30:00', type: 'design', user: 'Cody Fisher', googleMeetLink: '' }
];