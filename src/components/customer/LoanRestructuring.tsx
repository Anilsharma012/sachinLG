import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Calculator, IndianRupee, Calendar, ArrowRight, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockLoanAccounts, mockEmiSchedule } from "@/data/mockData";
import { toast } from "sonner";
import { format, differenceInMonths, addMonths } from "date-fns";

type RestructureType = 'reduce_emi' | 'extend_tenure' | 'partial_prepayment';

interface RestructureOption {
  type: RestructureType;
  newEmi: number;
  newTenure: number;
  totalInterest: number;
  savings: number;
}

export function LoanRestructuring() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [restructureType, setRestructureType] = useState<RestructureType>('reduce_emi');
  const [newTenure, setNewTenure] = useState([36]);
  const [prepaymentAmount, setPrepaymentAmount] = useState([100000]);
  const [requestReason, setRequestReason] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const loanAccount = mockLoanAccounts[0];
  const monthsCompleted = differenceInMonths(new Date(), loanAccount.disbursalDate);
  const monthsRemaining = loanAccount.tenureMonths - monthsCompleted;
  const minTenure = monthsRemaining;
  const maxTenure = 60;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  // Calculate new EMI based on restructure type
  const calculateRestructure = (): RestructureOption => {
    const principal = loanAccount.outstandingPrincipal;
    const rate = loanAccount.interestRate / 100 / 12;
    
    let newEmiAmount: number;
    let newTenureMonths: number;
    let totalInterest: number;
    let savings: number;

    switch (restructureType) {
      case 'extend_tenure':
        newTenureMonths = newTenure[0];
        newEmiAmount = Math.round((principal * rate * Math.pow(1 + rate, newTenureMonths)) / (Math.pow(1 + rate, newTenureMonths) - 1));
        totalInterest = (newEmiAmount * newTenureMonths) - principal;
        savings = loanAccount.emiAmount - newEmiAmount;
        break;
      
      case 'reduce_emi':
        // Reduce EMI by 20% and calculate new tenure
        newEmiAmount = Math.round(loanAccount.emiAmount * 0.8);
        newTenureMonths = Math.ceil(Math.log(newEmiAmount / (newEmiAmount - principal * rate)) / Math.log(1 + rate));
        totalInterest = (newEmiAmount * newTenureMonths) - principal;
        savings = loanAccount.emiAmount - newEmiAmount;
        break;
      
      case 'partial_prepayment':
        const newPrincipal = principal - prepaymentAmount[0];
        newTenureMonths = monthsRemaining;
        newEmiAmount = Math.round((newPrincipal * rate * Math.pow(1 + rate, newTenureMonths)) / (Math.pow(1 + rate, newTenureMonths) - 1));
        totalInterest = (newEmiAmount * newTenureMonths) - newPrincipal;
        const originalInterest = (loanAccount.emiAmount * monthsRemaining) - principal;
        savings = originalInterest - totalInterest;
        break;
      
      default:
        newEmiAmount = loanAccount.emiAmount;
        newTenureMonths = monthsRemaining;
        totalInterest = 0;
        savings = 0;
    }

    return {
      type: restructureType,
      newEmi: newEmiAmount,
      newTenure: newTenureMonths,
      totalInterest,
      savings
    };
  };

  const restructureOption = calculateRestructure();

  const handleSubmitRequest = () => {
    setRequestSubmitted(true);
    toast.success("Restructuring request submitted!", {
      description: "Our team will review and contact you within 2-3 business days."
    });
  };

  const getTypeLabel = (type: RestructureType) => {
    switch (type) {
      case 'reduce_emi': return 'Reduce EMI Amount';
      case 'extend_tenure': return 'Extend Loan Tenure';
      case 'partial_prepayment': return 'Partial Prepayment';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <CardTitle>Loan Restructuring</CardTitle>
                <CardDescription>Modify EMI or extend tenure based on your needs</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Loan Summary */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{formatCurrency(loanAccount.emiAmount)}</p>
              <p className="text-xs text-muted-foreground">Current EMI</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{monthsRemaining}</p>
              <p className="text-xs text-muted-foreground">Months Left</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{formatCurrency(loanAccount.outstandingPrincipal)}</p>
              <p className="text-xs text-muted-foreground">Outstanding</p>
            </div>
          </div>

          {/* Restructuring Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Available Options</p>
            <div className="grid gap-2">
              <div 
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setRestructureType('reduce_emi');
                  setShowCalculator(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IndianRupee className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-medium">Reduce EMI</p>
                      <p className="text-xs text-muted-foreground">Lower monthly payments</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div 
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setRestructureType('extend_tenure');
                  setShowCalculator(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Extend Tenure</p>
                      <p className="text-xs text-muted-foreground">More time to repay</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div 
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setRestructureType('partial_prepayment');
                  setShowCalculator(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Partial Prepayment</p>
                      <p className="text-xs text-muted-foreground">Pay extra, save interest</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {requestSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
            >
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-indigo-500 mt-0.5" />
                <div>
                  <p className="font-medium text-indigo-700 dark:text-indigo-400">Restructuring Request Pending</p>
                  <p className="text-sm text-muted-foreground">
                    Request ID: RST-{Date.now().toString(36).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our team will contact you within 2-3 business days.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Restructuring Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {getTypeLabel(restructureType)}
            </DialogTitle>
            <DialogDescription>
              Calculate your new EMI and savings
            </DialogDescription>
          </DialogHeader>

          <Tabs value={restructureType} onValueChange={(v) => setRestructureType(v as RestructureType)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reduce_emi">Reduce EMI</TabsTrigger>
              <TabsTrigger value="extend_tenure">Extend</TabsTrigger>
              <TabsTrigger value="partial_prepayment">Prepay</TabsTrigger>
            </TabsList>

            <TabsContent value="reduce_emi" className="space-y-4 mt-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">
                  Your EMI will be reduced by 20% with extended tenure
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Current EMI</p>
                    <p className="font-bold line-through text-muted-foreground">{formatCurrency(loanAccount.emiAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">New EMI</p>
                    <p className="font-bold text-emerald-500">{formatCurrency(restructureOption.newEmi)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="extend_tenure" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>New Tenure</Label>
                    <Badge variant="secondary">{newTenure[0]} months</Badge>
                  </div>
                  <Slider
                    value={newTenure}
                    onValueChange={setNewTenure}
                    min={minTenure}
                    max={maxTenure}
                    step={6}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{minTenure} months</span>
                    <span>{maxTenure} months</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">New EMI</p>
                      <p className="font-bold text-emerald-500">{formatCurrency(restructureOption.newEmi)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Monthly Savings</p>
                      <p className="font-bold text-emerald-500">{formatCurrency(restructureOption.savings)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="partial_prepayment" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Prepayment Amount</Label>
                    <Badge variant="secondary">{formatCurrency(prepaymentAmount[0])}</Badge>
                  </div>
                  <Slider
                    value={prepaymentAmount}
                    onValueChange={setPrepaymentAmount}
                    min={25000}
                    max={loanAccount.outstandingPrincipal - 50000}
                    step={25000}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹25,000</span>
                    <span>{formatCurrency(loanAccount.outstandingPrincipal - 50000)}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">New EMI</p>
                      <p className="font-bold text-emerald-500">{formatCurrency(restructureOption.newEmi)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Savings</p>
                      <p className="font-bold text-emerald-500">{formatCurrency(restructureOption.savings)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Comparison Table */}
          <div className="space-y-2">
            <p className="font-medium text-sm">Comparison</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Current</p>
                <p className="font-bold">{formatCurrency(loanAccount.emiAmount)}</p>
                <p className="text-xs text-muted-foreground">{monthsRemaining} months</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <p className="text-xs text-primary mb-1">New</p>
                <p className="font-bold text-primary">{formatCurrency(restructureOption.newEmi)}</p>
                <p className="text-xs text-muted-foreground">{restructureOption.newTenure} months</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCalculator(false)}>Cancel</Button>
            <Button 
              className="gradient-primary text-primary-foreground"
              onClick={() => {
                setShowCalculator(false);
                setShowRequest(true);
              }}
            >
              Request Restructuring
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Dialog */}
      <Dialog open={showRequest} onOpenChange={setShowRequest}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Request Loan Restructuring
            </DialogTitle>
            <DialogDescription>
              Submit your restructuring request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Request Summary */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Request Type</span>
                <Badge>{getTypeLabel(restructureType)}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current EMI</span>
                <span className="font-medium">{formatCurrency(loanAccount.emiAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Proposed EMI</span>
                <span className="font-medium text-primary">{formatCurrency(restructureOption.newEmi)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New Tenure</span>
                <span className="font-medium">{restructureOption.newTenure} months</span>
              </div>
            </div>

            {/* Reason */}
            <div>
              <Label>Reason for Restructuring (Optional)</Label>
              <Textarea
                placeholder="e.g., Job change, medical expenses, financial difficulties..."
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Terms */}
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-700 dark:text-amber-400">Important</p>
                  <ul className="text-muted-foreground mt-1 list-disc list-inside space-y-1 text-xs">
                    <li>Request is subject to approval</li>
                    <li>Processing fee may apply</li>
                    <li>New terms effective from next month</li>
                    <li>Credit score may be affected</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequest(false)}>Cancel</Button>
            <Button 
              className="gradient-primary text-primary-foreground"
              onClick={() => {
                handleSubmitRequest();
                setShowRequest(false);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
