import { useOnlineStatus } from "@/hooks/useOfflineSync";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const OfflineIndicator = () => {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      // Simulate sync
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setTimeout(() => setShowReconnected(false), 2000);
      }, 1500);
    }
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-amber-600 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg"
        >
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline. Some features may be limited.</span>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-emerald-600 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Syncing your data...</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Back online! Your data is synced.</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Compact version for dashboard headers
export const OfflineBadge = () => {
  const { isOnline } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
      <WifiOff className="h-3 w-3" />
      <span>Offline</span>
    </div>
  );
};

export default OfflineIndicator;
