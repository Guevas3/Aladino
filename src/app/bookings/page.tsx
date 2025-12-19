import Link from "next/link";
import { db } from "@/lib/db";
import { bookings } from "@/db/schema";
import { BookingForm } from "@/components/BookingForm";
import { BookingList } from "@/components/BookingList";
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
    const allBookings = await db.select().from(bookings);
    // Extract dates for the calendar (exclude cancelled)
    const bookedDates = allBookings
        .filter(b => b.status !== 'cancelled')
        .map(b => new Date(b.date));

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-primary">Reservas</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Form Component - Now first in order */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit">
                        <h3 className="font-semibold text-lg mb-4 text-primary">Nueva Reserva</h3>
                        <BookingForm bookedDates={bookedDates} />
                    </div>

                    {/* List - Now second in order */}
                    <div className="md:col-span-2">
                        <BookingList bookings={allBookings.map(b => ({
                            ...b,
                            status: b.status || 'pending'
                        }))} />
                    </div>
                </div>
            </div>
        </div>
    );
}
