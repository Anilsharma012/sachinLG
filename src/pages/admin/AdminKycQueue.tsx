import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const mockKycData = [
  { id: "KYC001", customerName: "Rajesh Kumar", customerId: "CUST001", documentType: "Aadhaar", submittedAt: "2024-01-15", status: "pending" },
  { id: "KYC002", customerName: "Priya Sharma", customerId: "CUST002", documentType: "PAN Card", submittedAt: "2024-01-14", status: "approved" },
  { id: "KYC003", customerName: "Amit Patel", customerId: "CUST003", documentType: "Address Proof", submittedAt: "2024-01-13", status: "rejected" },
  { id: "KYC004", customerName: "Sunita Devi", customerId: "CUST004", documentType: "Bank Statement", submittedAt: "2024-01-12", status: "pending" },
  { id: "KYC005", customerName: "Vikram Singh", customerId: "CUST005", documentType: "Salary Slip", submittedAt: "2024-01-11", status: "pending" },
];

const AdminKycQueue = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = mockKycData.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = mockKycData.filter(k => k.status === "pending").length;
  const approvedCount = mockKycData.filter(k => k.status === "approved").length;
  const rejectedCount = mockKycData.filter(k => k.status === "rejected").length;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">KYC Queue</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
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
                  placeholder="Search by name or customer ID..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>KYC ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.customerName}</p>
                        <p className="text-sm text-muted-foreground">{item.customerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.documentType}</TableCell>
                    <TableCell>{item.submittedAt}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status as any} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" /> Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>KYC Review - {item.customerName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Document Type</p>
                                  <p className="font-medium">{item.documentType}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Submitted Date</p>
                                  <p className="font-medium">{item.submittedAt}</p>
                                </div>
                              </div>
                              <div className="border rounded-lg p-8 bg-muted/50 text-center">
                                <p className="text-muted-foreground">Document Preview Area</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Remarks</label>
                                <Textarea placeholder="Add remarks for approval/rejection..." />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="destructive">
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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

export default AdminKycQueue;
