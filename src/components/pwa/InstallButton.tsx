import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Link } from "react-router-dom";

interface InstallButtonProps {
  role: "customer" | "agent" | "admin" | "superadmin";
}

export const InstallButton = ({ role }: InstallButtonProps) => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWA();

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS) {
      window.location.href = `/install/${role}`;
    } else if (isInstallable) {
      await installApp();
    } else {
      window.location.href = `/install/${role}`;
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleInstall}
      className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Install App</span>
    </Button>
  );
};

export default InstallButton;
