import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/custom/button'

interface InventoryItem {
  id: string
  sku: string
  name: string
  size: string
  color: string
  quantity: number
  reorderPoint: number
}

const initialInventory: InventoryItem[] = [
  { id: '1', sku: 'SN001', name: 'Running Shoe', size: '42', color: 'Blue', quantity: 50, reorderPoint: 20 },
  { id: '2', sku: 'SN002', name: 'Casual Sneaker', size: '39', color: 'White', quantity: 30, reorderPoint: 15 },
  { id: '3', sku: 'SN003', name: 'Hiking Boot', size: '44', color: 'Brown', quantity: 10, reorderPoint: 10 },
]

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    sku: '',
    name: '',
    size: '',
    color: '',
    quantity: 0,
    reorderPoint: 0
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddItem = () => {
    const newId = (Math.max(...inventory.map(item => parseInt(item.id))) + 1).toString()
    setInventory([...inventory, { ...newItem, id: newId }])
    setIsAddDialogOpen(false)
    setNewItem({ sku: '', name: '', size: '', color: '', quantity: 0, reorderPoint: 0 })
  }

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id))
  }

  const handleReorder = (id: string) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 20 } : item
    ))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <div className="flex justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>Enter the details for the new inventory item.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">SKU</Label>
                <Input id="sku" value={newItem.sku} onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="size" className="text-right">Size</Label>
                <Input id="size" value={newItem.size} onChange={(e) => setNewItem({ ...newItem, size: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">Color</Label>
                <Input id="color" value={newItem.color} onChange={(e) => setNewItem({ ...newItem, color: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input id="quantity" type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reorderPoint" className="text-right">Reorder Point</Label>
                <Input id="reorderPoint" type="number" value={newItem.reorderPoint} onChange={(e) => setNewItem({ ...newItem, reorderPoint: parseInt(e.target.value) })} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddItem}>Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {item.quantity <= item.reorderPoint ? (
                  <Badge variant="destructive">Low Stock</Badge>
                ) : (
                  <Badge variant="outline">In Stock</Badge>
                )}
              </TableCell>
              <TableCell className='flex items-center'>
                <Button variant="ghost" size="sm" onClick={() => handleReorder(item.id)}>
                  Reorder
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
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