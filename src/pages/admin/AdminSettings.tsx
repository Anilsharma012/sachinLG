import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CreditCard, FileText, Bell, Shield, Users, Percent, Save } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const [orgSettings, setOrgSettings] = useState({
    orgName: "ABC Finance Ltd",
    gstNumber: "29ABCDE1234F1ZK",
    address: "123 Business Park, Mumbai",
    phone: "+91 9876543210",
    email: "contact@abcfinance.com",
    invoicePrefix: "INV",
    receiptPrefix: "RCP",
  });

  const [loanSettings, setLoanSettings] = useState({
    maxLoanAmount: 5000000,
    minLoanAmount: 50000,
    maxTenure: 60,
    minTenure: 6,
    lateFeePercentage: 2,
    gracePeriodDays: 5,
    foreclosureCharge: 3,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    emiReminder: true,
    overdueAlert: true,
    paymentConfirmation: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>

        <Tabs defaultValue="organization" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="loan">Loan Rules</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" /> Organization Details
                </CardTitle>
                <CardDescription>Configure your organization's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input
                      value={orgSettings.orgName}
                      onChange={(e) => setOrgSettings({ ...orgSettings, orgName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GST Number</Label>
                    <Input
                      value={orgSettings.gstNumber}
                      onChange={(e) => setOrgSettings({ ...orgSettings, gstNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={orgSettings.phone}
                      onChange={(e) => setOrgSettings({ ...orgSettings, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={orgSettings.email}
                      onChange={(e) => setOrgSettings({ ...orgSettings, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Textarea
                      value={orgSettings.address}
                      onChange={(e) => setOrgSettings({ ...orgSettings, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Invoice Prefix</Label>
                    <Input
                      value={orgSettings.invoicePrefix}
                      onChange={(e) => setOrgSettings({ ...orgSettings, invoicePrefix: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Receipt Prefix</Label>
                    <Input
                      value={orgSettings.receiptPrefix}
                      onChange={(e) => setOrgSettings({ ...orgSettings, receiptPrefix: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loan">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Loan Rules & Fees
                </CardTitle>
                <CardDescription>Configure loan parameters, fees, and penalties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Loan Amount (₹)</Label>
                    <Input
                      type="number"
                      value={loanSettings.minLoanAmount}
                      onChange={(e) => setLoanSettings({ ...loanSettings, minLoanAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Loan Amount (₹)</Label>
                    <Input
                      type="number"
                      value={loanSettings.maxLoanAmount}
                      onChange={(e) => setLoanSettings({ ...loanSettings, maxLoanAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Tenure (Months)</Label>
                    <Input
                      type="number"
                      value={loanSettings.minTenure}
                      onChange={(e) => setLoanSettings({ ...loanSettings, minTenure: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Tenure (Months)</Label>
                    <Input
                      type="number"
                      value={loanSettings.maxTenure}
                      onChange={(e) => setLoanSettings({ ...loanSettings, maxTenure: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Late Fee (%)</Label>
                    <Input
                      type="number"
                      value={loanSettings.lateFeePercentage}
                      onChange={(e) => setLoanSettings({ ...loanSettings, lateFeePercentage: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Grace Period (Days)</Label>
                    <Input
                      type="number"
                      value={loanSettings.gracePeriodDays}
                      onChange={(e) => setLoanSettings({ ...loanSettings, gracePeriodDays: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Foreclosure Charge (%)</Label>
                    <Input
                      type="number"
                      value={loanSettings.foreclosureCharge}
                      onChange={(e) => setLoanSettings({ ...loanSettings, foreclosureCharge: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commission">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" /> Commission Rules
                </CardTitle>
                <CardDescription>Configure agent commission slabs and rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Commission Slabs</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">₹0 - ₹2,00,000</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">1.5%</span>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">₹2,00,001 - ₹5,00,000</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">2.0%</span>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">₹5,00,001 - ₹10,00,000</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">2.5%</span>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">Above ₹10,00,000</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">3.0%</span>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-4">Add New Slab</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Notification Settings
                </CardTitle>
                <CardDescription>Configure how and when notifications are sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">EMI Reminders</p>
                      <p className="text-sm text-muted-foreground">Send reminder before EMI due date</p>
                    </div>
                    <Switch
                      checked={notifications.emiReminder}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emiReminder: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Overdue Alerts</p>
                      <p className="text-sm text-muted-foreground">Alert for overdue payments</p>
                    </div>
                    <Switch
                      checked={notifications.overdueAlert}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, overdueAlert: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Confirmation</p>
                      <p className="text-sm text-muted-foreground">Confirm successful payments</p>
                    </div>
                    <Switch
                      checked={notifications.paymentConfirmation}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, paymentConfirmation: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Security Settings
                </CardTitle>
                <CardDescription>Configure security and access control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                    </div>
                    <select className="px-3 py-2 border rounded-md bg-background">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">IP Whitelisting</p>
                      <p className="text-sm text-muted-foreground">Restrict access to specific IPs</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Password Policy</p>
                      <p className="text-sm text-muted-foreground">Enforce strong passwords</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4" /> Role Permissions
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>SuperAdmin</span>
                        <span className="text-sm text-muted-foreground">Full Access</span>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>OrgAdmin</span>
                        <span className="text-sm text-muted-foreground">Manage Organization</span>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>Manager</span>
                        <span className="text-sm text-muted-foreground">Manage Team & Loans</span>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>Agent</span>
                        <span className="text-sm text-muted-foreground">Leads & Applications</span>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>Verifier</span>
                        <span className="text-sm text-muted-foreground">KYC & Documents</span>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>Finance</span>
                        <span className="text-sm text-muted-foreground">Payments & Disbursals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
