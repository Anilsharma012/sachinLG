import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Globe, Mail, MessageSquare, PhoneCall, CreditCard, Database } from "lucide-react";

type ProviderKey = "email" | "sms" | "whatsapp" | "storage" | "payments";

export default function SuperAdminIntegrations() {
  const [providers, setProviders] = useState<Record<ProviderKey, string>>({
    email: "smtp",
    sms: "msg91",
    whatsapp: "meta",
    storage: "cloud",
    payments: "razorpay",
  });
  const [allowOrgOverride, setAllowOrgOverride] = useState(true);

  const save = () => toast.success("Saved integration defaults (mock)");

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Platform-level provider defaults (orgs can override if allowed)</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" /> Provider Defaults
            </CardTitle>
            <CardDescription>These are mock settings; later they will power real integrations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email provider
              </Label>
              <Select value={providers.email} onValueChange={(v) => setProviders((p) => ({ ...p, email: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="ses">Amazon SES</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4" /> SMS provider
              </Label>
              <Select value={providers.sms} onValueChange={(v) => setProviders((p) => ({ ...p, sms: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msg91">MSG91</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> WhatsApp provider
              </Label>
              <Select value={providers.whatsapp} onValueChange={(v) => setProviders((p) => ({ ...p, whatsapp: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meta">Meta Cloud API</SelectItem>
                  <SelectItem value="gupshup">Gupshup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Database className="h-4 w-4" /> Storage
              </Label>
              <Select value={providers.storage} onValueChange={(v) => setProviders((p) => ({ ...p, storage: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Cloud storage</SelectItem>
                  <SelectItem value="s3">Amazon S3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment gateway
              </Label>
              <Select value={providers.payments} onValueChange={(v) => setProviders((p) => ({ ...p, payments: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                  <SelectItem value="cashfree">Cashfree</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">Allow org override</p>
                <p className="text-sm text-muted-foreground">If off, org-level settings are locked.</p>
              </div>
              <Switch checked={allowOrgOverride} onCheckedChange={setAllowOrgOverride} />
            </div>

            <div className="md:col-span-2">
              <Button onClick={save}>Save defaults</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </SuperAdminLayout>
  );
}
