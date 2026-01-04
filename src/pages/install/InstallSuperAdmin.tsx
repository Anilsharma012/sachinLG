import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, Smartphone, CheckCircle2, Shield, Bell, Zap, 
  Crown, ArrowRight, Share, Plus, MoreVertical, Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const InstallSuperAdmin = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();

  const features = [
    { icon: Globe, title: "Multi-tenant Control", description: "Manage all organizations" },
    { icon: Shield, title: "Platform Security", description: "Monitor system-wide security" },
    { icon: Bell, title: "Critical Alerts", description: "Real-time system notifications" },
    { icon: Zap, title: "System Health", description: "Monitor API & services" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-2xl shadow-amber-500/30 mb-6">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
            SuperAdmin Portal
          </Badge>
          <h1 className="text-3xl font-bold text-white mb-2">LoanCloud CEO</h1>
          <p className="text-amber-200/70">Platform-wide control center</p>
        </motion.div>
      </div>

      {/* Install Card */}
      <div className="px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              {isInstalled ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">App Installed!</h3>
                  <p className="text-slate-400 mb-6">SuperAdmin Portal is ready</p>
                  <Link to="/auth">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      Open SuperAdmin <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : isIOS ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Install on iPhone/iPad</h3>
                    <p className="text-slate-400 text-sm">Follow these steps to install</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">1</div>
                      <div>
                        <p className="text-white font-medium">Tap the Share button</p>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <Share className="h-4 w-4" /> at the bottom of Safari
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">2</div>
                      <div>
                        <p className="text-white font-medium">Select "Add to Home Screen"</p>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <Plus className="h-4 w-4" /> from the menu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">3</div>
                      <div>
                        <p className="text-white font-medium">Tap "Add" to confirm</p>
                        <p className="text-slate-400 text-sm">The app will appear on your home screen</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="text-center py-4">
                  <Download className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Install SuperAdmin</h3>
                  <p className="text-slate-400 text-sm mb-6">Get the full app experience on your device</p>
                  <Button 
                    onClick={installApp}
                    className="w-full bg-amber-600 hover:bg-amber-700 gap-2"
                    size="lg"
                  >
                    <Download className="h-5 w-5" /> Install App
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Smartphone className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Install SuperAdmin</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Open in Chrome or Edge, then use the browser menu
                    <MoreVertical className="h-4 w-4 inline ml-1" />
                  </p>
                  <Link to="/auth">
                    <Button variant="outline" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                      Continue in Browser <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-6 py-8">
        <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-4">Features</h4>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="border-0 bg-white/5 backdrop-blur h-full">
                <CardContent className="p-4">
                  <feature.icon className="h-6 w-6 text-amber-400 mb-2" />
                  <h5 className="font-medium text-white text-sm">{feature.title}</h5>
                  <p className="text-xs text-slate-400 mt-1">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-slate-500">
          App auto-updates when new versions are available
        </p>
      </div>
    </div>
  );
};

export default InstallSuperAdmin;
