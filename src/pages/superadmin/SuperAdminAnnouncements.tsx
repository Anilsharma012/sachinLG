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
import { Megaphone, Plus, Search } from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  status: "draft" | "published";
  createdAt: Date;
};

const mockAnnouncements: Announcement[] = [
  {
    id: "ann_001",
    title: "Scheduled maintenance",
    message: "Platform maintenance on Sunday 2AM–3AM IST.",
    status: "published",
    createdAt: new Date("2024-12-29T10:00:00"),
  },
];

export default function SuperAdminAnnouncements() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", message: "" });

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return mockAnnouncements;
    return mockAnnouncements.filter((a) => [a.title, a.message].some((v) => v.toLowerCase().includes(query)));
  }, [q]);

  const publish = () => {
    if (!draft.title.trim() || !draft.message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    toast.success("Announcement published (mock)");
    setOpen(false);
    setDraft({ title: "", message: "" });
  };

  return (
    <SuperAdminLayout>
      <section className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Broadcast platform-wide notices (mock)</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create announcement</DialogTitle>
                <DialogDescription>Later this can target specific orgs/plans.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <Input
                  placeholder="Title"
                  value={draft.title}
                  onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                />
                <Textarea
                  rows={5}
                  placeholder="Message"
                  value={draft.message}
                  onChange={(e) => setDraft((p) => ({ ...p, message: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={publish}>
                  <Megaphone className="mr-2 h-4 w-4" /> Publish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search announcements" className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {rows.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" /> {a.title}
                </CardTitle>
                <CardDescription>
                  {a.status.toUpperCase()} • {a.createdAt.toLocaleString("en-IN")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{a.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SuperAdminLayout>
  );
}
