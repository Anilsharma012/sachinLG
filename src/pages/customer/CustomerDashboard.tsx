import { motion } from "framer-motion";
import { IndianRupee, Calendar, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockLoanAccounts, mockEmiSchedule } from "@/data/mockData";
import { NocCertificate } from "@/components/customer/NocCertificate";
import { PaymentNotifications } from "@/components/customer/PaymentNotifications";
import { EmailNotificationCenter } from "@/components/customer/EmailNotificationCenter";
import { LoanForeclosure } from "@/components/customer/LoanForeclosure";
import { EmiReminderSettings } from "@/components/customer/EmiReminderSettings";
import { PaymentStatementExport } from "@/components/customer/PaymentStatementExport";
import { LoanRestructuring } from "@/components/customer/LoanRestructuring";
import { AutoDebitSetup } from "@/components/customer/AutoDebitSetup";
import { LoanRefinanceComparison } from "@/components/customer/LoanRefinanceComparison";
import { format } from "date-fns";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function CustomerDashboard() {
  const loanAccount = mockLoanAccounts[0];
  const paidEmis = mockEmiSchedule.filter(e => e.status === 'paid').length;
  const progress = (paidEmis / mockEmiSchedule.length) * 100;
  const nextEmi = mockEmiSchedule.find(e => e.status === 'due' || e.status === 'upcoming');

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Amit!</h1>
          <p className="text-muted-foreground">Here's your loan summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard title="Outstanding Balance" value={formatCurrency(loanAccount.outstandingTotal)} subtitle="Total payable" icon={IndianRupee} variant="primary" />
          <KpiCard title="Next EMI Due" value={formatCurrency(loanAccount.emiAmount)} subtitle={nextEmi ? format(nextEmi.dueDate, "dd MMM yyyy") : "-"} icon={Calendar} variant="warning" />
          <KpiCard title="EMIs Paid" value={`${paidEmis}/${mockEmiSchedule.length}`} subtitle={`${progress.toFixed(0)}% complete`} icon={CheckCircle} variant="success" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Progress</CardTitle>
            <CardDescription>Account: {loanAccount.loanAccountNo}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground">Loan Amount</p><p className="font-bold">{formatCurrency(loanAccount.sanctionedAmount)}</p></div>
              <div><p className="text-muted-foreground">Interest Rate</p><p className="font-bold">{loanAccount.interestRate}% p.a.</p></div>
              <div><p className="text-muted-foreground">Tenure</p><p className="font-bold">{loanAccount.tenureMonths} months</p></div>
              <div><p className="text-muted-foreground">EMI Amount</p><p className="font-bold">{formatCurrency(loanAccount.emiAmount)}</p></div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-Debit Setup */}
        <AutoDebitSetup />

        {/* Email Notifications */}
        <EmailNotificationCenter />

        {/* EMI Reminder Settings */}
        <EmiReminderSettings />

        {/* Loan Foreclosure / Early Closure */}
        <LoanForeclosure />

        {/* Loan Restructuring */}
        <LoanRestructuring />

        {/* Loan Refinance Comparison */}
        <LoanRefinanceComparison />

        {/* Payment Statement Export */}
        <PaymentStatementExport />

        {/* Payment Notifications with Invoices */}
        <PaymentNotifications />

        {/* NOC Certificate Section */}
        <NocCertificate />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>EMI Schedule</CardTitle><CardDescription>Your payment schedule</CardDescription></div>
            <Button className="gradient-accent text-accent-foreground">Pay Now</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEmiSchedule.map((emi) => (
                <div key={emi.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold">{emi.installmentNo}</div>
                    <div>
                      <p className="font-medium">EMI #{emi.installmentNo}</p>
                      <p className="text-sm text-muted-foreground">{format(emi.dueDate, "dd MMM yyyy")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(emi.total)}</p>
                    <StatusBadge status={emi.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}