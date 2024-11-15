import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/custom/button'

interface StoreLocation {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  manager: string
  status: 'Open' | 'Closed' | 'Renovating'
  openingHours: string
}

const initialLocations: StoreLocation[] = [
  { id: '1', name: 'Downtown Shoes', address: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', manager: 'Alice Johnson', status: 'Open', openingHours: '9:00 AM - 9:00 PM' },
  { id: '2', name: 'Suburban Footwear', address: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', manager: 'Bob Smith', status: 'Open', openingHours: '10:00 AM - 8:00 PM' },
  { id: '3', name: 'Mall Sneakers', address: '789 Shopping Center', city: 'Chicago', state: 'IL', zipCode: '60007', manager: 'Charlie Brown', status: 'Renovating', openingHours: 'Closed for Renovation' },
]

export default function StoreLocations() {
  const [locations, setLocations] = useState<StoreLocation[]>(initialLocations)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newLocation, setNewLocation] = useState<Omit<StoreLocation, 'id'>>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    manager: '',
    status: 'Open',
    openingHours: ''
  })

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddLocation = () => {
    const newId = (Math.max(...locations.map(location => parseInt(location.id))) + 1).toString()
    setLocations([...locations, { ...newLocation, id: newId }])
    setIsAddDialogOpen(false)
    setNewLocation({ name: '', address: '', city: '', state: '', zipCode: '', manager: '', status: 'Open', openingHours: '' })
  }

  const handleDeleteLocation = (id: string) => {
    setLocations(locations.filter(location => location.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: 'Open' | 'Closed' | 'Renovating') => {
    setLocations(locations.map(location => 
      location.id === id ? { ...location, status: newStatus } : location
    ))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Store Locations</h1>
      <div className="flex justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Store Location</DialogTitle>
              <DialogDescription>Enter the details for the new store location.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newLocation.name} onChange={(e) => setNewLocation({...newLocation, name: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" value={newLocation.address} onChange={(e) => setNewLocation({...newLocation, address: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">City</Label>
                <Input id="city" value={newLocation.city} onChange={(e) => setNewLocation({...newLocation, city: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">State</Label>
                <Input id="state" value={newLocation.state} onChange={(e) => setNewLocation({...newLocation, state: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zipCode" className="text-right">Zip Code</Label>
                <Input id="zipCode" value={newLocation.zipCode} onChange={(e) => setNewLocation({...newLocation, zipCode: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">Manager</Label>
                <Input id="manager" value={newLocation.manager} onChange={(e) => setNewLocation({...newLocation, manager: e.target.value})} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="openingHours" className="text-right">Opening Hours</Label>
                <Input id="openingHours" value={newLocation.openingHours} onChange={(e) => setNewLocation({...newLocation, openingHours: e.target.value})} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddLocation}>Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Zip Code</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Opening Hours</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLocations.map((location) => (
            <TableRow key={location.id}>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.address}</TableCell>
              <TableCell>{location.city}</TableCell>
              <TableCell>{location.state}</TableCell>
              <TableCell>{location.zipCode}</TableCell>
              <TableCell>{location.manager}</TableCell>
              <TableCell>
                <Badge
                  variant={location.status === 'Open' ? "outline" : location.status === 'Closed' ? "destructive" : "outline"}
                >
                  {location.status}
                </Badge>
              </TableCell>
              <TableCell>{location.openingHours}</TableCell>
              <TableCell className='flex items-center'>
                <Select
                  value={location.status}
                  onValueChange={(value: 'Open' | 'Closed' | 'Renovating') => handleStatusChange(location.id, value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Renovating">Renovating</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm">
                  <MapPin className="h-4 w-4 mr-2" /> View Map
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteLocation(location.id)}>
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