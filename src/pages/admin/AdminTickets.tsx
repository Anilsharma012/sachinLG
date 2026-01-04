import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";

const mockTickets = [
  { id: "TKT001", subject: "EMI Payment Issue", customerName: "Rajesh Kumar", customerId: "CUST001", priority: "high", category: "Payment", createdAt: "2024-01-15", status: "open" },
  { id: "TKT002", subject: "Document Upload Failed", customerName: "Priya Sharma", customerId: "CUST002", priority: "medium", category: "Technical", createdAt: "2024-01-14", status: "in_progress" },
  { id: "TKT003", subject: "Loan Statement Request", customerName: "Amit Patel", customerId: "CUST003", priority: "low", category: "Request", createdAt: "2024-01-13", status: "resolved" },
  { id: "TKT004", subject: "Interest Rate Query", customerName: "Sunita Devi", customerId: "CUST004", priority: "medium", category: "Query", createdAt: "2024-01-12", status: "open" },
  { id: "TKT005", subject: "Prepayment Process", customerName: "Vikram Singh", customerId: "CUST005", priority: "high", category: "Request", createdAt: "2024-01-11", status: "in_progress" },
];

const AdminTickets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCount = mockTickets.filter(t => t.status === "open").length;
  const inProgressCount = mockTickets.filter(t => t.status === "in_progress").length;
  const resolvedCount = mockTickets.filter(t => t.status === "resolved").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-500/10";
      case "medium": return "text-amber-500 bg-amber-500/10";
      case "low": return "text-green-500 bg-green-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" /> Create Ticket
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockTickets.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{openCount}</p>
                  <p className="text-sm text-muted-foreground">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{resolvedCount}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
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
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.customerName}</p>
                        <p className="text-sm text-muted-foreground">{ticket.customerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell>{ticket.createdAt}</TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status as any} />
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{ticket.subject}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Customer</p>
                                <p className="font-medium">{ticket.customerName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Category</p>
                                <p className="font-medium">{ticket.category}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Priority</p>
                                <p className="font-medium capitalize">{ticket.priority}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <StatusBadge status={ticket.status as any} />
                              </div>
                            </div>
                            <div className="border rounded-lg p-4 bg-muted/30">
                              <p className="text-sm text-muted-foreground mb-2">Conversation</p>
                              <p>Customer inquiry regarding {ticket.subject.toLowerCase()}...</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Reply</label>
                              <Textarea placeholder="Type your response..." />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Close Ticket</Button>
                              <Button>Send Reply</Button>
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

export default AdminTickets;
