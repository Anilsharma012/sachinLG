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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  UserCheck,
  Download,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
  status: 'active' | 'blocked';
  assignedAgent: string;
  loans: number;
  createdAt: string;
}

const mockCustomers: Customer[] = [
  { id: 'CUST001', name: 'Amit Patel', email: 'amit@email.com', phone: '9876543210', city: 'Mumbai', kycStatus: 'verified', status: 'active', assignedAgent: 'Rahul Sharma', loans: 2, createdAt: '2024-01-15' },
  { id: 'CUST002', name: 'Priya Singh', email: 'priya@email.com', phone: '9876543211', city: 'Delhi', kycStatus: 'pending', status: 'active', assignedAgent: 'Neha Gupta', loans: 0, createdAt: '2024-02-20' },
  { id: 'CUST003', name: 'Rahul Kumar', email: 'rahul.k@email.com', phone: '9876543212', city: 'Bangalore', kycStatus: 'submitted', status: 'active', assignedAgent: 'Rahul Sharma', loans: 1, createdAt: '2024-03-10' },
  { id: 'CUST004', name: 'Sneha Reddy', email: 'sneha@email.com', phone: '9876543213', city: 'Hyderabad', kycStatus: 'rejected', status: 'active', assignedAgent: 'Vikram Mehta', loans: 0, createdAt: '2024-03-15' },
  { id: 'CUST005', name: 'Vikash Jain', email: 'vikash@email.com', phone: '9876543214', city: 'Chennai', kycStatus: 'verified', status: 'blocked', assignedAgent: 'Neha Gupta', loans: 3, createdAt: '2024-01-05' },
];

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kycFilter, setKycFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesKyc = kycFilter === 'all' || customer.kycStatus === kycFilter;
    return matchesSearch && matchesStatus && matchesKyc;
  });

  const handleToggleStatus = (customerId: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c
    ));
    toast({
      title: 'Status Updated',
      description: 'Customer status has been updated successfully.',
    });
  };

  const getKycBadge = (status: Customer['kycStatus']) => {
    const config = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      submitted: { variant: 'warning' as const, label: 'Submitted' },
      verified: { variant: 'success' as const, label: 'Verified' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
    };
    return <StatusBadge status={config[status].variant}>{config[status].label}</StatusBadge>;
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">Manage customer accounts and KYC verification</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or ID..."
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
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={kycFilter} onValueChange={setKycFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="KYC Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All KYC</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Loans</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.id}`} />
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getKycBadge(customer.kycStatus)}</TableCell>
                    <TableCell>
                      <StatusBadge status={customer.status === 'active' ? 'success' : 'destructive'}>
                        {customer.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{customer.assignedAgent}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{customer.loans}</Badge>
                    </TableCell>
                    <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" /> Review KYC
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(customer.id)}>
                            {customer.status === 'active' ? (
                              <><Ban className="mr-2 h-4 w-4" /> Block</>
                            ) : (
                              <><UserCheck className="mr-2 h-4 w-4" /> Unblock</>
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

        {/* Customer Details Dialog */}
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>View and manage customer information</DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.id}`} />
                    <AvatarFallback className="text-xl">{selectedCustomer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                    <p className="text-muted-foreground">{selectedCustomer.id}</p>
                    <div className="flex gap-2 mt-2">
                      {getKycBadge(selectedCustomer.kycStatus)}
                      <StatusBadge status={selectedCustomer.status === 'active' ? 'success' : 'destructive'}>
                        {selectedCustomer.status}
                      </StatusBadge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">+91 {selectedCustomer.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">City</Label>
                    <p className="font-medium">{selectedCustomer.city}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Assigned Agent</Label>
                    <p className="font-medium">{selectedCustomer.assignedAgent}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Total Loans</Label>
                    <p className="font-medium">{selectedCustomer.loans}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Registered On</Label>
                    <p className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">View Loans</Button>
                  <Button variant="outline" className="flex-1">View Documents</Button>
                  <Button className="flex-1">Edit Profile</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
