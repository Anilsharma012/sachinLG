import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { IndianRupee, TrendingUp, Wallet, Download, Calendar, Target, Award } from "lucide-react";

interface Commission {
  id: string;
  customerName: string;
  loanId: string;
  product: string;
  disbursedAmount: number;
  commissionRate: number;
  commissionAmount: number;
  date: string;
  status: "pending" | "processing" | "paid";
}

const mockCommissions: Commission[] = [
  { id: "COM001", customerName: "Rahul Verma", loanId: "LOAN001", product: "Personal Loan", disbursedAmount: 300000, commissionRate: 2, commissionAmount: 6000, date: "2024-01-15", status: "paid" },
  { id: "COM002", customerName: "Sneha Gupta", loanId: "LOAN002", product: "Home Loan", disbursedAmount: 5000000, commissionRate: 1.5, commissionAmount: 75000, date: "2024-01-14", status: "processing" },
  { id: "COM003", customerName: "Amit Singh", loanId: "LOAN003", product: "Business Loan", disbursedAmount: 1000000, commissionRate: 2.5, commissionAmount: 25000, date: "2024-01-13", status: "paid" },
  { id: "COM004", customerName: "Pooja Sharma", loanId: "LOAN004", product: "Personal Loan", disbursedAmount: 500000, commissionRate: 2, commissionAmount: 10000, date: "2024-01-12", status: "pending" },
  { id: "COM005", customerName: "Vikash Kumar", loanId: "LOAN005", product: "Car Loan", disbursedAmount: 800000, commissionRate: 1.8, commissionAmount: 14400, date: "2024-01-11", status: "paid" },
  { id: "COM006", customerName: "Meera Patel", loanId: "LOAN006", product: "Home Loan", disbursedAmount: 3500000, commissionRate: 1.5, commissionAmount: 52500, date: "2024-01-10", status: "paid" },
];

const monthlyData = [
  { month: "Aug", earned: 45000, target: 50000 },
  { month: "Sep", earned: 62000, target: 55000 },
  { month: "Oct", earned: 58000, target: 60000 },
  { month: "Nov", earned: 71000, target: 65000 },
  { month: "Dec", earned: 85000, target: 70000 },
  { month: "Jan", earned: 182900, target: 80000 },
];

const productWise = [
  { name: "Personal Loan", value: 16000, color: "#3b82f6" },
  { name: "Home Loan", value: 127500, color: "#22c55e" },
  { name: "Business Loan", value: 25000, color: "#f59e0b" },
  { name: "Car Loan", value: 14400, color: "#8b5cf6" },
];

const AgentCommission = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");

  const totalEarned = mockCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const paidAmount = mockCommissions.filter(c => c.status === "paid").reduce((sum, c) => sum + c.commissionAmount, 0);
  const pendingAmount = mockCommissions.filter(c => c.status !== "paid").reduce((sum, c) => sum + c.commissionAmount, 0);
  const currentMonthTarget = 80000;
  const targetProgress = Math.round((totalEarned / currentMonthTarget) * 100);

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Commission Dashboard</h1>
            <p className="text-muted-foreground">Track your earnings and payouts</p>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border rounded-md bg-background"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_quarter">This Quarter</option>
              <option value="this_year">This Year</option>
            </select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{totalEarned.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <Wallet className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{paidAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Paid Out</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/20">
                  <TrendingUp className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pending Payout</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{targetProgress}%</p>
                  <p className="text-sm text-muted-foreground">Target Achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Banner */}
        {targetProgress >= 100 && (
          <Card className="bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 border-amber-500/30">
            <CardContent className="p-4 flex items-center gap-4">
              <Award className="h-10 w-10 text-amber-500" />
              <div>
                <p className="font-bold text-lg">🎉 Congratulations! You've exceeded your target!</p>
                <p className="text-sm text-muted-foreground">You've earned ₹{(totalEarned - currentMonthTarget).toLocaleString()} above your monthly target.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings vs Target</CardTitle>
                  <CardDescription>Your performance over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000)}k`} />
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} />
                      <Bar dataKey="earned" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Earned" />
                      <Bar dataKey="target" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Target" opacity={0.3} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Commission by Product</CardTitle>
                  <CardDescription>Earnings breakdown by loan type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={productWise}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {productWise.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Commission"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Commission Transactions</CardTitle>
                <CardDescription>Detailed list of all your commission entries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Disbursed Amount</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCommissions.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell className="font-medium">{comm.id}</TableCell>
                        <TableCell>{comm.customerName}</TableCell>
                        <TableCell>{comm.product}</TableCell>
                        <TableCell>₹{comm.disbursedAmount.toLocaleString()}</TableCell>
                        <TableCell>{comm.commissionRate}%</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ₹{comm.commissionAmount.toLocaleString()}
                        </TableCell>
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
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earning Trend</CardTitle>
                  <CardDescription>Commission growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000)}k`} />
                      <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Earned"]} />
                      <Line type="monotone" dataKey="earned" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-primary">{mockCommissions.length}</p>
                    <p className="text-muted-foreground">Total Disbursals</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-primary">1.87%</p>
                    <p className="text-muted-foreground">Avg. Commission Rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-primary">₹30.5K</p>
                    <p className="text-muted-foreground">Avg. per Disbursal</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AgentCommission;
