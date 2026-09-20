import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/base/badge";
import { type Booking } from "@/lib/data-provider";
import { formatDateTimeShort } from "../lib";

const statusBadge: Record<
  Booking["status"],
  { color: "green" | "gray" | "red"; label: string }
> = {
  confirmed: { color: "green", label: "confirmed" },
  completed: { color: "gray", label: "completed" },
  cancelled: { color: "red", label: "cancelled" },
};

export function BookingsTable({
  bookings,
  onSelect,
}: {
  bookings: Booking[];
  onSelect: (booking: Booking) => void;
}) {
  return (
    <div className="rounded-lg border border-solid">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Focus area</TableHead>
            <TableHead>Date & time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const badge = statusBadge[booking.status];
            return (
              <TableRow
                key={booking.id}
                onClick={() => onSelect(booking)}
                className="cursor-pointer hover:bg-accent/50"
              >
                <TableCell className="font-medium text-foreground">
                  {booking.client_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {booking.focus_area}
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatDateTimeShort(booking.booking_date, booking.booking_time)}
                </TableCell>
                <TableCell>
                  <Badge color={badge.color}>{badge.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
