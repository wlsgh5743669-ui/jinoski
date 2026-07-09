import { prisma } from "@/lib/prisma";
import { BookingDashboard } from "./booking-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { date: "asc" },
  });

  return <BookingDashboard bookings={bookings} />;
}
