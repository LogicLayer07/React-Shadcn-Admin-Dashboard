export type OrderItem = {
  name: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  customer: string
  email: string
  phone: string
  type: string
  status: string
  date: string
  amount: number
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  billingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: {
    type: string
    cardLastFour: string
  }
}