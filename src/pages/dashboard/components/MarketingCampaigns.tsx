import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Search, Plus, Trash2 } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/custom/button'

interface Campaign {
  id: string
  name: string
  type: string
  startDate: Date
  endDate: Date
  budget: number
  status: 'Active' | 'Scheduled' | 'Ended'
}

const initialCampaigns: Campaign[] = [
  { id: '1', name: 'Summer Sale', type: 'Discount', startDate: new Date(2023, 5, 1), endDate: new Date(2023, 7, 31), budget: 5000, status: 'Active' },
  { id: '2', name: 'Back to School', type: 'Bundle', startDate: new Date(2023, 7, 15), endDate: new Date(2023, 8, 15), budget: 3000, status: 'Scheduled' },
  { id: '3', name: 'Spring Collection Launch', type: 'New Product', startDate: new Date(2023, 2, 1), endDate: new Date(2023, 3, 30), budget: 8000, status: 'Ended' },
]

export default function MarketingCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCampaign, setNewCampaign] = useState<Omit<Campaign, 'id'>>({
    name: '',
    type: '',
    startDate: new Date(),
    endDate: new Date(),
    budget: 0,
    status: 'Scheduled'
  })

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCampaign = () => {
    const newId = (Math.max(...campaigns.map(campaign => parseInt(campaign.id))) + 1).toString()
    setCampaigns([...campaigns, { ...newCampaign, id: newId }])
    setIsAddDialogOpen(false)
    setNewCampaign({ name: '', type: '', startDate: new Date(), endDate: new Date(), budget: 0, status: 'Scheduled' })
  }

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id))
  }

  const handleUpdateStatus = (id: string, newStatus: 'Active' | 'Scheduled' | 'Ended') => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === id ? { ...campaign, status: newStatus } : campaign
    ))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Marketing Campaigns</h1>
      <div className="flex justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>Enter the details for the new marketing campaign.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newCampaign.name} onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Input id="type" value={newCampaign.type} onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">{format(newCampaign.startDate, "PPP")}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newCampaign.startDate}
                      onSelect={(date) =>   date && setNewCampaign({...newCampaign, startDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">{format(newCampaign.endDate, "PPP")}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newCampaign.endDate}
                      onSelect={(date) => date && setNewCampaign({...newCampaign, endDate: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">Budget</Label>
                <Input id="budget" type="number" value={newCampaign.budget} onChange={(e) => setNewCampaign({...newCampaign, budget: parseInt(e.target.value)})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCampaign}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCampaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.name}</TableCell>
              <TableCell>{campaign.type}</TableCell>
              <TableCell>{format(campaign.startDate, "PP")}</TableCell>
              <TableCell>{format(campaign.endDate, "PP")}</TableCell>
              <TableCell>${campaign.budget.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  variant={campaign.status === 'Active' ? "outline" : campaign.status === 'Scheduled' ? "outline" : "secondary"}
                >
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell className='flex items-center'>
                <Select
                  value={campaign.status}
                  onValueChange={(value: 'Active' | 'Scheduled' | 'Ended') => handleUpdateStatus(campaign.id, value)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteCampaign(campaign.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}