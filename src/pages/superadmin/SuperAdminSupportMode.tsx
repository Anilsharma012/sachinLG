import { useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserCog, Search, Eye, Shield, AlertTriangle, 
  Building2, User, Clock, MapPin, LogOut
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOrganizations, mockGlobalAuditLogs } from "@/data/superadminMockData";
import { toast } from "sonner";

export default function SuperAdminSupportMode() {
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [impersonationReason, setImpersonationReason] = useState("");
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedAs, setImpersonatedAs] = useState<{org: string; user: string; role: string} | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const mockUsers = [
    { id: 'u1', name: 'Rahul Sharma', role: 'OrgAdmin', email: 'rahul@loankart.com' },
    { id: 'u2', name: 'Priya Patel', role: 'Agent', email: 'priya@loankart.com' },
    { id: 'u3', name: 'Amit Kumar', role: 'Customer', email: 'amit@gmail.com' },
  ];

  const handleStartImpersonation = () => {
    if (!selectedOrg || !selectedUser || !impersonationReason.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmImpersonation = () => {
    const user = mockUsers.find(u => u.id === selectedUser);
    const org = mockOrganizations.find(o => o.id === selectedOrg);
    
    setImpersonatedAs({
      org: org?.name || '',
      user: user?.name || '',
      role: user?.role || ''
    });
    setIsImpersonating(true);
    setShowConfirmDialog(false);
    toast.success(`Now viewing as ${user?.name} (${user?.role})`);
  };

  const handleStopImpersonation = () => {
    setIsImpersonating(false);
    setImpersonatedAs(null);
    setSelectedOrg("");
    setSelectedUser("");
    setImpersonationReason("");
    toast.success("Exited support mode");
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Mode</h1>
            <p className="text-muted-foreground">Impersonate users for troubleshooting</p>
          </div>
        </div>

        {/* Warning Banner */}
        <Card className="border-warning bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Security Notice</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All actions performed in Support Mode are logged with your real identity. 
                  Impersonation should only be used for troubleshooting with valid business reasons.
                  Misuse will be audited and may result in access revocation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Impersonation Banner */}
        {isImpersonating && impersonatedAs && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCog className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      Currently viewing as: {impersonatedAs.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {impersonatedAs.role} at {impersonatedAs.org}
                    </p>
                  </div>
                </div>
                <Button variant="destructive" onClick={handleStopImpersonation}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit Support Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Impersonation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Start Impersonation
              </CardTitle>
              <CardDescription>
                View the platform as a specific user
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Organization</Label>
                <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockOrganizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {org.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser} disabled={!selectedOrg}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {user.name}
                          <Badge variant="outline" className="ml-2">{user.role}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reason for Impersonation *</Label>
                <Textarea
                  placeholder="Describe why you need to impersonate this user (e.g., 'Ticket #1234 - User reports payment not showing')"
                  value={impersonationReason}
                  onChange={(e) => setImpersonationReason(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleStartImpersonation}
                disabled={isImpersonating}
              >
                <Eye className="h-4 w-4 mr-2" />
                Start Impersonation
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common support tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Reset User Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Unlock User Account
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Extend Trial Period
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                View Org Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Impersonation Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Impersonation Sessions</CardTitle>
            <CardDescription>Audit trail of support mode usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Admin</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Impersonated User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Organization</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {mockGlobalAuditLogs
                    .filter(log => log.action.includes('impersonate'))
                    .slice(0, 5)
                    .map((log) => (
                      <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserCog className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-foreground">{log.actorName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {log.details?.impersonatedUser || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-foreground">
                          {log.orgName || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">
                          {log.details?.reason || 'No reason provided'}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {log.details?.duration || '5 min'}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Impersonation</DialogTitle>
              <DialogDescription>
                You are about to view the platform as another user
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organization:</span>
                  <span className="font-medium text-foreground">
                    {mockOrganizations.find(o => o.id === selectedOrg)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User:</span>
                  <span className="font-medium text-foreground">
                    {mockUsers.find(u => u.id === selectedUser)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <Badge variant="outline">
                    {mockUsers.find(u => u.id === selectedUser)?.role}
                  </Badge>
                </div>
              </div>
              <div className="p-4 bg-warning/10 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Reason:</strong> {impersonationReason}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                This session will be logged with your identity and the reason provided.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmImpersonation}>
                <Eye className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
}
