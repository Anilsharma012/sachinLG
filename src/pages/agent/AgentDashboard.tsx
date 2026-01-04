import { motion } from "framer-motion";
import { Users, TrendingUp, IndianRupee, Target, Calendar, Phone } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockLeads, mockCommissions } from "@/data/mockData";
import { format } from "date-fns";

function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  return `₹${amount.toLocaleString()}`;
}

export default function AgentDashboard() {
  const totalCommission = mockCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const upcomingFollowups = mockLeads.filter(l => l.nextFollowUp);

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, Priya!</h1>
          <p className="text-muted-foreground">Here's your performance summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard title="My Leads" value={mockLeads.length} subtitle="Active leads" icon={Users} trend={{ value: 15, isPositive: true }} />
          <KpiCard title="Conversions" value="12" subtitle="This month" icon={TrendingUp} variant="success" />
          <KpiCard title="Total Commission" value={formatCurrency(totalCommission)} subtitle="Earned this month" icon={IndianRupee} variant="info" />
          <KpiCard title="Target" value="85%" subtitle="Monthly target" icon={Target} variant="warning" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Today's Follow-ups</CardTitle><CardDescription>Scheduled calls and meetings</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingFollowups.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} /><AvatarFallback>{lead.name.charAt(0)}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.interestedProduct}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{lead.nextFollowUp && format(lead.nextFollowUp, "hh:mm a")}</span>
                      <Button size="sm" variant="outline"><Phone className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Commission History</CardTitle><CardDescription>Recent earnings</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommissions.map((comm) => (
                  <div key={comm.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{comm.customerName}</p>
                      <p className="text-xs text-muted-foreground">Disbursed: {formatCurrency(comm.disbursedAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success">{formatCurrency(comm.commissionAmount)}</p>
                      <StatusBadge status={comm.status} />
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
}
