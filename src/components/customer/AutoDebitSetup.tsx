import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CreditCard, CheckCircle, Shield, AlertCircle, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  isDefault: boolean;
  mandateStatus: 'pending' | 'active' | 'expired' | 'cancelled';
  mandateLimit: number;
  registeredDate: Date;
}

const mockBankAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "HDFC Bank",
    accountNumber: "XXXX XXXX 4521",
    ifscCode: "HDFC0001234",
    accountHolderName: "Amit Kumar",
    isDefault: true,
    mandateStatus: 'active',
    mandateLimit: 50000,
    registeredDate: new Date('2024-01-15')
  }
];

const banks = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", 
  "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda", "Yes Bank"
];

export function AutoDebitSetup() {
  const [accounts, setAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [autoDebitEnabled, setAutoDebitEnabled] = useState(true);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    mandateLimit: '50000'
  });

  const handleSubmit = () => {
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      toast({
        title: "Account numbers don't match",
        description: "Please ensure both account numbers are identical.",
        variant: "destructive"
      });
      return;
    }

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: formData.bankName,
      accountNumber: `XXXX XXXX ${formData.accountNumber.slice(-4)}`,
      ifscCode: formData.ifscCode,
      accountHolderName: formData.accountHolderName,
      isDefault: accounts.length === 0,
      mandateStatus: 'pending',
      mandateLimit: parseInt(formData.mandateLimit),
      registeredDate: new Date()
    };

    setAccounts([...accounts, newAccount]);
    setIsDialogOpen(false);
    setFormData({
      bankName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      mandateLimit: '50000'
    });

    toast({
      title: "Bank Account Added",
      description: "eNACH mandate registration initiated. You'll receive an OTP for verification."
    });
  };

  const setDefaultAccount = (id: string) => {
    setAccounts(accounts.map(acc => ({
      ...acc,
      isDefault: acc.id === id
    })));
    toast({ title: "Default account updated" });
  };

  const removeAccount = (id: string) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
    toast({ title: "Bank account removed" });
  };

  const getMandateStatusBadge = (status: BankAccount['mandateStatus']) => {
    const styles = {
      active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      expired: 'bg-red-500/10 text-red-500 border-red-500/20',
      cancelled: 'bg-muted text-muted-foreground border-border'
    };
    return <Badge variant="outline" className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Auto-Debit Setup</CardTitle>
              <CardDescription>Register bank account for automatic EMI deduction</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={autoDebitEnabled} onCheckedChange={setAutoDebitEnabled} />
              <span className="text-sm">{autoDebitEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Bank Account</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Register Bank Account for Auto-Debit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Select value={formData.bankName} onValueChange={(v) => setFormData({...formData, bankName: v})}>
                      <SelectTrigger><SelectValue placeholder="Select your bank" /></SelectTrigger>
                      <SelectContent>
                        {banks.map(bank => (
                          <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Holder Name</Label>
                    <Input 
                      placeholder="Name as per bank records"
                      value={formData.accountHolderName}
                      onChange={(e) => setFormData({...formData, accountHolderName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input 
                      placeholder="Enter account number"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Account Number</Label>
                    <Input 
                      placeholder="Re-enter account number"
                      value={formData.confirmAccountNumber}
                      onChange={(e) => setFormData({...formData, confirmAccountNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IFSC Code</Label>
                    <Input 
                      placeholder="e.g., HDFC0001234"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mandate Limit (₹)</Label>
                    <Select value={formData.mandateLimit} onValueChange={(v) => setFormData({...formData, mandateLimit: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25000">₹25,000</SelectItem>
                        <SelectItem value="50000">₹50,000</SelectItem>
                        <SelectItem value="100000">₹1,00,000</SelectItem>
                        <SelectItem value="200000">₹2,00,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Your bank details are encrypted and secured. eNACH mandate will be registered with NPCI for automatic EMI deduction.
                    </p>
                  </div>
                  <Button onClick={handleSubmit} className="w-full" disabled={!formData.bankName || !formData.accountNumber || !formData.ifscCode}>
                    Register & Verify via OTP
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No bank accounts registered for auto-debit</p>
            <p className="text-sm">Add a bank account to enable automatic EMI payments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{account.bankName}</p>
                        {account.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                      <p className="text-xs text-muted-foreground">IFSC: {account.ifscCode}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2 justify-end">
                      {getMandateStatusBadge(account.mandateStatus)}
                    </div>
                    <p className="text-xs text-muted-foreground">Limit: ₹{account.mandateLimit.toLocaleString()}</p>
                    <div className="flex items-center gap-2 justify-end">
                      {!account.isDefault && (
                        <Button variant="ghost" size="sm" onClick={() => setDefaultAccount(account.id)}>
                          Set Default
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeAccount(account.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {autoDebitEnabled && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <p className="text-sm text-emerald-600">Auto-debit is active. Your EMI will be automatically deducted 1 day before due date.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
