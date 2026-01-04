import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, Wallet, Building2, Crown, ArrowRight, Smartphone, 
  Download, Zap, Shield, Bell
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const portals = [
  {
    id: "customer",
    title: "Customer App",
    description: "Track loans, pay EMIs, manage documents",
    icon: Wallet,
    color: "sky",
    gradient: "from-sky-500 to-sky-600",
    bgLight: "bg-sky-500/10",
    textColor: "text-sky-400",
    link: "/install/customer",
    features: ["Loan tracking", "EMI payments", "Documents"],
  },
  {
    id: "agent",
    title: "Agent App",
    description: "Manage leads, track commission, assist customers",
    icon: Users,
    color: "emerald",
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    link: "/install/agent",
    features: ["Lead pipeline", "Commission", "Quick actions"],
  },
  {
    id: "admin",
    title: "Admin App",
    description: "Organization management, reports, settings",
    icon: Building2,
    color: "violet",
    gradient: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-500/10",
    textColor: "text-violet-400",
    link: "/install/admin",
    features: ["Org control", "Reports", "User management"],
  },
  {
    id: "superadmin",
    title: "SuperAdmin App",
    description: "Platform-wide control and monitoring",
    icon: Crown,
    color: "amber",
    gradient: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-500/10",
    textColor: "text-amber-400",
    link: "/install/superadmin",
    features: ["Multi-tenant", "System health", "Global settings"],
  },
];

const InstallHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/30 mb-6">
            <Smartphone className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Install LoanCloud
          </h1>
          <p className="text-slate-400 text-lg">
            Choose your portal and install the app for the best experience
          </p>
        </motion.div>
      </div>

      {/* Benefits */}
      <div className="px-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Zap, text: "Faster access" },
              { icon: Bell, text: "Push notifications" },
              { icon: Shield, text: "Secure & offline ready" },
              { icon: Download, text: "Auto updates" },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <benefit.icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-slate-300">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Portal Cards */}
      <div className="px-6 pb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link to={portal.link}>
                <Card className="group border-0 bg-white/5 backdrop-blur hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                        <portal.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-lg">{portal.title}</h3>
                          <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{portal.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {portal.features.map((feature) => (
                            <Badge 
                              key={feature} 
                              variant="secondary" 
                              className={`text-xs ${portal.bgLight} ${portal.textColor} border-0`}
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-sm text-slate-500 mb-4">
          Works on all devices • iOS, Android & Desktop
        </p>
        <Link to="/auth">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            Continue in Browser
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InstallHub;
