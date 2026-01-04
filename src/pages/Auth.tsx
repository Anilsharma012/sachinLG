import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserRole, signupSchema, loginSchema } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { 
  Shield, 
  Users, 
  User, 
  Loader2, 
  Mail, 
  Lock,
  ArrowRight,
  Building2,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

// Social provider icons
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const roleConfig: Record<UserRole, { icon: typeof Shield; label: string; color: string; email: string; password: string }> = {
  superadmin: {
    icon: Shield,
    label: 'Super Admin',
    color: 'from-rose-500 to-rose-600',
    email: 'superadmin@loanagent.com',
    password: 'superadmin123',
  },
  admin: {
    icon: Shield,
    label: 'Admin',
    color: 'from-primary to-primary/80',
    email: 'admin@loanagent.com',
    password: 'admin123',
  },
  agent: {
    icon: Users,
    label: 'Agent',
    color: 'from-emerald-500 to-emerald-600',
    email: 'agent@loanagent.com',
    password: 'agent123',
  },
  customer: {
    icon: User,
    label: 'Customer',
    color: 'from-blue-500 to-blue-600',
    email: 'customer@loanagent.com',
    password: 'customer123',
  },
};

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthView = 'login' | 'signup' | 'verify' | 'forgot-password' | 'reset-password';

export default function Auth() {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isComposing, setIsComposing] = useState(false);
  
  const { 
    login, 
    signup, 
    verifyEmail, 
    resendOtp, 
    loginAsRole,
    loginWithSocial,
    requestPasswordReset,
    resetPassword,
    isAuthenticated, 
    user,
    pendingVerification,
    pendingPasswordReset,
    clearPendingVerification,
    clearPendingPasswordReset
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname;

  // Check for pending verification on mount
  useEffect(() => {
    if (pendingVerification && view !== 'verify') {
      setEmail(pendingVerification);
      setView('verify');
    }
  }, [pendingVerification, view]);

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const roleRoutes: Record<UserRole, string> = {
      superadmin: '/superadmin',
      admin: '/admin',
      agent: '/agent',
      customer: '/customer',
    };
    const redirectTo = from || roleRoutes[user.role];
    navigate(redirectTo, { replace: true });
    return null;
  }

  const clearErrors = () => setErrors({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent form submission during IME composition (e.g., Hindi/Hinglish input)
    if (isComposing) {
      return;
    }

    clearErrors();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const loginResult = await login(email, password);
    setIsLoading(false);

    if (loginResult.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have been logged in successfully.',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: loginResult.error,
        variant: 'destructive',
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const result = signupSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const signupResult = await signup(name, email, password);
    setIsLoading(false);

    if (signupResult.success) {
      setDemoOtp(signupResult.otp || null);
      setView('verify');
      toast({
        title: 'Verification Required',
        description: 'Please enter the verification code sent to your email.',
      });
    } else {
      toast({
        title: 'Signup Failed',
        description: signupResult.error,
        variant: 'destructive',
      });
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 6-digit verification code.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const verifyResult = await verifyEmail(email || pendingVerification || '', otp);
    setIsLoading(false);

    if (verifyResult.success) {
      toast({
        title: 'Email Verified!',
        description: 'Your account has been created successfully.',
      });
      setDemoOtp(null);
    } else {
      toast({
        title: 'Verification Failed',
        description: verifyResult.error,
        variant: 'destructive',
      });
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    const result = await resendOtp(email || pendingVerification || '');
    setIsLoading(false);

    if (result.success) {
      setDemoOtp(result.otp || null);
      setOtp('');
      toast({
        title: 'Code Resent',
        description: 'A new verification code has been sent.',
      });
    } else {
      toast({
        title: 'Failed to Resend',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleBackToSignup = () => {
    clearPendingVerification();
    setView('signup');
    setOtp('');
    setDemoOtp(null);
  };

  const handleQuickLogin = (role: UserRole) => {
    setLoadingRole(role);
    setTimeout(() => {
      loginAsRole(role);
      toast({
        title: 'Welcome!',
        description: `Logged in as ${roleConfig[role].label}.`,
      });
      setLoadingRole(null);
    }, 500);
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    const result = await loginWithSocial(provider);
    setSocialLoading(null);

    if (result.success) {
      toast({
        title: 'Welcome!',
        description: `Logged in with ${provider === 'google' ? 'Google' : 'GitHub'}.`,
      });
    } else {
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!email || !email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    const result = await requestPasswordReset(email);
    setIsLoading(false);

    if (result.success) {
      setDemoOtp(result.otp || null);
      setView('reset-password');
      toast({
        title: 'Reset Code Sent',
        description: 'Check your email for the password reset code.',
      });
    } else {
      toast({
        title: 'Request Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async () => {
    clearErrors();

    if (otp.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 6-digit reset code.',
        variant: 'destructive',
      });
      return;
    }

    const result = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const resetResult = await resetPassword(email || pendingPasswordReset || '', otp, password);
    setIsLoading(false);

    if (resetResult.success) {
      toast({
        title: 'Password Reset!',
        description: 'Your password has been updated. Please log in.',
      });
      setView('login');
      setOtp('');
      setPassword('');
      setConfirmPassword('');
      setDemoOtp(null);
    } else {
      toast({
        title: 'Reset Failed',
        description: resetResult.error,
        variant: 'destructive',
      });
    }
  };

  const handleBackToLogin = () => {
    clearPendingPasswordReset();
    setView('login');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setDemoOtp(null);
  };

  const getViewTitle = () => {
    switch (view) {
      case 'verify': return 'Verify your email';
      case 'signup': return 'Create your account';
      case 'forgot-password': return 'Reset your password';
      case 'reset-password': return 'Set new password';
      default: return 'Sign in to your account';
    }
  };

  // Social login buttons component
  const SocialLoginButtons = () => (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={socialLoading !== null}
          className="h-11"
        >
          {socialLoading === 'google' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <GoogleIcon />
              <span className="ml-2">Google</span>
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('github')}
          disabled={socialLoading !== null}
          className="h-11"
        >
          {socialLoading === 'github' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <GitHubIcon />
              <span className="ml-2">GitHub</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">LoanAgent</span>
          </div>
          <p className="text-muted-foreground">{getViewTitle()}</p>
        </div>

        <AnimatePresence mode="wait">
          {/* Email Verification View */}
          {view === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleBackToSignup} className="h-8 w-8">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-xl">Verify Email</CardTitle>
                  </div>
                  <CardDescription>
                    Enter the 6-digit code sent to <span className="font-medium text-foreground">{email || pendingVerification}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {demoOtp && (
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Demo Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your verification code is: <span className="font-mono font-bold text-foreground text-lg">{demoOtp}</span>
                      </p>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button onClick={handleVerify} className="w-full" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : 'Verify Email'}
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?{' '}
                      <button onClick={handleResendOtp} disabled={isLoading} className="text-primary hover:underline font-medium disabled:opacity-50">
                        Resend
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Forgot Password View */}
          {view === 'forgot-password' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleBackToLogin} className="h-8 w-8">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-xl">Forgot Password</CardTitle>
                  </div>
                  <CardDescription>
                    Enter your email and we'll send you a reset code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : 'Send Reset Code'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Reset Password View */}
          {view === 'reset-password' && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleBackToLogin} className="h-8 w-8">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                  </div>
                  <CardDescription>
                    Enter the code sent to <span className="font-medium text-foreground">{email || pendingPasswordReset}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {demoOtp && (
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <KeyRound className="h-4 w-4" />
                        <span className="text-sm font-medium">Demo Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your reset code is: <span className="font-mono font-bold text-foreground text-lg">{demoOtp}</span>
                      </p>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Min. 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                  <Button onClick={handleResetPassword} className="w-full" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Resetting...</> : 'Reset Password'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Login/Signup View */}
          {(view === 'login' || view === 'signup') && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 shadow-xl">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-xl">
                    {view === 'signup' ? 'Create Account' : 'Welcome back'}
                  </CardTitle>
                  <CardDescription>
                    {view === 'signup' 
                      ? 'Sign up as a customer to get started' 
                      : 'Choose a login method to continue'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {view === 'login' ? (
                    <Tabs defaultValue="demo" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="demo">Quick Demo</TabsTrigger>
                        <TabsTrigger value="credentials">Credentials</TabsTrigger>
                      </TabsList>

                      <TabsContent value="demo" className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          Select a role to instantly access the dashboard:
                        </p>
                        {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                          const config = roleConfig[role];
                          const Icon = config.icon;
                          return (
                            <motion.div key={role} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant="outline"
                                className="w-full h-14 justify-between group hover:border-primary/50"
                                onClick={() => handleQuickLogin(role)}
                                disabled={loadingRole !== null}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
                                    <Icon className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="text-left">
                                    <div className="font-medium">{config.label}</div>
                                    <div className="text-xs text-muted-foreground">{config.email}</div>
                                  </div>
                                </div>
                                {loadingRole === role ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </Button>
                            </motion.div>
                          );
                        })}
                      </TabsContent>

                      <TabsContent value="credentials" className="space-y-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                              <button
                                type="button"
                                onClick={() => { setView('forgot-password'); clearErrors(); }}
                                className="text-xs text-primary hover:underline"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                          </div>

                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
                          </Button>
                        </form>

                        <SocialLoginButtons />

                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mt-4">Demo credentials:</p>
                          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {(Object.keys(roleConfig) as UserRole[]).map((role) => (
                              <p key={role}>
                                <span className="font-medium">{roleConfig[role].label}:</span>{' '}
                                {roleConfig[role].email} / {roleConfig[role].password}
                              </p>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="space-y-4">
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              type="text"
                              placeholder="John Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-password"
                              type="password"
                              placeholder="Min. 6 characters"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : 'Create Account'}
                        </Button>
                      </form>

                      <SocialLoginButtons />

                      <p className="text-xs text-center text-muted-foreground">
                        By signing up, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-center text-muted-foreground">
                      {view === 'signup' ? (
                        <>
                          Already have an account?{' '}
                          <button onClick={() => { setView('login'); clearErrors(); }} className="text-primary hover:underline font-medium">
                            Sign in
                          </button>
                        </>
                      ) : (
                        <>
                          Don't have an account?{' '}
                          <button onClick={() => { setView('signup'); clearErrors(); }} className="text-primary hover:underline font-medium">
                            Sign up
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help?{' '}
          <a href="#" className="text-primary hover:underline">Contact Support</a>
        </p>
      </motion.div>
    </div>
  );
}
