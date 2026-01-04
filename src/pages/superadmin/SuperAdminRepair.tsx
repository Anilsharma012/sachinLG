import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, Database, RefreshCw, Wrench, Zap } from "lucide-react";
import { mockOrganizations } from "@/data/superadminMockData";

export default function SuperAdminRepair() {
  const [orgId, setOrgId] = useState<string>("");

  const orgOptions = mockOrganizations;

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Data Repair Tools</h1>
          <p className="text-muted-foreground">Safe repair wizards (UI-only). Every action should be audited later.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Target Organization
            </CardTitle>
            <CardDescription>Select tenant before running any repair.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={orgId} onValueChange={setOrgId}>
              <SelectTrigger>
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {orgOptions.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" /> Recalculate Outstanding
              </CardTitle>
              <CardDescription>Recompute balances for a loan account (or entire org).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Loan Account ID (optional)" disabled={!orgId} />
              <Textarea placeholder="Reason (required)" disabled={!orgId} />
              <Button
                className="w-full"
                disabled={!orgId}
                onClick={() => toast.success("Recalculation initiated (mock)")}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Run
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" /> Regenerate EMI Schedule
              </CardTitle>
              <CardDescription>Generate missing EMI schedule with audit reason.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Loan Account ID" disabled={!orgId} />
              <Textarea placeholder="Reason (required)" disabled={!orgId} />
              <Button
                className="w-full"
                disabled={!orgId}
                onClick={() => toast.success("EMI schedule regenerated (mock)")}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Run
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> Fix Invoice Series
              </CardTitle>
              <CardDescription>Resolve numbering conflicts and FY resets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea placeholder="Reason (required)" disabled={!orgId} />
              <Button
                className="w-full"
                disabled={!orgId}
                onClick={() => toast.success("Invoice series fixed (mock)")}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Fix
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" /> Allocate Unallocated Payment
              </CardTitle>
              <CardDescription>Allocation wizard for payments not linked to EMIs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Payment ID" disabled={!orgId} />
              <Textarea placeholder="Reason (required)" disabled={!orgId} />
              <Button
                className="w-full"
                disabled={!orgId}
                onClick={() => toast.success("Payment allocated (mock)")}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Allocate
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </SuperAdminLayout>
  );
}
