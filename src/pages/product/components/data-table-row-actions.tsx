import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/custom/button';
import { Product, productSchema } from '../data/schema';

interface DataTableRowActionsProps {
  row: Row<Product>;
  editProduct: (id: number, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  copyProduct: (id: number) => void;
  favoriteProduct: (id: number) => void;
  labelProduct: (id: number, label: string) => void;
  compareProduct: (product: Product) => void;
}

export function DataTableRowActions({
  row,
  editProduct,
  deleteProduct,
  copyProduct,
  favoriteProduct,
  labelProduct,
  compareProduct,
}: DataTableRowActionsProps) {
  const product = productSchema.parse(row.original);
  const [isFavorite, setIsFavorite] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleCompare = () => {
    compareProduct(product);
  };
  
  const handleEdit = () => {
    setEditedProduct({ ...product }); 
    setIsEditDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    editProduct(product.id, editedProduct);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(product.id);
    }
  };

  const handleCopy = () => {
    copyProduct(product.id);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    favoriteProduct(product.id);
  };

  const handleLabel = (label: string) => {
    labelProduct(product.id, label);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onSelect={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopy}>Make a copy</DropdownMenuItem>
          <DropdownMenuItem onSelect={handleFavorite}>
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCompare}>Compare</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={product.general.category}>
                {['Tops', 'Bottoms', 'Accessories', 'Footwear'].map((label) => (
                  <DropdownMenuRadioItem
                    key={label}
                    value={label}
                    onSelect={() => handleLabel(label)}
                  >
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleDelete}>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="product-name">Name</Label>
            <Input
              id="product-name"
              value={editedProduct.general.name}
              onChange={(e) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  general: { ...prev.general, name: e.target.value },
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="product-description">Description</Label>
            <Input
              id="product-description"
              value={editedProduct.general.description}
              onChange={(e) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  general: { ...prev.general, description: e.target.value },
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="product-brand">Brand</Label>
            <Select
              value={editedProduct.general.brand}
              onValueChange={(value: string) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  general: { ...prev.general, brand: value },
                }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select order status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ComfortWear">ComfortWear</SelectItem>
                <SelectItem value="StylePro">StylePro</SelectItem>
                <SelectItem value="ActiveFit">ActiveFit</SelectItem>
                <SelectItem value="UrbanTrend">UrbanTrend</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={editedProduct.general.category}
              onValueChange={(value: string) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  general: { ...prev.general, category: value },
                }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select order status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tops">Tops</SelectItem>
                <SelectItem value="Bottoms">Bottoms</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Footwear">Footwear</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="product-material">Material</Label>
             <Select
              value={editedProduct.details.material}
              onValueChange={(value: string) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  details: { ...prev.details, material: value },
                }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select order status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100% Cotton">100% Cotton</SelectItem>
                <SelectItem value="Polyester Blend">Polyester Blend</SelectItem>
                <SelectItem value="Wool">Wool</SelectItem>
                <SelectItem value="Silk">Silk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="product-care-instructions">Care Instructions</Label>
            <Input
              id="product-care-instructions"
              value={editedProduct.details.careInstructions.join(', ')}
              onChange={(e) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    careInstructions: e.target.value.split(',').map((s) => s.trim()),
                  },
                }))
              }
              placeholder="Comma-separated instructions"
              required
            />
          </div>
          <div>
            <Label htmlFor="product-features">Features</Label>
            <Input
              id="product-features"
              value={editedProduct.details.features.join(', ')}
              onChange={(e) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    features: e.target.value.split(',').map((s) => s.trim()),
                  },
                }))
              }
              placeholder="Comma-separated features"
              required
            />
          </div>

          {/* Variants (for simplicity, only the first variant is shown) */}
          <div>
            <Label htmlFor="product-size">Size</Label>
            <Input
              id="product-size"
              value={editedProduct.variants[0]?.size || ''}
              onChange={(e) =>
                setEditedProduct((prev) => {
                  const updatedVariants = [...prev.variants];
                  updatedVariants[0].size = e.target.value;
                  return { ...prev, variants: updatedVariants };
                })
              }
              required
            />
          </div>

          {/* Promotion */}
          <div>
            <Label htmlFor="product-offer">Offer</Label>
            <Input
              id="product-offer"
              value={editedProduct.promotion.offer}
              onChange={(e) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  promotion: { ...prev.promotion, offer: e.target.value },
                }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="product-discount">Discount Percentage</Label>
            <Input
              id="product-discount"
              type="number"
              value={editedProduct.promotion.discountPercentage}
              onChange={(e) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  promotion: { ...prev.promotion, discountPercentage: Number(e.target.value) },
                }))
              }
              required
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleDialogSubmit}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
