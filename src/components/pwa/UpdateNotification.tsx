import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Listen for service worker updates
      const handleControllerChange = () => {
        setShowUpdate(true);
      };

      navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

      // Check for updates periodically
      const checkForUpdates = async () => {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            setRegistration(reg);
            await reg.update();
            
            if (reg.waiting) {
              setShowUpdate(true);
            }

            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    setShowUpdate(true);
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error("Error checking for updates:", error);
        }
      };

      checkForUpdates();

      // Check for updates every 30 minutes
      const interval = setInterval(checkForUpdates, 30 * 60 * 1000);

      return () => {
        navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
        clearInterval(interval);
      };
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[calc(100%-2rem)]"
        >
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center gap-4">
            <div className="p-2 bg-primary-foreground/20 rounded-full">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Update Available</p>
              <p className="text-xs opacity-80">A new version is ready to install</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleUpdate}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Update
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 w-8 hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;
