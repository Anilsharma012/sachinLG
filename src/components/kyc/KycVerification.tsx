import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Upload,
  Camera,
  FileText,
  User,
  CreditCard,
  Fingerprint,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";

interface KycVerificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationComplete: (status: "verified" | "rejected", data: any) => void;
}

interface VerificationStatus {
  pan: "pending" | "verifying" | "verified" | "failed";
  aadhaar: "pending" | "verifying" | "verified" | "failed";
  photo: "pending" | "verifying" | "verified" | "failed";
  documents: "pending" | "verifying" | "verified" | "failed";
}

export const KycVerification = ({
  open,
  onOpenChange,
  onVerificationComplete,
}: KycVerificationProps) => {
  const [step, setStep] = useState(1);
  const [panNumber, setPanNumber] = useState("");
  const [panName, setPanName] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    pan: "pending",
    aadhaar: "pending",
    photo: "pending",
    documents: "pending",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const formatPan = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
  };

  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const maskAadhaar = (value: string) => {
    const digits = value.replace(/\s/g, "");
    if (digits.length <= 4) return digits;
    return "XXXX XXXX " + digits.slice(-4);
  };

  const validatePan = (pan: string) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  };

  const validateAadhaar = (aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar.replace(/\s/g, ""));
  };

  const verifyPan = async () => {
    if (!validatePan(panNumber)) {
      toast.error("Invalid PAN format. Please check and try again.");
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(prev => ({ ...prev, pan: "verifying" }));

    // Simulate PAN verification API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock verification - in production, this would call actual API
    const isValid = panNumber.charAt(3) === "P"; // Personal PAN starts with 4th char as P
    
    if (isValid || true) { // Always succeed for demo
      setVerificationStatus(prev => ({ ...prev, pan: "verified" }));
      setPanName("JOHN DOE"); // Mock name from PAN
      toast.success("PAN Verified Successfully!");
      setStep(2);
    } else {
      setVerificationStatus(prev => ({ ...prev, pan: "failed" }));
      toast.error("PAN verification failed. Please check the number.");
    }

    setIsVerifying(false);
  };

  const sendAadhaarOtp = async () => {
    if (!validateAadhaar(aadhaarNumber)) {
      toast.error("Invalid Aadhaar format. Please enter 12 digits.");
      return;
    }

    setIsVerifying(true);

    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    setOtpSent(true);
    setIsVerifying(false);
    toast.success("OTP sent to your Aadhaar-linked mobile number!");
  };

  const verifyAadhaarOtp = async () => {
    if (aadhaarOtp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(prev => ({ ...prev, aadhaar: "verifying" }));

    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    setVerificationStatus(prev => ({ ...prev, aadhaar: "verified" }));
    toast.success("Aadhaar Verified Successfully!");
    setStep(3);
    setIsVerifying(false);
  };

  const handlePhotoUpload = async () => {
    setIsVerifying(true);
    setVerificationStatus(prev => ({ ...prev, photo: "verifying" }));

    // Simulate face matching
    await new Promise(resolve => setTimeout(resolve, 2000));

    setVerificationStatus(prev => ({ ...prev, photo: "verified" }));
    setPhotoUploaded(true);
    toast.success("Photo verified with Aadhaar!");
    setStep(4);
    setIsVerifying(false);
  };

  const completeKyc = async () => {
    setIsVerifying(true);
    setVerificationStatus(prev => ({ ...prev, documents: "verifying" }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    setVerificationStatus(prev => ({ ...prev, documents: "verified" }));
    
    toast.success("KYC Verification Complete!", {
      description: "Your identity has been verified successfully.",
    });

    onVerificationComplete("verified", {
      pan: panNumber,
      panName,
      aadhaarMasked: maskAadhaar(aadhaarNumber),
    });

    setIsVerifying(false);
    onOpenChange(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "verifying":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            KYC Verification
          </DialogTitle>
          <DialogDescription>
            Complete your identity verification to access all features
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: "pan", label: "PAN", icon: CreditCard },
            { key: "aadhaar", label: "Aadhaar", icon: Fingerprint },
            { key: "photo", label: "Photo", icon: Camera },
            { key: "documents", label: "Docs", icon: FileText },
          ].map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className={`flex flex-col items-center p-2 rounded-lg border ${
                verificationStatus[key as keyof VerificationStatus] === "verified"
                  ? "border-green-500/50 bg-green-500/5"
                  : verificationStatus[key as keyof VerificationStatus] === "verifying"
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted"
              }`}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{label}</span>
              <div className="mt-1">{getStatusIcon(verificationStatus[key as keyof VerificationStatus])}</div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                PAN Verification
              </CardTitle>
              <CardDescription>Enter your PAN card details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(formatPan(e.target.value))}
                  maxLength={10}
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Format: 5 letters + 4 digits + 1 letter
                </p>
              </div>

              {panName && (
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm text-muted-foreground">Name as per PAN:</p>
                  <p className="font-semibold text-green-600">{panName}</p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={verifyPan}
                disabled={panNumber.length !== 10 || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify PAN
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Aadhaar Verification
              </CardTitle>
              <CardDescription>Verify your Aadhaar with OTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <div className="relative">
                  <Input
                    id="aadhaar"
                    placeholder="XXXX XXXX XXXX"
                    value={showAadhaar ? formatAadhaar(aadhaarNumber) : maskAadhaar(aadhaarNumber)}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\s/g, ""))}
                    maxLength={14}
                    disabled={otpSent}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                  >
                    {showAadhaar ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your Aadhaar number is stored in masked format for security
                </p>
              </div>

              {!otpSent ? (
                <Button
                  className="w-full"
                  onClick={sendAadhaarOtp}
                  disabled={aadhaarNumber.replace(/\s/g, "").length !== 12 || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP to Aadhaar Mobile"
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit OTP"
                      value={aadhaarOtp}
                      onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        OTP sent to Aadhaar-linked mobile
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0" onClick={sendAadhaarOtp}>
                        <RefreshCw className="h-3 w-3 mr-1" /> Resend
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={verifyAadhaarOtp}
                    disabled={aadhaarOtp.length !== 6 || isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Verify OTP
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photo Verification
              </CardTitle>
              <CardDescription>Upload a selfie for face matching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {photoUploaded ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                    <p className="font-medium text-green-600">Photo Verified!</p>
                    <p className="text-sm text-muted-foreground">
                      Face matched with Aadhaar photo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Upload Selfie</p>
                      <p className="text-sm text-muted-foreground">
                        Take a clear photo of your face
                      </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={handlePhotoUpload} disabled={isVerifying}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button onClick={handlePhotoUpload} disabled={isVerifying}>
                        {isVerifying ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4 mr-2" />
                        )}
                        Take Photo
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Your photo will be matched with the photo in your Aadhaar for verification
              </p>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Final Verification
              </CardTitle>
              <CardDescription>Review and complete KYC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>PAN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{panNumber}</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4" />
                    <span>Aadhaar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{maskAadhaar(aadhaarNumber)}</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{panName}</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    <span>Photo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Verified</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={completeKyc}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Completing KYC...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete KYC Verification
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};
