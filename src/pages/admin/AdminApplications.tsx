import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockApplications, mockLoanProducts } from "@/data/mockData";
import type { LoanApplication } from "@/types";
import { format } from "date-fns";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusCounts = {
  all: mockApplications.length,
  under_review: mockApplications.filter((a) => a.status === "under_review").length,
  doc_pending: mockApplications.filter((a) => a.status === "doc_pending").length,
  approved: mockApplications.filter((a) => a.status === "approved").length,
  disbursed: mockApplications.filter((a) => a.status === "disbursed").length,
};

export default function AdminApplications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);

  const filteredApplications = mockApplications.filter((app) => {
    const matchesSearch =
      app.applicationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesProduct = productFilter === "all" || app.productId === productFilter;
    return matchesSearch && matchesStatus && matchesProduct;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Loan Applications</h1>
            <p className="text-muted-foreground">Manage and process loan applications</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="gradient-accent text-accent-foreground">
              + New Application
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Applications" },
            { key: "under_review", label: "Under Review" },
            { key: "doc_pending", label: "Docs Pending" },
            { key: "approved", label: "Approved" },
            { key: "disbursed", label: "Disbursed" },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={statusFilter === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab.key)}
              className={statusFilter === tab.key ? "gradient-primary" : ""}
            >
              {tab.label}
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-background/20">
                {statusCounts[tab.key as keyof typeof statusCounts] || 0}
              </span>
            </Button>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by application no or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {mockLoanProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tenure</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedApp(app)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{app.applicationNo}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(app.createdAt, "dd MMM yyyy")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.customerName}`}
                          />
                          <AvatarFallback>{app.customerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{app.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium">
                        {app.productName}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(app.requestedAmount)}
                    </TableCell>
                    <TableCell>{app.tenure} months</TableCell>
                    <TableCell>
                      {app.assignedAgentName ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.assignedAgentName}`}
                            />
                            <AvatarFallback>{app.assignedAgentName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{app.assignedAgentName}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(app.updatedAt, "dd MMM")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Documents
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-success">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Application Detail Dialog */}
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedApp && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-xl">{selectedApp.applicationNo}</DialogTitle>
                      <DialogDescription>
                        Applied on {format(selectedApp.createdAt, "dd MMMM yyyy")}
                      </DialogDescription>
                    </div>
                    <StatusBadge status={selectedApp.status} />
                  </div>
                </DialogHeader>

                <Tabs defaultValue="details" className="mt-4">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6 mt-4">
                    {/* Customer Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">
                            Customer Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedApp.customerName}`}
                              />
                              <AvatarFallback>{selectedApp.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedApp.customerName}</p>
                              <p className="text-sm text-muted-foreground">Customer ID: {selectedApp.customerId}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-muted-foreground">
                            Loan Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Product</span>
                            <span className="font-medium">{selectedApp.productName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Requested Amount</span>
                            <span className="font-medium">{formatCurrency(selectedApp.requestedAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tenure</span>
                            <span className="font-medium">{selectedApp.tenure} months</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Purpose</span>
                            <span className="font-medium">{selectedApp.purpose}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sanction Details */}
                    {selectedApp.sanction && (
                      <Card className="bg-success/5 border-success/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-success">Sanction Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Approved Amount</p>
                              <p className="text-lg font-bold">{formatCurrency(selectedApp.sanction.approvedAmount)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Interest Rate</p>
                              <p className="text-lg font-bold">{selectedApp.sanction.interestRate}% p.a.</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">EMI Amount</p>
                              <p className="text-lg font-bold">{formatCurrency(selectedApp.sanction.emiAmount)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline">Request Documents</Button>
                      <Button variant="outline" className="text-destructive border-destructive/50">
                        Reject
                      </Button>
                      <Button className="gradient-accent text-accent-foreground">
                        Approve & Sanction
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-4">
                    <div className="space-y-4">
                      {selectedApp.statusTimeline.map((entry, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            {index < selectedApp.statusTimeline.length - 1 && (
                              <div className="w-px h-full bg-border my-2" />
                            )}
                          </div>
                          <div className="pb-6">
                            <div className="flex items-center gap-2 mb-1">
                              <StatusBadge status={entry.status} />
                              <span className="text-sm text-muted-foreground">
                                {format(entry.timestamp, "dd MMM yyyy, hh:mm a")}
                              </span>
                            </div>
                            <p className="text-sm">
                              Updated by <span className="font-medium">{entry.actorName}</span>
                            </p>
                            {entry.remarks && (
                              <p className="text-sm text-muted-foreground mt-1">{entry.remarks}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Document viewer coming soon</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
