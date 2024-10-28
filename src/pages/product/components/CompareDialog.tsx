import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Product } from '../data/schema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface CompareDialogProps {
  products: Product[]
  isOpen: boolean
  onClose: () => void
}

export function CompareDialog({ products, isOpen, onClose }: CompareDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Product Comparison</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              {products.map((product) => (
                <TableHead key={product.id}>{product.general.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Brand</TableCell>
              {products.map((product) => (
                <TableCell key={product.id}>{product.general.brand}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>Category</TableCell>
              {products.map((product) => (
                <TableCell key={product.id}>{product.general.category}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>Material</TableCell>
              {products.map((product) => (
                <TableCell key={product.id}>{product.details.material}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>Care Instructions</TableCell>
              {products.map((product) => (
                <TableCell key={product.id}>{product.details.careInstructions.join(', ')}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>Features</TableCell>
              {products.map((product) => (
                <TableCell key={product.id}>{product.details.features.join(', ')}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>Offer</TableCell>
              {products.map((product) => (
                <TableCell key={product.id}>{product.promotion.offer}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>Discount</TableCell>
              {products.map((product) => (
                <TableCell key={product.id}>{product.promotion.discountPercentage}%</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}