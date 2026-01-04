import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, FileText, Receipt, Search, Eye, Mail, IndianRupee, Calendar, Filter } from "lucide-react";

interface ReceiptItem {
  id: string;
  type: "emi_receipt" | "invoice" | "noc" | "zero_due" | "sanction_letter" | "loan_statement";
  loanId: string;
  product: string;
  description: string;
  amount?: number;
  date: string;
  downloadUrl: string;
}

const mockReceipts: ReceiptItem[] = [
  { id: "RCP001", type: "emi_receipt", loanId: "LOAN001", product: "Personal Loan", description: "EMI #7 Payment Receipt", amount: 14130, date: "2024-01-05", downloadUrl: "#" },
  { id: "RCP002", type: "emi_receipt", loanId: "LOAN001", product: "Personal Loan", description: "EMI #6 Payment Receipt", amount: 14130, date: "2023-12-04", downloadUrl: "#" },
  { id: "RCP003", type: "emi_receipt", loanId: "LOAN001", product: "Personal Loan", description: "EMI #5 Payment Receipt", amount: 14130, date: "2023-11-05", downloadUrl: "#" },
  { id: "RCP004", type: "invoice", loanId: "LOAN001", product: "Personal Loan", description: "Processing Fee Invoice", amount: 3000, date: "2023-06-15", downloadUrl: "#" },
  { id: "RCP005", type: "sanction_letter", loanId: "LOAN001", product: "Personal Loan", description: "Loan Sanction Letter", date: "2023-06-14", downloadUrl: "#" },
  { id: "RCP006", type: "loan_statement", loanId: "LOAN001", product: "Personal Loan", description: "Loan Account Statement", date: "2024-01-15", downloadUrl: "#" },
  { id: "RCP007", type: "noc", loanId: "LOAN002", product: "Car Loan", description: "No Objection Certificate", date: "2024-03-10", downloadUrl: "#" },
  { id: "RCP008", type: "zero_due", loanId: "LOAN002", product: "Car Loan", description: "Zero Due Certificate", date: "2024-03-10", downloadUrl: "#" },
];

const typeLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  emi_receipt: { label: "EMI Receipt", icon: <Receipt className="h-4 w-4" />, color: "text-green-500 bg-green-500/10" },
  invoice: { label: "Invoice", icon: <FileText className="h-4 w-4" />, color: "text-blue-500 bg-blue-500/10" },
  noc: { label: "NOC", icon: <FileText className="h-4 w-4" />, color: "text-purple-500 bg-purple-500/10" },
  zero_due: { label: "Zero Due", icon: <FileText className="h-4 w-4" />, color: "text-amber-500 bg-amber-500/10" },
  sanction_letter: { label: "Sanction Letter", icon: <FileText className="h-4 w-4" />, color: "text-primary bg-primary/10" },
  loan_statement: { label: "Statement", icon: <FileText className="h-4 w-4" />, color: "text-muted-foreground bg-muted" },
};

const CustomerReceipts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loanFilter, setLoanFilter] = useState("all");

  const filteredReceipts = mockReceipts.filter(receipt => {
    const matchesSearch = receipt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || receipt.type === typeFilter;
    const matchesLoan = loanFilter === "all" || receipt.loanId === loanFilter;
    return matchesSearch && matchesType && matchesLoan;
  });

  const uniqueLoans = [...new Set(mockReceipts.map(r => r.loanId))];

  const totalEmiReceipts = mockReceipts.filter(r => r.type === "emi_receipt").length;
  const totalAmount = mockReceipts.filter(r => r.amount).reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Receipts & Documents</h1>
            <p className="text-muted-foreground">Download your payment receipts, invoices, and loan documents</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Download All
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <Receipt className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEmiReceipts}</p>
                <p className="text-sm text-muted-foreground">EMI Receipts</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockReceipts.filter(r => r.type === "invoice").length}</p>
                <p className="text-sm text-muted-foreground">Invoices</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockReceipts.filter(r => r.type === "noc" || r.type === "zero_due").length}</p>
                <p className="text-sm text-muted-foreground">NOC/Zero Due</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Paid</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search receipts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="emi_receipt">EMI Receipts</SelectItem>
                  <SelectItem value="invoice">Invoices</SelectItem>
                  <SelectItem value="sanction_letter">Sanction Letter</SelectItem>
                  <SelectItem value="loan_statement">Statements</SelectItem>
                  <SelectItem value="noc">NOC</SelectItem>
                  <SelectItem value="zero_due">Zero Due</SelectItem>
                </SelectContent>
              </Select>
              <Select value={loanFilter} onValueChange={setLoanFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Loan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Loans</SelectItem>
                  {uniqueLoans.map(loan => (
                    <SelectItem key={loan} value={loan}>{loan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Loan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => {
                  const typeInfo = typeLabels[receipt.type];
                  return (
                    <TableRow key={receipt.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                            {typeInfo.icon}
                          </div>
                          <div>
                            <p className="font-medium">{receipt.description}</p>
                            <p className="text-xs text-muted-foreground">{receipt.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{receipt.loanId}</p>
                          <p className="text-xs text-muted-foreground">{receipt.product}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {receipt.amount ? (
                          <span className="font-semibold">₹{receipt.amount.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredReceipts.length === 0 && (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No documents found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Download Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Documents</CardTitle>
              <CardDescription>Request specific documents for your loan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Request Loan Account Statement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Request Interest Certificate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" /> Request Foreclosure Statement
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Closed Loan Documents</CardTitle>
              <CardDescription>Download documents for your closed loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-green-500/20">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Car Loan - LOAN002</p>
                    <p className="text-sm text-muted-foreground">Closed on 2024-03-10</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-1" /> NOC
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-1" /> Zero Due
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerReceipts;
