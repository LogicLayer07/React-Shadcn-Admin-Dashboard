import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/custom/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
interface AddColumnDialogProps {
  onAddColumn: (title: string) => void
}

export default function AddColumnDialog({ onAddColumn }: AddColumnDialogProps) {
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const handleAddColumn = () => {
    if (!newColumnTitle) return

    onAddColumn(newColumnTitle)
    setIsAddColumnDialogOpen(false)
    setNewColumnTitle('')
    toast({
      title: "Column added",
      description: `New column "${newColumnTitle}" has been added`,
    })
  }

  return (
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
  )
}
