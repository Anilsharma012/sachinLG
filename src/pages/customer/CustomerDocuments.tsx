import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload, FileText, Eye, Download, CheckCircle, Clock, XCircle, AlertCircle, RefreshCw, Trash2 } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  category: "identity" | "address" | "income" | "property" | "other";
  required: boolean;
  status: "not_uploaded" | "uploaded" | "verified" | "rejected";
  uploadedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  fileUrl?: string;
  expiryDate?: string;
}

const mockDocuments: Document[] = [
  { id: "DOC001", name: "Aadhaar Card", type: "Identity Proof", category: "identity", required: true, status: "verified", uploadedAt: "2024-01-10", verifiedAt: "2024-01-11" },
  { id: "DOC002", name: "PAN Card", type: "Identity Proof", category: "identity", required: true, status: "verified", uploadedAt: "2024-01-10", verifiedAt: "2024-01-11" },
  { id: "DOC003", name: "Passport Photo", type: "Photo", category: "identity", required: true, status: "uploaded", uploadedAt: "2024-01-15" },
  { id: "DOC004", name: "Address Proof", type: "Address Proof", category: "address", required: true, status: "rejected", uploadedAt: "2024-01-12", rejectionReason: "Document is blurry, please re-upload a clear copy" },
  { id: "DOC005", name: "Salary Slip (Last 3 Months)", type: "Income Proof", category: "income", required: true, status: "not_uploaded" },
  { id: "DOC006", name: "Bank Statement (6 Months)", type: "Income Proof", category: "income", required: true, status: "uploaded", uploadedAt: "2024-01-14" },
  { id: "DOC007", name: "Form 16 / ITR", type: "Income Proof", category: "income", required: false, status: "not_uploaded" },
  { id: "DOC008", name: "Employment Letter", type: "Employment Proof", category: "income", required: false, status: "not_uploaded" },
];

const categories = [
  { key: "identity", label: "Identity Documents", icon: "🪪" },
  { key: "address", label: "Address Proof", icon: "🏠" },
  { key: "income", label: "Income Documents", icon: "💰" },
  { key: "property", label: "Property Documents", icon: "🏢" },
  { key: "other", label: "Other Documents", icon: "📄" },
];

const CustomerDocuments = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const requiredDocs = documents.filter(d => d.required);
  const uploadedCount = requiredDocs.filter(d => d.status !== "not_uploaded").length;
  const verifiedCount = requiredDocs.filter(d => d.status === "verified").length;
  const rejectedCount = documents.filter(d => d.status === "rejected").length;

  const completionPercent = Math.round((verifiedCount / requiredDocs.length) * 100);

  const handleUpload = (docId: string) => {
    setDocuments(docs => docs.map(d => 
      d.id === docId ? { ...d, status: "uploaded" as const, uploadedAt: new Date().toISOString().split("T")[0] } : d
    ));
    toast.success("Document uploaded successfully!");
    setUploadDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "uploaded": return <Clock className="h-5 w-5 text-amber-500" />;
      case "rejected": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getDocsByCategory = (category: string) => documents.filter(d => d.category === category);

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Documents</h1>
          <p className="text-muted-foreground">Upload and manage your KYC and loan documents</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Document Verification</span>
                  <span className="font-medium">{completionPercent}%</span>
                </div>
                <Progress value={completionPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">{verifiedCount} of {requiredDocs.length} required docs verified</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{verifiedCount}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{documents.filter(d => d.status === "uploaded").length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`${rejectedCount > 0 ? "bg-red-500/5 border-red-500/20" : ""}`}>
            <CardContent className="p-4 flex items-center gap-4">
              <XCircle className={`h-8 w-8 ${rejectedCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
              <div>
                <p className="text-2xl font-bold">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Needs Reupload</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rejected Documents Alert */}
        {rejectedCount > 0 && (
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-600">Action Required</p>
                  <p className="text-sm text-muted-foreground">
                    {rejectedCount} document(s) were rejected and need to be re-uploaded. Please check the rejection reason and upload again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents by Category */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const catDocs = getDocsByCategory(cat.key);
            if (catDocs.length === 0) return null;
            
            return (
              <Card key={cat.key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{cat.icon}</span> {cat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {catDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className={`flex items-center justify-between p-4 border rounded-lg ${
                          doc.status === "rejected" ? "border-red-500/50 bg-red-500/5" :
                          doc.status === "verified" ? "border-green-500/30 bg-green-500/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(doc.status)}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{doc.name}</p>
                              {doc.required && <span className="text-xs text-red-500">*Required</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">{doc.type}</p>
                            {doc.uploadedAt && (
                              <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadedAt}</p>
                            )}
                            {doc.rejectionReason && (
                              <p className="text-xs text-red-500 mt-1">Reason: {doc.rejectionReason}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={doc.status as any} />
                          {doc.status === "not_uploaded" && (
                            <Dialog open={uploadDialogOpen && selectedDoc?.id === doc.id} onOpenChange={(open) => {
                              setUploadDialogOpen(open);
                              if (open) setSelectedDoc(doc);
                            }}>
                              <DialogTrigger asChild>
                                <Button size="sm">
                                  <Upload className="h-4 w-4 mr-1" /> Upload
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Upload {doc.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Drag and drop your file here or</p>
                                    <Input type="file" className="mt-2" accept=".pdf,.jpg,.jpeg,.png" />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Supported formats: PDF, JPG, PNG (Max 5MB)
                                  </p>
                                  <Button className="w-full" onClick={() => handleUpload(doc.id)}>
                                    Upload Document
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          {doc.status === "rejected" && (
                            <Button size="sm" variant="destructive" onClick={() => {
                              setSelectedDoc(doc);
                              setUploadDialogOpen(true);
                            }}>
                              <RefreshCw className="h-4 w-4 mr-1" /> Re-upload
                            </Button>
                          )}
                          {(doc.status === "uploaded" || doc.status === "verified") && (
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upload Additional Document */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Upload Additional Document</p>
                <p className="text-sm text-muted-foreground">Need to upload a document not listed above?</p>
              </div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" /> Upload Other Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDocuments;
