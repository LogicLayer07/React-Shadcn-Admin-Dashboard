import { Order } from "./schema";
export const ordersDataTotal: Order[] = [
  {
    id: "ORD001",
    customer: "Liam Johnson",
    email: "liam@example.com",
    phone: "+1 234 567 890",
    type: "Sale",
    status: "Fulfilled",
    date: "2025-01-15",
    amount: 300.0,
    items: [
      { name: "Glimmer Lamp", quantity: 2, price: 125.0 },
      { name: "Aqua Filter", quantity: 1, price: 50.0 }
    ],
    shippingAddress: {
      street: "1234 Main St.",
      city: "Anytown",
      state: "CA",
      zipCode: "12345"
    },
    billingAddress: {
      street: "1234 Main St.",
      city: "Anytown",
      state: "CA",
      zipCode: "12345"
    },
    paymentMethod: {
      type: "Visa",
      cardLastFour: "4532"
    }
  },
  {
    id: "ORD002",
    customer: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1 987 654 321",
    type: "Sale",
    status: "Pending",
    date: "2025-02-20",
    amount: 450.0,
    items: [
      { name: "Solar Charger", quantity: 3, price: 150.0 }
    ],
    shippingAddress: {
      street: "5678 Oak St.",
      city: "New City",
      state: "NY",
      zipCode: "67890"
    },
    billingAddress: {
      street: "5678 Oak St.",
      city: "New City",
      state: "NY",
      zipCode: "67890"
    },
    paymentMethod: {
      type: "MasterCard",
      cardLastFour: "7890"
    }
  },
  {
    id: "ORD003",
    customer: "Oliver Smith",
    email: "oliver@example.com",
    phone: "+1 456 789 123",
    type: "Return",
    status: "Processing",
    date: "2025-03-05",
    amount: 220.0,
    items: [
      { name: "Portable Speaker", quantity: 2, price: 110.0 }
    ],
    shippingAddress: {
      street: "9101 Pine Rd.",
      city: "Old Town",
      state: "TX",
      zipCode: "11223"
    },
    billingAddress: {
      street: "9101 Pine Rd.",
      city: "Old Town",
      state: "TX",
      zipCode: "11223"
    },
    paymentMethod: {
      type: "Amex",
      cardLastFour: "2345"
    }
  },
  {
    id: "ORD004",
    customer: "Sophia Davis",
    email: "sophia@example.com",
    phone: "+1 321 654 987",
    type: "Sale",
    status: "Shipped",
    date: "2025-04-18",
    amount: 540.0,
    items: [
      { name: "Desk Lamp", quantity: 3, price: 180.0 }
    ],
    shippingAddress: {
      street: "3456 Elm St.",
      city: "Capitol City",
      state: "WA",
      zipCode: "22334"
    },
    billingAddress: {
      street: "3456 Elm St.",
      city: "Capitol City",
      state: "WA",
      zipCode: "22334"
    },
    paymentMethod: {
      type: "Discover",
      cardLastFour: "3456"
    }
  },
  {
    id: "ORD005",
    customer: "James Brown",
    email: "james@example.com",
    phone: "+1 654 321 789",
    type: "Sale",
    status: "Fulfilled",
    date: "2025-05-22",
    amount: 320.0,
    items: [
      { name: "Water Purifier", quantity: 1, price: 320.0 }
    ],
    shippingAddress: {
      street: "7890 Cedar St.",
      city: "Beachside",
      state: "FL",
      zipCode: "33445"
    },
    billingAddress: {
      street: "7890 Cedar St.",
      city: "Beachside",
      state: "FL",
      zipCode: "33445"
    },
    paymentMethod: {
      type: "Visa",
      cardLastFour: "5678"
    }
  },
  {
    id: "ORD006",
    customer: "Mia White",
    email: "mia@example.com",
    phone: "+1 987 123 456",
    type: "Return",
    status: "Completed",
    date: "2025-10-30",
    amount: 120.0,
    items: [
      { name: "Electric Kettle", quantity: 1, price: 120.0 }
    ],
    shippingAddress: {
      street: "1020 Willow St.",
      city: "Mountain View",
      state: "CO",
      zipCode: "44556"
    },
    billingAddress: {
      street: "1020 Willow St.",
      city: "Mountain View",
      state: "CO",
      zipCode: "44556"
    },
    paymentMethod: {
      type: "MasterCard",
      cardLastFour: "6789"
    }
  },
  {
    id: "ORD007",
    customer: "Noah Miller",
    email: "noah@example.com",
    phone: "+1 123 789 456",
    type: "Sale",
    status: "Pending",
    date: "2025-10-10",
    amount: 600.0,
    items: [
      { name: "Outdoor Tent", quantity: 2, price: 300.0 }
    ],
    shippingAddress: {
      street: "8901 Maple St.",
      city: "Lakeside",
      state: "MI",
      zipCode: "55667"
    },
    billingAddress: {
      street: "8901 Maple St.",
      city: "Lakeside",
      state: "MI",
      zipCode: "55667"
    },
    paymentMethod: {
      type: "Amex",
      cardLastFour: "7890"
    }
  },
  {
    id: "ORD008",
    customer: "Charlotte Martinez",
    email: "charlotte@example.com",
    phone: "+1 654 987 123",
    type: "Sale",
    status: "Shipped",
    date: "2025-10-14",
    amount: 400.0,
    items: [
      { name: "Fitness Tracker", quantity: 4, price: 100.0 }
    ],
    shippingAddress: {
      street: "1234 Birch St.",
      city: "Rivertown",
      state: "IL",
      zipCode: "66778"
    },
    billingAddress: {
      street: "1234 Birch St.",
      city: "Rivertown",
      state: "IL",
      zipCode: "66778"
    },
    paymentMethod: {
      type: "Visa",
      cardLastFour: "8901"
    }
  },
  {
    id: "ORD009",
    customer: "Amelia Garcia",
    email: "amelia@example.com",
    phone: "+1 321 456 789",
    type: "Return",
    status: "Processing",
    date: "2025-10-02",
    amount: 180.0,
    items: [
      { name: "Blender", quantity: 1, price: 180.0 }
    ],
    shippingAddress: {
      street: "5678 Aspen St.",
      city: "Greenfield",
      state: "OR",
      zipCode: "77889"
    },
    billingAddress: {
      street: "5678 Aspen St.",
      city: "Greenfield",
      state: "OR",
      zipCode: "77889"
    },
    paymentMethod: {
      type: "MasterCard",
      cardLastFour: "9012"
    }
  },
  {
    id: "ORD010",
    customer: "Lucas Anderson",
    email: "lucas@example.com",
    phone: "+1 789 654 321",
    type: "Sale",
    status: "Fulfilled",
    date: "2025-10-11",
    amount: 750.0,
    items: [
      { name: "Air Purifier", quantity: 3, price: 250.0 }
    ],
    shippingAddress: {
      street: "9101 Spruce St.",
      city: "Sunnyvale",
      state: "CA",
      zipCode: "88990"
    },
    billingAddress: {
      street: "9101 Spruce St.",
      city: "Sunnyvale",
      state: "CA",
      zipCode: "88990"
    },
    paymentMethod: {
      type: "Visa",
      cardLastFour: "0123"
    }
  }
];
