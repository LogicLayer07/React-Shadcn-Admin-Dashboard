import { ColumnDef, Row } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Product } from '../data/schema'
import { brands, categories } from '../data/data'
import { Button } from '@/components/custom/button'
import { useState } from 'react'

interface ColumnsProps {
  editProduct: (id: number, updatedProduct: Partial<Product>) => void
  deleteProduct: (id: number) => void
  copyProduct: (id: number) => void
  favoriteProduct: (id: number) => void
  labelProduct: (id: number, label: string) => void
  compareProduct: (product: Product) => void
}

export const columns = ({
  editProduct,
  deleteProduct,
  copyProduct,
  favoriteProduct,
  labelProduct,
  compareProduct
}: ColumnsProps): ColumnDef<Product>[] => [
    // {
    //   id: "compare",
    //   cell: ({ row }) => (
    //     <Button
    //       variant="outline"
    //       size="sm"
    //       onClick={() => compareProduct(row.original)}
    //     >
    //       Compare
    //     </Button>
    //   ),
    // },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    //   cell: ({ row }) => <div className="w-[10px]">{row.getValue("id")}</div>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const name = row.original.general.name
        return (
          <div className="flex space-x-2">
            <Badge variant="outline">{name}</Badge>
          </div>
        )
      },
      accessorFn: (row: Product) => row.general.name,
      filterFn: (row: Row<Product>, id: string, value: string) => {
        const name = (row.getValue(id) as string).toLowerCase()
        return name.includes(value.toLowerCase())
      },
    },
    {
      accessorKey: "brand",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Brand" />,
      cell: ({ row }) => {
        const brand = row.getValue("brand") as string
        const brandData = brands.find(b => b.value === brand)
        return (
          <div className="flex items-center">
            {brandData && brandData.icon && <brandData.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
            <Badge variant="outline">{brand}</Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const brand = row.getValue(id) as string
        return value.includes(brand)
      },
      accessorFn: (row: Product) => row.general.brand,
    },
    {
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => {
        const category = row.original.general.category
        const categoryData = categories.find(b => b.value === category)
        return (
          <div className="flex space-x-2">
            {categoryData && categoryData.icon && <categoryData.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
            <Badge variant="outline">{category}</Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        const brand = row.getValue(id) as string
        return value.includes(brand)
      },
      accessorFn: (row: Product) => row.general.category,
    },
    {
      accessorKey: "variants",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Variants" />,
      cell: ({ row }) => {
        const variants = row.original.variants
        const [selectedSize, setSelectedSize] = useState<string | null>(null)
        const [selectedColor, setSelectedColor] = useState<string | null>(null)

        const handleSizeSelect = (size: string) => {
          setSelectedSize(size === selectedSize ? null : size)
          setSelectedColor(null)
        }

        const handleColorSelect = (color: string) => {
          setSelectedColor(color === selectedColor ? null : color)
        }

        const getPrice = () => {
          if (selectedSize && selectedColor) {
            const variant = variants.find((v: any) => v.size === selectedSize)
            const colorVariant = variant?.colors.find((c: any) => c.color === selectedColor)
            if (colorVariant) {
              return (
                <div className='flex flex-wrap gap-1'>
                  <Badge variant="outline">${colorVariant.price.toFixed(2)}</Badge>
                  <Badge variant="outline">${colorVariant.originalPrice.toFixed(2)}</Badge>
                  <Badge variant="outline">{colorVariant.stockStatus}</Badge>
                </div>
              )
            }
          }
          return null
        }
        return (
          <div className="flex flex-wrap gap-2">
            <div>
              <div className="flex flex-wrap gap-1">
                {variants.map((variant: any) => (
                  <>
                    <Button
                      key={variant.size}
                      size="sm"
                      variant={selectedSize === variant.size ? "default" : "outline"}
                      onClick={() => handleSizeSelect(variant.size)}
                    >
                      {variant.size}
                    </Button>
                  </>
                ))}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap gap-1">
                {variants
                  .find((v: any) => v.size === selectedSize)
                  ?.colors.map((color: any) => (
                    <>
                      <Button
                        key={color.color}
                        size="sm"
                        variant={selectedColor === color.color ? "default" : "outline"}
                        onClick={() => handleColorSelect(color.color)}
                      >
                        {color.color}
                      </Button>
                    </>
                  ))}
              </div>
            </div>
            {getPrice()}
          </div>
        )
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => {
        const description = row.original.general.description
        return (
          <div className="max-w-[200px] truncate">{description}</div>
        )
      },
    },
    {
      accessorKey: "material",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Material" />,
      cell: ({ row }) => {
        const material = row.original.details.material
        return (
          <div className="flex space-x-2">
            <Badge variant="outline">{material}</Badge>
          </div>
        )
      },
    },
    
    {
      accessorKey: "careInstructions",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Care Instructions" />,
      cell: ({ row }) => {
        const careInstructions = row.original.details.careInstructions
        return (
          <div className="flex flex-wrap gap-1">
            {careInstructions.map((instruction, index) => (
              <Badge key={index} variant="outline">{instruction}</Badge>
            ))}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          editProduct={editProduct}
          deleteProduct={deleteProduct}
          copyProduct={copyProduct}
          favoriteProduct={favoriteProduct}
          labelProduct={labelProduct}
          compareProduct={compareProduct}
        />
      ),
    },
  ]