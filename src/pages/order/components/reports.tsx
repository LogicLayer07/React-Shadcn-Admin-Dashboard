import { useEffect, useState } from "react"
import {
  Copy,
  CreditCard,
  ListFilter,
  MoreVertical,
  Truck,
  RefreshCw,
  Printer,
  Send,
  Download,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/custom/button"
import { Order } from "./data/schema"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { BarChart } from "recharts"
import { ordersDataTotal } from "./data/order"

export function EnhancedOrderManagement() {
  const [ordersData, setOrdersData] = useState(ordersDataTotal)
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["All"])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    customer: "",
    email: "",
    phone: "",
    type: "Sale",
    status: "Pending",
    amount: 0,
  })

  const toggleStatusFilter = (status: string) => {
    if (status === "All") {
      setSelectedStatuses(["All"])
    } else {
      const newSelectedStatuses = selectedStatuses.filter(s => s !== "All")
      if (newSelectedStatuses.includes(status)) {
        newSelectedStatuses.splice(newSelectedStatuses.indexOf(status), 1)
      } else {
        newSelectedStatuses.push(status)
      }
      setSelectedStatuses(newSelectedStatuses.length ? newSelectedStatuses : ["All"])
    }
  }
  const filterOrders = () => {
    const now = new Date();
    const filtered = ordersDataTotal.filter((order) => {
      const orderDate = new Date(order.date);
      let matchesTimeFrame = false;

      if (timeFrame === "week") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesTimeFrame = orderDate >= oneWeekAgo && orderDate <= now;
      } else if (timeFrame === "month") {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        matchesTimeFrame = orderDate >= oneMonthAgo && orderDate <= now;
      } else if (timeFrame === "year") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        matchesTimeFrame = orderDate >= startOfYear && orderDate <= endOfYear;
      }

      const matchesStatus = selectedStatuses.includes("All") || selectedStatuses.includes(order.status);
      const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTimeFrame && matchesStatus && matchesSearch;
    });

    setOrdersData(filtered);
  };

  useEffect(() => {
    filterOrders();
  }, [timeFrame, selectedStatuses, searchTerm]);


  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleRefreshOrders = () => {
    setTimeout(() => {
      toast({
        title: "Orders Refreshed",
        description: "Latest order data has been fetched.",
      })
    }, 1000)
    setSelectedStatuses(["All"])
  }

  const handlePrintInvoice = (orderId: string) => {
    toast({
      title: "Print Invoice",
      description: `Printing invoice for order ${orderId}.`,
    })
  }

  const handleSendConfirmation = (orderId: string) => {
    toast({
      title: "Order Confirmation Sent",
      description: `Confirmation email sent for order ${orderId}.`,
    })
  }

  const handleQuickEditStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = ordersData.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrdersData(updatedOrders)
    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    })
  }

  const calculateTotalAmount = (period: "week" | "month" | "year" | "day") => {
    const now = new Date();
    const filteredOrders = ordersData.filter(order => {
      const orderDate = new Date(order.date);

      switch (period) {
        case "week":
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= oneWeekAgo && orderDate <= now;
        case "month":
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return orderDate >= oneMonthAgo && orderDate <= now;
        case "day":
          return (
            orderDate.getFullYear() === now.getFullYear() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getDate() === now.getDate()
          );
        case "year":
          const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return orderDate >= oneYearAgo && orderDate <= now;
        default:
          return false;
      }
    });

    return filteredOrders.reduce((total, order) => total + order.amount, 0);
  };


  const handleCreateOrder = () => {
    const order: Order = {
      ...newOrder as Order,
      id: `ORD${String(ordersData.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      items: [],
      shippingAddress: { street: "", city: "", state: "", zipCode: "" },
      billingAddress: { street: "", city: "", state: "", zipCode: "" },
      paymentMethod: { type: "", cardLastFour: "" },
    }
    ordersData.push(order)
    setIsCreateOrderOpen(false)
    setNewOrder({
      customer: "",
      email: "",
      phone: "",
      type: "Sale",
      status: "Pending",
      amount: 0,
    })
    filterOrders()
    toast({
      title: "Order Created",
      description: `New order ${order.id} has been created.`,
    })
  }

  // New Feature 3: Order Analytics
  const [showAnalytics, setShowAnalytics] = useState(false)

  const calculateAnalytics = () => {
    const totalOrders = ordersData.length
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.amount, 0)
    const averageOrderValue = totalRevenue / totalOrders
    const statusCounts = ordersData.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { totalOrders, totalRevenue, averageOrderValue, statusCounts }
  }

  // New Feature 4: Order Notes
  const [orderNotes, setOrderNotes] = useState<Record<string, string>>({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('')


  const handleAddNote = (orderId: string, note: string) => {
    try {
      setOrderNotes(prev => ({ ...prev, [orderId]: note }));
      toast({
        title: "Note Added",
        description: `Note added to order ${orderId}.`,
      });
      setNewNote('');
      setIsEditDialogOpen(false);
    } catch (error) {
    }
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
  const exportData = (format: 'csv' | 'json' | 'excel' | 'tsv') => {
    const data = ordersData;
    let content: string;
    let filename: string;
    let mimeType: string;
    const headers = Object.keys(data[0]);
    
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
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4">
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-4">
                <CardHeader className="pb-3">
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Order</DialogTitle>
                        <DialogDescription>
                          Fill in the details to create a new order.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">
                            Customer
                          </Label>
                          <Input
                            id="customer"
                            className="col-span-3"
                            value={newOrder.customer}
                            onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            className="col-span-3"
                            value={newOrder.email}
                            onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            className="col-span-3"
                            value={newOrder.phone}
                            onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">
                            Type
                          </Label>
                          <Select
                            value={newOrder.type}
                            onValueChange={(value) => setNewOrder({ ...newOrder, type: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select order type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sale">Sale</SelectItem>
                              <SelectItem value="Refund">Refund</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">
                            Status
                          </Label>
                          <Select
                            value={newOrder.status}
                            onValueChange={(value) => setNewOrder({ ...newOrder, status: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select order status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                              <SelectItem value="Declined">Declined</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">
                            Amount
                          </Label>
                          <Input
                            id="amount"
                            type="number"
                            className="col-span-3"
                            value={newOrder.amount}
                            onChange={(e) => setNewOrder({ ...newOrder, amount: parseFloat(e.target.value) })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleCreateOrder}>Create Order</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>This Day</CardDescription>
                  <CardTitle className="text-4xl">${calculateTotalAmount("day").toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>This Week</CardDescription>
                  <CardTitle className="text-4xl">${calculateTotalAmount("week").toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +25% from last week
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">${calculateTotalAmount("month").toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">${calculateTotalAmount("year").toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>

            </div>

            <Tabs defaultValue={timeFrame}>
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="week" onClick={() => setTimeFrame("week")}>
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month" onClick={() => setTimeFrame("month")}>
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="year" onClick={() => setTimeFrame("year")}>
                    Year
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={selectedStatuses.includes("All")}
                        onCheckedChange={() => toggleStatusFilter("All")}
                      >
                        All
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedStatuses.includes("Fulfilled")}
                        onCheckedChange={() => toggleStatusFilter("Fulfilled")}
                      >
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedStatuses.includes("Pending")}
                        onCheckedChange={() => toggleStatusFilter("Pending")}
                      >
                        Pending
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={selectedStatuses.includes("Declined")}
                        onCheckedChange={() => toggleStatusFilter("Declined")}
                      >
                        Declined
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-sm"
                    onClick={handleRefreshOrders}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Refresh</span>
                  </Button>
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
                        <Button onClick={() => exportData('csv')}>Export as CSV</Button>
                        <Button onClick={() => exportData('tsv')}>Export as TSV</Button>
                        <Button onClick={() => exportData('json')}>Export as JSON</Button>
                        <Button onClick={() => exportData('excel')}>Export as EXCEL</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-sm"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                  >
                    <BarChart className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Analytics</span>
                  </Button>
                </div>
              </div>
              <TabsContent value={timeFrame}>
                <Card>
                  <CardHeader className="px-7">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Recent orders from your store.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showAnalytics && (
                      <div className="mb-4 p-4 bg-muted rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Order Analytics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p>Total Orders: {calculateAnalytics().totalOrders}</p>
                            <p>Total Revenue: ${calculateAnalytics().totalRevenue.toFixed(2)}</p>
                          </div>
                          <div>
                            <p>Average Order Value: ${calculateAnalytics().averageOrderValue.toFixed(2)}</p>
                            <p>
                              Status Breakdown:
                              {Object.entries(calculateAnalytics().statusCounts).map(([status, count]) => (
                                <span key={status} className="ml-2">
                                  {status}: {count}
                                </span>
                              ))}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="h-[250px] overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ordersData.map((order) => (
                            <TableRow key={order.id} onClick={() => handleOrderClick(order)}>
                              <TableCell>
                                <div className="font-medium">{order.customer}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  {order.email}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {order.type}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge className="text-xs" variant={order.status === "Fulfilled" ? "secondary" : "outline"}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {order.date}
                              </TableCell>
                              <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => handlePrintInvoice(order.id)}>
                                      <Printer className="mr-2 h-4 w-4" />
                                      <span>Print Invoice</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleSendConfirmation(order.id)}>
                                      <Send className="mr-2 h-4 w-4" />
                                      <span>Send Confirmation</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Quick Edit Status</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => handleQuickEditStatus(order.id, "Fulfilled")}>
                                      Set as Fulfilled
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleQuickEditStatus(order.id, "Pending")}>
                                      Set as Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleQuickEditStatus(order.id, "Declined")}>
                                      Set as Declined
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onSelect={() => {
                                        setIsEditDialogOpen(true);
                                      }}
                                    >
                                      Add Note
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Add Note</DialogTitle>
                                      <DialogDescription>
                                        Add a note for order {order.id}.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">
                                          Note
                                        </Label>
                                        <Input
                                          id="addNote"
                                          value={newNote}
                                          onChange={(e) => setNewNote(e.target.value)}
                                          className="col-span-3"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        type="button"
                                        onClick={() => handleAddNote(order.id, newNote)}
                                      >
                                        Save Note
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Order {selectedOrder ? selectedOrder.id : 'Details'}
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: {selectedOrder ? selectedOrder.date : 'Select an order'}</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Track Order
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                {selectedOrder ? (
                  <>
                    <div className="grid gap-3">
                      <div className="font-semibold">Order Details</div>
                      <ul className="grid gap-3">
                        {selectedOrder.items.map((item, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              {item.name} x <span>{item.quantity}</span>
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <Separator className="my-2" />
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${selectedOrder.amount.toFixed(2)}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>$5.00</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span>$25.00</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                          <span className="text-muted-foreground">Total</span>
                          <span>${(selectedOrder.amount + 30).toFixed(2)}</span>
                        </li>
                      </ul>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-3">
                        <div className="font-semibold">Shipping Information</div>
                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                          <span>{selectedOrder.customer}</span>
                          <span>{selectedOrder.shippingAddress.street}</span>
                          <span>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</span>
                        </address>
                      </div>
                      <div className="grid auto-rows-max gap-3">
                        <div className="font-semibold">Billing Information</div>
                        <address className="grid gap-0.5 not-italic text-muted-foreground">
                          <span>{selectedOrder.customer}</span>
                          <span>{selectedOrder.billingAddress.street}</span>
                          <span>{selectedOrder.billingAddress.city}, {selectedOrder.billingAddress.state} {selectedOrder.billingAddress.zipCode}</span>
                        </address>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Customer Information</div>
                      <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Customer</dt>
                          <dd>{selectedOrder.customer}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd>
                            <a href={`mailto:${selectedOrder.email}`}>{selectedOrder.email}</a>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Phone</dt>
                          <dd>
                            <a href={`tel:${selectedOrder.phone}`}>{selectedOrder.phone}</a>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Payment Information</div>
                      <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center gap-1 text-muted-foreground">
                            <CreditCard className="h-4 w-4" />
                            {selectedOrder.paymentMethod.type}
                          </dt>
                          <dd>**** **** **** {selectedOrder.paymentMethod.cardLastFour}</dd>
                        </div>
                      </dl>
                    </div>
                    {orderNotes[selectedOrder.id] && (
                      <>
                        <Separator className="my-4" />
                        <div className="grid gap-3">
                          <div className="font-semibold">Order Notes</div>
                          <p className="text-muted-foreground">{orderNotes[selectedOrder.id]}</p>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Select an order to view details
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Updated <time dateTime={selectedOrder?.date || ""}>{selectedOrder?.date || "N/A"}</time>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}