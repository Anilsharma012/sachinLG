import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RefreshCw, RotateCcw, Search, Webhook } from "lucide-react";
import { mockWebhookLogs } from "@/data/superadminMockData";

export default function SuperAdminWebhooks() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return mockWebhookLogs.filter((w) => {
      const matchesQ = !query || [w.provider, w.eventType, w.orgName ?? ""].some((v) => v.toLowerCase().includes(query));
      const matchesStatus = status === "all" || w.status === status;
      return matchesQ && matchesStatus;
    });
  }, [q, status]);

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Webhook Logs</h1>
            <p className="text-muted-foreground">View webhook delivery status and retry failed events (mock)</p>
          </div>
          <Button variant="outline" onClick={() => toast.success("Refreshing logs (mock)")}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search provider / event / org" className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events ({rows.length})</CardTitle>
            <CardDescription>Failed events can be retried from here.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rows.map((w) => (
                <article
                  key={w.id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Webhook className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{w.eventType}</p>
                      <p className="text-sm text-muted-foreground">
                        {w.provider} • {w.orgName ?? "Platform"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={w.status === "failed" ? "destructive" : w.status === "pending" ? "secondary" : "default"}>
                      {w.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Retries: {w.retries}</span>
                    {w.status === "failed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success(`Retry started for ${w.id} (mock)`)}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Retry
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </SuperAdminLayout>
  );
}
