import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, Download, Eye, FileText, Upload } from "lucide-react";

const mockDocuments = [
  { id: "DOC001", name: "Aadhaar Card", customerName: "Rajesh Kumar", applicationId: "APP001", type: "Identity", uploadedAt: "2024-01-15", status: "verified" },
  { id: "DOC002", name: "PAN Card", customerName: "Priya Sharma", applicationId: "APP002", type: "Identity", uploadedAt: "2024-01-14", status: "pending" },
  { id: "DOC003", name: "Salary Slip", customerName: "Amit Patel", applicationId: "APP003", type: "Income", uploadedAt: "2024-01-13", status: "rejected" },
  { id: "DOC004", name: "Bank Statement", customerName: "Sunita Devi", applicationId: "APP004", type: "Financial", uploadedAt: "2024-01-12", status: "verified" },
  { id: "DOC005", name: "Address Proof", customerName: "Vikram Singh", applicationId: "APP005", type: "Address", uploadedAt: "2024-01-11", status: "pending" },
];

const AdminDocuments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredDocs = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <Button>
            <Upload className="h-4 w-4 mr-2" /> Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mockDocuments.length}</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{mockDocuments.filter(d => d.status === "verified").length}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{mockDocuments.filter(d => d.status === "pending").length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{mockDocuments.filter(d => d.status === "rejected").length}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background text-foreground"
              >
                <option value="all">All Types</option>
                <option value="identity">Identity</option>
                <option value="income">Income</option>
                <option value="financial">Financial</option>
                <option value="address">Address</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.id}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.customerName}</TableCell>
                    <TableCell>{doc.applicationId}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{doc.uploadedAt}</TableCell>
                    <TableCell>
                      <StatusBadge status={doc.status as any} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDocuments;
