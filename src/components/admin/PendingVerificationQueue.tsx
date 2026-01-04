import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, PendingRoleSignup } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  Check, 
  X, 
  Mail, 
  Phone, 
  Building2, 
  Clock,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PendingVerificationQueueProps {
  type: 'admin' | 'agent';
  title?: string;
  description?: string;
}

export function PendingVerificationQueue({ 
  type, 
  title = type === 'admin' ? 'Pending Admin Approvals' : 'Pending Agent Approvals',
  description = type === 'admin' ? 'Review and approve new admin registrations' : 'Review and approve new agent registrations'
}: PendingVerificationQueueProps) {
  const { pendingAdmins, pendingAgents, approveUser, rejectUser, refreshPendingLists } = useAuth();
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const pendingList = type === 'admin' ? pendingAdmins : pendingAgents;

  const handleApprove = async (pending: PendingRoleSignup) => {
    setLoadingId(pending.id);
    const result = await approveUser(pending.id, type);
    setLoadingId(null);

    if (result.success) {
      toast({
        title: 'User Approved!',
        description: `${pending.name} has been approved as ${type}. They can now login.`,
      });
      refreshPendingLists();
    } else {
      toast({
        title: 'Approval Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (pending: PendingRoleSignup) => {
    setLoadingId(pending.id);
    const result = await rejectUser(pending.id, type);
    setLoadingId(null);

    if (result.success) {
      toast({
        title: 'Request Rejected',
        description: `${pending.name}'s registration request has been rejected.`,
      });
      refreshPendingLists();
    } else {
      toast({
        title: 'Rejection Failed',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  if (pendingList.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {title}
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                {pendingList.length} pending
              </Badge>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </CardHeader>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-3">
              {pendingList.map((pending) => (
                <motion.div
                  key={pending.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="p-4 rounded-lg bg-card border border-border hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-amber-500/10 text-amber-600 font-semibold">
                          {pending.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{pending.name}</p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {pending.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {pending.mobile}
                          </span>
                        </div>
                        {pending.organizationName && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            {pending.organizationName}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          Applied {formatDistanceToNow(pending.createdAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-600 hover:bg-red-500/10"
                        onClick={() => handleReject(pending)}
                        disabled={loadingId === pending.id}
                      >
                        {loadingId === pending.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApprove(pending)}
                        disabled={loadingId === pending.id}
                      >
                        {loadingId === pending.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
