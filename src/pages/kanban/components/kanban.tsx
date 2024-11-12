import { useState, useMemo, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'

import { Search, Grid, List, PanelRightClose, Plus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, differenceInDays } from 'date-fns'
import { Button } from '@/components/custom/button'
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { initialData, initialUsers } from '../data/kanbans';
import { Activity, Severity, Vulnerability } from '../data/schema';
import ListView from './ListView';
import VulnerabilityCard from './VulnerabilityCard';
import VulnerabilityDialog from './VulnerabilityDialog';
import AnalyticsDialog from './AnalyticsDialog';
import RiskScoreDialog from './RiskScoreDialog';
import AutoRefresh from './AutoRefresh';
import AddColumnDialog from './AddColumnDialog';
import ExportDataDialog from './ExportDataDialog';
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function EnhancedVulnerabilityKanban() {
  const [columns, setColumns] = useState(initialData)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [sortBy, setSortBy] = useState<'severity' | 'score'>('severity')
  const [filterBy, setFilterBy] = useState<Severity | 'All'>('All')
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activityLog, setActivityLog] = useState<Activity[]>([])
  const [isAnalyticsDialogOpen, setIsAnalyticsDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isSeverityDialogOpen, setIsSeverityDialogOpen] = useState(false)
  const [isRiskScoreDialogOpen, setIsRiskScoreDialogOpen] = useState(false)
  const [riskScore, setRiskScore] = useState(0)
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

  const refreshData = useCallback(() => {
    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns }
      Object.keys(updatedColumns).forEach(columnId => {
        updatedColumns[columnId].items = updatedColumns[columnId].items.map(item => ({
          ...item,
          score: Math.floor(Math.random() * 100)
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
    setRiskScore(Math.min(100, Math.max(0, riskScore)))
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

  const handleAddVulnerability = (newVulnerability: Omit<Vulnerability, 'id' | 'status' | 'comments' | 'priority'>) => {
    const newId = `card${Math.max(...allVulnerabilities.map(v => parseInt(v.id.replace('card', '')))) + 1}`
    const newItem: Vulnerability = {
      ...newVulnerability,
      id: newId,
      status: 'Draft',
      comments: [],
      priority: false,
    }
    setColumns(prev => ({
      ...prev,
      draft: {
        ...prev.draft,
        items: [...prev.draft.items, newItem]
      }
    }))
    setIsAddDialogOpen(false)
    addActivity(`Added new vulnerability "${newItem.title}"`)
    toast({
      title: "Vulnerability added",
      description: `${newItem.title} has been added to the Draft column`,
    })
  }

  const handleUpdateVulnerability = (updatedVulnerability: Omit<Vulnerability, 'id' | 'status' | 'comments' | 'priority'>) => {
    if (!selectedVulnerability) return

    setColumns(prev => {
      const updatedColumns = { ...prev }
      for (const [columnId, column] of Object.entries(updatedColumns)) {
        const itemIndex = column.items.findIndex(item => item.id === selectedVulnerability.id)
        if (itemIndex !== -1) {
          updatedColumns[columnId].items[itemIndex] = {
            ...selectedVulnerability,
            ...updatedVulnerability
          }
          break
        }
      }
      return updatedColumns
    })

    setIsDetailDialogOpen(false)
    setSelectedVulnerability(null)
    addActivity(`Updated vulnerability "${updatedVulnerability.title}"`)
    toast({
      title: "Vulnerability updated",
      description: `${updatedVulnerability.title} has been updated`,
    })
  }

  const handleSaveSeverity = (updatedVulnerability: Omit<Vulnerability, 'id' | 'status' | 'comments' | 'priority'>) => {
    if (!selectedVulnerability) return

    setColumns(prev => {
      const updatedColumns = { ...prev }
      for (const [columnId, column] of Object.entries(updatedColumns)) {
        const itemIndex = column.items.findIndex(item => item.id === selectedVulnerability.id)
        if (itemIndex !== -1) {
          updatedColumns[columnId].items[itemIndex] = {
            ...selectedVulnerability,
            ...updatedVulnerability
          }
          break
        }
      }
      return updatedColumns
    })

    setIsSeverityDialogOpen(false)
    setSelectedVulnerability(null)
    addActivity(`Updated vulnerability "${updatedVulnerability.title}"`)
    toast({
      title: "Vulnerability updated",
      description: `${updatedVulnerability.title} has been updated`,
    })
  }


  const addColumn = (title: string) => {
    const newColumnId = `column${Object.keys(columns).length + 1}`
    setColumns(prev => ({
      ...prev,
      [newColumnId]: {
        id: newColumnId,
        title,
        items: []
      }
    }))
    addActivity(`Added new column "${title}"`)
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
        </Dialog>
        <VulnerabilityDialog
          isOpen={isAddDialogOpen || isDetailDialogOpen}
          onOpenChange={isAddDialogOpen ? setIsAddDialogOpen : setIsDetailDialogOpen}
          vulnerability={selectedVulnerability}
          onSave={isAddDialogOpen ? handleAddVulnerability : handleUpdateVulnerability}
          onSaveSeverity={handleSaveSeverity}
          isSeverityDialogOpen={isSeverityDialogOpen}
          onSeverityDialogChange={setIsSeverityDialogOpen}
          isNewVulnerability={isAddDialogOpen}
          addActivity={addActivity}
        />
        <RiskScoreDialog
          isOpen={isRiskScoreDialogOpen}
          onOpenChange={setIsRiskScoreDialogOpen}
          riskScore={riskScore}
        />
        <AddColumnDialog onAddColumn={addColumn} />

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
        <ExportDataDialog data={allVulnerabilities} />
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
        <AnalyticsDialog
          isOpen={isAnalyticsDialogOpen}
          onOpenChange={setIsAnalyticsDialogOpen}
          vulnerabilities={allVulnerabilities}
          columns={columns}
        />
        <RiskScoreDialog
          isOpen={isRiskScoreDialogOpen}
          onOpenChange={setIsRiskScoreDialogOpen}
          riskScore={riskScore}
        />
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
                            <VulnerabilityCard
                              key={item.id}
                              item={item}
                              index={index}
                              isSelected={selectedItems.includes(item.id)}
                              toggleSelection={toggleItemSelection}
                              setSelectedVulnerability={setSelectedVulnerability}
                              setIsDetailDialogOpen={setIsDetailDialogOpen}
                              handleDeleteVulnerability={handleDeleteVulnerability}
                            />
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
            <ListView
              vulnerabilities={allVulnerabilities}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
              setSelectedVulnerability={setSelectedVulnerability}
              setIsDetailDialogOpen={setIsDetailDialogOpen}
              setIsSeverityDialogOpen={setIsSeverityDialogOpen}
              handleDeleteVulnerability={handleDeleteVulnerability}
              searchTerm={searchTerm}
              filterBy={filterBy}
              sortBy={sortBy}
            />
          )}
        </div>
      </div>
      <AutoRefresh onRefresh={() => refreshData()} />
    </div>
  )
}