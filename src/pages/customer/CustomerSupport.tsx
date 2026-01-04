import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MessageSquare, Plus, Eye, Phone, Mail, Clock, CheckCircle, HelpCircle, Send, Paperclip } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  lastUpdate: string;
  messages: { sender: "customer" | "support"; message: string; timestamp: string }[];
}

const mockTickets: Ticket[] = [
  {
    id: "TKT001",
    subject: "EMI payment not reflecting",
    category: "Payment",
    priority: "high",
    createdAt: "2024-01-15",
    status: "in_progress",
    lastUpdate: "2024-01-16",
    messages: [
      { sender: "customer", message: "I made an EMI payment yesterday but it's not showing in my account.", timestamp: "2024-01-15 10:30 AM" },
      { sender: "support", message: "Thank you for reaching out. We're checking your payment status. Your transaction ID please?", timestamp: "2024-01-15 11:00 AM" },
      { sender: "customer", message: "Transaction ID: TXN123456789", timestamp: "2024-01-15 11:15 AM" },
      { sender: "support", message: "We've verified your payment. It will be updated within 24 hours.", timestamp: "2024-01-16 09:00 AM" },
    ]
  },
  {
    id: "TKT002",
    subject: "Need loan statement for ITR",
    category: "Documents",
    priority: "medium",
    createdAt: "2024-01-10",
    status: "resolved",
    lastUpdate: "2024-01-11",
    messages: [
      { sender: "customer", message: "I need my loan statement for filing ITR. Please help.", timestamp: "2024-01-10 02:00 PM" },
      { sender: "support", message: "Your loan statement has been sent to your registered email.", timestamp: "2024-01-11 10:00 AM" },
    ]
  },
];

const faqs = [
  { question: "How can I pay my EMI?", answer: "You can pay your EMI through UPI, Net Banking, Debit/Credit Card, or by visiting our collection center. Log into your dashboard and click 'Pay EMI' to proceed." },
  { question: "What happens if I miss an EMI?", answer: "If you miss an EMI, a late fee/penalty will be charged as per your loan agreement. It may also affect your credit score. Please contact us if you're facing difficulties." },
  { question: "How do I get my NOC after loan closure?", answer: "After your loan is fully repaid, the NOC is automatically generated within 7 working days. You can download it from the 'Receipts' section." },
  { question: "Can I prepay my loan?", answer: "Yes, you can prepay your loan partially or fully. Prepayment charges may apply as per your loan agreement. Use the 'Pay Now' option and select prepayment." },
  { question: "How can I update my contact details?", answer: "You can update your contact details from the 'My Profile' section. Some changes may require document verification." },
];

const CustomerSupport = () => {
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const handleCreateTicket = () => {
    toast.success("Ticket created successfully! Our team will respond within 24 hours.");
    setNewTicketOpen(false);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    toast.success("Message sent!");
    setNewMessage("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-500/10";
      case "medium": return "text-amber-500 bg-amber-500/10";
      case "low": return "text-green-500 bg-green-500/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
            <p className="text-muted-foreground">Get help with your queries and issues</p>
          </div>
          <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Raise Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">Payment Issue</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="loan">Loan Query</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Related Loan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select loan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOAN001">Personal Loan - LOAN001</SelectItem>
                        <SelectItem value="none">Not related to any loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea placeholder="Describe your issue in detail..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Attachments (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Paperclip className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
                    <Input type="file" className="mt-2" multiple />
                  </div>
                </div>
                <Button className="w-full" onClick={handleCreateTicket}>Submit Ticket</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-sm text-muted-foreground">1800-XXX-XXXX (Toll Free)</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <MessageSquare className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+91 98765-XXXXX</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-500/10">
                <Mail className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">support@loanagent.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets">My Tickets ({mockTickets.length})</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Track your support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
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
                              <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{ticket.subject}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex gap-4 text-sm">
                                  <span className="text-muted-foreground">Ticket: {ticket.id}</span>
                                  <span className="text-muted-foreground">|</span>
                                  <span className="text-muted-foreground">{ticket.category}</span>
                                  <span className="text-muted-foreground">|</span>
                                  <StatusBadge status={ticket.status as any} />
                                </div>
                                
                                <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                                  {ticket.messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}>
                                      <div className={`max-w-[80%] p-3 rounded-lg ${
                                        msg.sender === "customer" 
                                          ? "bg-primary text-primary-foreground" 
                                          : "bg-muted"
                                      }`}>
                                        <p className="text-sm">{msg.message}</p>
                                        <p className={`text-xs mt-1 ${msg.sender === "customer" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                          {msg.timestamp}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {ticket.status !== "resolved" && ticket.status !== "closed" && (
                                  <div className="flex gap-2">
                                    <Input 
                                      placeholder="Type your message..." 
                                      value={newMessage}
                                      onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <Button onClick={handleSendMessage}>
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
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
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{faq.question}</p>
                          <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CustomerSupport;
