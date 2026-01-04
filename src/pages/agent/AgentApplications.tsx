import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Search, Eye, Plus, FileText, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Application {
  id: string;
  customerName: string;
  customerId: string;
  product: string;
  amount: number;
  submittedAt: string;
  status: "draft" | "submitted" | "under_review" | "documents_pending" | "approved" | "rejected" | "disbursed";
  progress: number;
  pendingDocs?: string[];
}

const mockApplications: Application[] = [
  { id: "APP001", customerName: "Rahul Verma", customerId: "CUST001", product: "Personal Loan", amount: 300000, submittedAt: "2024-01-15", status: "under_review", progress: 60 },
  { id: "APP002", customerName: "Sneha Gupta", customerId: "CUST002", product: "Home Loan", amount: 5000000, submittedAt: "2024-01-14", status: "documents_pending", progress: 40, pendingDocs: ["Bank Statement", "ITR"] },
  { id: "APP003", customerName: "Amit Singh", customerId: "CUST003", product: "Business Loan", amount: 1000000, submittedAt: "2024-01-13", status: "approved", progress: 90 },
  { id: "APP004", customerName: "Pooja Sharma", customerId: "CUST004", product: "Personal Loan", amount: 500000, submittedAt: "2024-01-12", status: "draft", progress: 20 },
  { id: "APP005", customerName: "Vikash Kumar", customerId: "CUST005", product: "Car Loan", amount: 800000, submittedAt: "2024-01-11", status: "disbursed", progress: 100 },
  { id: "APP006", customerName: "Meera Patel", customerId: "CUST006", product: "Home Loan", amount: 3500000, submittedAt: "2024-01-10", status: "rejected", progress: 0 },
];

const AgentApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApps = mockApplications.filter(app => {
    const matchesSearch = app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: mockApplications.length,
    pending: mockApplications.filter(a => ["draft", "submitted", "under_review", "documents_pending"].includes(a.status)).length,
    approved: mockApplications.filter(a => a.status === "approved").length,
    disbursed: mockApplications.filter(a => a.status === "disbursed").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "disbursed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
            <p className="text-muted-foreground">Track loan applications submitted by your customers</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Application
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.total}</p>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.pending}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.disbursed}</p>
                  <p className="text-sm text-muted-foreground">Disbursed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="documents_pending">Docs Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{app.customerName}</p>
                        <p className="text-sm text-muted-foreground">{app.customerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{app.product}</TableCell>
                    <TableCell className="font-semibold">₹{app.amount.toLocaleString()}</TableCell>
                    <TableCell>{app.submittedAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={app.progress} className="w-20 h-2" />
                        <span className="text-xs text-muted-foreground">{app.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <StatusBadge status={app.status as any} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application Details - {app.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Customer</p>
                                  <p className="font-medium">{app.customerName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Product</p>
                                  <p className="font-medium">{app.product}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                                  <p className="font-medium text-xl">₹{app.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Submitted Date</p>
                                  <p className="font-medium">{app.submittedAt}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Application Progress</p>
                                <Progress value={app.progress} className="h-3" />
                                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                  <span>Submitted</span>
                                  <span>KYC</span>
                                  <span>Documents</span>
                                  <span>Approval</span>
                                  <span>Disbursed</span>
                                </div>
                              </div>

                              {app.pendingDocs && app.pendingDocs.length > 0 && (
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                  <p className="font-medium text-amber-600 mb-2">Pending Documents</p>
                                  <ul className="space-y-2">
                                    {app.pendingDocs.map((doc, idx) => (
                                      <li key={idx} className="flex items-center justify-between">
                                        <span className="text-sm">{doc}</span>
                                        <Button size="sm" variant="outline">
                                          <Upload className="h-3 w-3 mr-1" /> Upload
                                        </Button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1">View Documents</Button>
                                <Button className="flex-1">Contact Customer</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {app.status === "documents_pending" && (
                          <Button size="sm">
                            <Upload className="h-4 w-4 mr-1" /> Upload
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgentApplications;
