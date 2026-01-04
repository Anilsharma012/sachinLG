import { useMemo, useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, FileText, Plus, Search } from "lucide-react";

type Template = {
  id: string;
  name: string;
  category: "Invoice" | "Receipt" | "NOC" | "ZeroDue";
  content: string;
};

const mockTemplates: Template[] = [
  {
    id: "tpl_inv_default",
    name: "Default Invoice",
    category: "Invoice",
    content: "Invoice Template\n\nOrg: {{orgName}}\nCustomer: {{customerName}}\nAmount: {{amount}}\n",
  },
  {
    id: "tpl_rcpt_default",
    name: "Default Receipt",
    category: "Receipt",
    content: "Receipt Template\n\nPayment Id: {{paymentId}}\nAmount: {{amount}}\n",
  },
];

export default function SuperAdminTemplates() {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return mockTemplates;
    return mockTemplates.filter((t) => [t.name, t.category].some((v) => v.toLowerCase().includes(query)));
  }, [q]);

  const openEdit = (t: Template) => {
    setOpenId(t.id);
    setDraft(t.content);
  };

  const save = () => {
    toast.success("Template saved (mock)");
    setOpenId(null);
  };

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Templates</h1>
            <p className="text-muted-foreground">Global invoice/receipt/NOC templates (mock)</p>
          </div>
          <Button onClick={() => toast.success("Create template (mock)")}>
            <Plus className="mr-2 h-4 w-4" /> New template
          </Button>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search templates" className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {rows.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> {t.name}
                </CardTitle>
                <CardDescription>{t.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">{t.content}</pre>
                <Button variant="outline" onClick={() => openEdit(t)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!openId} onOpenChange={(v) => !v && setOpenId(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit template</DialogTitle>
              <DialogDescription>UI-only draft; later this will be stored and versioned.</DialogDescription>
            </DialogHeader>
            <Textarea rows={12} value={draft} onChange={(e) => setDraft(e.target.value)} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenId(null)}>
                Cancel
              </Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </SuperAdminLayout>
  );
}
