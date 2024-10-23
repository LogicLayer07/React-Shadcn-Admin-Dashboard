import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/custom/button';
import { Download, FileText, FileSpreadsheetIcon, FileJson } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IconFileTypeCsv, IconFileTypePdf } from '@tabler/icons-react';
import { Vulnerability } from '../data/schema';
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
interface ExportDataDialogProps {
  data: any[];
}

const ExportDataDialog: React.FC<ExportDataDialogProps> = ({ data}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const exportData = (format: 'csv' | 'json' | 'excel' | 'tsv' | 'pdf') => {
    let content: string;
    let filename: string;
    let mimeType: string;

    const headers: (keyof Vulnerability)[] = [
      'id', 'title', 'severity', 'type', 'score',
      'assignedTo', 'status', 'startDate', 'endDate'
    ];

    if (format === 'csv' || format === 'tsv') {
      const separator = format === 'csv' ? ',' : '\t';
      const contentRows = data.map(item =>
        headers.map((header) => {
          const value = item[header as keyof Vulnerability];
          if (header === 'assignedTo' && Array.isArray(value)) {
            return value.join(';');
          } else if ((header === 'startDate' || header === 'endDate') && value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }).join(separator)
      );
      content = [headers.join(separator), ...contentRows].join('\n');
      filename = `vulnerabilities.${format}`;
      mimeType = format === 'csv' ? 'text/csv;charset=utf-8;' : 'text/tab-separated-values;charset=utf-8;';
    } else if (format === 'excel') {
      const contentRows = data.map(item =>
        headers.map((header) => {
          const value = item[header as keyof Vulnerability];
          if (header === 'assignedTo' && Array.isArray(value)) {
            return value.join(';');
          } else if ((header === 'startDate' || header === 'endDate') && value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }).join(',')
      );
      content = [headers.join(','), ...contentRows].join('\n');
      filename = 'vulnerabilities.xlsx';
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;';
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const tableColumn = headers.map(header => header.toString());
      const tableRows = data.map(item =>
        headers.map((header) => {
          const value = item[header as keyof Vulnerability];
          if (header === 'assignedTo' && Array.isArray(value)) {
            return value.join(';');
          } else if ((header === 'startDate' || header === 'endDate') && value instanceof Date) {
            return value.toISOString();
          }
          return value ? value.toString() : '';
        })
      );
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
      });

      filename = 'vulnerabilities.pdf';
      doc.save(filename);
      setIsExportDialogOpen(false);
      return;
    } else {
      content = JSON.stringify(data, null, 2);
      filename = 'vulnerabilities.json';
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
            Choose the format to export your data.
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
  );
};

export default ExportDataDialog;
