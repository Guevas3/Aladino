"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock, User } from "lucide-react";

type Booking = {
    id: number;
    clientName: string;
    date: Date;
    timeSlot: string;
    status: string | null;
    totalAmount: string;
    depositAmount: string;
};

export function DashboardCalendar({ bookings }: { bookings: Booking[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Convert strings to dates for the calendar matcher
    const bookedDates = bookings.map(b => new Date(b.date));

    // Find bookings for the selected date
    const selectedBookings = date
        ? bookings.filter(b =>
            new Date(b.date).toDateString() === date.toDateString()
        )
        : [];

    return (
        <Popover open={!!date && selectedBookings.length > 0}>
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm h-fit relative">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Calendario</h3>
                <div className="flex justify-center">
                    <PopoverTrigger asChild>
                        <div className="w-full h-full"> {/* Trigger wrapper */}
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border border-border"
                                modifiers={{
                                    booked: bookedDates
                                }}
                                modifiersStyles={{
                                    booked: {
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                        color: 'var(--primary)'
                                    }
                                }}
                            />
                        </div>
                    </PopoverTrigger>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Fecha Reservada</span>
                </div>

                <PopoverContent className="w-80 p-0" align="start" side="right">
                    <div className="p-4 border-b border-border bg-muted/50">
                        <h4 className="font-semibold text-foreground">{date ? format(date, "PPPP") : "Selecciona una fecha"}</h4>
                        <p className="text-xs text-muted-foreground">{selectedBookings.length} reserva(s)</p>
                    </div>
                    <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                        {selectedBookings.length > 0 ? (
                            selectedBookings.map(booking => (
                                <div key={booking.id} className="border border-border rounded-md p-3 bg-card">
                                    <div className="flex items-center gap-2 mb-2 font-medium text-foreground">
                                        <User size={14} className="text-primary" />
                                        <span>{booking.clientName}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            <span>{booking.timeSlot}</span>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 bg-secondary/20 text-secondary-foreground rounded-full">
                                            {booking.status ?? 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No hay reservas para esta fecha.</p>
                        )}
                    </div>
                </PopoverContent>
            </div>
        </Popover>
    );
}
