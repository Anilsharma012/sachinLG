import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  ArrowRight,
  Shield,
  Zap,
  Users,
  BarChart3,
  FileCheck,
  CreditCard,
  CheckCircle2,
  Star,
  Play,
  Phone,
  Mail,
  MapPin,
  Clock,
  TrendingUp,
  Landmark,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import images
import heroDashboard from "@/assets/hero-dashboard.png";
import loanLifecycle3d from "@/assets/loan-lifecycle-3d.png";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";

const features = [
  {
    icon: Users,
    title: "Multi-Tenant SaaS",
    description: "Support multiple loan agencies with complete data isolation and custom branding.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: FileCheck,
    title: "Complete KYC Flow",
    description: "Digital KYC with Aadhaar/PAN verification, document approval workflows.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: CreditCard,
    title: "EMI Management",
    description: "Automated EMI scheduling, payment tracking, reminders, and receipt generation.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Real-time dashboards, collection reports, agent performance analytics.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description: "Auto-assign agents, document reminders, overdue alerts, and NOC generation.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Role-based access, audit logs, encrypted data, and regulatory compliance.",
    color: "from-rose-500 to-rose-600",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Director, Vikram Finance",
    content: "LoanAgent transformed our operations. We went from managing 50 files to 500+ with the same team. The automation is incredible!",
    rating: 5,
    image: testimonial1,
  },
  {
    name: "Rajesh Kumar",
    role: "CEO, FinServe Partners",
    content: "The automated EMI tracking and collection reports save us 20+ hours every week. Best investment we made.",
    rating: 5,
    image: testimonial2,
  },
  {
    name: "Meera Patel",
    role: "Founder, QuickLoans India",
    content: "Best loan management software we've used. Customer support is exceptional and the features are exactly what we needed.",
    rating: 5,
    image: testimonial3,
  },
];

const stats = [
  { value: "₹500Cr+", label: "Loans Processed", icon: TrendingUp },
  { value: "50K+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Loan Agencies", icon: Landmark },
  { value: "99.9%", label: "System Uptime", icon: Clock },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₹2,999",
    period: "/month",
    description: "Perfect for small agencies",
    features: [
      "Up to 100 loan files",
      "3 team members",
      "Basic KYC verification",
      "EMI tracking",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹7,999",
    period: "/month",
    description: "Most popular for growing agencies",
    features: [
      "Up to 500 loan files",
      "10 team members",
      "Advanced KYC with Aadhaar",
      "Automated reminders",
      "Priority support",
      "Custom branding",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹19,999",
    period: "/month",
    description: "For large scale operations",
    features: [
      "Unlimited loan files",
      "Unlimited team members",
      "Full API access",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
    popular: false,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [loginRole, setLoginRole] = useState<"admin" | "agent" | "customer">("admin");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${loginRole}`);
  };

  const handleSignup = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">LoanAgent</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Testimonials</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Contact</a>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Sign In
              </Button>
              <Button
                className="gradient-accent text-accent-foreground hidden sm:flex"
                onClick={handleSignup}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative">
          <div className="container mx-auto px-4 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6 border border-accent/30">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Trusted by 500+ Loan Agencies</span>
                </div>
                
                <div className="relative mb-6">
                  <img 
                    src={loanLifecycle3d} 
                    alt="Complete Loan Lifecycle Management System - Lead Capture, KYC, Loan Approval, EMI Payments, NOC" 
                    className="w-full max-w-lg rounded-2xl shadow-2xl"
                  />
                </div>
                
                <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl">
                  End-to-end loan lifecycle management for agents, DSAs, and NBFCs. 
                  From lead capture to NOC - manage everything in one powerful platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="gradient-accent text-accent-foreground shadow-lg hover:shadow-xl transition-all group"
                    onClick={handleSignup}
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 group"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-center lg:text-left"
                    >
                      <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                      <p className="text-sm text-primary-foreground/60">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Login Card */}
              <motion.div
                id="login-section"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-3xl" />
                <Card className="relative shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Sign in to access your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="admin" onValueChange={(v) => setLoginRole(v as typeof loginRole)}>
                      <TabsList className="grid grid-cols-3 mb-6 bg-muted/50">
                        <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin
                        </TabsTrigger>
                        <TabsTrigger value="agent" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                          <Users className="h-4 w-4 mr-2" />
                          Agent
                        </TabsTrigger>
                        <TabsTrigger value="customer" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Customer
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value={loginRole}>
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder={`${loginRole}@loanagent.com`}
                              defaultValue={`${loginRole}@loanagent.com`}
                              className="h-12"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                              <Link to="/auth" className="text-sm text-accent hover:underline">
                                Forgot password?
                              </Link>
                            </div>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              defaultValue="password123"
                              className="h-12"
                            />
                          </div>
                          <Button type="submit" className="w-full h-12 gradient-primary text-lg font-semibold">
                            Sign In as {loginRole.charAt(0).toUpperCase() + loginRole.slice(1)}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                      Don't have an account?{" "}
                      <Link to="/auth" className="text-accent hover:underline font-semibold">
                        Start free trial
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative -mt-10 pb-20"
        >
          <div className="container mx-auto px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <img 
                src={heroDashboard} 
                alt="LoanAgent Dashboard Preview" 
                className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Loans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed for loan DSAs, agents, and NBFCs to streamline their entire lending operations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 group hover:-translate-y-1">
                  <CardHeader>
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Streamlined Loan Lifecycle
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From lead generation to loan closure and NOC issuance - we've got every step covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Lead Capture", desc: "Capture leads from multiple sources with smart forms", icon: Users, color: "from-blue-500 to-blue-600" },
              { step: "2", title: "KYC & Docs", desc: "Digital KYC with Aadhaar/PAN verification", icon: FileCheck, color: "from-emerald-500 to-emerald-600" },
              { step: "3", title: "Approval", desc: "Quick approval workflow with disbursement", icon: CheckCircle2, color: "from-purple-500 to-purple-600" },
              { step: "4", title: "EMI & Closure", desc: "Automated EMI tracking to NOC generation", icon: Receipt, color: "from-orange-500 to-orange-600" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-accent text-accent-foreground font-bold text-sm flex items-center justify-center shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-medium">Simple Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start with a 14-day free trial. No credit card required.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? 'border-accent shadow-xl scale-105' : 'border-border/50'}`}>
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="pt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'gradient-accent text-accent-foreground' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={handleSignup}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Customer Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Leading Agencies
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our customers have to say about LoanAgent
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl gradient-hero p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Loan Business?
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
                Join 500+ loan agencies who have already streamlined their operations with LoanAgent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gradient-accent text-accent-foreground shadow-lg group"
                  onClick={handleSignup}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Schedule Demo
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions? Our team is here to help you get started with LoanAgent.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">support@loanagent.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>We'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" type="email" placeholder="john@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      placeholder="Tell us about your requirements..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>
                  <Button className="w-full gradient-accent text-accent-foreground">
                    Send Message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-xl font-bold">LoanAgent</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete loan management platform for modern lending businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 LoanAgent. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
