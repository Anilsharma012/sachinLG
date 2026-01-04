import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { IndianRupee, Calendar, CreditCard, Download, CheckCircle, Clock, AlertTriangle, Wallet, Receipt } from "lucide-react";
import { PaymentGateway } from "@/components/payment/PaymentGateway";

interface EmiScheduleItem {
  emiNo: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  emiAmount: number;
  penalty?: number;
  totalDue: number;
  status: "paid" | "due" | "overdue" | "upcoming";
  paidDate?: string;
  paidAmount?: number;
}

const mockEmiSchedule: EmiScheduleItem[] = [
  { emiNo: 1, dueDate: "2023-07-05", principalAmount: 10130, interestAmount: 4000, emiAmount: 14130, totalDue: 14130, status: "paid", paidDate: "2023-07-04", paidAmount: 14130 },
  { emiNo: 2, dueDate: "2023-08-05", principalAmount: 10231, interestAmount: 3899, emiAmount: 14130, totalDue: 14130, status: "paid", paidDate: "2023-08-05", paidAmount: 14130 },
  { emiNo: 3, dueDate: "2023-09-05", principalAmount: 10333, interestAmount: 3797, emiAmount: 14130, totalDue: 14130, status: "paid", paidDate: "2023-09-06", paidAmount: 14130 },
  { emiNo: 4, dueDate: "2023-10-05", principalAmount: 10437, interestAmount: 3693, emiAmount: 14130, totalDue: 14130, status: "paid", paidDate: "2023-10-05", paidAmount: 14130 },
  { emiNo: 5, dueDate: "2023-11-05", principalAmount: 10541, interestAmount: 3589, emiAmount: 14130, totalDue: 14130, status: "paid", paidDate: "2023-11-05", paidAmount: 14130 },
  { emiNo: 6, dueDate: "2023-12-05", principalAmount: 10647, interestAmount: 3483, emiAmount: 14130, totalDue: 14130, status: "paid", paidDate: "2023-12-04", paidAmount: 14130 },
  { emiNo: 7, dueDate: "2024-01-05", principalAmount: 10754, interestAmount: 3376, emiAmount: 14130, totalDue: 14130, status: "paid", paidDate: "2024-01-05", paidAmount: 14130 },
  { emiNo: 8, dueDate: "2024-02-05", principalAmount: 10861, interestAmount: 3269, emiAmount: 14130, penalty: 500, totalDue: 14630, status: "overdue" },
  { emiNo: 9, dueDate: "2024-03-05", principalAmount: 10970, interestAmount: 3160, emiAmount: 14130, totalDue: 14130, status: "upcoming" },
  { emiNo: 10, dueDate: "2024-04-05", principalAmount: 11080, interestAmount: 3050, emiAmount: 14130, totalDue: 14130, status: "upcoming" },
];

const CustomerEmi = () => {
  const [selectedLoan, setSelectedLoan] = useState("LOAN001");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedEmis, setSelectedEmis] = useState<number[]>([]);

  const paidEmis = mockEmiSchedule.filter(e => e.status === "paid");
  const overdueEmis = mockEmiSchedule.filter(e => e.status === "overdue");
  const upcomingEmis = mockEmiSchedule.filter(e => e.status === "upcoming");
  
  const totalPaid = paidEmis.reduce((sum, e) => sum + (e.paidAmount || 0), 0);
  const totalDue = overdueEmis.reduce((sum, e) => sum + e.totalDue, 0);
  const nextEmi = [...overdueEmis, ...upcomingEmis][0];

  const handleEmiSelect = (emiNo: number) => {
    setSelectedEmis(prev => 
      prev.includes(emiNo) ? prev.filter(e => e !== emiNo) : [...prev, emiNo]
    );
  };

  const getSelectedTotal = () => {
    return mockEmiSchedule
      .filter(e => selectedEmis.includes(e.emiNo))
      .reduce((sum, e) => sum + e.totalDue, 0);
  };

  const handlePaymentSuccess = (txnId: string, mode: string) => {
    toast.success(`Payment successful! Transaction ID: ${txnId}`);
    setPaymentDialogOpen(false);
    setSelectedEmis([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "overdue": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "due": return <Clock className="h-4 w-4 text-amber-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">EMI Schedule</h1>
            <p className="text-muted-foreground">View and pay your EMI installments</p>
          </div>
          <Select value={selectedLoan} onValueChange={setSelectedLoan}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select loan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOAN001">Personal Loan - LOAN001</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Paid ({paidEmis.length} EMIs)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={`${totalDue > 0 ? "bg-red-500/5 border-red-500/20" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className={`h-8 w-8 ${totalDue > 0 ? "text-red-500" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-2xl font-bold">₹{totalDue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Overdue Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-lg font-bold">{nextEmi?.dueDate}</p>
                  <p className="text-sm text-muted-foreground">Next EMI Date</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <IndianRupee className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">₹{nextEmi?.totalDue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Next EMI Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pay Now Section */}
        {(overdueEmis.length > 0 || upcomingEmis.length > 0) && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Pay EMI Now</h3>
                  <p className="text-muted-foreground">
                    {overdueEmis.length > 0 
                      ? `You have ${overdueEmis.length} overdue EMI(s) - ₹${totalDue.toLocaleString()} total`
                      : `Next EMI of ₹${nextEmi?.emiAmount.toLocaleString()} is due on ${nextEmi?.dueDate}`
                    }
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className={overdueEmis.length > 0 ? "bg-red-600 hover:bg-red-700" : ""}
                  onClick={() => setPaymentDialogOpen(true)}
                >
                  <CreditCard className="h-5 w-5 mr-2" /> Pay Now
                </Button>
                <PaymentGateway
                  open={paymentDialogOpen}
                  onOpenChange={setPaymentDialogOpen}
                  amount={getSelectedTotal() || (nextEmi?.totalDue || 0)}
                  loanAccountNo={selectedLoan}
                  emiNumbers={selectedEmis.length > 0 ? selectedEmis : [nextEmi?.emiNo || 0]}
                  onPaymentSuccess={handlePaymentSuccess}
                  allowCash={true}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* EMI Schedule Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>EMI Schedule</CardTitle>
                <CardDescription>Personal Loan - LOAN001 (24 EMIs @ 12% p.a.)</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Download Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>EMI #</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>EMI</TableHead>
                  <TableHead>Penalty</TableHead>
                  <TableHead>Total Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEmiSchedule.map((emi) => (
                  <TableRow key={emi.emiNo} className={emi.status === "overdue" ? "bg-red-500/5" : ""}>
                    <TableCell className="font-medium">{emi.emiNo}</TableCell>
                    <TableCell>{emi.dueDate}</TableCell>
                    <TableCell>₹{emi.principalAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{emi.interestAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{emi.emiAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-red-500">{emi.penalty ? `₹${emi.penalty}` : "-"}</TableCell>
                    <TableCell className="font-semibold">₹{emi.totalDue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(emi.status)}
                        <StatusBadge status={emi.status as any} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {emi.status === "paid" && (
                        <Button variant="ghost" size="sm">
                          <Receipt className="h-4 w-4" />
                        </Button>
                      )}
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

export default CustomerEmi;
