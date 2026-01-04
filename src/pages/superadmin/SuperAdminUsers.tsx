import { useMemo, useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Building2, Search, Users } from "lucide-react";
import { mockOrganizations } from "@/data/superadminMockData";

type CrossOrgUser = {
  id: string;
  name: string;
  email: string;
  role: "OrgAdmin" | "Agent" | "Customer";
  orgId: string;
  orgName: string;
  status: "active" | "blocked";
};

const mockUsers: CrossOrgUser[] = [
  {
    id: "usr_001",
    name: "Rahul Sharma",
    email: "rahul@vikramfinance.com",
    role: "OrgAdmin",
    orgId: "org_001",
    orgName: "Vikram Finance Pvt Ltd",
    status: "active",
  },
  {
    id: "usr_002",
    name: "Priya Patel",
    email: "priya@vikramfinance.com",
    role: "Agent",
    orgId: "org_001",
    orgName: "Vikram Finance Pvt Ltd",
    status: "active",
  },
  {
    id: "usr_003",
    name: "Amit Kumar",
    email: "amit@gmail.com",
    role: "Customer",
    orgId: "org_002",
    orgName: "FinServe Partners LLP",
    status: "active",
  },
  {
    id: "usr_004",
    name: "Neha Singh",
    email: "neha@quickloans.in",
    role: "OrgAdmin",
    orgId: "org_003",
    orgName: "QuickLoans India",
    status: "blocked",
  },
];

export default function SuperAdminUsers() {
  const [q, setQ] = useState("");
  const [orgId, setOrgId] = useState<string>("all");
  const [role, setRole] = useState<string>("all");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return mockUsers.filter((u) => {
      const matchesQ = !query || [u.name, u.email, u.orgName].some((v) => v.toLowerCase().includes(query));
      const matchesOrg = orgId === "all" || u.orgId === orgId;
      const matchesRole = role === "all" || u.role === role;
      return matchesQ && matchesOrg && matchesRole;
    });
  }, [q, orgId, role]);

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Cross-Org Users</h1>
          <p className="text-muted-foreground">CEO “Everything View” for users across all tenants (mock)</p>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="relative sm:col-span-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search name/email/org" className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>

              <Select value={orgId} onValueChange={setOrgId}>
                <SelectTrigger>
                  <SelectValue placeholder="Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All organizations</SelectItem>
                  {mockOrganizations.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="OrgAdmin">OrgAdmin</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users ({rows.length})</CardTitle>
            <CardDescription>Use Support Mode to impersonate a user with reason.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Organization</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{u.role}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span className="text-foreground">{u.orgName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={u.status === "active" ? "secondary" : "destructive"}>{u.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" onClick={() => toast.success("Open user details (mock)")}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </SuperAdminLayout>
  );
}
