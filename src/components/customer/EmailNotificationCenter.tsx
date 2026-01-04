import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, FileCheck, Bell, X, Eye, Download, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { toast } from "sonner";

interface EmailNotification {
  id: string;
  type: 'emi_success' | 'noc_ready' | 'emi_reminder' | 'foreclosure';
  subject: string;
  preview: string;
  fullContent: string;
  sentAt: Date;
  read: boolean;
  emailTo: string;
}

const mockEmails: EmailNotification[] = [
  {
    id: '1',
    type: 'emi_success',
    subject: 'EMI Payment Successful - ₹15,500',
    preview: 'Your EMI payment for loan account LA-2024-001 has been processed successfully.',
    fullContent: `Dear Amit Kumar,

Your EMI payment has been successfully processed. Here are the details:

**Payment Details:**
- Amount: ₹15,500
- Loan Account: LA-2024-001
- EMI Number: 8 of 36
- Payment Date: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}
- Transaction ID: TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}

**Loan Summary:**
- Outstanding Principal: ₹4,25,000
- Next EMI Due: ${format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}

Thank you for your timely payment. Your loan account is in good standing.

Best regards,
LoanAgent Finance Team`,
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    emailTo: 'amit.kumar@email.com'
  },
  {
    id: '2',
    type: 'noc_ready',
    subject: 'NOC Certificate Ready for Download',
    preview: 'Congratulations! Your No Objection Certificate is ready for download.',
    fullContent: `Dear Amit Kumar,

Congratulations on successfully closing your loan!

We are pleased to inform you that your No Objection Certificate (NOC) is now ready for download.

**Loan Closure Details:**
- Loan Account: LA-2024-002
- Original Loan Amount: ₹3,00,000
- Closure Date: ${format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'dd MMM yyyy')}
- Closure Type: Regular Closure

**Important Information:**
- The NOC confirms that you have no outstanding dues with us.
- Please download and keep this document for your records.
- This certificate is required for any future financial transactions.

You can download your NOC from your dashboard or click the button below.

Thank you for choosing LoanAgent Finance. We look forward to serving you again.

Best regards,
LoanAgent Finance Team`,
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    emailTo: 'amit.kumar@email.com'
  },
  {
    id: '3',
    type: 'emi_reminder',
    subject: 'EMI Due Reminder - 3 Days Left',
    preview: 'Your EMI of ₹15,500 is due in 3 days. Please ensure sufficient balance.',
    fullContent: `Dear Amit Kumar,

This is a friendly reminder that your EMI payment is due in 3 days.

**Payment Details:**
- Amount Due: ₹15,500
- Due Date: ${format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}
- Loan Account: LA-2024-001
- EMI Number: 9 of 36

**Payment Options:**
- Auto-debit from registered bank account
- UPI/Net Banking via our portal
- Pay at any of our branch offices

Please ensure sufficient balance in your registered bank account to avoid any late payment charges.

Late Payment Charges: 2% per month on overdue amount

Best regards,
LoanAgent Finance Team`,
    sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    emailTo: 'amit.kumar@email.com'
  }
];

export function EmailNotificationCenter() {
  const [emails, setEmails] = useState<EmailNotification[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [emailPreferences, setEmailPreferences] = useState({
    emiSuccess: true,
    nocReady: true,
    emiReminder: true,
    foreclosure: true
  });

  const unreadCount = emails.filter(e => !e.read).length;

  const getTypeIcon = (type: EmailNotification['type']) => {
    switch (type) {
      case 'emi_success': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'noc_ready': return <FileCheck className="h-5 w-5 text-blue-500" />;
      case 'emi_reminder': return <Bell className="h-5 w-5 text-amber-500" />;
      case 'foreclosure': return <Clock className="h-5 w-5 text-purple-500" />;
    }
  };

  const getTypeBadge = (type: EmailNotification['type']) => {
    switch (type) {
      case 'emi_success': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Payment</Badge>;
      case 'noc_ready': return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">NOC</Badge>;
      case 'emi_reminder': return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">Reminder</Badge>;
      case 'foreclosure': return <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Foreclosure</Badge>;
    }
  };

  const openEmail = (email: EmailNotification) => {
    setSelectedEmail(email);
    if (!email.read) {
      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
    }
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return format(date, 'dd MMM');
  };

  const resendEmail = () => {
    toast.success("Email resent successfully!", {
      description: "A copy has been sent to your registered email."
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Email Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">{unreadCount}</Badge>
                  )}
                </CardTitle>
                <CardDescription>Payment confirmations and important updates</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email Preferences */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <p className="text-sm font-medium">Email Preferences</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">EMI Success</span>
                <Switch 
                  checked={emailPreferences.emiSuccess} 
                  onCheckedChange={(checked) => setEmailPreferences(prev => ({ ...prev, emiSuccess: checked }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">NOC Ready</span>
                <Switch 
                  checked={emailPreferences.nocReady} 
                  onCheckedChange={(checked) => setEmailPreferences(prev => ({ ...prev, nocReady: checked }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">EMI Reminders</span>
                <Switch 
                  checked={emailPreferences.emiReminder} 
                  onCheckedChange={(checked) => setEmailPreferences(prev => ({ ...prev, emiReminder: checked }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Foreclosure</span>
                <Switch 
                  checked={emailPreferences.foreclosure} 
                  onCheckedChange={(checked) => setEmailPreferences(prev => ({ ...prev, foreclosure: checked }))} 
                />
              </div>
            </div>
          </div>

          {/* Email List */}
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              <AnimatePresence>
                {emails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => openEmail(email)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      email.read ? 'bg-card' : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getTypeIcon(email.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-medium truncate ${email.read ? '' : 'text-primary'}`}>
                            {email.subject}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimeAgo(email.sentAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">{email.preview}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getTypeBadge(email.type)}
                          {!email.read && <Badge variant="secondary" className="text-xs">New</Badge>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Email Detail Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {selectedEmail && getTypeIcon(selectedEmail.type)}
              <div>
                <DialogTitle>{selectedEmail?.subject}</DialogTitle>
                <DialogDescription>
                  Sent to {selectedEmail?.emailTo} • {selectedEmail && format(selectedEmail.sentAt, 'dd MMM yyyy, hh:mm a')}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <Separator />
          <ScrollArea className="max-h-[50vh]">
            <div className="prose prose-sm dark:prose-invert max-w-none p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-transparent p-0">
                {selectedEmail?.fullContent}
              </pre>
            </div>
          </ScrollArea>
          <Separator />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={resendEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Resend Email
            </Button>
            {selectedEmail?.type === 'noc_ready' && (
              <Button className="gradient-primary text-primary-foreground">
                <Download className="h-4 w-4 mr-2" />
                Download NOC
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
