import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { 
  CreditCard, Plus, Edit, Trash2, Check, X, Users, 
  Database, Zap, Shield, MoreVertical, Search
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPlans, mockSubscriptions } from "@/data/superadminMockData";
import { toast } from "sonner";

export default function SuperAdminPlans() {
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);

  const handleMarkPaid = (subId: string) => {
    toast.success("Subscription marked as paid");
  };

  const handleCancelSubscription = (subId: string) => {
    toast.success("Subscription cancelled");
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Plans & Billing</h1>
            <p className="text-muted-foreground">Manage subscription plans and billing</p>
          </div>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Plan</DialogTitle>
                    <DialogDescription>Define a new subscription plan</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Plan Name</Label>
                        <Input placeholder="e.g., Professional" />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Price (₹)</Label>
                        <Input type="number" placeholder="2999" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Max Agents</Label>
                        <Input type="number" placeholder="25" />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Customers</Label>
                        <Input type="number" placeholder="1000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Storage (GB)</Label>
                        <Input type="number" placeholder="10" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>Cancel</Button>
                    <Button onClick={() => { toast.success("Plan created"); setIsCreatePlanOpen(false); }}>
                      Create Plan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockPlans.map((plan) => (
                <Card key={plan.id} className={plan.isPopular ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.isPopular && <Badge>Popular</Badge>}
                    </div>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">₹{plan.priceMonthly.toLocaleString()}</span>
                      <span className="text-muted-foreground">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Up to {plan.limits.maxAgents} agents</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Up to {plan.limits.maxCustomers.toLocaleString()} customers</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span>{plan.limits.storageGB} GB storage</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border space-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>Manage organization subscriptions</CardDescription>
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
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
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
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleMarkPaid(sub.id)}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Mark as Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Change Plan
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleCancelSubscription(sub.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Cancel
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
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Invoices</CardTitle>
                <CardDescription>All subscription invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Invoice management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
