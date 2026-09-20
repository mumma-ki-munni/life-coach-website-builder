import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPage } from "@/components/admin-page";
import { useDataProvider, type ContactMessage } from "@/lib/data-provider";
import { useFilters, type MessageTab } from "@/lib/filter-context";
import { MessagesTable } from "./components/messages-table";
import { MessageDetailPanel } from "./components/message-detail-panel";
import { MessagesBlankslate } from "./components/messages-blankslate";

/**
 * Messages (`/admin/messages`) — the coach's inbox for contact form
 * submissions. A status-filtered list (All / New / Read) with a slide-in
 * detail panel. Opening a "new" message marks it read; archiving soft-deletes
 * it from every tab. Sorted most-recent-first, always.
 */
export default function AdminMessages() {
  const { messageTab, setMessageTab } = useFilters();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { useMessages, useUpdateMessageStatus } = useDataProvider();
  const { data: messages } = useMessages({ tab: messageTab });
  const { mutate: updateStatus } = useUpdateMessageStatus();

  const openPanel = (message: ContactMessage) => {
    setSelected(message);
    setPanelOpen(true);
    // Opening a new message is the "mark as read" action — no separate button.
    if (message.status === "new") {
      updateStatus({ id: message.id, status: "read" });
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <AdminPage
      title="Messages"
      description="Messages sent through your contact form."
    >
      <Tabs
        value={messageTab}
        onValueChange={(v) => setMessageTab(v as MessageTab)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {isEmpty ? (
          <MessagesBlankslate />
        ) : (
          <MessagesTable messages={messages} onSelect={openPanel} />
        )}
      </div>

      <MessageDetailPanel
        message={selected}
        open={panelOpen}
        onOpenChange={setPanelOpen}
      />
    </AdminPage>
  );
}
