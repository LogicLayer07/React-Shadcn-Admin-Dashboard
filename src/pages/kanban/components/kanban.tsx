import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Search, Grid, List, Plus, Calendar, MoreVertical, Trash2, Edit3, Download, Clock, Flag, PanelRightClose, FileText, FileSpreadsheetIcon, FileJson, BarChart2, RefreshCw, AlertTriangle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format, differenceInDays } from 'date-fns'
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from '@/components/custom/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { IconFileTypeCsv, IconFileTypePdf } from '@tabler/icons-react';
import { initialData, initialUsers } from '../data/kanbans';
import { Activity, Comment, Severity, Vulnerability } from '../data/schema';
import { Progress } from "@/components/ui/progress"
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function EnhancedVulnerabilityKanban() {
  const [columns, setColumns] = useState(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [sortBy, setSortBy] = useState<'severity' | 'score'>('severity')
  const [filterBy, setFilterBy] = useState<Severity | 'All'>('All')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null)
  const [newVulnerability, setNewVulnerability] = useState<Omit<Vulnerability, 'id' | 'status' | 'comments' | 'priority'>>({
    title: '',
    severity: 'Low',
    tags: '',
    type: '',
    score: 0,
    assignedTo: [],
    startDate: new Date(),
    endDate: new Date(),
  })
  const [newComment, setNewComment] = useState('')
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activityLog, setActivityLog] = useState<Activity[]>([])
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(60000) // 1 minute default
  const [riskScore, setRiskScore] = useState(0)
  const [isRiskScoreDialogOpen, setIsRiskScoreDialogOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  console.log(tags)
  useEffect(() => {
    const checkDueDates = () => {
      const today = new Date()
      Object.values(columns).forEach(column => {
        column.items.forEach(item => {
          const daysUntilDue = differenceInDays(item.endDate, today)
          if (daysUntilDue <= 3 && daysUntilDue > 0) {
            toast({
              title: "Due Date Approaching",
              description: `${item.title} is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`,
              duration: 5000,
            })
          }
        })
      })
    }

    checkDueDates()
    const interval = setInterval(checkDueDates, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [columns])

  useEffect(() => {
    if (isAutoRefreshEnabled) {
      const interval = setInterval(() => {
        refreshData()
      }, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [isAutoRefreshEnabled, refreshInterval])

  const refreshData = useCallback(() => {
    // Simulating data refresh
    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns }
      Object.keys(updatedColumns).forEach(columnId => {
        updatedColumns[columnId].items = updatedColumns[columnId].items.map(item => ({
          ...item,
          score: Math.floor(Math.random() * 100) // Simulating score update
        }))
      })
      return updatedColumns
    })
    toast({
      title: "Data Refreshed",
      description: "Vulnerability data has been updated.",
    })
  }, [])

  const calculateRiskScore = useCallback(() => {
    const allVulnerabilities = Object.values(columns).flatMap(column => column.items)
    const totalScore = allVulnerabilities.reduce((sum, vuln) => sum + vuln.score, 0)
    const averageScore = totalScore / allVulnerabilities.length
    const criticalCount = allVulnerabilities.filter(vuln => vuln.severity === 'Critical').length
    const highCount = allVulnerabilities.filter(vuln => vuln.severity === 'High').length

    const riskScore = (averageScore * 0.5) + (criticalCount * 10) + (highCount * 5)
    setRiskScore(Math.min(100, Math.max(0, riskScore))) // Ensure score is between 0 and 100
  }, [columns])

  useEffect(() => {
    calculateRiskScore()
  }, [columns, calculateRiskScore])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = source.droppableId === destination.droppableId ? sourceItems : [...destColumn.items]

    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, { ...removed, status: destColumn.title })

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    })

    addActivity(`Moved "${removed.title}" from ${sourceColumn.title} to ${destColumn.title}`)

    toast({
      title: "Item moved",
      description: `${removed.title} moved to ${destColumn.title}`,
    })
  }

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500 text-white'
      case 'High':
        return 'bg-orange-500 text-white'
      case 'Medium':
        return 'bg-yellow-500 text-white'
      case 'Low':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const filteredAndSortedColumns = useMemo(() => {
    return Object.entries(columns).reduce((acc, [columnId, column]) => {
      let filteredItems = column.items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterBy === 'All' || item.severity === filterBy)
      )

      filteredItems.sort((a, b) => {
        if (sortBy === 'severity') {
          const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
          return severityOrder[a.severity] - severityOrder[b.severity]
        } else {
          return b.score - a.score
        }
      })

      acc[columnId] = { ...column, items: filteredItems }
      return acc
    }, {} as typeof columns)
  }, [columns, searchTerm, sortBy, filterBy])

  const allVulnerabilities = useMemo(() => {
    return Object.values(columns).flatMap(column => column.items)
  }, [columns])

  const handleAddVulnerability = () => {
    const newId = `card${Math.max(...allVulnerabilities.map(v => parseInt(v.id.replace('card', '')))) + 1}`
    const newItem: Vulnerability = {
      ...newVulnerability,
      id: newId,
      status: 'Draft',
      comments: [],
      priority: false,
      tags: []
    }
    setColumns(prev => ({
      ...prev,
      draft: {
        ...prev.draft,
        items: [...prev.draft.items, newItem]
      }
    }))
    setIsAddDialogOpen(false)
    setNewVulnerability({
      title: '',
      severity: 'Low',
      type: '',
      tags: '',
      score: 0,
      assignedTo: [],
      startDate: new Date(),
      endDate: new Date(),
    })
    addActivity(`Added new vulnerability "${newItem.title}"`)
    toast({
      title: "Vulnerability added",
      description: `${newItem.title} has been added to the Draft column`,
    })
  }

  const handleUpdateVulnerability = () => {
    if (!selectedVulnerability) return

    setColumns(prev => {
      const updatedColumns = { ...prev }
      for (const [columnId, column] of Object.entries(updatedColumns)) {
        const itemIndex = column.items.findIndex(item => item.id === selectedVulnerability.id)
        if (itemIndex !== -1) {
          updatedColumns[columnId].items[itemIndex] = selectedVulnerability
          break
        }
      }
      return updatedColumns
    })

    setIsDetailDialogOpen(false)
    setSelectedVulnerability(null)
    addActivity(`Updated vulnerability "${selectedVulnerability.title}"`)
    toast({
      title: "Vulnerability updated",
      description: `${selectedVulnerability.title} has been updated`,
    })
  }

  const handleAddComment = () => {
    if (!selectedVulnerability || !newComment) return

    const newCommentObj: Comment = {
      id: (selectedVulnerability.comments.length + 1).toString(),
      user: 'Current User',
      text: newComment,
      timestamp: new Date()
    }

    setSelectedVulnerability(prev => ({
      ...prev!,
      comments: [...prev!.comments, newCommentObj]
    }))

    setNewComment('')
    addActivity(`Added comment to "${selectedVulnerability.title}"`)
    toast({
      title: "Comment added",
      description: `New comment added to ${selectedVulnerability.title}`,
    })
  }

  const handleAddColumn = () => {
    if (!newColumnTitle) return

    const newColumnId = `column${Object.keys(columns).length + 1}`
    setColumns(prev => ({
      ...prev,
      [newColumnId]: {
        id: newColumnId,
        title: newColumnTitle,
        items: []
      }
    }))
    setIsAddColumnDialogOpen(false)
    setNewColumnTitle('')
    addActivity(`Added new column "${newColumnTitle}"`)
    toast({
      title: "Column added",
      description: `New column "${newColumnTitle}" has been added`,
    })
  }

  const handleDeleteVulnerability = (vulnerabilityId: string) => {
    setColumns(prev => {
      const updatedColumns = { ...prev }
      for (const [columnId, column] of Object.entries(updatedColumns)) {
        const itemIndex = column.items.findIndex(item => item.id === vulnerabilityId)
        if (itemIndex !== -1) {
          const deletedItem = column.items[itemIndex]
          updatedColumns[columnId].items.splice(itemIndex, 1)
          addActivity(`Deleted vulnerability "${deletedItem.title}"`)
          break
        }
      }
      return updatedColumns
    })
    toast({
      title: "Vulnerability deleted",
      description: `The vulnerability has been removed`,
    })
  }

  const handleBulkAction = (action: 'move' | 'assign', value: string) => {
    setColumns(prev => {
      const updatedColumns = { ...prev }

      selectedItems.forEach(itemId => {
        for (const [columnId, column] of Object.entries(updatedColumns)) {
          const itemIndex = column.items.findIndex(item => item.id === itemId)
          if (itemIndex !== -1) {
            if (action === 'move') {
              const [movedItem] = column.items.splice(itemIndex, 1)
              updatedColumns[value].items.push({ ...movedItem, status: updatedColumns[value].title })
            } else if (action === 'assign') {
              updatedColumns[columnId].items[itemIndex].assignedTo = [value]
            }
            break
          }
        }
      })
      return updatedColumns
    })
    addActivity(`Bulk ${action === 'move' ? 'moved' : 'assigned'} ${selectedItems.length} items`)
    setSelectedItems([])
    toast({
      title: "Bulk action completed",
      description: `${selectedItems.length} items have been ${action === 'move' ? 'moved' : 'assigned'}`,
    })
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const addActivity = (action: string) => {
    const newActivity: Activity = {
      id: (activityLog.length + 1).toString(),
      action,
      item: '',
      user: 'Current User',
      timestamp: new Date()
    }
    setActivityLog(prev => [newActivity, ...prev])
  }

  const exportData = (format: 'csv' | 'json' | 'excel' | 'tsv' | 'pdf') => {
    const data = allVulnerabilities;
    let content: string;
    let filename: string;
    let mimeType: string;

    const headers: (keyof Vulnerability)[] = [
      'id', 'title', 'severity', 'type', 'score',
      'assignedTo', 'status', 'startDate', 'endDate'
    ];

    if (format === 'csv' || format === 'tsv') {
      const separator = format === 'csv' ? ',' : '\t';
      const contentRows = data.map(item =>
        headers.map((header) => {
          const value = item[header as keyof Vulnerability];
          if (header === 'assignedTo' && Array.isArray(value)) {
            return value.join(';');
          } else if ((header === 'startDate' || header === 'endDate') && value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }).join(separator)
      );
      content = [headers.join(separator), ...contentRows].join('\n');
      filename = `vulnerabilities.${format}`;
      mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'text/tab-separated-values;charset=utf-8;';
    } else if (format === 'excel') {
      const contentRows = data.map(item =>
        headers.map((header) => {
          const value = item[header as keyof Vulnerability];
          if (header === 'assignedTo' && Array.isArray(value)) {
            return value.join(';');
          } else if ((header === 'startDate' || header === 'endDate') && value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }).join(',')
      );
      content = [headers.join(','), ...contentRows].join('\n');
      filename = 'vulnerabilities.xlsx';
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;';
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const tableColumn = headers.map(header => header.toString());
      const tableRows = data.map(item =>
        headers.map((header) => {
          const value = item[header as keyof Vulnerability];
          if (header === 'assignedTo' && Array.isArray(value)) {
            return value.join(';');
          } else if ((header === 'startDate' || header === 'endDate') && value instanceof Date) {
            return value.toISOString();
          }
          return value ? value.toString() : '';
        })
      );
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
      });

      filename = 'vulnerabilities.pdf';
      doc.save(filename);
      addActivity(`Exported data in PDF format`);
      setIsExportDialogOpen(false);
      return;
    } else {
      content = JSON.stringify(data, null, 2);
      filename = 'vulnerabilities.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    addActivity(`Exported data in ${format.toUpperCase()} format`);
    setIsExportDialogOpen(false);
  };

  const handleAddTag = () => {
    if (newTag && selectedVulnerability) {
      setSelectedVulnerability(prev => ({
        ...prev!,
        tags: [...(prev!.tags || []), newTag]
      }))
      setNewTag('')
      setTags(prevTags => [...new Set([...prevTags, newTag])])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (selectedVulnerability) {
      setSelectedVulnerability(prev => ({
        ...prev!,
        tags: prev!.tags.filter((tag: any) => tag !== tagToRemove)
      }))
    }
  }

  const VulnerabilityCard: React.FC<{ item: Vulnerability; index: number }> = ({ item, index }) => (
    <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="mb-2 cursor-pointer">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                  />
                  <Badge className={getSeverityColor(item.severity)}>
                    {item.severity}
                  </Badge>
                </div>
                <span className="text-sm">{item.score}</span>
              </div>
              <p className="text-sm font-medium">{item.title}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
                <div className='flex items-center gap-1'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex -space-x-2">
                          {item.assignedTo.map((user, index) => (
                            <img
                              key={index}
                              className="w-6 h-6 rounded-full border-2 border-white"
                              src={initialUsers.find(u => u.name === user)?.avatar}
                              alt={user}
                            />
                          ))}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.assignedTo.join(', ')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="text-xs mt-1 flex justify-between items-center">
                <span>{format(item.startDate, 'PP')} - {format(item.endDate, 'PP')}</span>
                <div className="flex items-center gap-2">
                  {item.priority && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Flag className="h-4 w-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>High Priority</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {differenceInDays(item.endDate, new Date()) <= 3 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Clock className="h-4 w-4 text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Due Soon</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedVulnerability(item)
                        setIsDetailDialogOpen(true)
                      }}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteVulnerability(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setColumns(prev => {
                          const updatedColumns = { ...prev }
                          for (const column of Object.values(updatedColumns)) {
                            const itemIndex = column.items.findIndex(i => i.id === item.id)
                            if (itemIndex !== -1) {
                              column.items[itemIndex].priority = !column.items[itemIndex].priority
                              break
                            }
                          }
                          return updatedColumns
                        })
                        addActivity(`${item.priority ? 'Removed' : 'Set'} high priority for "${item.title}"`)
                      }}>
                        <Flag className="mr-2 h-4 w-4" />
                        <span>{item.priority ? 'Remove Priority' : 'Set High Priority'}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag: any, index: any) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Vulnerabilities</h1>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by issue name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={(value: 'severity' | 'score') => setSortBy(value)}>
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="severity">Severity</SelectItem>
            <SelectItem value="score">Score</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={(value: Severity | 'All') => setFilterBy(value)}>
          <SelectTrigger className="md:w-[180px]">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Vulnerability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Vulnerability</DialogTitle>
              <DialogDescription>
                Enter the details of the new vulnerability here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newVulnerability.title}
                  onChange={(e) => setNewVulnerability({ ...newVulnerability, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">
                  Severity
                </Label>
                <Select
                  value={newVulnerability.severity}
                  onValueChange={(value: Severity) => setNewVulnerability({ ...newVulnerability, severity: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input
                  id="type"
                  value={newVulnerability.type}
                  onChange={(e) => setNewVulnerability({ ...newVulnerability, type: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="score" className="text-right">
                  Score
                </Label>
                <Input
                  id="score"
                  type="number"
                  value={newVulnerability.score}
                  onChange={(e) => setNewVulnerability({ ...newVulnerability, score: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignedTo" className="text-right">
                  Assigned To
                </Label>
                <Select
                  value={newVulnerability.assignedTo[0] || ''}
                  onValueChange={(value: string) => setNewVulnerability({ ...newVulnerability, assignedTo: [value] })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialUsers.map(user => (
                      <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-[280px] justify-start text-left font-normal ${!newVulnerability.startDate && "text-muted-foreground"
                        }`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newVulnerability.startDate ? format(newVulnerability.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newVulnerability.startDate}
                      onSelect={(date) => date && setNewVulnerability({ ...newVulnerability, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-[280px] justify-start text-left font-normal ${!newVulnerability.endDate && "text-muted-foreground"
                        }`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newVulnerability.endDate ? format(newVulnerability.endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newVulnerability.endDate}
                      onSelect={(date) => date && setNewVulnerability({ ...newVulnerability, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddVulnerability}>Save vulnerability</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Column
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
              <DialogDescription>
                Enter the title for the new column.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="columnTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="columnTitle"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddColumn}>Add Column</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <Select onValueChange={(value) => handleBulkAction('move', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Move to..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(columns).map(([columnId, column]) => (
                  <SelectItem key={columnId} value={columnId}>{column.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleBulkAction('assign', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                {initialUsers.map(user => (
                  <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Export Data</DialogTitle>
              <DialogDescription>
                Choose the format to export your vulnerability data.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center gap-4 py-4">
              <Button onClick={() => exportData('csv')}>
                <IconFileTypeCsv className="mr-2" /> CSV
              </Button>
              <Button onClick={() => exportData('tsv')}>
                <FileText className="mr-2" /> TSV
              </Button>
              <Button onClick={() => exportData('json')}>
                <FileJson className="mr-2" /> JSON
              </Button>
              <Button onClick={() => exportData('excel')}>
                <FileSpreadsheetIcon className="mr-2" /> EXCEL
              </Button>
              <Button onClick={() => exportData('pdf')}>
                <IconFileTypePdf className="mr-2" /> PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Sheet>
          <SheetTrigger>
            <Button size="sm">
              <PanelRightClose className="h-4 w-4 mr-2" /> Show Activity
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
          >
            <div className="h-[calc(100vh)] overflow-auto no-scrollbar p-6">
              <h3 className="font-semibold mb-2">Activity Log</h3>
              <ScrollArea className="h-[calc(100vh)] pb-4 overflow-auto pr-4">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="mb-2 text-sm">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground">{format(activity.timestamp, 'PP p')}</p>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
        <Dialog open={isAnalyticsDialogOpen} onOpenChange={setIsAnalyticsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <BarChart2 className="h-4 w-4 mr-2" /> Analytics
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Vulnerability Analytics</DialogTitle>
              <DialogDescription>
                Overview of vulnerability statistics and trends.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <h3 className="font-semibold mb-2">Severity Distribution</h3>
              <div className="flex justify-between mb-4">
                {['Critical', 'High', 'Medium', 'Low'].map((severity) => (
                  <div key={severity} className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getSeverityColor(severity as Severity)}`}>
                      {allVulnerabilities.filter(v => v.severity === severity).length}
                    </div>
                    <p className="mt-1 text-sm">{severity}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-semibold mb-2">Status Distribution</h3>
              <div className="flex justify-between mb-4">
                {Object.entries(columns).map(([columnId, column]) => (
                  <div key={columnId} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {column.items.length}
                    </div>
                    <p className="mt-1 text-sm">{column.title}</p>
                  </div>
                ))}
              </div>
              <h3 className="font-semibold mb-2">Timeline</h3>
              <ChartContainer
                config={{
                  move: {
                    label: "Move",
                    color: "hsl(var(--chart-1))",
                  },
                  exercise: {
                    label: "Exercise",
                    color: "hsl(var(--chart-2))",
                  },
                  stand: {
                    label: "Stand",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="mx-auto aspect-square w-full max-w-[80%]"
              >
                <RadialBarChart
                  margin={{
                    left: -10,
                    right: -10,
                    top: -10,
                    bottom: -10,
                  }}
                  data={Object.entries(columns).map(([columnId, column]) => ({
                    activity: column.title.toLowerCase(),
                    value: (column.items.length) * 100, 
                    fill: `var(--color-${column.title.toLowerCase()})`, 
                  }))}
                  innerRadius="20%"
                  barSize={24}
                  startAngle={90}
                  endAngle={450}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    dataKey="value"
                    tick={false}
                  />
                  <RadialBar dataKey="value" background cornerRadius={5} />
                </RadialBarChart>
              </ChartContainer>
            </div>

          </DialogContent>
        </Dialog>
        <Dialog open={isRiskScoreDialogOpen} onOpenChange={setIsRiskScoreDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" /> Risk Score
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Overall Risk Score</DialogTitle>
              <DialogDescription>
                Current risk assessment based on vulnerabilities.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold">{riskScore.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <Progress value={riskScore} className="w-full" />
              <p className="mt-4 text-sm text-center">
                {riskScore < 30 ? "Low risk. Keep monitoring." :
                  riskScore < 70 ? "Moderate risk. Take action on critical items." :
                    "High risk. Immediate attention required."}
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value: 'board' | 'list') => value && setViewMode(value)}>
          <ToggleGroupItem value="board" aria-label="Board view">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex gap-4 overflow-auto no-scrollbar">
        <div className="flex-grow">
          {viewMode === 'board' ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 overflow-auto pb-4 no-scrollbar">
                {Object.entries(filteredAndSortedColumns).map(([columnId, column]) => (
                  <div key={columnId} className="flex-shrink-0 w-72">
                    <h2 className="font-semibold mb-2">
                      {column.title} ({column.items.length})
                    </h2>
                    <Droppable droppableId={columnId}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="p-2 rounded-lg min-h-[200px]"
                        >
                          {column.items.map((item, index) => (
                            <VulnerabilityCard key={item.id} item={item} index={index} />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30px]"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allVulnerabilities
                  .filter(item =>
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (filterBy === 'All' || item.severity === filterBy)
                  )
                  .sort((a, b) => {
                    if (sortBy === 'severity') {
                      const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
                      return severityOrder[a.severity] - severityOrder[b.severity]
                    } else {
                      return b.score - a.score
                    }
                  })
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleItemSelection(item.id)}
                        />
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.score}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.assignedTo.join(', ')}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{format(item.startDate, 'PP')}</TableCell>
                      <TableCell>{format(item.endDate, 'PP')}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedVulnerability(item)
                          setIsDetailDialogOpen(true)
                        }}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteVulnerability(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Vulnerability Details</DialogTitle>
          </DialogHeader>
          {selectedVulnerability && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={selectedVulnerability.title}
                  onChange={(e) => setSelectedVulnerability({ ...selectedVulnerability, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">
                  Severity
                </Label>
                <Select
                  value={selectedVulnerability.severity}
                  onValueChange={(value: Severity) => setSelectedVulnerability({ ...selectedVulnerability, severity: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input
                  id="type"
                  value={selectedVulnerability.type}
                  onChange={(e) => setSelectedVulnerability({ ...selectedVulnerability, type: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="score" className="text-right">
                  Score
                </Label>
                <Input
                  id="score"
                  type="number"
                  value={selectedVulnerability.score}
                  onChange={(e) => setSelectedVulnerability({ ...selectedVulnerability, score: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignedTo" className="text-right">
                  Assigned To
                </Label>
                <Select
                  value={selectedVulnerability.assignedTo[0] || ''}
                  onValueChange={(value: string) => setSelectedVulnerability({ ...selectedVulnerability, assignedTo: [value] })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialUsers.map(user => (
                      <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-[280px] justify-start text-left font-normal`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(selectedVulnerability.startDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedVulnerability.startDate}
                      onSelect={(date) => date && setSelectedVulnerability({ ...selectedVulnerability, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-[280px] justify-start text-left font-normal`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(selectedVulnerability.endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedVulnerability.endDate}
                      onSelect={(date) => date && setSelectedVulnerability({ ...selectedVulnerability, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="comments" className="text-right">
                  Comments
                </Label>
                <div className="col-span-3 space-y-2">
                  {selectedVulnerability.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded">
                      <p className="text-sm font-medium">{comment.user}</p>
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-xs text-gray-500">{format(comment.timestamp, 'PP p')}</p>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleAddComment}>Add</Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedVulnerability.tags && selectedVulnerability.tags.map((tag: any, index: any) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                    />
                    <Button onClick={handleAddTag}>Add</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateVulnerability}>Update vulnerability</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="autoRefresh">Auto Refresh:</Label>
          <Checkbox
            id="autoRefresh"
            checked={isAutoRefreshEnabled}
            onCheckedChange={(checked) => setIsAutoRefreshEnabled(checked as boolean)}
          />
        </div>
        {isAutoRefreshEnabled && (
          <Select
            value={refreshInterval.toString()}
            onValueChange={(value) => setRefreshInterval(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Refresh Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30000">30 seconds</SelectItem>
              <SelectItem value="60000">1 minute</SelectItem>
              <SelectItem value="300000">5 minutes</SelectItem>
              <SelectItem value="600000">10 minutes</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button onClick={refreshData}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh Now
        </Button>
      </div>
    </div>
  )
}