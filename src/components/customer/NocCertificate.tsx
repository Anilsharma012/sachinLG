import { useState } from "react";
import { motion } from "framer-motion";
import { FileCheck, Download, Award, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface LoanForNoc {
  id: string;
  loanAccountNo: string;
  productName: string;
  disbursedAmount: number;
  closedDate?: Date;
  nocStatus: 'eligible' | 'processing' | 'ready' | 'not_eligible';
  nocRequestedAt?: Date;
  nocGeneratedAt?: Date;
}

// Mock data - loans eligible for NOC
const mockLoansForNoc: LoanForNoc[] = [
  {
    id: 'la1',
    loanAccountNo: 'LN2025100001',
    productName: 'Personal Loan',
    disbursedAmount: 487500,
    closedDate: new Date('2025-12-15'),
    nocStatus: 'ready',
    nocRequestedAt: new Date('2025-12-16'),
    nocGeneratedAt: new Date('2025-12-17'),
  },
  {
    id: 'la2',
    loanAccountNo: 'LN2024050002',
    productName: 'Home Loan',
    disbursedAmount: 2500000,
    closedDate: new Date('2025-11-30'),
    nocStatus: 'processing',
    nocRequestedAt: new Date('2025-12-01'),
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function NocCertificate() {
  const [loansForNoc, setLoansForNoc] = useState<LoanForNoc[]>(mockLoansForNoc);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleRequestNoc = (loanId: string) => {
    setLoansForNoc(prev => prev.map(loan => 
      loan.id === loanId 
        ? { ...loan, nocStatus: 'processing' as const, nocRequestedAt: new Date() }
        : loan
    ));
    toast({
      title: "NOC Requested",
      description: "Your NOC request has been submitted. It will be ready within 24-48 hours.",
    });
  };

  const handleDownloadNoc = async (loan: LoanForNoc) => {
    setDownloading(loan.id);
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock PDF download
    const nocContent = `
      NO OBJECTION CERTIFICATE
      
      Date: ${format(new Date(), 'dd MMM yyyy')}
      
      Loan Account No: ${loan.loanAccountNo}
      Product: ${loan.productName}
      Loan Amount: ${formatCurrency(loan.disbursedAmount)}
      Closed On: ${loan.closedDate ? format(loan.closedDate, 'dd MMM yyyy') : '-'}
      
      This is to certify that the above-mentioned loan has been fully repaid 
      and there are no outstanding dues against this account.
      
      We have no objection if the borrower obtains any loan from any other 
      financial institution.
      
      Authorized Signatory
      LoanAgent Financial Services
    `;
    
    const blob = new Blob([nocContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NOC_${loan.loanAccountNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloading(null);
    toast({
      title: "NOC Downloaded",
      description: "Your No Objection Certificate has been downloaded successfully.",
    });
  };

  const getStatusConfig = (status: LoanForNoc['nocStatus']) => {
    switch (status) {
      case 'ready':
        return {
          label: 'Ready for Download',
          icon: CheckCircle,
          variant: 'default' as const,
          className: 'bg-emerald-500 text-white',
        };
      case 'processing':
        return {
          label: 'Processing',
          icon: Clock,
          variant: 'secondary' as const,
          className: 'bg-amber-500 text-white',
        };
      case 'eligible':
        return {
          label: 'Eligible for NOC',
          icon: FileCheck,
          variant: 'outline' as const,
          className: '',
        };
      default:
        return {
          label: 'Not Eligible',
          icon: AlertCircle,
          variant: 'destructive' as const,
          className: '',
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center">
            <Award className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <CardTitle>No Objection Certificate (NOC)</CardTitle>
            <CardDescription>Download NOC for your closed loans</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loansForNoc.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No closed loans available for NOC</p>
          </div>
        ) : (
          loansForNoc.map((loan) => {
            const statusConfig = getStatusConfig(loan.nocStatus);
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{loan.loanAccountNo}</p>
                      <Badge className={statusConfig.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{loan.productName}</p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Loan Amount:</span>{" "}
                      <span className="font-medium">{formatCurrency(loan.disbursedAmount)}</span>
                    </p>
                    {loan.closedDate && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Closed On:</span>{" "}
                        <span className="font-medium">{format(loan.closedDate, 'dd MMM yyyy')}</span>
                      </p>
                    )}
                    {loan.nocGeneratedAt && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">NOC Generated:</span>{" "}
                        <span className="font-medium">{format(loan.nocGeneratedAt, 'dd MMM yyyy')}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {loan.nocStatus === 'eligible' && (
                      <Button onClick={() => handleRequestNoc(loan.id)} className="gradient-accent">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Request NOC
                      </Button>
                    )}
                    {loan.nocStatus === 'processing' && (
                      <Button disabled variant="secondary">
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </Button>
                    )}
                    {loan.nocStatus === 'ready' && (
                      <Button 
                        onClick={() => handleDownloadNoc(loan)} 
                        className="gradient-primary"
                        disabled={downloading === loan.id}
                      >
                        {downloading === loan.id ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download NOC
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
