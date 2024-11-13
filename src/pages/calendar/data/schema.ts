export interface CalendarEvent {
    id: string;
    title: string;
    start: string | Date;
    end: string | Date;
    type: string;
    user: string;
    googleMeetLink?: string;
    rrule?: {
        freq?: string;
        dtstart?: string;
        until?: string;
    };
    duration?: string;
    description?: string;
    reminder?: number;
    attendees?: string[];
}

export interface Participant {
    name: string;
    email: string;
    image: string;
}

export interface EventType {
    color: string;
    label: string;
}
