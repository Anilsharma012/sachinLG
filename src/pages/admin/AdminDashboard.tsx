import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PendingVerificationQueue } from "@/components/admin/PendingVerificationQueue";
import { mockApplications, mockDashboardStats, mockLoanProducts } from "@/data/mockData";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const disbursementData = [
  { month: "Jul", amount: 2400000 },
  { month: "Aug", amount: 3200000 },
  { month: "Sep", amount: 2800000 },
  { month: "Oct", amount: 4100000 },
  { month: "Nov", amount: 3500000 },
  { month: "Dec", amount: 4800000 },
];

const collectionData = [
  { day: "Mon", collected: 120000, due: 150000 },
  { day: "Tue", collected: 180000, due: 200000 },
  { day: "Wed", collected: 150000, due: 180000 },
  { day: "Thu", collected: 220000, due: 250000 },
  { day: "Fri", collected: 190000, due: 220000 },
  { day: "Sat", collected: 100000, due: 120000 },
  { day: "Sun", collected: 50000, due: 60000 },
];

const loanTypeData = [
  { name: "Personal Loan", value: 45, color: "hsl(222, 47%, 20%)" },
  { name: "Home Loan", value: 30, color: "hsl(158, 64%, 42%)" },
  { name: "Business Loan", value: 25, color: "hsl(38, 92%, 50%)" },
];

const topAgents = [
  { name: "Priya Sharma", leads: 45, conversions: 12, amount: 2500000 },
  { name: "Rahul Verma", leads: 38, conversions: 10, amount: 2100000 },
  { name: "Anita Singh", leads: 32, conversions: 8, amount: 1800000 },
  { name: "Vikash Kumar", leads: 28, conversions: 7, amount: 1500000 },
];

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Download Report</Button>
            <Button className="gradient-accent text-accent-foreground">
              + New Application
            </Button>
          </div>
        </div>

        {/* Pending Agent Approvals */}
        <PendingVerificationQueue type="agent" />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Leads"
            value={mockDashboardStats.totalLeads}
            subtitle="This month"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <KpiCard
            title="Applications"
            value={mockDashboardStats.totalApplications}
            subtitle="Active processing"
            icon={FileText}
            trend={{ value: 8, isPositive: true }}
            variant="info"
          />
          <KpiCard
            title="Disbursed Amount"
            value={formatCurrency(mockDashboardStats.disbursedAmount)}
            subtitle="This month"
            icon={IndianRupee}
            trend={{ value: 15, isPositive: true }}
            variant="success"
          />
          <KpiCard
            title="Overdue EMIs"
            value={mockDashboardStats.overdueCount}
            subtitle="Requires attention"
            icon={AlertTriangle}
            trend={{ value: 3, isPositive: false }}
            variant="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Disbursement Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Disbursement Trend</CardTitle>
              <CardDescription>Monthly loan disbursement amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={disbursementData}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis tickFormatter={(v) => formatCurrency(v)} className="text-xs" />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), "Disbursed"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(158, 64%, 42%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Loan Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Distribution</CardTitle>
              <CardDescription>By product type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loanTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {loanTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Share"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {loanTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection & Agents Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Collections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Collections</CardTitle>
              <CardDescription>Collected vs Due amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={collectionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis tickFormatter={(v) => formatCurrency(v)} className="text-xs" />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="due" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Due" />
                    <Bar dataKey="collected" fill="hsl(158, 64%, 42%)" radius={[4, 4, 0, 0]} name="Collected" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Agents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Top Performing Agents</CardTitle>
                <CardDescription>This month's leaderboard</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAgents.map((agent, index) => (
                  <div key={agent.name} className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent.leads} leads • {agent.conversions} converted
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">{formatCurrency(agent.amount)}</p>
                      <p className="text-xs text-muted-foreground">Disbursed</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <CardDescription>Latest loan applications requiring attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApplications.map((app) => (
                  <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{app.applicationNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.customerName}`} />
                          <AvatarFallback>{app.customerName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {app.customerName}
                      </div>
                    </TableCell>
                    <TableCell>{app.productName}</TableCell>
                    <TableCell>{formatCurrency(app.requestedAmount)}</TableCell>
                    <TableCell>{app.assignedAgentName || "-"}</TableCell>
                    <TableCell>
                      <StatusBadge status={app.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(app.createdAt, "dd MMM yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockDashboardStats.approvedLoans}</p>
                <p className="text-xs text-muted-foreground">Approved Today</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockDashboardStats.pendingKyc}</p>
                <p className="text-xs text-muted-foreground">KYC Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(mockDashboardStats.collectionsToday)}</p>
                <p className="text-xs text-muted-foreground">Collections Today</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockDashboardStats.activeAgents}</p>
                <p className="text-xs text-muted-foreground">Active Agents</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
