import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPage } from "@/components/admin-page";
import { useDataProvider, type Booking } from "@/lib/data-provider";
import type { BookingFilters } from "@/lib/data-provider";
import { BookingsTable } from "./components/bookings-table";
import { BookingDetailPanel } from "./components/booking-detail-panel";
import { BookingsBlankslate } from "./components/bookings-blankslate";

type Tab = BookingFilters["tab"];

const emptyCopy: Record<Exclude<Tab, "upcoming">, string> = {
  past: "No past calls yet.",
  cancelled: "No cancelled bookings.",
};

/**
 * Intake Requests (`/admin/bookings`) — the coach's primary admin screen. A
 * list of booked intake calls with Upcoming / Past / Cancelled tabs and a
 * slide-in detail panel for reviewing goals and taking action.
 */
export default function AdminBookings() {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/demo")
    ? "/demo/admin"
    : "/admin";

  const [tab, setTab] = useState<Tab>("upcoming");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { useBookings } = useDataProvider();
  const { data: bookings } = useBookings({ tab });

  const openPanel = (booking: Booking) => {
    setSelected(booking);
    setPanelOpen(true);
  };

  const isEmpty = bookings.length === 0;

  return (
    <AdminPage
      title="Intake Requests"
      description="Review booked intake calls and mark them complete or cancelled."
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {isEmpty ? (
          tab === "upcoming" ? (
            <BookingsBlankslate
              availabilityHref={`${basePath}/availability`}
            />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              {emptyCopy[tab]}
            </p>
          )
        ) : (
          <BookingsTable bookings={bookings} onSelect={openPanel} />
        )}
      </div>

      <BookingDetailPanel
        booking={selected}
        open={panelOpen}
        onOpenChange={setPanelOpen}
      />
    </AdminPage>
  );
}
