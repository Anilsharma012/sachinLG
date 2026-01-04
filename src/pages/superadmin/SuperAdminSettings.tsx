import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings } from "lucide-react";

export default function SuperAdminSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalKyc, setGlobalKyc] = useState(true);
  const [supportModeOnlyCrossOrg, setSupportModeOnlyCrossOrg] = useState(true);

  const save = () => toast.success("Platform settings saved (mock)");

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground">Global feature flags and maintenance controls (UI-only)</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Global Flags
            </CardTitle>
            <CardDescription>These flags apply across all organizations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">Maintenance mode</p>
                <p className="text-sm text-muted-foreground">Show maintenance notice and block non-admin access (mock).</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">KYC required by default</p>
                <p className="text-sm text-muted-foreground">Orgs can still override if plan allows (mock).</p>
              </div>
              <Switch checked={globalKyc} onCheckedChange={setGlobalKyc} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">Cross-org access only via Support Mode</p>
                <p className="text-sm text-muted-foreground">Adds strict audit logging (mock).</p>
              </div>
              <Switch checked={supportModeOnlyCrossOrg} onCheckedChange={setSupportModeOnlyCrossOrg} />
            </div>

            <Button onClick={save}>Save settings</Button>
          </CardContent>
        </Card>
      </section>
    </SuperAdminLayout>
  );
}
