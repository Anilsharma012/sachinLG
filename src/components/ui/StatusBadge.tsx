import { cn } from "@/lib/utils";
import type { ApplicationStatus, DocumentStatus, EmiStatus, KycStatus, LeadStage, PaymentStatus } from "@/types";

type StatusType = ApplicationStatus | DocumentStatus | EmiStatus | KycStatus | LeadStage | PaymentStatus | 
  'success' | 'warning' | 'destructive' | 'secondary' | 'info' | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  children?: React.ReactNode;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  // Application Status
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  submitted: { label: "Submitted", className: "bg-info/10 text-info border-info/20" },
  doc_pending: { label: "Docs Pending", className: "bg-warning/10 text-warning border-warning/20" },
  kyc_pending: { label: "KYC Pending", className: "bg-warning/10 text-warning border-warning/20" },
  under_review: { label: "Under Review", className: "bg-info/10 text-info border-info/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  disbursed: { label: "Disbursed", className: "bg-success/10 text-success border-success/20" },
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },

  // Document Status
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  // approved - already defined
  // rejected - already defined

  // EMI Status
  upcoming: { label: "Upcoming", className: "bg-muted text-muted-foreground" },
  due: { label: "Due", className: "bg-warning/10 text-warning border-warning/20" },
  overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive border-destructive/20" },
  partial: { label: "Partial", className: "bg-warning/10 text-warning border-warning/20" },
  paid: { label: "Paid", className: "bg-success/10 text-success border-success/20" },

  // KYC Status
  verified: { label: "Verified", className: "bg-success/10 text-success border-success/20" },
  resubmitted: { label: "Resubmitted", className: "bg-info/10 text-info border-info/20" },

  // Lead Stage
  new: { label: "New", className: "bg-info/10 text-info border-info/20" },
  contacted: { label: "Contacted", className: "bg-warning/10 text-warning border-warning/20" },
  qualified: { label: "Qualified", className: "bg-success/10 text-success border-success/20" },
  converted: { label: "Converted", className: "bg-success/10 text-success border-success/20" },
  lost: { label: "Lost", className: "bg-muted text-muted-foreground" },

  // Payment Status
  initiated: { label: "Initiated", className: "bg-info/10 text-info border-info/20" },
  success: { label: "Success", className: "bg-success/10 text-success border-success/20" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
  refunded: { label: "Refunded", className: "bg-muted text-muted-foreground" },
  reconciled: { label: "Reconciled", className: "bg-success/10 text-success border-success/20" },

  // Generic variants (for custom labels via children)
  warning: { label: "", className: "bg-warning/10 text-warning border-warning/20" },
  destructive: { label: "", className: "bg-destructive/10 text-destructive border-destructive/20" },
  secondary: { label: "", className: "bg-muted text-muted-foreground" },
  info: { label: "", className: "bg-info/10 text-info border-info/20" },
  blocked: { label: "Blocked", className: "bg-destructive/10 text-destructive border-destructive/20" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground" },
  npa: { label: "NPA", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        config.className,
        className
      )}
    >
      {children || config.label}
    </span>
  );
}
