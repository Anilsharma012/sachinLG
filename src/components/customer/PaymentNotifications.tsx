import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Download, Receipt, CheckCircle, Clock, IndianRupee, FileText, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PaymentNotification {
  id: string;
  type: 'payment_success' | 'payment_reminder' | 'emi_due' | 'late_fee' | 'noc_ready';
  title: string;
  message: string;
  amount?: number;
  loanAccountNo?: string;
  emiNo?: number;
  receiptNo?: string;
  timestamp: Date;
  isRead: boolean;
  invoiceAvailable?: boolean;
}

// Mock payment notifications
const mockNotifications: PaymentNotification[] = [
  {
    id: 'n1',
    type: 'payment_success',
    title: 'EMI Payment Successful',
    message: 'Your EMI payment of ₹16,736 for loan LN2025100001 has been received successfully.',
    amount: 16736,
    loanAccountNo: 'LN2025100001',
    emiNo: 2,
    receiptNo: 'REC2025120001',
    timestamp: new Date('2025-12-05T10:30:00'),
    isRead: false,
    invoiceAvailable: true,
  },
  {
    id: 'n2',
    type: 'emi_due',
    title: 'EMI Due Reminder',
    message: 'Your EMI of ₹16,736 for loan LN2025100001 is due on 05 Jan 2026.',
    amount: 16736,
    loanAccountNo: 'LN2025100001',
    emiNo: 3,
    timestamp: new Date('2025-12-30T09:00:00'),
    isRead: false,
    invoiceAvailable: false,
  },
  {
    id: 'n3',
    type: 'payment_success',
    title: 'EMI Payment Successful',
    message: 'Your EMI payment of ₹16,736 for loan LN2025100001 has been received successfully.',
    amount: 16736,
    loanAccountNo: 'LN2025100001',
    emiNo: 1,
    receiptNo: 'REC2025110001',
    timestamp: new Date('2025-11-04T14:22:00'),
    isRead: true,
    invoiceAvailable: true,
  },
  {
    id: 'n4',
    type: 'noc_ready',
    title: 'NOC Certificate Ready',
    message: 'Your NOC for loan LN2024050002 is ready for download.',
    loanAccountNo: 'LN2024050002',
    timestamp: new Date('2025-12-17T11:00:00'),
    isRead: true,
    invoiceAvailable: false,
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PaymentNotifications() {
  const [notifications, setNotifications] = useState<PaymentNotification[]>(mockNotifications);
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentNotification | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast({
      title: "All notifications marked as read",
    });
  };

  const handleDownloadInvoice = (notification: PaymentNotification) => {
    const invoiceContent = `
===============================================
                PAYMENT RECEIPT
===============================================

Receipt No: ${notification.receiptNo}
Date: ${format(notification.timestamp, 'dd MMM yyyy, hh:mm a')}

-----------------------------------------------
LOAN DETAILS
-----------------------------------------------
Loan Account No: ${notification.loanAccountNo}
EMI Number: ${notification.emiNo}
Amount Paid: ${notification.amount ? formatCurrency(notification.amount) : '-'}

-----------------------------------------------
PAYMENT BREAKDOWN
-----------------------------------------------
Principal: ${notification.amount ? formatCurrency(Math.round(notification.amount * 0.69)) : '-'}
Interest: ${notification.amount ? formatCurrency(Math.round(notification.amount * 0.31)) : '-'}
Late Fee: ₹0
-----------------------------------------------
Total: ${notification.amount ? formatCurrency(notification.amount) : '-'}

Payment Status: SUCCESS ✓

-----------------------------------------------
Thank you for your payment!
LoanAgent Financial Services

This is a computer-generated receipt and does not 
require a signature.
===============================================
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${notification.receiptNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Invoice Downloaded",
      description: `Receipt ${notification.receiptNo} has been downloaded.`,
    });
  };

  const getNotificationIcon = (type: PaymentNotification['type']) => {
    switch (type) {
      case 'payment_success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'emi_due':
      case 'payment_reminder':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'late_fee':
        return <IndianRupee className="h-5 w-5 text-red-500" />;
      case 'noc_ready':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center relative">
                <Bell className="h-6 w-6 text-primary-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <CardTitle>Payment Notifications</CardTitle>
                <CardDescription>Your EMI payments and invoices</CardDescription>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    notification.isRead 
                      ? 'bg-card hover:bg-muted/50' 
                      : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-muted-foreground">
                          {format(notification.timestamp, 'dd MMM yyyy, hh:mm a')}
                        </p>
                        
                        {notification.invoiceAvailable && notification.type === 'payment_success' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvoice(notification);
                              }}
                            >
                              <Receipt className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default"
                              className="gradient-accent text-accent-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadInvoice(notification);
                              }}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment Receipt
            </DialogTitle>
            <DialogDescription>
              Receipt No: {selectedInvoice?.receiptNo}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Account</span>
                  <span className="font-medium">{selectedInvoice.loanAccountNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EMI Number</span>
                  <span className="font-medium">#{selectedInvoice.emiNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{format(selectedInvoice.timestamp, 'dd MMM yyyy')}</span>
                </div>
              </div>

              <div className="p-4 rounded-lg border space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Principal</span>
                  <span>{selectedInvoice.amount ? formatCurrency(Math.round(selectedInvoice.amount * 0.69)) : '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interest</span>
                  <span>{selectedInvoice.amount ? formatCurrency(Math.round(selectedInvoice.amount * 0.31)) : '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Late Fee</span>
                  <span>₹0</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span className="text-emerald-600">{selectedInvoice.amount ? formatCurrency(selectedInvoice.amount) : '-'}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Payment Successful</span>
              </div>

              <Button 
                className="w-full gradient-accent"
                onClick={() => {
                  handleDownloadInvoice(selectedInvoice);
                  setSelectedInvoice(null);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
