import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, Search, RefreshCw, Filter, Download,
  Bug, Webhook, Zap, Database, AlertCircle, CheckCircle,
  RotateCcw, Eye, Trash2, Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockSystemErrors, mockWebhookLogs } from "@/data/superadminMockData";
import { toast } from "sonner";

export default function SuperAdminErrors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusCodeFilter, setStatusCodeFilter] = useState<string>("all");
  const [selectedError, setSelectedError] = useState<typeof mockSystemErrors[0] | null>(null);

  const filteredErrors = mockSystemErrors.filter(error => {
    const matchesSearch = error.errorMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusCodeFilter === "all" || error.statusCode.toString() === statusCodeFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRetryWebhook = (webhookId: string) => {
    toast.success("Webhook retry initiated");
  };

  const errorStats = {
    total: mockSystemErrors.length,
    critical: mockSystemErrors.filter(e => e.statusCode >= 500).length,
    warnings: mockSystemErrors.filter(e => e.statusCode >= 400 && e.statusCode < 500).length,
    webhookFailures: mockWebhookLogs.filter(w => w.status === 'failed').length,
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Error Console</h1>
            <p className="text-muted-foreground">Monitor and manage system errors and webhooks</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Bug className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{errorStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{errorStats.critical}</p>
                  <p className="text-sm text-muted-foreground">Critical (5xx)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{errorStats.warnings}</p>
                  <p className="text-sm text-muted-foreground">Warnings (4xx)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Webhook className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{errorStats.webhookFailures}</p>
                  <p className="text-sm text-muted-foreground">Webhook Failures</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="errors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="errors">System Errors</TabsTrigger>
            <TabsTrigger value="webhooks">Webhook Logs</TabsTrigger>
            <TabsTrigger value="repair">Data Repair Tools</TabsTrigger>
          </TabsList>

          {/* System Errors Tab */}
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search errors..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusCodeFilter} onValueChange={setStatusCodeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Codes</SelectItem>
                      <SelectItem value="500">500</SelectItem>
                      <SelectItem value="502">502</SelectItem>
                      <SelectItem value="503">503</SelectItem>
                      <SelectItem value="400">400</SelectItem>
                      <SelectItem value="401">401</SelectItem>
                      <SelectItem value="403">403</SelectItem>
                      <SelectItem value="404">404</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Logs ({filteredErrors.length})</CardTitle>
                <CardDescription>Recent system errors and exceptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredErrors.map((error) => (
                    <div
                      key={error.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/10 cursor-pointer hover:bg-destructive/10 transition-colors"
                      onClick={() => setSelectedError(error)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{error.errorMessage}</p>
                          <p className="text-sm text-muted-foreground">
                            {error.method} {error.endpoint} • {error.orgName || 'Platform'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="destructive">{error.statusCode}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(error.createdAt).toLocaleTimeString('en-IN')}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhook Logs Tab */}
          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Logs</CardTitle>
                <CardDescription>Payment gateway and integration webhooks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockWebhookLogs.map((webhook) => (
                    <div
                      key={webhook.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        webhook.status === 'failed' 
                          ? 'bg-destructive/5 border-destructive/10' 
                          : 'bg-success/5 border-success/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          webhook.status === 'failed' ? 'bg-destructive/10' : 'bg-success/10'
                        }`}>
                          <Webhook className={`h-5 w-5 ${
                            webhook.status === 'failed' ? 'text-destructive' : 'text-success'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{webhook.eventType}</p>
                          <p className="text-sm text-muted-foreground">
                            {webhook.provider} • {webhook.orgName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={webhook.status === 'failed' ? 'destructive' : 'default'}>
                          {webhook.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Retries: {webhook.retries}
                        </span>
                        {webhook.status === 'failed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRetryWebhook(webhook.id)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Repair Tools Tab */}
          <TabsContent value="repair" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Recalculate Outstanding
                  </CardTitle>
                  <CardDescription>
                    Recalculate loan outstanding amounts for an organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org1">LoanKart Finance</SelectItem>
                      <SelectItem value="org2">QuickLoan Services</SelectItem>
                      <SelectItem value="org3">CashFlow Finance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Loan Account ID (optional)" />
                  <Input placeholder="Reason for recalculation" />
                  <Button className="w-full" onClick={() => toast.success("Recalculation initiated")}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recalculate
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Regenerate EMI Schedule
                  </CardTitle>
                  <CardDescription>
                    Regenerate EMI schedule for a specific loan account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org1">LoanKart Finance</SelectItem>
                      <SelectItem value="org2">QuickLoan Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Loan Account ID" />
                  <Input placeholder="Reason for regeneration" />
                  <Button className="w-full" onClick={() => toast.success("EMI schedule regenerated")}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Fix Invoice Series
                  </CardTitle>
                  <CardDescription>
                    Reset invoice numbering for financial year
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org1">LoanKart Finance</SelectItem>
                      <SelectItem value="org2">QuickLoan Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Reason for fix" />
                  <Button className="w-full" onClick={() => toast.success("Invoice series fixed")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Fix Series
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Allocate Unallocated Payment
                  </CardTitle>
                  <CardDescription>
                    Manually allocate payment to EMIs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org1">LoanKart Finance</SelectItem>
                      <SelectItem value="org2">QuickLoan Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Payment ID" />
                  <Input placeholder="Reason for allocation" />
                  <Button className="w-full" onClick={() => toast.success("Payment allocated")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Allocate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Detail Dialog */}
        <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Error Details</DialogTitle>
              <DialogDescription>
                {selectedError?.method} {selectedError?.endpoint}
              </DialogDescription>
            </DialogHeader>
            {selectedError && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status Code</p>
                    <Badge variant="destructive">{selectedError.statusCode}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Organization</p>
                    <p className="text-foreground">{selectedError.orgName || 'Platform'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="text-foreground">{selectedError.userId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="text-foreground">
                      {new Date(selectedError.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Error Message</p>
                  <p className="text-foreground bg-muted p-3 rounded-lg">
                    {selectedError.errorMessage}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Stack Trace</p>
                  <ScrollArea className="h-[200px]">
                    <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                      {selectedError.stack}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
}
