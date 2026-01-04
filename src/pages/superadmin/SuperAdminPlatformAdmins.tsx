import { useMemo, useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockPlatformAdmins } from "@/data/superadminMockData";
import { toast } from "sonner";
import { Plus, Search, Shield, UserCog } from "lucide-react";

export default function SuperAdminPlatformAdmins() {
  const [q, setQ] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", mobile: "", role: "support" as const });

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return mockPlatformAdmins;
    return mockPlatformAdmins.filter((a) =>
      [a.name, a.email, a.role].some((v) => v.toLowerCase().includes(query))
    );
  }, [q]);

  const handleCreate = () => {
    if (!newAdmin.name || !newAdmin.email) {
      toast.error("Name and email are required");
      return;
    }
    toast.success("Platform admin created (mock)");
    setIsCreateOpen(false);
    setNewAdmin({ name: "", email: "", mobile: "", role: "support" });
  };

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Platform Admins</h1>
            <p className="text-muted-foreground">Manage CEO-level staff (Support / Billing / Auditor)</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Platform Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create platform admin</DialogTitle>
                <DialogDescription>UI-only mock. Later this will create a real platform staff user.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input value={newAdmin.name} onChange={(e) => setNewAdmin((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Mobile</Label>
                  <Input value={newAdmin.mobile} onChange={(e) => setNewAdmin((p) => ({ ...p, mobile: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select value={newAdmin.role} onValueChange={(v) => setNewAdmin((p) => ({ ...p, role: v as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                      <SelectItem value="superadmin">SuperAdmin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search name / email / role" className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admins ({rows.length})</CardTitle>
            <CardDescription>All actions are mocked for now.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Admin</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last login</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <UserCog className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{a.name}</p>
                            <p className="text-sm text-muted-foreground">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">
                          {a.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={a.status === "active" ? "secondary" : "destructive"} className="capitalize">
                          {a.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleString("en-IN") : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success("Permissions opened (mock)")}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Permissions
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => toast.success("Admin blocked/unblocked (mock)")}
                          >
                            Block
                          </Button>
                        </div>
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
