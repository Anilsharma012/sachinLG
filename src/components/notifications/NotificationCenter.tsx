import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Clock,
  IndianRupee,
  FileText,
  Settings,
  Trash2,
  MailCheck,
  BellRing
} from "lucide-react";

interface Notification {
  id: string;
  type: "emi_reminder" | "payment_success" | "payment_failed" | "kyc_update" | "loan_update" | "document";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
}

interface NotificationPreferences {
  emiReminders: boolean;
  paymentConfirmations: boolean;
  overdueAlerts: boolean;
  kycUpdates: boolean;
  loanStatusUpdates: boolean;
  documentUpdates: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  reminderDaysBefore: number;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "emi_reminder",
    title: "EMI Due Tomorrow",
    message: "Your EMI of ₹14,130 for Loan LOAN001 is due tomorrow (Feb 5, 2024). Pay now to avoid late fees.",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    priority: "high",
  },
  {
    id: "2",
    type: "payment_success",
    title: "Payment Successful",
    message: "₹14,130 paid successfully for EMI #7. Receipt has been sent to your email.",
    timestamp: new Date(Date.now() - 86400000),
    read: true,
    priority: "low",
  },
  {
    id: "3",
    type: "kyc_update",
    title: "KYC Verified",
    message: "Your KYC verification is complete. You can now access all features.",
    timestamp: new Date(Date.now() - 172800000),
    read: true,
    priority: "medium",
  },
  {
    id: "4",
    type: "payment_failed",
    title: "Payment Failed",
    message: "Auto-pay for EMI #8 failed. Please pay manually to avoid late fees.",
    timestamp: new Date(Date.now() - 259200000),
    read: false,
    priority: "high",
  },
  {
    id: "5",
    type: "loan_update",
    title: "Loan Application Approved",
    message: "Congratulations! Your personal loan of ₹5,00,000 has been approved.",
    timestamp: new Date(Date.now() - 604800000),
    read: true,
    priority: "medium",
  },
];

const defaultPreferences: NotificationPreferences = {
  emiReminders: true,
  paymentConfirmations: true,
  overdueAlerts: true,
  kycUpdates: true,
  loanStatusUpdates: true,
  documentUpdates: true,
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
  reminderDaysBefore: 3,
};

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "emi_reminder":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "payment_success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "payment_failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "kyc_update":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "loan_update":
        return <IndianRupee className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      default:
        return "bg-muted-foreground";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean | number) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success("Preferences updated");
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "payments") return n.type.includes("payment");
    if (activeTab === "reminders") return n.type === "emi_reminder";
    return true;
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              <Bell className="h-4 w-4" />
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              <BellRing className="h-4 w-4" />
              Unread
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {activeTab !== "settings" && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <MailCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <TabsContent value="all" className="mt-4">
          <NotificationsList
            notifications={filteredNotifications}
            getTypeIcon={getTypeIcon}
            getPriorityColor={getPriorityColor}
            formatTime={formatTime}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          <NotificationsList
            notifications={filteredNotifications}
            getTypeIcon={getTypeIcon}
            getPriorityColor={getPriorityColor}
            formatTime={formatTime}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <NotificationsList
            notifications={filteredNotifications}
            getTypeIcon={getTypeIcon}
            getPriorityColor={getPriorityColor}
            formatTime={formatTime}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        </TabsContent>

        <TabsContent value="reminders" className="mt-4">
          <NotificationsList
            notifications={filteredNotifications}
            getTypeIcon={getTypeIcon}
            getPriorityColor={getPriorityColor}
            formatTime={formatTime}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Notification Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Types</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "emiReminders", label: "EMI Reminders", desc: "Get reminded before EMI due dates" },
                  { key: "paymentConfirmations", label: "Payment Confirmations", desc: "Confirmation after successful payments" },
                  { key: "overdueAlerts", label: "Overdue Alerts", desc: "Alerts when EMI becomes overdue" },
                  { key: "kycUpdates", label: "KYC Updates", desc: "Status updates on your KYC verification" },
                  { key: "loanStatusUpdates", label: "Loan Status Updates", desc: "Updates on loan application status" },
                  { key: "documentUpdates", label: "Document Updates", desc: "When documents are verified or rejected" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={key}>{label}</Label>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      id={key}
                      checked={preferences[key as keyof NotificationPreferences] as boolean}
                      onCheckedChange={(v) => updatePreference(key as keyof NotificationPreferences, v)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Channels</CardTitle>
                <CardDescription>How do you want to receive notifications?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(v) => updatePreference("emailNotifications", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive SMS on your mobile</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.smsNotifications}
                    onCheckedChange={(v) => updatePreference("smsNotifications", v)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Browser push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(v) => updatePreference("pushNotifications", v)}
                  />
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <Label>EMI Reminder Days</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    How many days before EMI due date should we remind you?
                  </p>
                  <div className="flex gap-2">
                    {[1, 3, 5, 7].map((days) => (
                      <Button
                        key={days}
                        variant={preferences.reminderDaysBefore === days ? "default" : "outline"}
                        size="sm"
                        onClick={() => updatePreference("reminderDaysBefore", days)}
                      >
                        {days} day{days > 1 ? "s" : ""}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Separate component for notifications list
const NotificationsList = ({
  notifications,
  getTypeIcon,
  getPriorityColor,
  formatTime,
  markAsRead,
  deleteNotification,
}: {
  notifications: Notification[];
  getTypeIcon: (type: string) => React.ReactNode;
  getPriorityColor: (priority: string) => string;
  formatTime: (date: Date) => string;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}) => {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <ScrollArea className="h-[500px]">
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                !notification.read ? "bg-primary/5" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex gap-4">
                <div className="mt-1">{getTypeIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h4>
                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
