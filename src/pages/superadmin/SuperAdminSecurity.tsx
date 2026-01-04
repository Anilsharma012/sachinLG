import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Shield, Users } from "lucide-react";

export default function SuperAdminSecurity() {
  const [allowedDomains, setAllowedDomains] = useState("loanagent.com, partner.com");
  const [ipAllowlistEnabled, setIpAllowlistEnabled] = useState(false);
  const [ipAllowlist, setIpAllowlist] = useState("103.45.67.0/24\n49.204.0.0/16");
  const [rateLimit, setRateLimit] = useState({ loginPerMin: 20, apiPerMin: 1200 });

  const save = () => toast.success("Security settings saved (mock)");

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Security Settings</h1>
          <p className="text-muted-foreground">Platform-wide security controls (UI-only)</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Rate limits
              </CardTitle>
              <CardDescription>Protect against brute force & abuse.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Login attempts / minute</Label>
                <Input
                  type="number"
                  value={rateLimit.loginPerMin}
                  onChange={(e) => setRateLimit((p) => ({ ...p, loginPerMin: Number(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>API requests / minute</Label>
                <Input
                  type="number"
                  value={rateLimit.apiPerMin}
                  onChange={(e) => setRateLimit((p) => ({ ...p, apiPerMin: Number(e.target.value) }))}
                />
              </div>
              <Button onClick={save}>Save</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Domain allowlist
              </CardTitle>
              <CardDescription>Optional: restrict platform admin emails to domains.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Allowed domains (comma-separated)</Label>
                <Input value={allowedDomains} onChange={(e) => setAllowedDomains(e.target.value)} />
              </div>
              <Button variant="outline" onClick={() => toast.success("Domains validated (mock)")}>Validate</Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Session controls
              </CardTitle>
              <CardDescription>Emergency actions for incidents.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Force logout all tenant users and staff (mock).</p>
              <Button variant="destructive" onClick={() => toast.success("Forced logout triggered (mock)")}>Force logout</Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>IP allowlist</CardTitle>
              <CardDescription>Optional: allow platform access only from specific IPs/CIDRs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Enable IP allowlist</p>
                  <p className="text-sm text-muted-foreground">If enabled, non-allowed IPs will be blocked.</p>
                </div>
                <Switch checked={ipAllowlistEnabled} onCheckedChange={setIpAllowlistEnabled} />
              </div>
              <div className="grid gap-2">
                <Label>Allowed IPs (one per line)</Label>
                <Textarea value={ipAllowlist} onChange={(e) => setIpAllowlist(e.target.value)} rows={6} disabled={!ipAllowlistEnabled} />
              </div>
              <Button onClick={save} disabled={!ipAllowlistEnabled}>
                Save allowlist
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </SuperAdminLayout>
  );
}
