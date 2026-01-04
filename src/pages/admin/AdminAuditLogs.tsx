import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, Shield, Download, Activity, User, FileText } from "lucide-react";

const mockAuditLogs = [
  { id: "LOG001", action: "LOAN_APPROVED", actor: "Admin User", actorId: "ADM001", entity: "Loan Application", entityId: "APP001", oldValue: "pending", newValue: "approved", ip: "192.168.1.1", device: "Chrome/Windows", timestamp: "2024-01-15 10:30:00" },
  { id: "LOG002", action: "PAYMENT_RECEIVED", actor: "System", actorId: "SYS", entity: "Payment", entityId: "PAY001", oldValue: null, newValue: "₹15,000", ip: "Gateway", device: "Razorpay", timestamp: "2024-01-15 09:45:00" },
  { id: "LOG003", action: "KYC_REJECTED", actor: "Verifier User", actorId: "VER001", entity: "KYC Document", entityId: "KYC001", oldValue: "pending", newValue: "rejected", ip: "192.168.1.5", device: "Safari/MacOS", timestamp: "2024-01-15 09:15:00" },
  { id: "LOG004", action: "USER_CREATED", actor: "Admin User", actorId: "ADM001", entity: "User", entityId: "USR005", oldValue: null, newValue: "New Agent", ip: "192.168.1.1", device: "Chrome/Windows", timestamp: "2024-01-14 16:30:00" },
  { id: "LOG005", action: "EMI_WAIVED", actor: "Finance User", actorId: "FIN001", entity: "EMI", entityId: "EMI001", oldValue: "₹500 penalty", newValue: "₹0", ip: "192.168.1.8", device: "Firefox/Linux", timestamp: "2024-01-14 15:00:00" },
  { id: "LOG006", action: "LOAN_DISBURSED", actor: "Finance User", actorId: "FIN001", entity: "Loan Account", entityId: "LOAN001", oldValue: "sanctioned", newValue: "disbursed", ip: "192.168.1.8", device: "Firefox/Linux", timestamp: "2024-01-14 14:00:00" },
];

const AdminAuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    if (action.includes("APPROVED") || action.includes("CREATED") || action.includes("DISBURSED")) return "text-green-500 bg-green-500/10";
    if (action.includes("REJECTED") || action.includes("DELETED")) return "text-red-500 bg-red-500/10";
    if (action.includes("WAIVED") || action.includes("UPDATED")) return "text-amber-500 bg-amber-500/10";
    return "text-blue-500 bg-blue-500/10";
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export Logs
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
                  <p className="text-sm text-muted-foreground">Total Actions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <User className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{new Set(mockAuditLogs.map(l => l.actorId)).size}</p>
                  <p className="text-sm text-muted-foreground">Unique Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{mockAuditLogs.filter(l => l.action.includes("APPROVED")).length}</p>
                  <p className="text-sm text-muted-foreground">Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{mockAuditLogs.filter(l => l.action.includes("WAIVED")).length}</p>
                  <p className="text-sm text-muted-foreground">Waivers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by action, actor or entity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="all">All Actions</option>
                <option value="APPROVED">Approvals</option>
                <option value="REJECTED">Rejections</option>
                <option value="CREATED">Creations</option>
                <option value="PAYMENT">Payments</option>
                <option value="WAIVED">Waivers</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{log.actor}</p>
                        <p className="text-sm text-muted-foreground">{log.actorId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{log.entity}</p>
                        <p className="text-sm text-muted-foreground">{log.entityId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {log.oldValue && <span className="text-red-500 line-through mr-2">{log.oldValue}</span>}
                        <span className="text-green-500">{log.newValue}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Log ID</p>
                                <p className="font-medium">{log.id}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Timestamp</p>
                                <p className="font-medium">{log.timestamp}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Action</p>
                                <p className="font-medium">{log.action}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Actor</p>
                                <p className="font-medium">{log.actor} ({log.actorId})</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">IP Address</p>
                                <p className="font-medium">{log.ip}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Device</p>
                                <p className="font-medium">{log.device}</p>
                              </div>
                            </div>
                            <div className="border-t pt-4">
                              <p className="text-sm text-muted-foreground mb-2">Value Changes</p>
                              <div className="flex gap-4">
                                <div className="flex-1 p-3 bg-red-500/10 rounded-lg">
                                  <p className="text-xs text-muted-foreground">Old Value</p>
                                  <p className="font-medium">{log.oldValue || "N/A"}</p>
                                </div>
                                <div className="flex-1 p-3 bg-green-500/10 rounded-lg">
                                  <p className="text-xs text-muted-foreground">New Value</p>
                                  <p className="font-medium">{log.newValue}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAuditLogs;
