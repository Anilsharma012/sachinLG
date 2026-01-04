import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, Filter, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mockPayments, mockLoanAccounts } from "@/data/mockData";
import { toast } from "sonner";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface StatementData {
  period: string;
  loanAccount: string;
  totalPayments: number;
  totalAmount: number;
  format: 'pdf' | 'excel';
}

export function PaymentStatementExport() {
  const [showExport, setShowExport] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [period, setPeriod] = useState<string>("3months");
  const [selectedLoan, setSelectedLoan] = useState<string>("all");
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');
  const [generatedStatement, setGeneratedStatement] = useState<StatementData | null>(null);

  const loanAccount = mockLoanAccounts[0];

  const getPeriodLabel = (p: string) => {
    switch (p) {
      case '1month': return 'Last 1 Month';
      case '3months': return 'Last 3 Months';
      case '6months': return 'Last 6 Months';
      case '1year': return 'Last 1 Year';
      case 'all': return 'All Time';
      default: return p;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  const calculateStats = () => {
    const successfulPayments = mockPayments.filter(p => p.status === 'success' || p.status === 'reconciled');
    const totalAmount = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    return {
      count: successfulPayments.length,
      amount: totalAmount
    };
  };

  const stats = calculateStats();

  const handleGenerateStatement = () => {
    setIsGenerating(true);
    
    // Simulate PDF generation
    setTimeout(() => {
      setGeneratedStatement({
        period: getPeriodLabel(period),
        loanAccount: selectedLoan === 'all' ? 'All Loans' : loanAccount.loanAccountNo,
        totalPayments: stats.count,
        totalAmount: stats.amount,
        format: exportFormat
      });
      setIsGenerating(false);
    }, 2000);
  };

  const handleDownload = () => {
    // Create a mock PDF content
    const content = `
PAYMENT STATEMENT
=================

Customer: Amit Kumar
Generated: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}

Period: ${generatedStatement?.period}
Loan Account: ${generatedStatement?.loanAccount}

PAYMENT SUMMARY
---------------
Total Payments: ${generatedStatement?.totalPayments}
Total Amount: ${formatCurrency(generatedStatement?.totalAmount || 0)}

PAYMENT DETAILS
---------------
${mockPayments.map((p, i) => `
${i + 1}. Payment ID: ${p.txnId}
   Amount: ${formatCurrency(p.amount)}
   Date: ${format(p.createdAt, 'dd MMM yyyy')}
   Mode: ${p.mode.toUpperCase()}
   Status: ${p.status.toUpperCase()}
`).join('')}

---
This is a computer generated statement.
LoanAgent Finance Pvt. Ltd.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payment_Statement_${format(new Date(), 'yyyy-MM-dd')}.${exportFormat === 'pdf' ? 'txt' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Statement downloaded successfully!", {
      description: `Your payment statement has been saved.`
    });
    setShowExport(false);
    setGeneratedStatement(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Payment Statement</CardTitle>
                <CardDescription>Download your complete payment history</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">{stats.count}</p>
              <p className="text-xs text-muted-foreground">Total Payments</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-emerald-500">{formatCurrency(stats.amount)}</p>
              <p className="text-xs text-muted-foreground">Amount Paid</p>
            </div>
          </div>

          {/* Recent Payments Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Payments</p>
            {mockPayments.slice(0, 3).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-xs text-muted-foreground">{format(payment.createdAt, 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">{payment.mode}</Badge>
              </div>
            ))}
          </div>

          <Button 
            className="w-full gradient-primary text-primary-foreground"
            onClick={() => setShowExport(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Payment Statement
          </Button>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export Payment Statement
            </DialogTitle>
            <DialogDescription>
              Download your payment history as PDF or Excel
            </DialogDescription>
          </DialogHeader>

          {!generatedStatement ? (
            <div className="space-y-4">
              {/* Period Selection */}
              <div className="space-y-2">
                <Label>Select Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last 1 Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last 1 Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loan Account Selection */}
              <div className="space-y-2">
                <Label>Loan Account</Label>
                <Select value={selectedLoan} onValueChange={setSelectedLoan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Loans</SelectItem>
                    <SelectItem value={loanAccount.loanAccountNo}>{loanAccount.loanAccountNo}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as 'pdf' | 'excel')}>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                        <div className="h-8 w-8 rounded bg-red-500/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-red-500" />
                        </div>
                        PDF
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excel" id="excel" />
                      <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer">
                        <div className="h-8 w-8 rounded bg-emerald-500/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-emerald-500" />
                        </div>
                        Excel
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Statement Preview</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Period: {getPeriodLabel(period)}</p>
                  <p>Loan: {selectedLoan === 'all' ? 'All Loans' : loanAccount.loanAccountNo}</p>
                  <p>Payments: ~{stats.count} transactions</p>
                  <p>Format: {exportFormat.toUpperCase()}</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowExport(false)}>Cancel</Button>
                <Button 
                  className="gradient-primary text-primary-foreground"
                  onClick={handleGenerateStatement}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Statement
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-center py-4">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="font-semibold text-lg">Statement Ready!</p>
                <p className="text-sm text-muted-foreground">Your payment statement has been generated</p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium">{generatedStatement.period}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Loan Account</span>
                  <span className="font-medium">{generatedStatement.loanAccount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Payments</span>
                  <span className="font-medium">{generatedStatement.totalPayments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-medium text-emerald-500">{formatCurrency(generatedStatement.totalAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Format</span>
                  <Badge variant="secondary">{generatedStatement.format.toUpperCase()}</Badge>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setGeneratedStatement(null);
                  }}
                >
                  Back
                </Button>
                <Button 
                  className="gradient-primary text-primary-foreground"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download {generatedStatement.format.toUpperCase()}
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
