import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { usePushNotifications, useNotificationPreferences } from "@/hooks/useOfflineSync";
import { 
  Bell, BellOff, BellRing, Check, AlertCircle, 
  CreditCard, Users, Megaphone, Calendar, Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const NotificationSettings = () => {
  const { 
    isSupported, 
    isSubscribed, 
    permission, 
    isLoading, 
    subscribe, 
    unsubscribe,
    showLocalNotification 
  } = usePushNotifications();
  
  const { preferences, updatePreferences } = useNotificationPreferences();

  const handleSubscribe = async () => {
    const subscription = await subscribe();
    if (subscription) {
      toast.success("Push notifications enabled!", {
        description: "You'll receive reminders for EMIs and follow-ups"
      });
    } else if (permission === 'denied') {
      toast.error("Notifications blocked", {
        description: "Please enable notifications in your browser settings"
      });
    }
  };

  const handleUnsubscribe = async () => {
    const success = await unsubscribe();
    if (success) {
      toast.success("Push notifications disabled");
    }
  };

  const testNotification = async () => {
    await showLocalNotification("Test Notification", {
      body: "This is how your notifications will appear!",
      tag: "test-notification",
    });
  };

  return (
    <div className="space-y-6">
      {/* Push Notification Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Push Notifications</CardTitle>
                <CardDescription>Receive real-time alerts on your device</CardDescription>
              </div>
            </div>
            {isSubscribed ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                <Check className="h-3 w-3 mr-1" /> Enabled
              </Badge>
            ) : (
              <Badge variant="secondary">
                <BellOff className="h-3 w-3 mr-1" /> Disabled
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isSupported ? (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Not Supported</p>
                <p className="text-sm opacity-80">Your browser doesn't support push notifications. Try using Chrome or Edge.</p>
              </div>
            </div>
          ) : permission === 'denied' ? (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Notifications Blocked</p>
                <p className="text-sm opacity-80">Please enable notifications in your browser settings to receive alerts.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              {isSubscribed ? (
                <>
                  <Button variant="outline" onClick={testNotification} className="gap-2">
                    <BellRing className="h-4 w-4" /> Test Notification
                  </Button>
                  <Button variant="destructive" onClick={handleUnsubscribe} disabled={isLoading} className="gap-2">
                    <BellOff className="h-4 w-4" /> Disable Notifications
                  </Button>
                </>
              ) : (
                <Button onClick={handleSubscribe} disabled={isLoading} className="gap-2">
                  <Bell className="h-4 w-4" /> Enable Push Notifications
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* EMI Reminders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <Label htmlFor="emi-reminders" className="font-medium">EMI Payment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded before EMI due dates</p>
                </div>
              </div>
              <Switch
                id="emi-reminders"
                checked={preferences.emiReminders}
                onCheckedChange={(checked) => updatePreferences({ emiReminders: checked })}
              />
            </div>
            
            {preferences.emiReminders && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-12 space-y-2"
              >
                <Label className="text-sm text-muted-foreground">
                  Remind me {preferences.emiReminderDays} days before due date
                </Label>
                <Slider
                  value={[preferences.emiReminderDays]}
                  onValueChange={([value]) => updatePreferences({ emiReminderDays: value })}
                  min={1}
                  max={7}
                  step={1}
                  className="w-full max-w-xs"
                />
                <div className="flex justify-between text-xs text-muted-foreground max-w-xs">
                  <span>1 day</span>
                  <span>7 days</span>
                </div>
              </motion.div>
            )}
          </div>

          <Separator />

          {/* Lead Follow-ups */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <Label htmlFor="lead-followups" className="font-medium">Lead Follow-up Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about scheduled follow-ups</p>
              </div>
            </div>
            <Switch
              id="lead-followups"
              checked={preferences.leadFollowUps}
              onCheckedChange={(checked) => updatePreferences({ leadFollowUps: checked })}
            />
          </div>

          <Separator />

          {/* Payment Confirmations */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <Label htmlFor="payment-confirmations" className="font-medium">Payment Confirmations</Label>
                <p className="text-sm text-muted-foreground">Receive confirmation when payments are processed</p>
              </div>
            </div>
            <Switch
              id="payment-confirmations"
              checked={preferences.paymentConfirmations}
              onCheckedChange={(checked) => updatePreferences({ paymentConfirmations: checked })}
            />
          </div>

          <Separator />

          {/* Marketing Updates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Megaphone className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <Label htmlFor="marketing-updates" className="font-medium">Promotional Updates</Label>
                <p className="text-sm text-muted-foreground">New offers, discounts, and announcements</p>
              </div>
            </div>
            <Switch
              id="marketing-updates"
              checked={preferences.marketingUpdates}
              onCheckedChange={(checked) => updatePreferences({ marketingUpdates: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Install App Hint */}
      {!window.matchMedia('(display-mode: standalone)').matches && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Install the app for best experience</p>
                <p className="text-xs text-muted-foreground">Get reliable notifications even when the browser is closed</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/install">Install</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationSettings;
