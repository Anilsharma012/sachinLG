import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, TrendingUp, Users, IndianRupee, Calendar } from "lucide-react";

const disbursalData = [
  { month: "Jan", amount: 4500000 },
  { month: "Feb", amount: 5200000 },
  { month: "Mar", amount: 4800000 },
  { month: "Apr", amount: 6100000 },
  { month: "May", amount: 5500000 },
  { month: "Jun", amount: 7200000 },
];

const collectionsData = [
  { month: "Jan", collected: 3800000, due: 4200000 },
  { month: "Feb", collected: 4100000, due: 4500000 },
  { month: "Mar", collected: 3900000, due: 4300000 },
  { month: "Apr", collected: 5200000, due: 5500000 },
  { month: "May", collected: 4800000, due: 5000000 },
  { month: "Jun", collected: 6100000, due: 6500000 },
];

const statusDistribution = [
  { name: "Active", value: 45, color: "#22c55e" },
  { name: "Overdue", value: 15, color: "#ef4444" },
  { name: "Closed", value: 30, color: "#3b82f6" },
  { name: "NPA", value: 10, color: "#f59e0b" },
];

const reportsList = [
  { name: "Disbursal Report", description: "Monthly loan disbursals with agent breakdown", icon: IndianRupee },
  { name: "Collection Report", description: "EMI collection status and overdue analysis", icon: TrendingUp },
  { name: "Customer Report", description: "Customer acquisition and KYC status", icon: Users },
  { name: "Commission Report", description: "Agent-wise commission earned and payouts", icon: FileText },
  { name: "Overdue Report", description: "List of overdue EMIs with aging analysis", icon: Calendar },
  { name: "Revenue Report", description: "Interest income and fee collection summary", icon: IndianRupee },
];

const AdminReports = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" /> Date Range
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Export All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Disbursals</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={disbursalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collections vs Due</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={collectionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} />
                  <Line type="monotone" dataKey="collected" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="due" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loan Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportsList.map((report) => (
                  <div key={report.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <report.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" /> PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" /> CSV
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
