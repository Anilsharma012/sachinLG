import { useState, useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Smartphone, Zap, Bell, Wifi } from "lucide-react";
import { motion } from "framer-motion";

interface InstallPromptModalProps {
  role: "customer" | "agent" | "admin" | "superadmin";
}

const roleConfig = {
  customer: {
    title: "Install LoanCloud",
    description: "Get the best experience with our mobile app",
    gradient: "from-sky-500 to-blue-600",
  },
  agent: {
    title: "Install LoanAgent",
    description: "Manage your leads faster with our app",
    gradient: "from-emerald-500 to-green-600",
  },
  admin: {
    title: "Install Admin Portal",
    description: "Full admin control at your fingertips",
    gradient: "from-violet-500 to-purple-600",
  },
  superadmin: {
    title: "Install SuperAdmin",
    description: "Monitor your platform on the go",
    gradient: "from-amber-500 to-orange-600",
  },
};

const features = [
  { icon: Zap, text: "Faster load times" },
  { icon: Bell, text: "Push notifications" },
  { icon: Wifi, text: "Works offline" },
];

export const InstallPromptModal = ({ role }: InstallPromptModalProps) => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();
  const [open, setOpen] = useState(false);

  const config = roleConfig[role];
  const storageKey = `pwa-modal-shown-${role}`;

  useEffect(() => {
    // Check if modal was already shown
    const wasShown = localStorage.getItem(storageKey);
    if (wasShown || isInstalled) {
      return;
    }

    // Show modal after a delay on first visit
    const timer = setTimeout(() => {
      setOpen(true);
      localStorage.setItem(storageKey, "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, [role, isInstalled, storageKey]);

  const handleInstall = async () => {
    if (isIOS) {
      window.location.href = `/install/${role}`;
    } else if (isInstallable) {
      const success = await installApp();
      if (success) {
        setOpen(false);
      }
    } else {
      window.location.href = `/install/${role}`;
    }
  };

  const handleSkip = () => {
    setOpen(false);
  };

  if (isInstalled) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-4`}
          >
            <Smartphone className="h-8 w-8 text-white" />
          </motion.div>
          <DialogTitle className="text-xl">{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                <feature.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleInstall}
            className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90`}
          >
            <Download className="h-4 w-4 mr-2" />
            Install Now
          </Button>
          <Button variant="ghost" onClick={handleSkip} className="w-full">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstallPromptModal;
