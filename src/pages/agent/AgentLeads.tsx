import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, Plus, Phone, Mail, Calendar, ArrowRight, MoreHorizontal, 
  User, Filter, TrendingUp, Users, Target, CheckCircle2, XCircle,
  MessageSquare, Clock, IndianRupee
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  amount: number;
  stage: "new" | "contacted" | "qualified" | "negotiation" | "converted" | "lost";
  source: string;
  nextFollowUp?: string;
  notes?: string;
  createdAt: string;
  priority: "high" | "medium" | "low";
}

const mockLeads: Lead[] = [
  { id: "L001", name: "Rahul Verma", phone: "+91 9876543210", email: "rahul@email.com", product: "Personal Loan", amount: 300000, stage: "negotiation", source: "Website", nextFollowUp: "2024-01-16", createdAt: "2024-01-10", priority: "high" },
  { id: "L002", name: "Sneha Gupta", phone: "+91 9876543211", email: "sneha@email.com", product: "Home Loan", amount: 5000000, stage: "contacted", source: "Referral", nextFollowUp: "2024-01-17", createdAt: "2024-01-12", priority: "medium" },
  { id: "L003", name: "Amit Singh", phone: "+91 9876543212", email: "amit@email.com", product: "Business Loan", amount: 1000000, stage: "qualified", source: "Walk-in", notes: "Needs quick disbursement", createdAt: "2024-01-08", priority: "high" },
  { id: "L004", name: "Pooja Sharma", phone: "+91 9876543213", email: "pooja@email.com", product: "Personal Loan", amount: 500000, stage: "negotiation", source: "Partner", createdAt: "2024-01-14", priority: "medium" },
  { id: "L005", name: "Vikash Kumar", phone: "+91 9876543214", email: "vikash@email.com", product: "Car Loan", amount: 800000, stage: "new", source: "Campaign", createdAt: "2024-01-15", priority: "low" },
  { id: "L006", name: "Meera Patel", phone: "+91 9876543215", email: "meera@email.com", product: "Home Loan", amount: 3500000, stage: "converted", source: "Referral", createdAt: "2024-01-05", priority: "high" },
  { id: "L007", name: "Suresh Reddy", phone: "+91 9876543216", email: "suresh@email.com", product: "Personal Loan", amount: 200000, stage: "lost", source: "Website", createdAt: "2024-01-03", priority: "low" },
];

const stages = [
  { key: "new", label: "New", color: "bg-sky-500", textColor: "text-sky-600", bgLight: "bg-sky-50 dark:bg-sky-950/30", icon: Users },
  { key: "contacted", label: "Contacted", color: "bg-violet-500", textColor: "text-violet-600", bgLight: "bg-violet-50 dark:bg-violet-950/30", icon: MessageSquare },
  { key: "qualified", label: "Qualified", color: "bg-amber-500", textColor: "text-amber-600", bgLight: "bg-amber-50 dark:bg-amber-950/30", icon: Target },
  { key: "negotiation", label: "Negotiation", color: "bg-orange-500", textColor: "text-orange-600", bgLight: "bg-orange-50 dark:bg-orange-950/30", icon: TrendingUp },
  { key: "converted", label: "Converted", color: "bg-emerald-500", textColor: "text-emerald-600", bgLight: "bg-emerald-50 dark:bg-emerald-950/30", icon: CheckCircle2 },
  { key: "lost", label: "Lost", color: "bg-red-500", textColor: "text-red-600", bgLight: "bg-red-50 dark:bg-red-950/30", icon: XCircle },
];

