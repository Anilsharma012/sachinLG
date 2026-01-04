import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  MoreHorizontal,
  Eye,
  Download,
  IndianRupee,
  Calendar,
  CreditCard,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';

interface LoanAccount {
  id: string;
  customerId: string;
  customerName: string;
  loanType: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  nextEmiDate: string;
  paidEmis: number;
  totalEmis: number;
  status: 'active' | 'closed' | 'overdue' | 'npa';
  disbursedAt: string;
}

const mockLoanAccounts: LoanAccount[] = [
  { id: 'LA001', customerId: 'CUST001', customerName: 'Amit Patel', loanType: 'Personal Loan', sanctionedAmount: 500000, disbursedAmount: 485000, outstandingAmount: 320000, interestRate: 12.5, tenure: 36, emiAmount: 16720, nextEmiDate: '2024-02-05', paidEmis: 12, totalEmis: 36, status: 'active', disbursedAt: '2023-02-01' },
  { id: 'LA002', customerId: 'CUST003', customerName: 'Rahul Kumar', loanType: 'Business Loan', sanctionedAmount: 1000000, disbursedAmount: 970000, outstandingAmount: 850000, interestRate: 14, tenure: 48, emiAmount: 27650, nextEmiDate: '2024-01-20', paidEmis: 6, totalEmis: 48, status: 'overdue', disbursedAt: '2023-07-15' },
  { id: 'LA003', customerId: 'CUST005', customerName: 'Vikash Jain', loanType: 'Home Loan', sanctionedAmount: 3500000, disbursedAmount: 3400000, outstandingAmount: 0, interestRate: 8.5, tenure: 240, emiAmount: 29850, nextEmiDate: '-', paidEmis: 240, totalEmis: 240, status: 'closed', disbursedAt: '2004-03-10' },
  { id: 'LA004', customerId: 'CUST002', customerName: 'Priya Singh', loanType: 'Personal Loan', sanctionedAmount: 200000, disbursedAmount: 194000, outstandingAmount: 178000, interestRate: 13, tenure: 24, emiAmount: 9520, nextEmiDate: '2024-02-10', paidEmis: 2, totalEmis: 24, status: 'active', disbursedAt: '2023-12-01' },
];

export default function AdminLoanAccounts() {
  const [accounts, setAccounts] = useState<LoanAccount[]>(mockLoanAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<LoanAccount | null>(null);
  const { toast } = useToast();

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusConfig = (status: LoanAccount['status']) => {
    const config = {
      active: { variant: 'success' as const, icon: CheckCircle2, label: 'Active' },
      closed: { variant: 'secondary' as const, icon: CheckCircle2, label: 'Closed' },
      overdue: { variant: 'warning' as const, icon: Clock, label: 'Overdue' },
      npa: { variant: 'destructive' as const, icon: AlertTriangle, label: 'NPA' },
    };
    return config[status];
  };

  const totalDisbursed = accounts.reduce((sum, a) => sum + a.disbursedAmount, 0);
  const totalOutstanding = accounts.reduce((sum, a) => sum + a.outstandingAmount, 0);
  const activeLoans = accounts.filter(a => a.status === 'active').length;
  const overdueLoans = accounts.filter(a => a.status === 'overdue' || a.status === 'npa').length;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Loan Accounts</h1>
            <p className="text-muted-foreground">Manage disbursed loans and EMI collections</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Banknote className="h-6 w-6 text-primary" />
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
                  <IndianRupee className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <p className="text-2xl font-bold">{activeLoans}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">{overdueLoans}</p>
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
                  placeholder="Search by customer name or loan ID..."
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
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="npa">NPA</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Disbursed</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>EMI Progress</TableHead>
                  <TableHead>Next EMI</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => {
                  const statusConfig = getStatusConfig(account.status);
                  return (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.id}</TableCell>
                      <TableCell>{account.customerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{account.loanType}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(account.disbursedAmount)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(account.outstandingAmount)}</TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[100px]">
                          <div className="flex justify-between text-xs">
                            <span>{account.paidEmis}/{account.totalEmis}</span>
                            <span className="text-muted-foreground">{Math.round((account.paidEmis / account.totalEmis) * 100)}%</span>
                          </div>
                          <Progress value={(account.paidEmis / account.totalEmis) * 100} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {account.status !== 'closed' ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(account.nextEmiDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={statusConfig.variant}>
                          {statusConfig.label}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedAccount(account)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" /> View EMIs
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Statement
                            </DropdownMenuItem>
                            {account.status === 'closed' && (
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Download NOC
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Loan Details Dialog */}
        <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Loan Account Details</DialogTitle>
              <DialogDescription>{selectedAccount?.id}</DialogDescription>
            </DialogHeader>
            {selectedAccount && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Customer</Label>
                    <p className="font-medium">{selectedAccount.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Loan Type</Label>
                    <p className="font-medium">{selectedAccount.loanType}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Sanctioned Amount</Label>
                    <p className="font-medium">{formatCurrency(selectedAccount.sanctionedAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Disbursed Amount</Label>
                    <p className="font-medium">{formatCurrency(selectedAccount.disbursedAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Outstanding</Label>
                    <p className="font-medium text-amber-600">{formatCurrency(selectedAccount.outstandingAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Interest Rate</Label>
                    <p className="font-medium">{selectedAccount.interestRate}% p.a.</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Tenure</Label>
                    <p className="font-medium">{selectedAccount.tenure} months</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">EMI Amount</Label>
                    <p className="font-medium">{formatCurrency(selectedAccount.emiAmount)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Repayment Progress</span>
                    <span className="font-medium">{selectedAccount.paidEmis} of {selectedAccount.totalEmis} EMIs paid</span>
                  </div>
                  <Progress value={(selectedAccount.paidEmis / selectedAccount.totalEmis) * 100} className="h-3" />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">View EMI Schedule</Button>
                  <Button variant="outline" className="flex-1">Payment History</Button>
                  <Button className="flex-1">Record Payment</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
