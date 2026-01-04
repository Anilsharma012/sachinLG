import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/ui/KpiCard";
import { CreditCard, Wallet, Clock, CheckCircle, Plus, Smartphone, Building2, QrCode, IndianRupee, Download, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: Smartphone, description: "Pay via Google Pay, PhonePe, Paytm" },
  { id: "netbanking", label: "Net Banking", icon: Building2, description: "Pay via Internet Banking" },
  { id: "card", label: "Debit/Credit Card", icon: CreditCard, description: "Visa, Mastercard, RuPay" },
  { id: "qr", label: "Scan QR", icon: QrCode, description: "Scan and pay using any UPI app" },
];

const mockPaymentHistory = [
  { id: "PAY001", date: "2024-01-15", amount: 15420, method: "UPI", status: "Success", loanId: "LA001", transactionId: "TXN789456123" },
  { id: "PAY002", date: "2024-01-10", amount: 5000, method: "Net Banking", status: "Success", loanId: "LA001", transactionId: "TXN789456124" },
  { id: "PAY003", date: "2023-12-15", amount: 15420, method: "Card", status: "Success", loanId: "LA001", transactionId: "TXN789456125" },
  { id: "PAY004", date: "2023-12-10", amount: 2500, method: "UPI", status: "Failed", loanId: "LA002", transactionId: "TXN789456126" },
  { id: "PAY005", date: "2023-11-15", amount: 15420, method: "UPI", status: "Success", loanId: "LA001", transactionId: "TXN789456127" },
];

const mockScheduledPayments = [
  { id: "SCH001", loanId: "LA001", dueDate: "2024-02-15", amount: 15420, status: "Upcoming" },
  { id: "SCH002", loanId: "LA002", dueDate: "2024-02-20", amount: 8500, status: "Upcoming" },
];

export default function CustomerPayments() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedLoan, setSelectedLoan] = useState("");
  const { toast } = useToast();

  const handlePayment = () => {
    toast({
      title: "Payment Initiated",
      description: `Processing payment of ₹${paymentAmount} via ${selectedMethod}`,
    });
    setIsPaymentOpen(false);
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payments</h1>
            <p className="text-muted-foreground">Make payments and view payment history</p>
          </div>
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Make Payment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Make a Payment</DialogTitle>
                <DialogDescription>Choose your payment method and amount</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Loan</Label>
                  <Select value={selectedLoan} onValueChange={setSelectedLoan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose loan account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LA001">Personal Loan - LA001 (₹15,420 due)</SelectItem>
                      <SelectItem value="LA002">Business Loan - LA002 (₹8,500 due)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Amount</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      className="pl-9"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <method.icon className="h-5 w-5 mb-1 text-primary" />
                        <p className="font-medium text-sm">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>Cancel</Button>
                <Button onClick={handlePayment} disabled={!selectedMethod || !paymentAmount || !selectedLoan}>
                  Pay ₹{paymentAmount || "0"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            title="Total Paid"
            value="₹4,62,600"
            subtitle="All time payments"
            icon={Wallet}
            trend={{ value: 12, isPositive: true }}
          />
          <KpiCard
            title="This Month"
            value="₹20,420"
            subtitle="Payments in January"
            icon={CreditCard}
          />
          <KpiCard
            title="Pending"
            value="₹23,920"
            subtitle="Due this month"
            icon={Clock}
            trend={{ value: 2, isPositive: false }}
          />
          <KpiCard
            title="Successful"
            value="98%"
            subtitle="Payment success rate"
            icon={CheckCircle}
          />
        </div>

        {/* Upcoming Payments Alert */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Upcoming EMI Due</p>
              <p className="text-sm text-muted-foreground">You have 2 EMIs totaling ₹23,920 due in the next 7 days</p>
            </div>
            <Button variant="outline" className="border-amber-300 hover:bg-amber-100">
              Pay Now
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Payments</TabsTrigger>
            <TabsTrigger value="autopay">Auto-Pay Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All your past payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPaymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell className="font-medium">{payment.loanId}</TableCell>
                        <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell className="text-right font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === "Success" ? "default" : "destructive"}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Payments</CardTitle>
                <CardDescription>Upcoming EMIs and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockScheduledPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{payment.loanId} - EMI Payment</p>
                          <p className="text-sm text-muted-foreground">Due: {new Date(payment.dueDate).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{payment.amount.toLocaleString()}</p>
                        <Badge variant="outline">{payment.status}</Badge>
                      </div>
                      <Button>Pay Now</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="autopay">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Pay Setup</CardTitle>
                <CardDescription>Set up automatic payments for your loans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No Auto-Pay Configured</h3>
                  <p className="text-muted-foreground mb-4">Set up auto-pay to never miss an EMI payment</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Setup Auto-Pay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
