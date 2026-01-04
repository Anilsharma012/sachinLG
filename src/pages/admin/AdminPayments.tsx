import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Eye, IndianRupee, TrendingUp, CreditCard, RefreshCw, Banknote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CashPaymentRecorder, CashPaymentRecord } from "@/components/admin/CashPaymentRecorder";
import { toast } from "sonner";

const mockPayments = [
  { id: "PAY001", customerName: "Rajesh Kumar", loanId: "LOAN001", amount: 15000, method: "UPI", transactionId: "TXN123456", date: "2024-01-15", status: "success" },
  { id: "PAY002", customerName: "Priya Sharma", loanId: "LOAN002", amount: 22000, method: "Net Banking", transactionId: "TXN123457", date: "2024-01-14", status: "success" },
  { id: "PAY003", customerName: "Amit Patel", loanId: "LOAN003", amount: 18500, method: "Card", transactionId: "TXN123458", date: "2024-01-13", status: "failed" },
  { id: "PAY004", customerName: "Sunita Devi", loanId: "LOAN004", amount: 12000, method: "UPI", transactionId: "TXN123459", date: "2024-01-12", status: "pending" },
  { id: "PAY005", customerName: "Vikram Singh", loanId: "LOAN005", amount: 25000, method: "Cash", transactionId: "TXN123460", date: "2024-01-11", status: "success" },
];

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cashRecorderOpen, setCashRecorderOpen] = useState(false);
  const [payments, setPayments] = useState(mockPayments);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.loanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments.filter(p => p.status === "success").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = payments.filter(p => p.status === "failed").reduce((sum, p) => sum + p.amount, 0);

  const handleCashPaymentRecorded = (payment: CashPaymentRecord) => {
    const newPayment = {
      id: payment.id,
      customerName: payment.customerName,
      loanId: payment.loanAccountNo,
      amount: payment.amount,
      method: "Cash",
      transactionId: payment.receiptNo,
      date: payment.paymentDate,
      status: "success",
    };
    setPayments(prev => [newPayment, ...prev]);
    toast.success("Cash payment recorded successfully!");
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <Button onClick={() => setCashRecorderOpen(true)}>
            <Banknote className="h-4 w-4 mr-2" /> Record Cash Payment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <IndianRupee className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">₹{totalCollected.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <RefreshCw className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">₹{failedAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockPayments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
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
                  placeholder="Search by customer, loan ID or transaction..."
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
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell>{payment.loanId}</TableCell>
                    <TableCell className="font-semibold">₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{payment.transactionId}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status as any} />
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payment Details - {payment.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Customer</p>
                                <p className="font-medium">{payment.customerName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Loan ID</p>
                                <p className="font-medium">{payment.loanId}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-medium text-xl">₹{payment.amount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Payment Method</p>
                                <p className="font-medium">{payment.method}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Transaction ID</p>
                                <p className="font-medium">{payment.transactionId}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Date</p>
                                <p className="font-medium">{payment.date}</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Download Receipt</Button>
                              <Button>Send Receipt</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Cash Payment Recorder Modal */}
      <CashPaymentRecorder
        open={cashRecorderOpen}
        onOpenChange={setCashRecorderOpen}
        onPaymentRecorded={handleCashPaymentRecorded}
      />
    </DashboardLayout>
  );
};

export default AdminPayments;
