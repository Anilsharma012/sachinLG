import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, IndianRupee, Calendar, PieChart, Download, Info } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function CustomerCalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(24);

  const calculations = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loanAmount;

    // Generate amortization schedule
    let balance = loanAmount;
    const schedule = [];
    for (let i = 1; i <= tenure; i++) {
      const interestComponent = balance * monthlyRate;
      const principalComponent = emi - interestComponent;
      balance -= principalComponent;
      schedule.push({
        month: i,
        emi: emi,
        principal: principalComponent,
        interest: interestComponent,
        balance: Math.max(0, balance),
      });
    }

    return { emi, totalPayment, totalInterest, schedule };
  }, [loanAmount, interestRate, tenure]);

  const pieData = [
    { name: "Principal", value: loanAmount, color: "hsl(var(--primary))" },
    { name: "Interest", value: calculations.totalInterest, color: "hsl(var(--accent))" },
  ];

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loan Calculator</h1>
          <p className="text-muted-foreground">Calculate your EMI and view payment schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Inputs */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                EMI Calculator
              </CardTitle>
              <CardDescription>Adjust the values to calculate your EMI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loan Amount */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Loan Amount</Label>
                  <span className="text-sm font-medium">₹{loanAmount.toLocaleString()}</span>
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={(v) => setLoanAmount(v[0])}
                  min={50000}
                  max={5000000}
                  step={10000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹50,000</span>
                  <span>₹50,00,000</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Interest Rate (p.a.)</Label>
                  <span className="text-sm font-medium">{interestRate}%</span>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={(v) => setInterestRate(v[0])}
                  min={5}
                  max={30}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Tenure (Months)</Label>
                  <span className="text-sm font-medium">{tenure} months</span>
                </div>
                <Slider
                  value={[tenure]}
                  onValueChange={(v) => setTenure(v[0])}
                  min={6}
                  max={84}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>6 months</span>
                  <span>84 months</span>
                </div>
              </div>

              {/* Quick Select */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Quick Select Tenure</Label>
                <div className="flex flex-wrap gap-2">
                  {[12, 24, 36, 48, 60].map((t) => (
                    <Button
                      key={t}
                      variant={tenure === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTenure(t)}
                    >
                      {t} mo
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Loan Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* EMI Display */}
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
                    <p className="text-4xl font-bold text-primary">
                      ₹{Math.round(calculations.emi).toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Principal Amount</p>
                      <p className="text-lg font-semibold">₹{loanAmount.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                      <p className="text-lg font-semibold text-accent">₹{Math.round(calculations.totalInterest).toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Total Payment</p>
                      <p className="text-lg font-semibold">₹{Math.round(calculations.totalPayment).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => `₹${value.toLocaleString()}`}
                      />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key Info */}
              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Processing Fee & Other Charges</p>
                    <p className="text-sm text-muted-foreground">
                      This calculator shows the basic EMI. Actual EMI may vary based on processing fee, insurance, and other charges applicable to your loan product.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Amortization Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Amortization Schedule
              </CardTitle>
              <CardDescription>Month-by-month breakdown of your loan payments</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">EMI</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculations.schedule.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell className="text-right">₹{Math.round(row.emi).toLocaleString()}</TableCell>
                      <TableCell className="text-right text-green-600">₹{Math.round(row.principal).toLocaleString()}</TableCell>
                      <TableCell className="text-right text-amber-600">₹{Math.round(row.interest).toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{Math.round(row.balance).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Compare Products */}
        <Card>
          <CardHeader>
            <CardTitle>Compare Loan Products</CardTitle>
            <CardDescription>See how different loan products compare for your requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Personal Loan", rate: 12, maxTenure: 60, minAmount: 50000, maxAmount: 2000000 },
                { name: "Business Loan", rate: 14, maxTenure: 48, minAmount: 100000, maxAmount: 5000000 },
                { name: "Home Loan", rate: 8.5, maxTenure: 240, minAmount: 500000, maxAmount: 10000000 },
              ].map((product) => {
                const monthlyRate = product.rate / 12 / 100;
                const productTenure = Math.min(tenure, product.maxTenure);
                const productAmount = Math.min(Math.max(loanAmount, product.minAmount), product.maxAmount);
                const productEmi = (productAmount * monthlyRate * Math.pow(1 + monthlyRate, productTenure)) / (Math.pow(1 + monthlyRate, productTenure) - 1);

                return (
                  <div key={product.name} className="p-4 rounded-lg border hover:border-primary transition-colors">
                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interest Rate</span>
                        <span className="font-medium">{product.rate}% p.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Tenure</span>
                        <span className="font-medium">{product.maxTenure} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">EMI</span>
                        <span className="font-medium text-primary">₹{Math.round(productEmi).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3" size="sm">
                      Apply Now
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
