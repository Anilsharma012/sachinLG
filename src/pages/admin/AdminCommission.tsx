import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, IndianRupee, Users, TrendingUp, Wallet } from "lucide-react";

const mockCommissions = [
  { id: "COM001", agentName: "Vikram Agent", agentId: "AGT001", loanId: "LOAN001", customerName: "Rajesh Kumar", disbursedAmount: 500000, commissionRate: 2, commissionAmount: 10000, date: "2024-01-15", status: "paid" },
  { id: "COM002", agentName: "Neha Agent", agentId: "AGT002", loanId: "LOAN002", customerName: "Priya Sharma", disbursedAmount: 750000, commissionRate: 2.5, commissionAmount: 18750, date: "2024-01-14", status: "pending" },
  { id: "COM003", agentName: "Vikram Agent", agentId: "AGT001", loanId: "LOAN003", customerName: "Amit Patel", disbursedAmount: 300000, commissionRate: 2, commissionAmount: 6000, date: "2024-01-13", status: "paid" },
  { id: "COM004", agentName: "Rahul Agent", agentId: "AGT003", loanId: "LOAN004", customerName: "Sunita Devi", disbursedAmount: 450000, commissionRate: 1.5, commissionAmount: 6750, date: "2024-01-12", status: "pending" },
  { id: "COM005", agentName: "Neha Agent", agentId: "AGT002", loanId: "LOAN005", customerName: "Vikram Singh", disbursedAmount: 600000, commissionRate: 2.5, commissionAmount: 15000, date: "2024-01-11", status: "processing" },
];

const AdminCommission = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCommissions = mockCommissions.filter(comm => {
    const matchesSearch = comm.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.loanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || comm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCommission = mockCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const paidCommission = mockCommissions.filter(c => c.status === "paid").reduce((sum, c) => sum + c.commissionAmount, 0);
  const pendingCommission = mockCommissions.filter(c => c.status === "pending" || c.status === "processing").reduce((sum, c) => sum + c.commissionAmount, 0);
  const uniqueAgents = new Set(mockCommissions.map(c => c.agentId)).size;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Commission Ledger</h1>
          <Button>
            <Wallet className="h-4 w-4 mr-2" /> Process Payouts
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <IndianRupee className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">₹{totalCommission.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Commission</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">₹{paidCommission.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Paid Out</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Wallet className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">₹{pendingCommission.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pending Payout</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{uniqueAgents}</p>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
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
                  placeholder="Search by agent, customer or loan ID..."
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
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Disbursed</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell className="font-medium">{comm.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comm.agentName}</p>
                        <p className="text-sm text-muted-foreground">{comm.agentId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{comm.loanId}</TableCell>
                    <TableCell>{comm.customerName}</TableCell>
                    <TableCell>₹{comm.disbursedAmount.toLocaleString()}</TableCell>
                    <TableCell>{comm.commissionRate}%</TableCell>
                    <TableCell className="font-semibold text-green-600">₹{comm.commissionAmount.toLocaleString()}</TableCell>
                    <TableCell>{comm.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={comm.status as any} />
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

export default AdminCommission;
