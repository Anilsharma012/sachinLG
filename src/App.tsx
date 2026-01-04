import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthPortalSelector from "./pages/auth/AuthPortalSelector";
import SuperAdminAuth from "./pages/auth/SuperAdminAuth";
import AdminAuth from "./pages/auth/AdminAuth";
import AgentAuth from "./pages/auth/AgentAuth";
import CustomerAuth from "./pages/auth/CustomerAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminLoanAccounts from "./pages/admin/AdminLoanAccounts";
import AdminKycQueue from "./pages/admin/AdminKycQueue";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminCommission from "./pages/admin/AdminCommission";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminReports from "./pages/admin/AdminReports";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminSettings from "./pages/admin/AdminSettings";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerApply from "./pages/customer/CustomerApply";
import CustomerLoans from "./pages/customer/CustomerLoans";
import CustomerEmi from "./pages/customer/CustomerEmi";
import CustomerDocuments from "./pages/customer/CustomerDocuments";
import CustomerReceipts from "./pages/customer/CustomerReceipts";
import CustomerSupport from "./pages/customer/CustomerSupport";
import CustomerPayments from "./pages/customer/CustomerPayments";
import CustomerCalculator from "./pages/customer/CustomerCalculator";
import CustomerNotifications from "./pages/customer/CustomerNotifications";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentLeads from "./pages/agent/AgentLeads";
import AgentApplications from "./pages/agent/AgentApplications";
import AgentCustomers from "./pages/agent/AgentCustomers";
import AgentCommission from "./pages/agent/AgentCommission";
import AgentSupport from "./pages/agent/AgentSupport";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminOrganizations from "./pages/superadmin/SuperAdminOrganizations";
import SuperAdminPlans from "./pages/superadmin/SuperAdminPlans";
import SuperAdminErrors from "./pages/superadmin/SuperAdminErrors";
import SuperAdminSupportMode from "./pages/superadmin/SuperAdminSupportMode";
import SuperAdminAuditLogs from "./pages/superadmin/SuperAdminAuditLogs";
import SuperAdminPlatformAdmins from "./pages/superadmin/SuperAdminPlatformAdmins";
import SuperAdminUsers from "./pages/superadmin/SuperAdminUsers";
import SuperAdminSubscriptions from "./pages/superadmin/SuperAdminSubscriptions";
import SuperAdminWebhooks from "./pages/superadmin/SuperAdminWebhooks";
import SuperAdminRepair from "./pages/superadmin/SuperAdminRepair";
import SuperAdminIntegrations from "./pages/superadmin/SuperAdminIntegrations";
import SuperAdminTemplates from "./pages/superadmin/SuperAdminTemplates";
import SuperAdminAnnouncements from "./pages/superadmin/SuperAdminAnnouncements";
import SuperAdminSecurity from "./pages/superadmin/SuperAdminSecurity";
import SuperAdminSettings from "./pages/superadmin/SuperAdminSettings";
import InstallAgent from "./pages/install/InstallAgent";
import InstallCustomer from "./pages/install/InstallCustomer";
import InstallAdmin from "./pages/install/InstallAdmin";
import InstallSuperAdmin from "./pages/install/InstallSuperAdmin";
import InstallHub from "./pages/install/InstallHub";

