import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, Clock, CheckCircle, Calendar, Smartphone, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockEmiSchedule } from "@/data/mockData";
import { toast } from "sonner";
import { format, differenceInDays, addDays } from "date-fns";

interface ScheduledReminder {
  id: string;
  emiNo: number;
  dueDate: Date;
  reminderDate: Date;
  status: 'scheduled' | 'sent' | 'dismissed';
  amount: number;
}

export function EmiReminderSettings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("+91 98765 43210");
  const [showWhatsappSetup, setShowWhatsappSetup] = useState(false);
  const [reminderDays, setReminderDays] = useState([3]);
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>([]);

  // Generate scheduled reminders based on upcoming EMIs
  useEffect(() => {
    const upcomingEmis = mockEmiSchedule.filter(e => e.status === 'upcoming' || e.status === 'due');
    const reminders: ScheduledReminder[] = upcomingEmis.map(emi => ({
      id: `reminder-${emi.id}`,
      emiNo: emi.installmentNo,
      dueDate: emi.dueDate,
      reminderDate: addDays(emi.dueDate, -reminderDays[0]),
      status: 'scheduled' as const,
      amount: emi.total
    }));
    setScheduledReminders(reminders);
  }, [reminderDays]);

  const handleTestNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('EMI Reminder Test', {
            body: 'Your EMI of ₹15,500 is due in 3 days. Tap to pay now.',
            icon: '/pwa/icon-192.png',
            badge: '/pwa/icon-192.png'
          });
          toast.success("Test notification sent!");
        } else {
          toast.error("Please enable notifications in your browser settings");
        }
      });
    } else {
      toast.info("Push notifications are not supported in this browser");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: ScheduledReminder['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
      case 'sent':
        return <Badge className="bg-emerald-500/10 text-emerald-500"><CheckCircle className="h-3 w-3 mr-1" /> Sent</Badge>;
      case 'dismissed':
        return <Badge variant="outline">Dismissed</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <BellRing className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <CardTitle>EMI Reminder Settings</CardTitle>
              <CardDescription>Never miss an EMI payment with timely reminders</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Channels */}
        <div className="space-y-4">
          <p className="font-medium text-sm">Notification Channels</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Get instant alerts on your device</p>
                </div>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <polyline points="3,7 12,13 21,7" />
                </svg>
                <div>
                  <p className="font-medium">Email Reminders</p>
                  <p className="text-xs text-muted-foreground">Receive reminders via email</p>
                </div>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-xs text-muted-foreground">Get SMS reminders (charges may apply)</p>
                </div>
              </div>
              <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
            </div>
            {/* WhatsApp Channel */}
            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      WhatsApp Notifications
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Popular</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {whatsappEnabled ? whatsappNumber : "Get instant WhatsApp alerts"}
                    </p>
                  </div>
                </div>
                <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
              </div>
              {whatsappEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-emerald-500/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-xs text-muted-foreground">
                      Linked: <span className="font-medium text-foreground">{whatsappNumber}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-emerald-600"
                      onClick={() => {
                        toast.success("WhatsApp verified!", {
                          description: "You will receive EMI reminders on WhatsApp."
                        });
                      }}
                    >
                      Test Message
                    </Button>
                  </div>
                  <div className="mt-2 p-2 rounded bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400">
                    <p className="font-medium mb-1">You'll receive:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                      <li>EMI due reminders ({reminderDays[0]} days before)</li>
                      <li>Payment confirmation receipts</li>
                      <li>Loan closure & NOC updates</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Reminder Timing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Remind Me Before</p>
              <p className="text-xs text-muted-foreground">Days before EMI due date</p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {reminderDays[0]} {reminderDays[0] === 1 ? 'day' : 'days'}
            </Badge>
          </div>
          <Slider
            value={reminderDays}
            onValueChange={setReminderDays}
            min={1}
            max={7}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 day</span>
            <span>3 days</span>
            <span>7 days</span>
          </div>
        </div>

        {/* Test Notification */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleTestNotification}
        >
          <Bell className="h-4 w-4 mr-2" />
          Send Test Notification
        </Button>

        {/* Scheduled Reminders */}
        <div className="space-y-3">
          <p className="font-medium text-sm">Upcoming Reminders</p>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              <AnimatePresence>
                {scheduledReminders.map((reminder, index) => {
                  const daysUntilReminder = differenceInDays(reminder.reminderDate, new Date());
                  const isUpcoming = daysUntilReminder >= 0 && daysUntilReminder <= 7;
                  
                  return (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border ${isUpcoming ? 'bg-amber-500/5 border-amber-500/20' : 'bg-card'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                            isUpcoming ? 'bg-amber-500/10 text-amber-500' : 'bg-muted'
                          }`}>
                            {reminder.emiNo}
                          </div>
                          <div>
                            <p className="font-medium">EMI #{reminder.emiNo}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {format(reminder.dueDate, 'dd MMM yyyy')} • {formatCurrency(reminder.amount)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {daysUntilReminder < 0 
                              ? 'Reminder sent'
                              : daysUntilReminder === 0 
                                ? 'Today'
                                : `In ${daysUntilReminder} days`
                            }
                          </p>
                          {getStatusBadge(reminder.status)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Info */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Reminders are sent {reminderDays[0]} days before your EMI due date at 9:00 AM. 
              You'll receive notifications through your enabled channels.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
