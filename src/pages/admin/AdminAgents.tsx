import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  UserCheck,
  Download,
  TrendingUp,
  Target,
  IndianRupee,
  Users,
  Phone,
  Mail
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  leadsAssigned: number;
  conversions: number;
  disbursedAmount: number;
  commission: number;
  target: number;
  achieved: number;
  joinedAt: string;
}

const mockAgents: Agent[] = [
  { id: 'AGT001', name: 'Rahul Sharma', email: 'rahul@loanagent.com', phone: '9876543210', status: 'active', leadsAssigned: 45, conversions: 12, disbursedAmount: 2500000, commission: 75000, target: 5000000, achieved: 2500000, joinedAt: '2023-06-15' },
  { id: 'AGT002', name: 'Neha Gupta', email: 'neha@loanagent.com', phone: '9876543211', status: 'active', leadsAssigned: 38, conversions: 15, disbursedAmount: 3200000, commission: 96000, target: 4000000, achieved: 3200000, joinedAt: '2023-08-20' },
  { id: 'AGT003', name: 'Vikram Mehta', email: 'vikram@loanagent.com', phone: '9876543212', status: 'active', leadsAssigned: 52, conversions: 8, disbursedAmount: 1800000, commission: 54000, target: 4500000, achieved: 1800000, joinedAt: '2023-04-10' },
  { id: 'AGT004', name: 'Anita Desai', email: 'anita@loanagent.com', phone: '9876543213', status: 'inactive', leadsAssigned: 20, conversions: 5, disbursedAmount: 800000, commission: 24000, target: 3000000, achieved: 800000, joinedAt: '2023-10-05' },
];

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { toast } = useToast();

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDisbursed = agents.reduce((sum, a) => sum + a.disbursedAmount, 0);
  const totalCommission = agents.reduce((sum, a) => sum + a.commission, 0);
  const totalConversions = agents.reduce((sum, a) => sum + a.conversions, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agents</h1>
            <p className="text-muted-foreground">Manage agents, targets, and commissions</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                  <p className="text-2xl font-bold">{agents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Conversions</p>
                  <p className="text-2xl font-bold">{totalConversions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <IndianRupee className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Disbursed</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalDisbursed)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/10">
                  <Target className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Commission</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalCommission)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Target Progress</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}`} />
                          <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {agent.email}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {agent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={agent.status === 'active' ? 'success' : 'secondary'}>
                        {agent.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{agent.leadsAssigned}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                        {agent.conversions}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex justify-between text-xs">
                          <span>{formatCurrency(agent.achieved)}</span>
                          <span className="text-muted-foreground">{Math.round((agent.achieved / agent.target) * 100)}%</span>
                        </div>
                        <Progress value={(agent.achieved / agent.target) * 100} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600">
                      {formatCurrency(agent.commission)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedAgent(agent)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Target className="mr-2 h-4 w-4" /> Set Target
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {agent.status === 'active' ? (
                              <><Ban className="mr-2 h-4 w-4" /> Deactivate</>
                            ) : (
                              <><UserCheck className="mr-2 h-4 w-4" /> Activate</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Agent Details Dialog */}
        <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agent Details</DialogTitle>
              <DialogDescription>Performance metrics and commission details</DialogDescription>
            </DialogHeader>
            {selectedAgent && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAgent.id}`} />
                    <AvatarFallback className="text-xl">{selectedAgent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedAgent.name}</h3>
                    <p className="text-muted-foreground">{selectedAgent.email}</p>
                    <StatusBadge status={selectedAgent.status === 'active' ? 'success' : 'secondary'} className="mt-2">
                      {selectedAgent.status}
                    </StatusBadge>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Leads Assigned</p>
                      <p className="text-2xl font-bold">{selectedAgent.leadsAssigned}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-2xl font-bold text-emerald-600">{selectedAgent.conversions}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">{Math.round((selectedAgent.conversions / selectedAgent.leadsAssigned) * 100)}%</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Target Progress</span>
                    <span className="font-medium">{formatCurrency(selectedAgent.achieved)} / {formatCurrency(selectedAgent.target)}</span>
                  </div>
                  <Progress value={(selectedAgent.achieved / selectedAgent.target) * 100} className="h-3" />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">View Leads</Button>
                  <Button variant="outline" className="flex-1">Commission History</Button>
                  <Button className="flex-1">Edit Agent</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
