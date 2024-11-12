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
import { CompareDialog } from './CompareDialog'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/custom/button'

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
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
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
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}