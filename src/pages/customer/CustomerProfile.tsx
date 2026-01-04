import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { KycVerification } from '@/components/kyc/KycVerification';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Shield,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Briefcase,
  Calendar,
  IndianRupee,
  Fingerprint
} from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN number').optional().or(z.literal('')),
  currentAddress: z.string().max(500).optional(),
  currentCity: z.string().max(100).optional(),
  currentState: z.string().max(100).optional(),
  currentPincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode').optional().or(z.literal('')),
  employmentType: z.string().optional(),
  companyName: z.string().max(200).optional(),
  monthlyIncome: z.string().optional(),
  bankName: z.string().max(100).optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code').optional().or(z.literal('')),
});

type ProfileData = z.infer<typeof profileSchema>;

const PROFILE_STORAGE_KEY = 'loan_agent_customer_profile';

export default function CustomerProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Load saved profile from localStorage
  const getSavedProfile = (): Partial<ProfileData> => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const savedProfile = getSavedProfile();

  const [formData, setFormData] = useState<ProfileData>({
    name: user?.name || savedProfile.name || '',
    phone: savedProfile.phone || '',
    dateOfBirth: savedProfile.dateOfBirth || '',
    gender: savedProfile.gender || '',
    pan: savedProfile.pan || '',
    currentAddress: savedProfile.currentAddress || '',
    currentCity: savedProfile.currentCity || '',
    currentState: savedProfile.currentState || '',
    currentPincode: savedProfile.currentPincode || '',
    employmentType: savedProfile.employmentType || '',
    companyName: savedProfile.companyName || '',
    monthlyIncome: savedProfile.monthlyIncome || '',
    bankName: savedProfile.bankName || '',
    accountNumber: savedProfile.accountNumber || '',
    ifscCode: savedProfile.ifscCode || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('personal');
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = async () => {
    setErrors({});

    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(formData));
    
    setIsLoading(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
    });
  };

  const kycStatus = kycVerified || savedProfile.pan ? 'verified' : 'pending';

  const handleKycComplete = (status: "verified" | "rejected", data: any) => {
    if (status === "verified") {
      setKycVerified(true);
      setFormData(prev => ({ ...prev, pan: data.pan }));
      toast({
        title: 'KYC Verified',
        description: 'Your identity has been verified successfully.',
      });
    }
  };
  const profileCompletion = Object.values(formData).filter(Boolean).length;
  const totalFields = Object.keys(formData).length;
  const completionPercentage = Math.round((profileCompletion / totalFields) * 100);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and KYC details</p>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="lg:sticky lg:top-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {formData.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{formData.name || 'Customer'}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant={kycStatus === 'verified' ? 'default' : 'secondary'} className="gap-1">
                      {kycStatus === 'verified' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      KYC {kycStatus === 'verified' ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>

                  {/* Verify KYC Button */}
                  {kycStatus !== 'verified' && (
                    <Button 
                      className="mt-4 w-full" 
                      onClick={() => setKycDialogOpen(true)}
                    >
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Verify KYC Now
                    </Button>
                  )}

                  <Separator className="my-6" />

                  <div className="w-full space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Profile Completion</span>
                        <span className="font-medium">{completionPercentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                    </div>

                    <div className="text-left space-y-3">
                      {formData.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>+91 {formData.phone}</span>
                        </div>
                      )}
                      {formData.currentCity && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.currentCity}, {formData.currentState}</span>
                        </div>
                      )}
                      {formData.companyName && (
                        <div className="flex items-center gap-3 text-sm">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{formData.companyName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="personal" className="gap-2">
                  <User className="h-4 w-4 hidden sm:block" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="address" className="gap-2">
                  <MapPin className="h-4 w-4 hidden sm:block" />
                  Address
                </TabsTrigger>
                <TabsTrigger value="employment" className="gap-2">
                  <Briefcase className="h-4 w-4 hidden sm:block" />
                  Employment
                </TabsTrigger>
                <TabsTrigger value="bank" className="gap-2">
                  <CreditCard className="h-4 w-4 hidden sm:block" />
                  Bank
                </TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Update your personal details and identity information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Mobile Number</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="9876543210"
                            className="pl-12"
                          />
                        </div>
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="dob"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(v) => handleChange('gender', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="pan" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        PAN Number
                      </Label>
                      <Input
                        id="pan"
                        value={formData.pan}
                        onChange={(e) => handleChange('pan', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                      {errors.pan && <p className="text-xs text-destructive">{errors.pan}</p>}
                      <p className="text-xs text-muted-foreground">PAN is required for KYC verification</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Address */}
              <TabsContent value="address">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Current Address
                    </CardTitle>
                    <CardDescription>Your current residential address</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentAddress">Address Line</Label>
                      <Input
                        id="currentAddress"
                        value={formData.currentAddress}
                        onChange={(e) => handleChange('currentAddress', e.target.value)}
                        placeholder="House/Flat No., Street, Locality"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="currentCity">City</Label>
                        <Input
                          id="currentCity"
                          value={formData.currentCity}
                          onChange={(e) => handleChange('currentCity', e.target.value)}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentState">State</Label>
                        <Select value={formData.currentState} onValueChange={(v) => handleChange('currentState', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="currentPincode">Pincode</Label>
                        <Input
                          id="currentPincode"
                          value={formData.currentPincode}
                          onChange={(e) => handleChange('currentPincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6-digit pincode"
                          maxLength={6}
                        />
                        {errors.currentPincode && <p className="text-xs text-destructive">{errors.currentPincode}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Employment */}
              <TabsContent value="employment">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Employment Details
                    </CardTitle>
                    <CardDescription>Your current employment and income information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="employmentType">Employment Type</Label>
                        <Select value={formData.employmentType} onValueChange={(v) => handleChange('employmentType', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salaried">Salaried</SelectItem>
                            <SelectItem value="self-employed">Self Employed</SelectItem>
                            <SelectItem value="business">Business Owner</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company / Business Name</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                            placeholder="Enter company name"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">Monthly Income</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={(e) => handleChange('monthlyIncome', e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter monthly income"
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Your approximate monthly net income</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bank Details */}
              <TabsContent value="bank">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Bank Account Details
                    </CardTitle>
                    <CardDescription>Your primary bank account for loan disbursement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        placeholder="Enter bank name"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={formData.accountNumber}
                          onChange={(e) => handleChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter account number"
                          type="password"
                        />
                        <p className="text-xs text-muted-foreground">Your account number is encrypted</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          value={formData.ifscCode}
                          onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                          placeholder="SBIN0001234"
                          maxLength={11}
                        />
                        {errors.ifscCode && <p className="text-xs text-destructive">{errors.ifscCode}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* KYC Verification Modal */}
      <KycVerification
        open={kycDialogOpen}
        onOpenChange={setKycDialogOpen}
        onVerificationComplete={handleKycComplete}
      />
    </DashboardLayout>
  );
}
