import { Table } from '@tanstack/react-table'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { Download, FileJson, FileSpreadsheetIcon, FileText, GitCompare, PlusCircle, RefreshCw, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { importExcel } from '@/lib/exportExcel'
import { Product } from '../data/schema'
import { useState } from 'react'
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
import { IconFileTypeCsv, IconFileTypePdf } from '@tabler/icons-react'
import { brands, categories } from '../data/data'
import { Button } from '@/components/custom/button'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  compareProducts: Product[]
  onCompare: () => void
  onResetCompare: () => void
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

type HeaderPath = string;

export function DataTableToolbar<TData>({
  table,
  compareProducts,
  onCompare,
  onResetCompare
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleImport = async () => {
    if (!importFile) return;
    try {
      const fileExtension = importFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'csv' || fileExtension === 'tsv') {
        await importDelimitedFile(importFile, fileExtension);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        await importExcel(importFile);
      } else {
        console.error('Unsupported file type');
      }
    } catch (error) {
      console.error('Error importing file:', error);
    }
  };

  const importDelimitedFile = async (file: File, fileType: 'csv' | 'tsv') => {
    const text = await file.text();
    const delimiter = fileType === 'csv' ? ',' : '\t';
    const rows = text.split('\n').map(row => row.split(delimiter));
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = row[index]?.trim() || '';
      });
      return obj;
    });
    console.log('Imported data:', data);
    // Here you would typically update your application state or send the data to your backend
  };

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

  const exportData = (format: 'csv' | 'json' | 'excel' | 'tsv' | 'pdf') => {
    const data = table.getCoreRowModel().rows.map(row => row.original as Product);
    let content: string;
    let filename: string;
    let mimeType: string;

    const headers: HeaderPath[] = [
      'id',
      'general.name',
      'general.description',
      'general.brand',
      'general.category',
      'details.material',
      'details.careInstructions',
      'details.features',
      'variants',
      'promotion.offer',
      'promotion.discountPercentage'
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
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const tableColumn = headers.map(header => header.split('.').pop() || header);
      const tableRows = data.map(item => {
        const flatItem = flattenObject(item);
        return headers.map(header => formatValue(flatItem[header]));
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        styles: { overflow: 'linebreak', cellWidth: 'wrap' },
        columnStyles: { text: { cellWidth: 'auto' } },
      });

      filename = 'products.pdf';
      doc.save(filename);
      setIsExportDialogOpen(false);
      return;
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
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("brand") && (
          <DataTableFacetedFilter
            column={table.getColumn("brand")}
            title="Brand"
            options={brands}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className='space-x-4 flex'>
        <Button
          onClick={onCompare}
          className="h-8 px-2 lg:px-3"
          disabled={compareProducts.length < 2}
        >
          <GitCompare className="mr-2 h-4 w-4" />
          Compare ({compareProducts.length}/2)
        </Button>
        <Button
          onClick={onResetCompare}
          className="h-8 px-2 lg:px-3"
          variant="outline"
          disabled={compareProducts.length === 0}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <DataTableViewOptions table={table} />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Import</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Import File</DialogTitle>
              <DialogDescription>
                Please select a CSV, TSV, or Excel file to import your data.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file-upload" className="text-right">
                  File
                </Label>
                <Input
                  type="file"
                  accept=".csv, .tsv, .xlsx, .xls"
                  id="file-upload"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleImport}>Import</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <Link to="/product/add">
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Link>
        </Button>
      </div>
    </div>
  )
}