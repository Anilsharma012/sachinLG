import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

const CustomerNotifications = () => {
  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your loan activities and reminders</p>
        </div>

        <NotificationCenter />
      </div>
    </DashboardLayout>
  );
};

export default CustomerNotifications;
