import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, FileText, User, IndianRupee, Users, Building2, CreditCard } from "lucide-react";

interface LoanApplicationData {
  // Loan Details
  loanProduct: string;
  loanAmount: string;
  tenure: string;
  purpose: string;
  // Existing Obligations
  hasExistingLoans: boolean;
  existingLoanDetails: string;
  existingEmiAmount: string;
  // Reference Contacts
  reference1Name: string;
  reference1Phone: string;
  reference1Relation: string;
  reference2Name: string;
  reference2Phone: string;
  reference2Relation: string;
  // Co-applicant
  hasCoApplicant: boolean;
  coApplicantName: string;
  coApplicantPhone: string;
  coApplicantRelation: string;
  coApplicantIncome: string;
  // Guarantor
  hasGuarantor: boolean;
  guarantorName: string;
  guarantorPhone: string;
  guarantorAddress: string;
  // Bank Preference
  preferredBank: string;
  // Terms
  termsAccepted: boolean;
}

const loanProducts = [
  { id: "personal", name: "Personal Loan", minAmount: 50000, maxAmount: 2500000, minTenure: 6, maxTenure: 60, rate: "10.5% - 18%" },
  { id: "home", name: "Home Loan", minAmount: 500000, maxAmount: 50000000, minTenure: 12, maxTenure: 360, rate: "8.5% - 10.5%" },
  { id: "business", name: "Business Loan", minAmount: 100000, maxAmount: 5000000, minTenure: 12, maxTenure: 84, rate: "12% - 20%" },
  { id: "car", name: "Car Loan", minAmount: 100000, maxAmount: 10000000, minTenure: 12, maxTenure: 84, rate: "9% - 12%" },
  { id: "education", name: "Education Loan", minAmount: 100000, maxAmount: 7500000, minTenure: 12, maxTenure: 180, rate: "8% - 12%" },
  { id: "gold", name: "Gold Loan", minAmount: 10000, maxAmount: 5000000, minTenure: 3, maxTenure: 36, rate: "7% - 10%" },
];

const loanPurposes = [
  "Home Renovation", "Medical Emergency", "Wedding Expenses", "Education", "Debt Consolidation",
  "Travel", "Business Expansion", "Working Capital", "Vehicle Purchase", "Land Purchase", "Other"
];

const banks = [
  "Any Bank", "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra Bank",
  "Punjab National Bank", "Bank of Baroda", "Bajaj Finserv", "Tata Capital", "IDFC First Bank"
];

