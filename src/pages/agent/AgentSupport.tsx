import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Plus, Eye, Phone, Mail, Clock, CheckCircle, HelpCircle, Book, Video } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  status: "open" | "in_progress" | "resolved";
  lastUpdate: string;
}

const mockTickets: Ticket[] = [
  { id: "TKT001", subject: "Commission not credited", category: "Commission", priority: "high", createdAt: "2024-01-15", status: "in_progress", lastUpdate: "2024-01-16" },
  { id: "TKT002", subject: "Customer document upload issue", category: "Technical", priority: "medium", createdAt: "2024-01-14", status: "open", lastUpdate: "2024-01-14" },
  { id: "TKT003", subject: "Lead assignment clarification", category: "Operations", priority: "low", createdAt: "2024-01-10", status: "resolved", lastUpdate: "2024-01-12" },
];

const faqs = [
  { question: "How is my commission calculated?", answer: "Commission is calculated based on the disbursed loan amount and the applicable rate for each product type. Personal loans have 2%, Home loans 1.5%, Business loans 2.5%, and Car loans 1.8%." },
  { question: "When do I receive my commission payout?", answer: "Commission payouts are processed on the 1st and 15th of every month. Commissions earned before the cut-off date are included in the next payout cycle." },
  { question: "How can I convert a lead to customer?", answer: "Navigate to My Leads, select the lead you want to convert, click on 'Convert to Customer' button and fill in the required KYC details." },
  { question: "What documents are required for loan application?", answer: "Required documents vary by loan type. Generally, you need ID proof (Aadhaar/PAN), address proof, income documents (salary slips/ITR), and bank statements." },
];

const AgentSupport = () => {
  const [newTicketOpen, setNewTicketOpen] = useState(false);

  const handleSubmitTicket = () => {
    toast.success("Support ticket created successfully!");
    setNewTicketOpen(false);
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
    <DashboardLayout role="agent">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
            <p className="text-muted-foreground">Get help, raise tickets, and access resources</p>
          </div>
          <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select className="w-full px-3 py-2 border rounded-md bg-background">
                      <option>Technical</option>
                      <option>Commission</option>
                      <option>Operations</option>
                      <option>Training</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <select className="w-full px-3 py-2 border rounded-md bg-background">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe your issue in detail..." rows={4} />
                </div>
                <Button className="w-full" onClick={handleSubmitTicket}>Submit Ticket</Button>
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
                <p className="font-medium">Call Support</p>
                <p className="text-sm text-muted-foreground">+91 1800-XXX-XXXX</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <MessageSquare className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-500/10">
                <Mail className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@loanagent.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
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
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
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
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
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

          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" /> Training Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span>Agent Onboarding Guide</span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span>Product Knowledge Base</span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span>Sales Best Practices</span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <span>Compliance Guidelines</span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" /> Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <p className="font-medium">How to Add Leads</p>
                        <p className="text-xs text-muted-foreground">5 min video</p>
                      </div>
                      <Button variant="outline" size="sm">Watch</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <p className="font-medium">Document Upload Process</p>
                        <p className="text-xs text-muted-foreground">3 min video</p>
                      </div>
                      <Button variant="outline" size="sm">Watch</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div>
                        <p className="font-medium">Understanding Commission</p>
                        <p className="text-xs text-muted-foreground">7 min video</p>
                      </div>
                      <Button variant="outline" size="sm">Watch</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AgentSupport;
