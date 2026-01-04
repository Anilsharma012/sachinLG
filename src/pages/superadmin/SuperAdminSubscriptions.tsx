import { useMemo, useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreVertical, Search, Check, X } from "lucide-react";
import { mockSubscriptions } from "@/data/superadminMockData";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function SuperAdminSubscriptions() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return mockSubscriptions;
    return mockSubscriptions.filter((s) => [s.orgName, s.planName, s.status].some((v) => v.toLowerCase().includes(query)));
  }, [q]);

  const markPaid = () => toast.success("Marked as paid (mock)");
  const renew = () => toast.success("Renewed (mock)");
  const cancel = () => toast.success("Cancelled (mock)");

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">Org-wise subscriptions, renewals, and payment status (mock)</p>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search organization / plan / status" className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions ({rows.length})</CardTitle>
            <CardDescription>Actions are simulated with toasts for now.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Organization</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">End</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{s.orgName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{s.planName}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status === "active" ? "success" : s.status === "trial" ? "info" : "destructive"}>
                          {s.status}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-foreground">₹{s.amount.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.paymentStatus === "paid" ? "success" : s.paymentStatus === "pending" ? "warning" : "destructive"}>
                          {s.paymentStatus}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(s.endAt).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={markPaid}>
                              <Check className="mr-2 h-4 w-4" /> Mark paid
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={renew}>
                              <Check className="mr-2 h-4 w-4" /> Renew
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={cancel}>
                              <X className="mr-2 h-4 w-4" /> Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </SuperAdminLayout>
  );
}
