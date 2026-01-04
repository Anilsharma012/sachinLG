import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Banknote, 
  User, 
  CreditCard, 
  Calendar,
  Receipt,
  Loader2,
  CheckCircle,
  IndianRupee,
  FileText
} from "lucide-react";

interface CashPaymentRecorderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentRecorded: (payment: CashPaymentRecord) => void;
}

export interface CashPaymentRecord {
  id: string;
  loanAccountNo: string;
  customerName: string;
  amount: number;
  emiNumbers: number[];
  paymentDate: string;
  receivedBy: string;
  receiptNo: string;
  remarks?: string;
  status: "recorded" | "verified" | "reconciled";
}

const mockLoanAccounts = [
  { id: "LOAN001", customerName: "Rahul Sharma", outstanding: 145000 },
  { id: "LOAN002", customerName: "Priya Patel", outstanding: 89500 },
  { id: "LOAN003", customerName: "Amit Kumar", outstanding: 256000 },
];

const mockEmis = [
  { emiNo: 8, dueDate: "2024-02-05", amount: 14630, status: "overdue" },
  { emiNo: 9, dueDate: "2024-03-05", amount: 14130, status: "upcoming" },
  { emiNo: 10, dueDate: "2024-04-05", amount: 14130, status: "upcoming" },
];

export const CashPaymentRecorder = ({
  open,
  onOpenChange,
  onPaymentRecorded,
}: CashPaymentRecorderProps) => {
  const [selectedLoan, setSelectedLoan] = useState("");
  const [selectedEmis, setSelectedEmis] = useState<number[]>([]);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);

  const selectedAccount = mockLoanAccounts.find(a => a.id === selectedLoan);

  const toggleEmiSelection = (emiNo: number) => {
    setSelectedEmis(prev =>
      prev.includes(emiNo) ? prev.filter(e => e !== emiNo) : [...prev, emiNo]
    );
  };

  const calculateSelectedTotal = () => {
    return mockEmis
      .filter(e => selectedEmis.includes(e.emiNo))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const handleRecordPayment = async () => {
    if (!selectedLoan) {
      toast.error("Please select a loan account");
      return;
    }
    if (selectedEmis.length === 0) {
      toast.error("Please select at least one EMI");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const receiptNo = `RCPT${Date.now()}`;
    
    const payment: CashPaymentRecord = {
      id: `PAY${Date.now()}`,
      loanAccountNo: selectedLoan,
      customerName: selectedAccount?.customerName || "",
      amount: parseFloat(amount),
      emiNumbers: selectedEmis,
      paymentDate,
      receivedBy: "Admin User",
      receiptNo,
      remarks,
      status: "recorded",
    };

    toast.success("Cash Payment Recorded!", {
      description: `Receipt No: ${receiptNo}`,
    });

    onPaymentRecorded(payment);
    setIsProcessing(false);
    
    // Reset form
    setSelectedLoan("");
    setSelectedEmis([]);
    setAmount("");
    setRemarks("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Record Cash Payment
          </DialogTitle>
          <DialogDescription>
            Record a cash payment received at the office
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Loan Account Selection */}
          <div className="space-y-2">
            <Label>Select Loan Account</Label>
            <Select value={selectedLoan} onValueChange={setSelectedLoan}>
              <SelectTrigger>
                <SelectValue placeholder="Search by Loan ID or Customer Name" />
              </SelectTrigger>
              <SelectContent>
                {mockLoanAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{account.id}</span>
                      <span className="text-muted-foreground">-</span>
                      <span>{account.customerName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Details */}
          {selectedAccount && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedAccount.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Outstanding: ₹{selectedAccount.outstanding.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* EMI Selection */}
          {selectedLoan && (
            <div className="space-y-2">
              <Label>Select EMIs to Pay</Label>
              <div className="space-y-2">
                {mockEmis.map(emi => (
                  <div
                    key={emi.emiNo}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedEmis.includes(emi.emiNo)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleEmiSelection(emi.emiNo)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedEmis.includes(emi.emiNo)
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {selectedEmis.includes(emi.emiNo) && (
                          <CheckCircle className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">EMI #{emi.emiNo}</p>
                        <p className="text-xs text-muted-foreground">Due: {emi.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{emi.amount.toLocaleString()}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          emi.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {emi.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Received</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedEmis.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  EMI Total: ₹{calculateSelectedTotal().toLocaleString()}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Payment Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Add any notes about this payment..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
            />
          </div>

          {/* Summary */}
          {selectedEmis.length > 0 && amount && (
            <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Recording Payment</p>
                    <p className="text-2xl font-bold text-green-600 flex items-center">
                      <IndianRupee className="h-5 w-5" />
                      {parseFloat(amount || "0").toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      For EMI #{selectedEmis.join(", #")}
                    </p>
                    <p className="text-sm font-medium">{selectedAccount?.customerName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleRecordPayment}
              disabled={!selectedLoan || selectedEmis.length === 0 || !amount || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Receipt className="h-4 w-4 mr-2" />
                  Record & Generate Receipt
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            A receipt will be generated and sent to the customer's email
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
