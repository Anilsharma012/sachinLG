import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockLeads } from "@/data/mockData";
import type { Lead, LeadStage } from "@/types";
import { format } from "date-fns";

const stages: { key: LeadStage; label: string; color: string }[] = [
  { key: "new", label: "New", color: "bg-info/10 border-info/20" },
  { key: "contacted", label: "Contacted", color: "bg-warning/10 border-warning/20" },
  { key: "qualified", label: "Qualified", color: "bg-success/10 border-success/20" },
  { key: "converted", label: "Converted", color: "bg-accent/10 border-accent/20" },
  { key: "lost", label: "Lost", color: "bg-muted" },
];

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} />
            <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{lead.name}</p>
            <p className="text-xs text-muted-foreground">{lead.source}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-success">
              <UserPlus className="h-4 w-4 mr-2" />
              Convert to Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          <span>{lead.mobile}</span>
        </div>
        {lead.email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div>

      {lead.interestedProduct && (
        <div className="mt-3">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium">
            {lead.interestedProduct}
          </span>
        </div>
      )}

      {lead.nextFollowUp && (
        <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs">
          <Calendar className="h-3.5 w-3.5 text-warning" />
          <span className="text-muted-foreground">Follow-up:</span>
          <span className="font-medium">{format(lead.nextFollowUp, "dd MMM, hh:mm a")}</span>
        </div>
      )}

      {lead.notes.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground line-clamp-1">
            Note: {lead.notes[lead.notes.length - 1]}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function AdminLeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const filteredLeads = mockLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobile.includes(searchQuery)
  );

  const getLeadsByStage = (stage: LeadStage) =>
    filteredLeads.filter((lead) => lead.stage === stage);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lead Management</h1>
            <p className="text-muted-foreground">Track and manage your sales pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === "kanban" ? "list" : "kanban")}>
              {viewMode === "kanban" ? "List View" : "Kanban View"}
            </Button>
            <Button className="gradient-accent text-accent-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="walkin">Walk-in</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="u2">Priya Sharma</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stages.map((stage) => {
              const stageLeads = getLeadsByStage(stage.key);
              return (
                <div key={stage.key} className="space-y-3">
                  <div
                    className={`rounded-lg border p-3 ${stage.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{stage.label}</h3>
                      <span className="text-sm text-muted-foreground">
                        {stageLeads.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 min-h-[200px]">
                    {stageLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
                        No leads
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Lead</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-left p-4 font-medium">Source</th>
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Stage</th>
                    <th className="text-left p-4 font-medium">Next Follow-up</th>
                    <th className="text-left p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.name}`} />
                            <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{lead.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{lead.mobile}</p>
                          {lead.email && <p className="text-muted-foreground">{lead.email}</p>}
                        </div>
                      </td>
                      <td className="p-4 text-sm">{lead.source}</td>
                      <td className="p-4">
                        {lead.interestedProduct && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium">
                            {lead.interestedProduct}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={lead.stage} />
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {lead.nextFollowUp ? format(lead.nextFollowUp, "dd MMM, hh:mm a") : "-"}
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stages.map((stage) => (
            <Card key={stage.key} className={stage.color}>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{getLeadsByStage(stage.key).length}</p>
                <p className="text-sm text-muted-foreground">{stage.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
