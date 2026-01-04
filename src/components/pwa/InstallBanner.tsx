import { useState, useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InstallBannerProps {
  role: "customer" | "agent" | "admin" | "superadmin";
}

const roleConfig = {
  customer: {
    title: "Install LoanCloud",
    description: "Get faster access to your loans",
    gradient: "from-sky-600 to-sky-700",
    installUrl: "/install/customer",
  },
  agent: {
    title: "Install LoanAgent",
    description: "Manage leads on the go",
    gradient: "from-emerald-600 to-emerald-700",
    installUrl: "/install/agent",
  },
  admin: {
    title: "Install Admin Portal",
    description: "Full control from anywhere",
    gradient: "from-violet-600 to-violet-700",
    installUrl: "/install/admin",
  },
  superadmin: {
    title: "Install SuperAdmin",
    description: "Platform monitoring on the go",
    gradient: "from-amber-600 to-amber-700",
    installUrl: "/install/superadmin",
  },
};

export const InstallBanner = ({ role }: InstallBannerProps) => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const config = roleConfig[role];

  useEffect(() => {
    // Check if user has dismissed the banner before
    const isDismissed = localStorage.getItem(`pwa-banner-dismissed-${role}`);
    if (isDismissed) {
      setDismissed(true);
    }

    // Show banner after a short delay for better UX
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [role]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(`pwa-banner-dismissed-${role}`, "true");
  };

  const handleInstall = async () => {
    if (isIOS) {
      window.location.href = config.installUrl;
    } else {
      const success = await installApp();
      if (success) {
        setDismissed(true);
      }
    }
  };

  // Don't show if already installed, dismissed, or not ready
  if (isInstalled || dismissed || !showBanner) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative bg-gradient-to-r ${config.gradient} rounded-lg p-4 mb-4 shadow-lg`}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-white/80" />
        </button>

        <div className="flex items-center gap-4 pr-6">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm">{config.title}</h4>
            <p className="text-white/80 text-xs">{config.description}</p>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleInstall}
            className="shrink-0 bg-white text-slate-900 hover:bg-white/90 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Install</span>
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallBanner;
