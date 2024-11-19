import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  GroupingState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { Product } from '../data/schema'
import { ChevronRight, ChevronDown, PinIcon } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { CompareDialog } from './CompareDialog'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  compareProducts: Product[]
  onCompare: (product: Product) => void
  onResetCompare: () => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  compareProducts,
  onResetCompare
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [isCompareDialogOpen, setIsCompareDialogOpen] = React.useState(false)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [pinnedRows, setPinnedRows] = React.useState<Record<string, boolean>>({})
  const globalFilterFn = React.useCallback(
    (row: any, _columnId: string, filterValue: string) => {
      const searchValue = filterValue.toLowerCase()
      
      const getValue = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.flatMap(item => getValue(item))
        }
        if (typeof obj === 'object' && obj !== null) {
          return Object.values(obj).flatMap(value => getValue(value))
        }
        return [String(obj).toLowerCase()]
      }

      const flattenedValues = getValue(row.original)
      return flattenedValues.some((value: any) => value.includes(searchValue))
    },
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      grouping,
      expanded,
    },
    enableRowSelection: true,
    enableGrouping: true,
    enableExpanding: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn,
  })

  const toggleRowPin = (rowId: string) => {
    setPinnedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }))
  }

  const sortedRows = React.useMemo(() => {
    const unpinnedRows = table.getRowModel().rows.filter(row => !pinnedRows[row.id])
    const pinnedRowsArray = table.getRowModel().rows.filter(row => pinnedRows[row.id])
    return [...pinnedRowsArray, ...unpinnedRows]
  }, [table.getRowModel().rows, pinnedRows])

  return (
    <div className='space-y-4'>
      <DataTableToolbar 
        table={table}
        compareProducts={compareProducts}
        onCompare={() => setIsCompareDialogOpen(true)}
        onResetCompare={onResetCompare}
      />
      <CompareDialog
        products={compareProducts}
        isOpen={isCompareDialogOpen}
        onClose={() => setIsCompareDialogOpen(false)}
      />
      <div className='rounded-md border overflow-hidden'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanGroup()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleGroupingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsGrouped() && ' 🔥'}
                      </div>
                    )}
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                        style: {
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          width: '5px',
                          background: 'rgba(0,0,0,.5)',
                          cursor: 'col-resize',
                          userSelect: 'none',
                          touchAction: 'none',
                        },
                      }}
                    />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                style={{
                  backgroundColor: pinnedRows[row.id] ? 'rgba(59, 130, 246, 0.1)' : undefined,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.getIsGrouped() ? (
                      <Button
                        variant="ghost"
                        {...{
                          onClick: row.getToggleExpandedHandler(),
                          style: { cursor: 'pointer' },
                        }}
                      >
                        {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}{' '}
                        ({row.subRows.length})
                      </Button>
                    ) : cell.getIsAggregated() ? (
                      flexRender(
                        cell.column.columnDef.aggregatedCell ??
                          cell.column.columnDef.cell,
                        cell.getContext()
                      )
                    ) : cell.getIsPlaceholder() ? null : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowPin(row.id)}
                    aria-label={pinnedRows[row.id] ? "Unpin row" : "Pin row"}
                  >
                    <PinIcon className={`h-4 w-4 ${pinnedRows[row.id] ? 'text-blue-500' : ''}`} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}