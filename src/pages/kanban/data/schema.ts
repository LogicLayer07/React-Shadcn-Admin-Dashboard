export type Severity = 'Critical' | 'High' | 'Medium' | 'Low'

export interface User {
  id: string
  name: string
  avatar: string
}

export interface Comment {
  id: string
  user: string
  text: string
  timestamp: Date
}

export interface Vulnerability {
  id: string
  title: string
  severity: Severity
  type: string
  score: number
  assignedTo: string[]
  status: string
  startDate: Date
  endDate: Date
  comments: Comment[]
  priority: boolean
}

export interface Column {
  id: string
  title: string
  items: Vulnerability[]
}

export interface Activity {
  id: string
  action: string
  item: string
  user: string
  timestamp: Date
}
