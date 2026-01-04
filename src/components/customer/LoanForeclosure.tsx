import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Clock, IndianRupee, AlertTriangle, CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockLoanAccounts } from "@/data/mockData";
import { toast } from "sonner";
import { format, differenceInMonths } from "date-fns";

interface ForeclosureDetails {
  outstandingPrincipal: number;
  accruedInterest: number;
  foreclosureCharges: number;
  processingFee: number;
  gstOnCharges: number;
  totalPayable: number;
  savingsOnInterest: number;
}

export function LoanForeclosure() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const loanAccount = mockLoanAccounts[0];
  const monthsCompleted = differenceInMonths(new Date(), loanAccount.disbursalDate);
  const monthsRemaining = loanAccount.tenureMonths - monthsCompleted;
  const minMonthsForForeclosure = 6;
  const canForeclose = monthsCompleted >= minMonthsForForeclosure;

  // Calculate foreclosure details
  const calculateForeclosure = (): ForeclosureDetails => {
    const outstandingPrincipal = loanAccount.outstandingPrincipal;
    const accruedInterest = Math.round(outstandingPrincipal * (loanAccount.interestRate / 100 / 12)); // 1 month interest
    
    // Foreclosure charges: 2% of outstanding + fixed processing fee
    const foreclosureChargePercent = monthsCompleted < 12 ? 4 : monthsCompleted < 24 ? 3 : 2;
    const foreclosureCharges = Math.round(outstandingPrincipal * (foreclosureChargePercent / 100));
    const processingFee = 1500;
    const gstOnCharges = Math.round((foreclosureCharges + processingFee) * 0.18);
    
    const totalPayable = outstandingPrincipal + accruedInterest + foreclosureCharges + processingFee + gstOnCharges;
    
    // Calculate savings
    const remainingInterest = Math.round(loanAccount.emiAmount * monthsRemaining - outstandingPrincipal);
    const savingsOnInterest = Math.max(0, remainingInterest - (foreclosureCharges + processingFee + gstOnCharges));

    return {
      outstandingPrincipal,
      accruedInterest,
      foreclosureCharges,
      processingFee,
      gstOnCharges,
      totalPayable,
      savingsOnInterest
    };
  };

  const foreclosure = calculateForeclosure();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  const handleSubmitRequest = () => {
    setRequestSubmitted(true);
    toast.success("Foreclosure request submitted!", {
      description: "Our team will contact you within 24-48 hours."
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>Early Loan Closure</CardTitle>
                <CardDescription>Calculate foreclosure charges and close your loan early</CardDescription>
              </div>
            </div>
            <Badge variant={canForeclose ? "default" : "secondary"}>
              {canForeclose ? "Eligible" : "Not Yet Eligible"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loan Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="font-bold text-lg">{formatCurrency(loanAccount.outstandingPrincipal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">EMIs Paid</p>
              <p className="font-bold text-lg">{monthsCompleted} of {loanAccount.tenureMonths}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="font-bold text-lg">{monthsRemaining} months</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="font-bold text-lg">{loanAccount.interestRate}% p.a.</p>
            </div>
          </div>

          {!canForeclose && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-700 dark:text-amber-400">Minimum Tenure Not Met</p>
                <p className="text-sm text-muted-foreground">
                  Foreclosure is available after {minMonthsForForeclosure} months. You can apply in {minMonthsForForeclosure - monthsCompleted} more months.
                </p>
              </div>
            </div>
          )}

          {canForeclose && (
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCalculator(true)}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Charges
              </Button>
              <Button 
                className="flex-1 gradient-primary text-primary-foreground"
                onClick={() => setShowRequest(true)}
                disabled={requestSubmitted}
              >
                {requestSubmitted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Request Submitted
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Request Foreclosure
                  </>
                )}
              </Button>
            </div>
          )}

          {requestSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="font-medium text-emerald-700 dark:text-emerald-400">Foreclosure Request Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    Request ID: FCR-{Date.now().toString(36).toUpperCase()} • Submitted on {format(new Date(), 'dd MMM yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our team will contact you within 24-48 hours with the final payoff amount.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Foreclosure Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Foreclosure Calculator
            </DialogTitle>
            <DialogDescription>
              Estimated charges for early loan closure as of {format(new Date(), 'dd MMM yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Outstanding Principal</span>
                <span className="font-medium">{formatCurrency(foreclosure.outstandingPrincipal)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Accrued Interest (1 month)</span>
                <span className="font-medium">{formatCurrency(foreclosure.accruedInterest)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">
                  Foreclosure Charges ({monthsCompleted < 12 ? '4%' : monthsCompleted < 24 ? '3%' : '2%'})
                </span>
                <span className="font-medium text-amber-600">{formatCurrency(foreclosure.foreclosureCharges)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">{formatCurrency(foreclosure.processingFee)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-medium">{formatCurrency(foreclosure.gstOnCharges)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-3 bg-primary/5 rounded-lg px-3 -mx-3">
                <span className="font-semibold text-lg">Total Payable</span>
                <span className="font-bold text-xl text-primary">{formatCurrency(foreclosure.totalPayable)}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-emerald-500" />
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  You save {formatCurrency(foreclosure.savingsOnInterest)} on interest!
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                By closing early, you avoid paying interest for the remaining {monthsRemaining} months.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              * This is an estimate. Final amount may vary based on the actual payment date.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCalculator(false)}>Close</Button>
            <Button 
              className="gradient-primary text-primary-foreground"
              onClick={() => {
                setShowCalculator(false);
                setShowRequest(true);
              }}
            >
              Proceed to Request
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Foreclosure Request Dialog */}
      <Dialog open={showRequest} onOpenChange={setShowRequest}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Request Loan Foreclosure
            </DialogTitle>
            <DialogDescription>
              Submit a request to close your loan early
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && <div className={`flex-1 h-1 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-3">Loan Details</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Account No</p>
                      <p className="font-medium">{loanAccount.loanAccountNo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Outstanding</p>
                      <p className="font-medium">{formatCurrency(loanAccount.outstandingPrincipal)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Est. Payoff</p>
                      <p className="font-medium">{formatCurrency(foreclosure.totalPayable)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valid Till</p>
                      <p className="font-medium">{format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setStep(2)}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label>Reason for Foreclosure (Optional)</Label>
                  <Textarea
                    placeholder="e.g., Received bonus, want to reduce debt burden..."
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-700 dark:text-amber-400">Important</p>
                      <ul className="text-muted-foreground mt-1 list-disc list-inside space-y-1">
                        <li>Foreclosure amount is valid for 7 days</li>
                        <li>Payment must be made via NEFT/RTGS only</li>
                        <li>NOC will be issued within 3 working days</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                  <Button className="flex-1" onClick={() => setStep(3)}>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <p className="font-medium">Confirm Request</p>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loan Account</span>
                      <span className="font-medium">{loanAccount.loanAccountNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Payoff Amount</span>
                      <span className="font-medium">{formatCurrency(foreclosure.totalPayable)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valid Till</span>
                      <span className="font-medium">{format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                  <Button 
                    className="flex-1 gradient-primary text-primary-foreground"
                    onClick={() => {
                      handleSubmitRequest();
                      setShowRequest(false);
                      setStep(1);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
