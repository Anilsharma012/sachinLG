import { useState, useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingInstallButtonProps {
  role: "customer" | "agent" | "admin" | "superadmin";
}

export const FloatingInstallButton = ({ role }: FloatingInstallButtonProps) => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();
  const [showButton, setShowButton] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkDismissed = localStorage.getItem(`floating-install-dismissed-${role}`);
    if (checkDismissed) {
      setDismissed(true);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowButton(scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [role]);

  const handleInstall = async () => {
    if (isIOS) {
      window.location.href = `/install/${role}`;
    } else if (isInstallable) {
      const success = await installApp();
      if (success) {
        setDismissed(true);
      }
    } else {
      window.location.href = `/install/${role}`;
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(`floating-install-dismissed-${role}`, "true");
  };

  if (isInstalled || dismissed || !showButton) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        <Button
          onClick={handleInstall}
          size="lg"
          className="rounded-full shadow-lg shadow-primary/30 gap-2 px-6"
        >
          <Download className="h-5 w-5" />
          Install App
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDismiss}
          className="rounded-full h-10 w-10 bg-background/80 backdrop-blur"
        >
          ×
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingInstallButton;