const CustomerApply = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState<LoanApplicationData>({
    loanProduct: "",
    loanAmount: "",
    tenure: "",
    purpose: "",
    hasExistingLoans: false,
    existingLoanDetails: "",
    existingEmiAmount: "",
    reference1Name: "",
    reference1Phone: "",
    reference1Relation: "",
    reference2Name: "",
    reference2Phone: "",
    reference2Relation: "",
    hasCoApplicant: false,
    coApplicantName: "",
    coApplicantPhone: "",
    coApplicantRelation: "",
    coApplicantIncome: "",
    hasGuarantor: false,
    guarantorName: "",
    guarantorPhone: "",
    guarantorAddress: "",
    preferredBank: "",
    termsAccepted: false,
  });

  const selectedProduct = loanProducts.find(p => p.id === formData.loanProduct);

  const handleChange = (field: keyof LoanApplicationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    toast.success("Application submitted successfully! You will receive updates via SMS and email.");
  };

  const calculateEMI = () => {
    const p = Number(formData.loanAmount);
    const r = 12 / 100 / 12; // 12% annual rate, monthly
    const n = Number(formData.tenure);
    if (p && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return Math.round(emi);
    }
    return 0;
  };

  const stepIcons = [
    <FileText key="1" className="h-5 w-5" />,
    <IndianRupee key="2" className="h-5 w-5" />,
    <Users key="3" className="h-5 w-5" />,
    <User key="4" className="h-5 w-5" />,
    <Check key="5" className="h-5 w-5" />,
  ];

  const stepLabels = ["Loan Details", "Obligations", "References", "Co-Applicant", "Review"];

  return (
    <DashboardLayout role="customer">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Apply for Loan</h1>
          <p className="text-muted-foreground">Complete the application in a few simple steps</p>
        </div>

        {/* Progress Stepper */}
        <div className="relative">
          <div className="flex justify-between mb-2">
            {stepLabels.map((label, idx) => (
              <div key={idx} className={`flex flex-col items-center flex-1 ${idx + 1 <= step ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  idx + 1 < step ? "bg-primary text-primary-foreground" : 
                  idx + 1 === step ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {idx + 1 < step ? <Check className="h-5 w-5" /> : stepIcons[idx]}
                </div>
                <span className="text-xs text-center hidden sm:block">{label}</span>
              </div>
            ))}
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
        </div>

        {/* Step 1: Loan Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Loan Details
              </CardTitle>
              <CardDescription>Select your loan type and amount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Select Loan Product *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {loanProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleChange("loanProduct", product.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        formData.loanProduct === product.id ? "border-primary bg-primary/5 ring-2 ring-primary" : ""
                      }`}
                    >
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Rate: {product.rate}</p>
                      <p className="text-xs text-muted-foreground">₹{(product.minAmount/100000).toFixed(1)}L - ₹{(product.maxAmount/100000).toFixed(1)}L</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProduct && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Loan Amount (₹) *</Label>
                      <Input
                        type="number"
                        value={formData.loanAmount}
                        onChange={(e) => handleChange("loanAmount", e.target.value)}
                        placeholder={`Min: ₹${selectedProduct.minAmount.toLocaleString()}`}
                        min={selectedProduct.minAmount}
                        max={selectedProduct.maxAmount}
                      />
                      <p className="text-xs text-muted-foreground">
                        Range: ₹{selectedProduct.minAmount.toLocaleString()} - ₹{selectedProduct.maxAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Tenure (Months) *</Label>
                      <Select value={formData.tenure} onValueChange={(v) => handleChange("tenure", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenure" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: Math.floor((selectedProduct.maxTenure - selectedProduct.minTenure) / 6) + 1 }, (_, i) => {
                            const months = selectedProduct.minTenure + i * 6;
                            return months <= selectedProduct.maxTenure ? (
                              <SelectItem key={months} value={String(months)}>
                                {months} months ({(months / 12).toFixed(1)} years)
                              </SelectItem>
                            ) : null;
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.loanAmount && formData.tenure && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Estimated EMI</span>
                        <span className="text-2xl font-bold text-primary">₹{calculateEMI().toLocaleString()}/month</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">*Indicative EMI based on 12% interest rate</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Purpose of Loan *</Label>
                    <Select value={formData.purpose} onValueChange={(v) => handleChange("purpose", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanPurposes.map((purpose) => (
                          <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Bank/NBFC</Label>
                    <Select value={formData.preferredBank} onValueChange={(v) => handleChange("preferredBank", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Existing Obligations */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" /> Existing Financial Obligations
              </CardTitle>
              <CardDescription>Tell us about your current loans and EMIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasExistingLoans"
                  checked={formData.hasExistingLoans}
                  onCheckedChange={(checked) => handleChange("hasExistingLoans", !!checked)}
                />
                <Label htmlFor="hasExistingLoans">I have existing loans/EMIs</Label>
              </div>

              {formData.hasExistingLoans && (
                <>
                  <div className="space-y-2">
                    <Label>Existing Loan Details</Label>
                    <Textarea
                      value={formData.existingLoanDetails}
                      onChange={(e) => handleChange("existingLoanDetails", e.target.value)}
                      placeholder="E.g., Home Loan from HDFC Bank - ₹50L outstanding, Car Loan from Axis Bank - ₹5L outstanding"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Monthly EMI Amount (₹)</Label>
                    <Input
                      type="number"
                      value={formData.existingEmiAmount}
                      onChange={(e) => handleChange("existingEmiAmount", e.target.value)}
                      placeholder="Enter total monthly EMI"
                    />
                  </div>
                </>
              )}

              {!formData.hasExistingLoans && (
                <div className="p-6 text-center bg-muted/30 rounded-lg">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">No existing obligations - Great for loan eligibility!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Reference Contacts */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Reference Contacts
              </CardTitle>
              <CardDescription>Provide 2 reference contacts (not family members)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium">Reference 1</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={formData.reference1Name}
                      onChange={(e) => handleChange("reference1Name", e.target.value)}
                      placeholder="Reference name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={formData.reference1Phone}
                      onChange={(e) => handleChange("reference1Phone", e.target.value)}
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select value={formData.reference1Relation} onValueChange={(v) => handleChange("reference1Relation", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="neighbor">Neighbor</SelectItem>
                        <SelectItem value="business_partner">Business Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <h4 className="font-medium">Reference 2</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={formData.reference2Name}
                      onChange={(e) => handleChange("reference2Name", e.target.value)}
                      placeholder="Reference name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={formData.reference2Phone}
                      onChange={(e) => handleChange("reference2Phone", e.target.value)}
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select value={formData.reference2Relation} onValueChange={(v) => handleChange("reference2Relation", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="neighbor">Neighbor</SelectItem>
                        <SelectItem value="business_partner">Business Partner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Co-Applicant & Guarantor */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Co-Applicant & Guarantor
              </CardTitle>
              <CardDescription>Add co-applicant or guarantor if applicable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Co-Applicant */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasCoApplicant"
                    checked={formData.hasCoApplicant}
                    onCheckedChange={(checked) => handleChange("hasCoApplicant", !!checked)}
                  />
                  <Label htmlFor="hasCoApplicant">I want to add a Co-Applicant</Label>
                </div>

                {formData.hasCoApplicant && (
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Co-Applicant Name *</Label>
                        <Input
                          value={formData.coApplicantName}
                          onChange={(e) => handleChange("coApplicantName", e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input
                          value={formData.coApplicantPhone}
                          onChange={(e) => handleChange("coApplicantPhone", e.target.value)}
                          placeholder="10-digit mobile"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship *</Label>
                        <Select value={formData.coApplicantRelation} onValueChange={(v) => handleChange("coApplicantRelation", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Income (₹)</Label>
                        <Input
                          type="number"
                          value={formData.coApplicantIncome}
                          onChange={(e) => handleChange("coApplicantIncome", e.target.value)}
                          placeholder="Monthly income"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Guarantor */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasGuarantor"
                    checked={formData.hasGuarantor}
                    onCheckedChange={(checked) => handleChange("hasGuarantor", !!checked)}
                  />
                  <Label htmlFor="hasGuarantor">I want to add a Guarantor</Label>
                </div>

                {formData.hasGuarantor && (
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Guarantor Name *</Label>
                        <Input
                          value={formData.guarantorName}
                          onChange={(e) => handleChange("guarantorName", e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input
                          value={formData.guarantorPhone}
                          onChange={(e) => handleChange("guarantorPhone", e.target.value)}
                          placeholder="10-digit mobile"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={formData.guarantorAddress}
                        onChange={(e) => handleChange("guarantorAddress", e.target.value)}
                        placeholder="Complete address with PIN code"
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5" /> Review Application
              </CardTitle>
              <CardDescription>Please review your application before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-3">Loan Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Product:</span>
                    <span className="font-medium">{selectedProduct?.name}</span>
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">₹{Number(formData.loanAmount).toLocaleString()}</span>
                    <span className="text-muted-foreground">Tenure:</span>
                    <span className="font-medium">{formData.tenure} months</span>
                    <span className="text-muted-foreground">Purpose:</span>
                    <span className="font-medium">{formData.purpose}</span>
                    <span className="text-muted-foreground">Est. EMI:</span>
                    <span className="font-medium text-primary">₹{calculateEMI().toLocaleString()}/month</span>
                  </div>
                </div>

                {formData.hasExistingLoans && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Existing Obligations</h4>
                    <p className="text-sm text-muted-foreground">Monthly EMI: ₹{formData.existingEmiAmount}</p>
                  </div>
                )}

                {formData.hasCoApplicant && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Co-Applicant</h4>
                    <p className="text-sm">{formData.coApplicantName} ({formData.coApplicantRelation})</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleChange("termsAccepted", !!checked)}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I hereby declare that all information provided is true and correct. I authorize the company to verify my details 
                  and pull my credit report. I agree to the Terms & Conditions and Privacy Policy.
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {step < totalSteps ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" /> Submit Application
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerApply;