const AgentLeads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState(mockLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterSource, setFilterSource] = useState<string>("all");

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === "all" || lead.source === filterSource;
    return matchesSearch && matchesSource;
  });

  const getLeadsByStage = (stage: string) => filteredLeads.filter(l => l.stage === stage);

  const moveToNextStage = (leadId: string) => {
    const stageOrder = ["new", "contacted", "qualified", "negotiation", "converted"];
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const currentIndex = stageOrder.indexOf(lead.stage);
        if (currentIndex < stageOrder.length - 1) {
          return { ...lead, stage: stageOrder[currentIndex + 1] as Lead["stage"] };
        }
      }
      return lead;
    }));
  };

  const totalValue = leads.reduce((sum, lead) => sum + lead.amount, 0);
  const convertedValue = leads.filter(l => l.stage === "converted").reduce((sum, lead) => sum + lead.amount, 0);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Medium</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] px-1.5 py-0">Low</Badge>;
    }
  };

  return (
    <DashboardLayout role="agent">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Lead Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage your sales opportunities</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 shadow-sm">
                <Plus className="h-4 w-4" /> Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-lg">Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Full Name</Label>
                    <Input placeholder="Enter name" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Phone</Label>
                    <Input placeholder="+91 9876543210" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Email</Label>
                    <Input type="email" placeholder="email@example.com" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Source</Label>
                    <Select defaultValue="website">
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="walkin">Walk-in</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="campaign">Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Product</Label>
                    <Select defaultValue="personal">
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="home">Home Loan</SelectItem>
                        <SelectItem value="business">Business Loan</SelectItem>
                        <SelectItem value="car">Car Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Loan Amount</Label>
                    <Input type="number" placeholder="500000" className="h-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Notes</Label>
                  <Textarea placeholder="Additional notes..." className="min-h-[80px] resize-none" />
                </div>
                <Button className="w-full">Create Lead</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-sky-950/50 dark:to-sky-900/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Converted</p>
                  <p className="text-2xl font-bold text-foreground">{leads.filter(l => l.stage === "converted").length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/50 dark:to-violet-900/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Pipeline Value</p>
                  <p className="text-2xl font-bold text-foreground">₹{(totalValue / 100000).toFixed(0)}L</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold text-foreground">{((leads.filter(l => l.stage === "converted").length / leads.length) * 100).toFixed(0)}%</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-background"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-[140px] h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Walk-in">Walk-in</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="Campaign">Campaign</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pipeline Kanban View */}
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4 min-w-max">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon;
              const stageLeads = getLeadsByStage(stage.key);
              return (
                <motion.div 
                  key={stage.key} 
                  className="w-[280px] flex-shrink-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Stage Header */}
                  <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg ${stage.bgLight}`}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                      <span className={`font-semibold text-sm ${stage.textColor}`}>{stage.label}</span>
                    </div>
                    <Badge variant="secondary" className="h-5 px-2 text-xs font-medium bg-background/80">
                      {stageLeads.length}
                    </Badge>
                  </div>

                  {/* Lead Cards */}
                  <div className="space-y-3">
                    {stageLeads.map((lead, leadIndex) => (
                      <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: leadIndex * 0.03 }}
                      >
                        <Card className="group cursor-pointer border border-border/50 hover:border-border hover:shadow-md transition-all duration-200 bg-card">
                          <CardContent className="p-4">
                            {/* Lead Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} />
                                  <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                                    {lead.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-foreground truncate">{lead.name}</p>
                                  <p className="text-xs text-muted-foreground">{lead.source}</p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                                    <User className="h-4 w-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Phone className="h-4 w-4 mr-2" /> Call Lead
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" /> Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Calendar className="h-4 w-4 mr-2" /> Schedule Follow-up
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Product & Amount */}
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary border-0">
                                  {lead.product}
                                </Badge>
                                {getPriorityBadge(lead.priority)}
                              </div>
                              
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-foreground">₹{(lead.amount / 100000).toFixed(1)}L</span>
                              </div>

                              {lead.nextFollowUp && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md px-2 py-1.5">
                                  <Clock className="h-3 w-3" />
                                  <span>Follow-up: {new Date(lead.nextFollowUp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            {stage.key !== "converted" && stage.key !== "lost" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-4 h-8 text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveToNextStage(lead.id);
                                }}
                              >
                                Move Forward <ArrowRight className="h-3 w-3 ml-1.5" />
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                    {/* Empty State */}
                    {stageLeads.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-border/50 rounded-lg bg-muted/20">
                        <StageIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No leads</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Lead Detail Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">Lead Details</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedLead.name}`} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {selectedLead.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{selectedLead.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{selectedLead.product}</Badge>
                      {getPriorityBadge(selectedLead.priority)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-medium">{selectedLead.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium truncate">{selectedLead.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Loan Amount</p>
                    <p className="text-sm font-bold">₹{selectedLead.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Source</p>
                    <p className="text-sm font-medium">{selectedLead.source}</p>
                  </div>
                </div>

                {selectedLead.notes && (
                  <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</p>
                    <p className="text-sm">{selectedLead.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 gap-2">
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Button>
                  <Button size="sm" variant="secondary" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Convert
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AgentLeads;
