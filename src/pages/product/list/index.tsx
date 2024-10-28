import { DataTable } from '../components/data-table'
import { columns } from '../components/columns'
import { products as initialProducts } from '../data/products'
import { useCallback, useState } from 'react'
import { Product } from '../data/schema'
export default function SettingsProfile() {
  const [productsData, setProductsData] = useState<Product[]>(initialProducts)

  const editProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProductsData(productsData.map(product =>
      product.id === id ? { ...product, ...updatedProduct } : product
    ))
  }

  const deleteProduct = (id: number) => {
    setProductsData(productsData.filter(product => product.id !== id))
  }

  const copyProduct = (id: number) => {
    const productToCopy = productsData.find(product => product.id === id)
    if (productToCopy) {
      const newProduct = {
        ...productToCopy,
        id: Math.max(...productsData.map(p => p.id)) + 1,
        general: { ...productToCopy.general, name: `Copy of ${productToCopy.general.name}` }
      }
      setProductsData([...productsData, newProduct])
    }
  }

  const favoriteProduct = (id: number) => {
    // Implement favorite logic here
    console.log(`Product ${id} favorited`)
  }

  const labelProduct = (id: number, label: string) => {
    setProductsData(productsData.map(product =>
      product.id === id ? { ...product, general: { ...product.general, category: label } } : product
    ))
  }
  const [compareProducts, setCompareProducts] = useState<Product[]>([])

  const compareProduct = useCallback((product: Product) => {
    setCompareProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product].slice(-2)
    )
  }, [])
  const resetCompareProducts = () => {
    setCompareProducts([])
  }
  console.log("compareProducts",compareProducts)
  const productColumns = columns({
    editProduct,
    deleteProduct,
    copyProduct,
    favoriteProduct,
    labelProduct,
    compareProduct,
  })

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DataTable
          data={productsData}
          columns={productColumns}
          compareProducts={compareProducts}
          onCompare={compareProduct}
          onResetCompare={resetCompareProducts}
        />
      </div>
    </>
  )
}


