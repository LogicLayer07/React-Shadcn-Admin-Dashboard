import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../components/data-table-view-options'
import { Download, FileJson, FileSpreadsheetIcon, FileText } from 'lucide-react'
import { labels, priorities, statuses } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { useState } from 'react'
import { Task } from '../data/schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IconFileTypeCsv } from '@tabler/icons-react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
interface DataTableToolbarProps<TData> {
  table: Table<TData>
  handleCreateTask: (newTask: Omit<Task, "id">) => void
}
type HeaderPath = string;
export function DataTableToolbar<TData>({
  table,
  handleCreateTask
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    status: "backlog",
    label: "bug",
    priority: "low",
  })

  const handleCreateNewTask = () => {
    handleCreateTask(newTask)
    setIsNewTaskDialogOpen(false)
    setNewTask({ title: "", status: "backlog", label: "bug", priority: "low" })
  }
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const flattenObject = (obj: any, prefix = ''): { [key: string]: any } => {
    return Object.keys(obj).reduce((acc: { [key: string]: any }, k: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.map(v => typeof v === 'object' ? JSON.stringify(v) : v).join('; ');
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };
  const exportData = (format: 'csv' | 'json' | 'excel' | 'tsv') => {
    const data = table.getCoreRowModel().rows.map(row => row.original as Task);
    let content: string;
    let filename: string;
    let mimeType: string;

    const headers: HeaderPath[] = [
      'id',
      'title',
      'status',
      'label',
      'priority',
    ];

    if (format === 'csv' || format === 'tsv' || format === 'excel') {
      const separator = format === 'tsv' ? '\t' : ',';
      const contentRows = data.map(item => {
        const flatItem = flattenObject(item);
        return headers.map(header => {
          const value = flatItem[header];
          return formatValue(value);
        }).join(separator);
      });

      content = [headers.join(separator), ...contentRows].join('\n');
      filename = `products.${format === 'excel' ? 'xlsx' : format}`;
      mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' :
        format === 'tsv' ? 'text/tab-separated-values;charset=utf-8;' :
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;';
    } else {
      content = JSON.stringify(data, null, 2);
      filename = 'products.json';
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
    setIsExportDialogOpen(false);
  };
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter tasks...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={statuses}
            />
          )}
          {table.getColumn('priority') && (
            <DataTableFacetedFilter
              column={table.getColumn('priority')}
              title='Priority'
              options={priorities}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='mx-2'>
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
          </div>
        </DialogContent>
      </Dialog>
      </div>
      <div className="flex items-center space-x-2">
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 lg:flex">
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Select
                  value={newTask.label}
                  onValueChange={(value) => setNewTask({ ...newTask, label: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    {labels.map((label) => (
                      <SelectItem key={label.value} value={label.value}>
                        {label.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreateNewTask}>Create Task</Button>
          </DialogContent>
        </Dialog>
        </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
