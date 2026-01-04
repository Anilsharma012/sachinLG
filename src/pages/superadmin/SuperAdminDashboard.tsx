import { motion } from "framer-motion";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PendingVerificationQueue } from "@/components/admin/PendingVerificationQueue";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Calendar,
  RefreshCcw,
  DollarSign,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { mockPlatformStats, mockOrganizations, mockSystemErrors, mockSubscriptions } from "@/data/superadminMockData";

const revenueData = [
  { month: "Jul", revenue: 180000, subscriptions: 45 },
  { month: "Aug", revenue: 220000, subscriptions: 52 },
  { month: "Sep", revenue: 280000, subscriptions: 61 },
  { month: "Oct", revenue: 310000, subscriptions: 68 },
  { month: "Nov", revenue: 340000, subscriptions: 75 },
  { month: "Dec", revenue: 360000, subscriptions: 82 },
];

const orgDistribution = [
  { name: "Enterprise", value: 15, color: "#f59e0b" },
  { name: "Professional", value: 35, color: "#3b82f6" },
  { name: "Starter", value: 30, color: "#10b981" },
  { name: "Trial", value: 20, color: "#6b7280" },
];

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
};

export default function SuperAdminDashboard() {
  const stats = mockPlatformStats;

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
            <p className="text-muted-foreground">Real-time insights across all organizations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Pending Admin Approvals */}
        <PendingVerificationQueue type="admin" />

        {/* Primary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Organizations</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalOrganizations}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                        {stats.activeOrganizations} Active
                      </Badge>
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                        {stats.trialOrganizations} Trial
                      </Badge>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Users</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stats.totalAgents} Agents • {stats.totalCustomers} Customers
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">MTD Disbursement</p>
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.totalDisbursedMTD)}</p>
                    <p className="text-sm text-emerald-600 mt-1 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      +18.5% vs last month
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Revenue</p>
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.platformRevenueMTD)}</p>
                    <p className="text-sm text-emerald-600 mt-1 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      +12.3% vs last month
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">API Uptime</p>
                    <p className="text-xl font-bold text-emerald-600">{stats.apiUptime}%</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500 text-white">Healthy</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-xl font-bold text-amber-600">{stats.errorRate}%</p>
                  </div>
                </div>
                <Badge className="bg-amber-500 text-white">Low</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Webhook Failures</p>
                    <p className="text-xl font-bold text-red-600">{stats.webhookFailures}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue EMIs</p>
                    <p className="text-xl font-bold text-foreground">{stats.overdueCount}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly subscription revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Organization Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription>Organizations by plan type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orgDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {orgDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {orgDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Organizations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Organizations</CardTitle>
                <CardDescription>Latest registered organizations</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrganizations.slice(0, 4).map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{org.name}</p>
                        <p className="text-sm text-muted-foreground">{org.city}, {org.state}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge
                        status={org.planStatus === 'active' ? 'success' : org.planStatus === 'trial' ? 'info' : 'destructive'}
                      >
                        {org.planStatus}
                      </StatusBadge>
                      <p className="text-xs text-muted-foreground mt-1">{org.plan} Plan</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Errors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Errors</CardTitle>
                <CardDescription>System errors requiring attention</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSystemErrors.map((error) => (
                  <div
                    key={error.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{error.errorMessage}</p>
                        <p className="text-sm text-muted-foreground">
                          {error.method} {error.endpoint}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">{error.statusCode}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {error.orgName || 'Platform'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Subscription Overview</CardTitle>
              <CardDescription>Active and pending subscriptions</CardDescription>
            </div>
            <Button variant="outline" size="sm">Manage Subscriptions</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Organization</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Next Billing</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{sub.orgName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{sub.planName}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={sub.status === 'active' ? 'success' : sub.status === 'trial' ? 'info' : 'destructive'}
                        >
                          {sub.status}
                        </StatusBadge>
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        ₹{sub.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {sub.nextBillingAt 
                          ? new Date(sub.nextBillingAt).toLocaleDateString('en-IN')
                          : '-'
                        }
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={sub.paymentStatus === 'paid' ? 'success' : sub.paymentStatus === 'pending' ? 'warning' : 'destructive'}
                        >
                          {sub.paymentStatus}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
