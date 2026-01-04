import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, Smartphone, CheckCircle2, Shield, Bell, Zap, 
  Settings, ArrowRight, Share, Plus, MoreVertical, Building2
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const InstallAdmin = () => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();

  const features = [
    { icon: Building2, title: "Org Management", description: "Manage your organization" },
    { icon: Settings, title: "Full Control", description: "Configure all settings" },
    { icon: Bell, title: "Real-time Alerts", description: "Stay updated instantly" },
    { icon: Shield, title: "Enterprise Security", description: "Advanced access controls" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-2xl shadow-violet-500/30 mb-6">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <Badge className="mb-4 bg-violet-500/20 text-violet-400 border-violet-500/30">
            Admin Portal
          </Badge>
          <h1 className="text-3xl font-bold text-white mb-2">LoanCloud Admin</h1>
          <p className="text-violet-200/70">Manage your lending organization</p>
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
                  <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">App Installed!</h3>
                  <p className="text-slate-400 mb-6">Admin Portal is ready on your device</p>
                  <Link to="/auth">
                    <Button className="w-full bg-violet-600 hover:bg-violet-700">
                      Open Admin Portal <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : isIOS ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Install on iPhone/iPad</h3>
                    <p className="text-slate-400 text-sm">Follow these steps to install</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
                      <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">1</div>
                      <div>
                        <p className="text-white font-medium">Tap the Share button</p>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <Share className="h-4 w-4" /> at the bottom of Safari
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
                      <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">2</div>
                      <div>
                        <p className="text-white font-medium">Select "Add to Home Screen"</p>
                        <p className="text-slate-400 text-sm flex items-center gap-1">
                          <Plus className="h-4 w-4" /> from the menu
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50">
                      <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">3</div>
                      <div>
                        <p className="text-white font-medium">Tap "Add" to confirm</p>
                        <p className="text-slate-400 text-sm">The app will appear on your home screen</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="text-center py-4">
                  <Download className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Install Admin Portal</h3>
                  <p className="text-slate-400 text-sm mb-6">Get the full app experience on your device</p>
                  <Button 
                    onClick={installApp}
                    className="w-full bg-violet-600 hover:bg-violet-700 gap-2"
                    size="lg"
                  >
                    <Download className="h-5 w-5" /> Install App
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Smartphone className="h-12 w-12 text-violet-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Install Admin Portal</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Open in Chrome or Edge, then use the browser menu
                    <MoreVertical className="h-4 w-4 inline ml-1" />
                  </p>
                  <Link to="/auth">
                    <Button variant="outline" className="w-full border-violet-500/30 text-violet-400 hover:bg-violet-500/10">
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
        <h4 className="text-sm font-semibold text-violet-400 uppercase tracking-wide mb-4">Features</h4>
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
                  <feature.icon className="h-6 w-6 text-violet-400 mb-2" />
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

export default InstallAdmin;