import OfflineIndicator from "./components/pwa/OfflineIndicator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <OfflineIndicator />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* PWA Install Pages - Public */}
            <Route path="/install" element={<InstallHub />} />
            <Route path="/install/agent" element={<InstallAgent />} />
            <Route path="/install/customer" element={<InstallCustomer />} />
            <Route path="/install/admin" element={<InstallAdmin />} />
            <Route path="/install/superadmin" element={<InstallSuperAdmin />} />
            <Route path="/auth" element={<AuthPortalSelector />} />
            <Route path="/auth/superadmin" element={<SuperAdminAuth />} />
            <Route path="/auth/admin" element={<AdminAuth />} />
            <Route path="/auth/agent" element={<AgentAuth />} />
            <Route path="/auth/customer" element={<CustomerAuth />} />
            <Route path="/auth/legacy" element={<Auth />} />
            
            {/* Admin Routes - Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/agents"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminAgents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/loans"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLoanAccounts />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/kyc" element={<ProtectedRoute allowedRoles={["admin"]}><AdminKycQueue /></ProtectedRoute>} />
            <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDocuments /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPayments /></ProtectedRoute>} />
            <Route path="/admin/invoices" element={<ProtectedRoute allowedRoles={["admin"]}><AdminInvoices /></ProtectedRoute>} />
            <Route path="/admin/commission" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCommission /></ProtectedRoute>} />
            <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTickets /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]}><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAuditLogs /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />
            {/* Customer Routes - Protected */}
            <Route path="/customer" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/customer/profile" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerProfile /></ProtectedRoute>} />
            <Route path="/customer/apply" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerApply /></ProtectedRoute>} />
            <Route path="/customer/loans" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerLoans /></ProtectedRoute>} />
            <Route path="/customer/emi" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerEmi /></ProtectedRoute>} />
            <Route path="/customer/documents" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDocuments /></ProtectedRoute>} />
            <Route path="/customer/receipts" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerReceipts /></ProtectedRoute>} />
            <Route path="/customer/payments" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerPayments /></ProtectedRoute>} />
            <Route path="/customer/calculator" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerCalculator /></ProtectedRoute>} />
            <Route path="/customer/notifications" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerNotifications /></ProtectedRoute>} />
            <Route path="/customer/support" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerSupport /></ProtectedRoute>} />
            
            {/* Agent Routes - Protected */}
            <Route path="/agent" element={<ProtectedRoute allowedRoles={["agent"]}><AgentDashboard /></ProtectedRoute>} />
            <Route path="/agent/leads" element={<ProtectedRoute allowedRoles={["agent"]}><AgentLeads /></ProtectedRoute>} />
            <Route path="/agent/applications" element={<ProtectedRoute allowedRoles={["agent"]}><AgentApplications /></ProtectedRoute>} />
            <Route path="/agent/customers" element={<ProtectedRoute allowedRoles={["agent"]}><AgentCustomers /></ProtectedRoute>} />
            <Route path="/agent/commission" element={<ProtectedRoute allowedRoles={["agent"]}><AgentCommission /></ProtectedRoute>} />
            <Route path="/agent/support" element={<ProtectedRoute allowedRoles={["agent"]}><AgentSupport /></ProtectedRoute>} />
            
            {/* SuperAdmin Routes - Protected */}
            <Route path="/superadmin" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/superadmin/organizations" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminOrganizations /></ProtectedRoute>} />
            <Route path="/superadmin/plans" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminPlans /></ProtectedRoute>} />
            <Route path="/superadmin/subscriptions" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminSubscriptions /></ProtectedRoute>} />
            <Route path="/superadmin/errors" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminErrors /></ProtectedRoute>} />
            <Route path="/superadmin/webhooks" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminWebhooks /></ProtectedRoute>} />
            <Route path="/superadmin/repair" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminRepair /></ProtectedRoute>} />
            <Route path="/superadmin/support-mode" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminSupportMode /></ProtectedRoute>} />
            <Route path="/superadmin/admins" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminPlatformAdmins /></ProtectedRoute>} />
            <Route path="/superadmin/users" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminUsers /></ProtectedRoute>} />
            <Route path="/superadmin/integrations" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminIntegrations /></ProtectedRoute>} />
            <Route path="/superadmin/templates" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminTemplates /></ProtectedRoute>} />
            <Route path="/superadmin/announcements" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminAnnouncements /></ProtectedRoute>} />
            <Route path="/superadmin/audit" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminAuditLogs /></ProtectedRoute>} />
            <Route path="/superadmin/security" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminSecurity /></ProtectedRoute>} />
            <Route path="/superadmin/settings" element={<ProtectedRoute allowedRoles={["superadmin"]}><SuperAdminSettings /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
