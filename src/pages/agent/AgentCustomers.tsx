import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Eye, Phone, Mail, Users, UserCheck, FileText, IndianRupee } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycStatus: "pending" | "verified" | "rejected";
  totalLoans: number;
  activeLoans: number;
  totalDisbursed: number;
  createdAt: string;
  lastActivity: string;
}

const mockCustomers: Customer[] = [
  { id: "CUST001", name: "Rahul Verma", phone: "+91 9876543210", email: "rahul@email.com", kycStatus: "verified", totalLoans: 2, activeLoans: 1, totalDisbursed: 800000, createdAt: "2023-06-15", lastActivity: "2024-01-15" },
  { id: "CUST002", name: "Sneha Gupta", phone: "+91 9876543211", email: "sneha@email.com", kycStatus: "verified", totalLoans: 1, activeLoans: 1, totalDisbursed: 5000000, createdAt: "2023-08-20", lastActivity: "2024-01-14" },
  { id: "CUST003", name: "Amit Singh", phone: "+91 9876543212", email: "amit@email.com", kycStatus: "pending", totalLoans: 0, activeLoans: 0, totalDisbursed: 0, createdAt: "2024-01-10", lastActivity: "2024-01-13" },
  { id: "CUST004", name: "Pooja Sharma", phone: "+91 9876543213", email: "pooja@email.com", kycStatus: "verified", totalLoans: 3, activeLoans: 2, totalDisbursed: 1500000, createdAt: "2022-11-05", lastActivity: "2024-01-12" },
  { id: "CUST005", name: "Vikash Kumar", phone: "+91 9876543214", email: "vikash@email.com", kycStatus: "rejected", totalLoans: 0, activeLoans: 0, totalDisbursed: 0, createdAt: "2024-01-05", lastActivity: "2024-01-11" },
];

const AgentCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [kycFilter, setKycFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesKyc = kycFilter === "all" || customer.kycStatus === kycFilter;
    return matchesSearch && matchesKyc;
  });

  const totalCustomers = mockCustomers.length;
  const verifiedCustomers = mockCustomers.filter(c => c.kycStatus === "verified").length;
  const activeLoansCount = mockCustomers.reduce((sum, c) => sum + c.activeLoans, 0);
  const totalDisbursed = mockCustomers.reduce((sum, c) => sum + c.totalDisbursed, 0);

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Customers</h1>
            <p className="text-muted-foreground">Manage customers acquired through your leads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <UserCheck className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{verifiedCustomers}</p>
                  <p className="text-sm text-muted-foreground">KYC Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{activeLoansCount}</p>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <IndianRupee className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">₹{(totalDisbursed / 100000).toFixed(1)}L</p>
                  <p className="text-sm text-muted-foreground">Total Disbursed</p>
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
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="all">All KYC Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Total Loans</TableHead>
                  <TableHead>Active Loans</TableHead>
                  <TableHead>Total Disbursed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{customer.phone}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={customer.kycStatus as any} />
                    </TableCell>
                    <TableCell>{customer.totalLoans}</TableCell>
                    <TableCell>
                      <span className={customer.activeLoans > 0 ? "text-primary font-medium" : ""}>
                        {customer.activeLoans}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{customer.totalDisbursed.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.name}`} />
                                    <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                                    <p className="text-muted-foreground">{selectedCustomer.id}</p>
                                    <StatusBadge status={selectedCustomer.kycStatus as any} />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{selectedCustomer.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{selectedCustomer.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Customer Since</p>
                                    <p className="font-medium">{selectedCustomer.createdAt}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Last Activity</p>
                                    <p className="font-medium">{selectedCustomer.lastActivity}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold">{selectedCustomer.totalLoans}</p>
                                    <p className="text-xs text-muted-foreground">Total Loans</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-primary">{selectedCustomer.activeLoans}</p>
                                    <p className="text-xs text-muted-foreground">Active</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold">₹{(selectedCustomer.totalDisbursed / 100000).toFixed(1)}L</p>
                                    <p className="text-xs text-muted-foreground">Disbursed</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button className="flex-1">
                                    <Phone className="h-4 w-4 mr-2" /> Call
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    <Mail className="h-4 w-4 mr-2" /> Email
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
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

export default AgentCustomers;
