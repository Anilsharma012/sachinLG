import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, signupSchema, loginSchema } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

// Social icons
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

type AuthView = 'login' | 'signup' | 'verify';

export default function CustomerAuth() {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { 
    login, 
    signup, 
    verifyEmail, 
    resendOtp, 
    loginWithSocial,
    isAuthenticated, 
    user,
    pendingVerification,
    clearPendingVerification
  } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for pending verification
  useEffect(() => {
    if (pendingVerification && view !== 'verify') {
      setEmail(pendingVerification);
      setView('verify');
    }
  }, [pendingVerification, view]);

  // Redirect if already authenticated as customer
  if (isAuthenticated && user?.role === 'customer') {
    navigate('/customer', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have been logged in successfully.',
      });
      navigate('/customer', { replace: true });
    } else {
      toast({
        title: 'Login Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = signupSchema.safeParse({ name, email, password });
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    const result = await signup(name, email, password);
    setIsLoading(false);

    if (result.success) {
      setDemoOtp(result.otp || null);
      setView('verify');
      toast({
        title: 'Verification Required',
        description: 'Please enter the verification code sent to your email.',
      });
    } else {
      toast({
        title: 'Signup Failed',
        description: result.error,
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
    const result = await verifyEmail(email || pendingVerification || '', otp);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Email Verified!',
        description: 'Your account has been created successfully.',
      });
      setDemoOtp(null);
      navigate('/customer', { replace: true });
    } else {
      toast({
        title: 'Verification Failed',
        description: result.error,
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

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    const result = await loginWithSocial(provider);
    setSocialLoading(null);

    if (result.success) {
      toast({
        title: 'Welcome!',
        description: `Logged in with ${provider === 'google' ? 'Google' : 'GitHub'}.`,
      });
      navigate('/customer', { replace: true });
    } else {
      toast({
        title: 'Login Failed',
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
        <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={socialLoading !== null} className="h-11">
          {socialLoading === 'google' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><GoogleIcon /><span className="ml-2">Google</span></>}
        </Button>
        <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={socialLoading !== null} className="h-11">
          {socialLoading === 'github' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><GitHubIcon /><span className="ml-2">GitHub</span></>}
        </Button>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title={view === 'verify' ? 'Verify Your Email' : view === 'login' ? 'Customer Login' : 'Create Account'}
      subtitle={view === 'verify' ? 'Enter the code sent to your email' : view === 'login' ? 'Access your loan dashboard' : 'Start your loan journey'}
      imagePosition={view === 'signup' ? 'left' : 'right'}
      roleColor="from-blue-600 to-blue-800"
      roleIcon={<User className="h-12 w-12" />}
      roleLabel="Customer"
    >
      <Card className="border-border/50 shadow-xl">
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {view === 'verify' ? (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Button variant="ghost" size="sm" onClick={handleBackToSignup} className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                {demoOtp && (
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-2 text-accent mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Demo OTP</span>
                    </div>
                    <code className="text-lg font-mono">{demoOtp}</code>
                  </div>
                )}

                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} className="h-12 w-12" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button onClick={handleVerify} className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify Email'}
                </Button>

                <Button variant="ghost" onClick={handleResendOtp} disabled={isLoading} className="w-full">
                  Resend Code
                </Button>
              </motion.div>
            ) : (
              <Tabs value={view} onValueChange={(v) => setView(v as AuthView)}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <motion.form
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleLogin}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-12" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
                    </Button>

                    <SocialLoginButtons />

                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Email:</span> <code className="text-foreground">customer@loanagent.com</code></p>
                        <p><span className="text-muted-foreground">Password:</span> <code className="text-foreground">customer123</code></p>
                      </div>
                    </div>
                  </motion.form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <motion.form
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleSignup}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-name" placeholder="Priya Patel" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11" />
                      </div>
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Minimum 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</> : 'Create Account'}
                    </Button>

                    <SocialLoginButtons />
                  </motion.form>
                </TabsContent>
              </Tabs>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
