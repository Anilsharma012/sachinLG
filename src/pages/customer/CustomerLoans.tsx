import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, FileText, Download, Clock, CheckCircle, AlertCircle, Briefcase, IndianRupee, Calendar, ArrowRight, XCircle } from "lucide-react";

interface LoanApplication {
  id: string;
  product: string;
  amount: number;
  tenure: number;
  status: string;
  appliedAt: string;
  emi?: number;
  timeline: { stage: string; date: string; status: "completed" | "current" | "pending"; remarks?: string }[];
}

interface LoanAccount {
  id: string;
  product: string;
  sanctionedAmount: number;
  disbursedAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  startDate: string;
  endDate: string;
  status: "active" | "closed" | "overdue";
  paidEmis: number;
  totalEmis: number;
  nextEmiDate: string;
  nextEmiAmount: number;
}

const mockApplications: LoanApplication[] = [
  {
    id: "APP001",
    product: "Personal Loan",
    amount: 500000,
    tenure: 36,
    status: "under_review",
    appliedAt: "2024-01-15",
    emi: 16608,
    timeline: [
      { stage: "Application Submitted", date: "2024-01-15", status: "completed" },
      { stage: "Documents Uploaded", date: "2024-01-16", status: "completed" },
      { stage: "KYC Verification", date: "2024-01-17", status: "completed" },
      { stage: "Under Review", date: "2024-01-18", status: "current" },
      { stage: "Approval", date: "", status: "pending" },
      { stage: "Disbursal", date: "", status: "pending" },
    ]
  },
  {
    id: "APP002",
    product: "Home Loan",
    amount: 3500000,
    tenure: 240,
    status: "documents_pending",
    appliedAt: "2024-01-10",
    timeline: [
      { stage: "Application Submitted", date: "2024-01-10", status: "completed" },
      { stage: "Documents Pending", date: "2024-01-11", status: "current", remarks: "Property documents required" },
      { stage: "KYC Verification", date: "", status: "pending" },
      { stage: "Under Review", date: "", status: "pending" },
      { stage: "Approval", date: "", status: "pending" },
      { stage: "Disbursal", date: "", status: "pending" },
    ]
  },
];

const mockLoans: LoanAccount[] = [
  {
    id: "LOAN001",
    product: "Personal Loan",
    sanctionedAmount: 300000,
    disbursedAmount: 300000,
    outstandingAmount: 185000,
    interestRate: 12,
    tenure: 24,
    emiAmount: 14130,
    startDate: "2023-06-15",
    endDate: "2025-06-15",
    status: "active",
    paidEmis: 7,
    totalEmis: 24,
    nextEmiDate: "2024-02-05",
    nextEmiAmount: 14130,
  },
  {
    id: "LOAN002",
    product: "Car Loan",
    sanctionedAmount: 800000,
    disbursedAmount: 800000,
    outstandingAmount: 0,
    interestRate: 9.5,
    tenure: 48,
    emiAmount: 20165,
    startDate: "2020-03-10",
    endDate: "2024-03-10",
    status: "closed",
    paidEmis: 48,
    totalEmis: 48,
    nextEmiDate: "",
    nextEmiAmount: 0,
  },
];

const CustomerLoans = () => {
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanAccount | null>(null);

  const activeLoans = mockLoans.filter(l => l.status === "active");
  const closedLoans = mockLoans.filter(l => l.status === "closed");
  const pendingApplications = mockApplications.filter(a => !["disbursed", "rejected", "closed"].includes(a.status));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "current": return <Clock className="h-4 w-4 text-amber-500 animate-pulse" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Loans</h1>
          <p className="text-muted-foreground">Track your loan applications and active accounts</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeLoans.length}</p>
                <p className="text-sm text-muted-foreground">Active Loans</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingApplications.length}</p>
                <p className="text-sm text-muted-foreground">Pending Applications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/10">
                <IndianRupee className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(activeLoans.reduce((sum, l) => sum + l.outstandingAmount, 0) / 100000).toFixed(1)}L</p>
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{closedLoans.length}</p>
                <p className="text-sm text-muted-foreground">Closed Loans</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Applications ({mockApplications.length})</TabsTrigger>
            <TabsTrigger value="active">Active Loans ({activeLoans.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed Loans ({closedLoans.length})</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="space-y-4">
              {mockApplications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{app.product}</h3>
                            <StatusBadge status={app.status as any} />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Application ID: {app.id}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span>₹{app.amount.toLocaleString()}</span>
                            <span className="text-muted-foreground">|</span>
                            <span>{app.tenure} months</span>
                            <span className="text-muted-foreground">|</span>
                            <span>Applied: {app.appliedAt}</span>
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedApp(app)}>
                            <Eye className="h-4 w-4 mr-2" /> Track Status
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Application Timeline - {app.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                              <span>{app.product}</span>
                              <span className="font-bold">₹{app.amount.toLocaleString()}</span>
                            </div>
                            <div className="space-y-0">
                              {app.timeline.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                    {getStatusIcon(step.status)}
                                    {idx < app.timeline.length - 1 && (
                                      <div className={`w-0.5 h-12 ${step.status === "completed" ? "bg-green-500" : "bg-muted"}`} />
                                    )}
                                  </div>
                                  <div className="pb-6">
                                    <p className={`font-medium ${step.status === "pending" ? "text-muted-foreground" : ""}`}>
                                      {step.stage}
                                    </p>
                                    {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
                                    {step.remarks && (
                                      <p className="text-xs text-amber-600 mt-1">{step.remarks}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Loans Tab */}
          <TabsContent value="active">
            <div className="space-y-4">
              {activeLoans.map((loan) => (
                <Card key={loan.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{loan.product}</h3>
                          <StatusBadge status={loan.status as any} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Loan ID: {loan.id}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Sanctioned</p>
                            <p className="font-semibold">₹{loan.sanctionedAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Outstanding</p>
                            <p className="font-semibold text-red-500">₹{loan.outstandingAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">EMI Amount</p>
                            <p className="font-semibold">₹{loan.emiAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Interest Rate</p>
                            <p className="font-semibold">{loan.interestRate}% p.a.</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">EMI Progress</span>
                            <span>{loan.paidEmis} / {loan.totalEmis} EMIs paid</span>
                          </div>
                          <Progress value={(loan.paidEmis / loan.totalEmis) * 100} className="h-2" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 lg:items-end">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Next EMI Due</p>
                          <p className="font-bold text-lg">{loan.nextEmiDate}</p>
                          <p className="text-primary font-semibold">₹{loan.nextEmiAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> Details
                          </Button>
                          <Button size="sm">
                            Pay EMI <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Closed Loans Tab */}
          <TabsContent value="closed">
            <div className="space-y-4">
              {closedLoans.map((loan) => (
                <Card key={loan.id} className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <h3 className="font-semibold">{loan.product}</h3>
                          <StatusBadge status="closed">Closed</StatusBadge>
                        </div>
                        <p className="text-sm text-muted-foreground">Loan ID: {loan.id}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>₹{loan.disbursedAmount.toLocaleString()}</span>
                          <span className="text-muted-foreground">|</span>
                          <span>{loan.startDate} to {loan.endDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> NOC
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Zero Due
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CustomerLoans;
