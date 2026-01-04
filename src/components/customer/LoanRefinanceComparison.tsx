import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Calculator, ArrowRight, CheckCircle, XCircle, IndianRupee, Percent, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockLoanAccounts } from "@/data/mockData";

interface RefinanceOption {
  id: string;
  lenderName: string;
  interestRate: number;
  processingFee: number;
  maxTenure: number;
  minAmount: number;
  maxAmount: number;
  features: string[];
  recommended?: boolean;
}

const refinanceOptions: RefinanceOption[] = [
  {
    id: "1",
    lenderName: "HDFC Bank",
    interestRate: 10.5,
    processingFee: 1,
    maxTenure: 60,
    minAmount: 100000,
    maxAmount: 5000000,
    features: ["No prepayment charges", "Flexible tenure", "Quick disbursal"],
    recommended: true
  },
  {
    id: "2",
    lenderName: "ICICI Bank",
    interestRate: 10.75,
    processingFee: 1.5,
    maxTenure: 60,
    minAmount: 50000,
    maxAmount: 4000000,
    features: ["Balance transfer offer", "Top-up available", "Online management"]
  },
  {
    id: "3",
    lenderName: "Axis Bank",
    interestRate: 11.0,
    processingFee: 0.5,
    maxTenure: 72,
    minAmount: 100000,
    maxAmount: 5000000,
    features: ["Lowest processing fee", "EMI holiday option", "Part payment allowed"]
  },
  {
    id: "4",
    lenderName: "SBI",
    interestRate: 10.25,
    processingFee: 1,
    maxTenure: 84,
    minAmount: 50000,
    maxAmount: 10000000,
    features: ["Lowest interest rate", "Government backed", "Long tenure option"]
  }
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function calculateEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

export function LoanRefinanceComparison() {
  const currentLoan = mockLoanAccounts[0];
  const [selectedTenure, setSelectedTenure] = useState(currentLoan.tenureMonths);
  
  const currentEMI = currentLoan.emiAmount;
  const outstandingAmount = currentLoan.outstandingTotal;

  const comparisons = useMemo(() => {
    return refinanceOptions.map(option => {
      const newEMI = calculateEMI(outstandingAmount, option.interestRate, selectedTenure);
      const totalCurrentPayment = currentEMI * selectedTenure;
      const totalNewPayment = newEMI * selectedTenure;
      const processingFeeAmount = (outstandingAmount * option.processingFee) / 100;
      const savings = totalCurrentPayment - totalNewPayment - processingFeeAmount;
      const monthlySavings = currentEMI - newEMI;
      
      return {
        ...option,
        newEMI,
        totalNewPayment,
        processingFeeAmount,
        savings,
        monthlySavings,
        isBetter: savings > 0
      };
    }).sort((a, b) => b.savings - a.savings);
  }, [outstandingAmount, currentEMI, selectedTenure]);

  const bestOption = comparisons.find(c => c.isBetter);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingDown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Loan Refinancing Comparison</CardTitle>
            <CardDescription>Compare your current loan with refinancing options</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Loan Summary */}
        <div className="p-4 rounded-lg bg-muted/50 border">
          <h4 className="font-semibold mb-3">Your Current Loan</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="font-bold text-lg">{formatCurrency(outstandingAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Interest Rate</p>
              <p className="font-bold text-lg">{currentLoan.interestRate}% p.a.</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current EMI</p>
              <p className="font-bold text-lg">{formatCurrency(currentEMI)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining Tenure</p>
              <p className="font-bold text-lg">{currentLoan.tenureMonths} months</p>
            </div>
          </div>
        </div>

        {/* Tenure Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">New Tenure (months)</Label>
            <Badge variant="secondary">{selectedTenure} months</Badge>
          </div>
          <Slider
            value={[selectedTenure]}
            onValueChange={([v]) => setSelectedTenure(v)}
            min={12}
            max={84}
            step={6}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>12 months</span>
            <span>84 months</span>
          </div>
        </div>

        {/* Best Option Highlight */}
        {bestOption && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="font-semibold text-emerald-600">Best Savings with {bestOption.lenderName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You can save {formatCurrency(bestOption.savings)} over the loan tenure by refinancing with {bestOption.lenderName} at {bestOption.interestRate}% p.a.
            </p>
          </motion.div>
        )}

        {/* Comparison Cards */}
        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards" className="mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {comparisons.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${option.recommended ? 'border-primary bg-primary/5' : 'bg-card'} relative`}
                >
                  {option.recommended && (
                    <Badge className="absolute -top-2 right-4 bg-primary">Recommended</Badge>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{option.lenderName}</h4>
                    {option.isBetter ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        Save {formatCurrency(option.savings)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        No Savings
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Interest</p>
                        <p className="font-medium">{option.interestRate}% p.a.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">New EMI</p>
                        <p className="font-medium">{formatCurrency(option.newEMI)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className="text-muted-foreground">Processing Fee:</span>
                    <span className="font-medium">{option.processingFee}% ({formatCurrency(option.processingFeeAmount)})</span>
                  </div>

                  {option.monthlySavings > 0 && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3">
                      <TrendingDown className="h-4 w-4" />
                      <span>Save {formatCurrency(option.monthlySavings)}/month</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {option.features.slice(0, 2).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                    ))}
                  </div>

                  <Button className="w-full" variant={option.recommended ? "default" : "outline"}>
                    Apply for Refinance
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Lender</th>
                    <th className="text-right p-3 text-sm font-medium">Interest</th>
                    <th className="text-right p-3 text-sm font-medium">New EMI</th>
                    <th className="text-right p-3 text-sm font-medium">Monthly Savings</th>
                    <th className="text-right p-3 text-sm font-medium">Total Savings</th>
                    <th className="text-center p-3 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((option) => (
                    <tr key={option.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {option.lenderName}
                          {option.recommended && <Badge className="text-xs">Best</Badge>}
                        </div>
                      </td>
                      <td className="p-3 text-right">{option.interestRate}%</td>
                      <td className="p-3 text-right">{formatCurrency(option.newEMI)}</td>
                      <td className="p-3 text-right">
                        {option.monthlySavings > 0 ? (
                          <span className="text-emerald-600">+{formatCurrency(option.monthlySavings)}</span>
                        ) : (
                          <span className="text-red-500">{formatCurrency(option.monthlySavings)}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {option.savings > 0 ? (
                          <span className="text-emerald-600 font-medium">+{formatCurrency(option.savings)}</span>
                        ) : (
                          <span className="text-red-500">{formatCurrency(option.savings)}</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <Button size="sm" variant="outline">Apply</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center">
          *Rates and calculations are indicative. Actual rates may vary based on credit profile and lender policies.
        </p>
      </CardContent>
    </Card>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
