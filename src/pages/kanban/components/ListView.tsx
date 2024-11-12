import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/custom/button'
import { Badge } from "@/components/ui/badge"
import { Edit3, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Vulnerability, Severity } from '../data/schema'

interface ListViewProps {
  vulnerabilities: Vulnerability[]
  selectedItems: string[]
  toggleItemSelection: (itemId: string) => void
  setSelectedVulnerability: (vulnerability: Vulnerability) => void
  setIsDetailDialogOpen: (isOpen: boolean) => void
  setIsSeverityDialogOpen: (isOpen: boolean) => void
  handleDeleteVulnerability: (vulnerabilityId: string) => void
  searchTerm: string
  filterBy: Severity | 'All'
  sortBy: 'severity' | 'score'
}

export default function ListView({
  vulnerabilities,
  selectedItems,
  toggleItemSelection,
  setSelectedVulnerability,
  setIsDetailDialogOpen,
  setIsSeverityDialogOpen,
  handleDeleteVulnerability,
  searchTerm,
  filterBy,
  sortBy
}: ListViewProps) {
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

  const filteredAndSortedVulnerabilities = vulnerabilities
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

  return (
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
        {filteredAndSortedVulnerabilities.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={() => toggleItemSelection(item.id)}
              />
            </TableCell>
            <TableCell>{item.title}</TableCell>
            <TableCell>
            <Button variant="ghost" size="sm" onClick={() => {
                setSelectedVulnerability(item)
                setIsSeverityDialogOpen(true)
              }}>
              <Badge className={getSeverityColor(item.severity)}>
                {item.severity}
              </Badge>
              </Button>
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
  )
}