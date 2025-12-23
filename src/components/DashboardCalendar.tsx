"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock, User, X } from "lucide-react";

type Booking = {
    id: number;
    clientName: string;
    date: Date;
    timeSlot: string;
    status: string;
    totalAmount: string;
    depositAmount: string;
};

export function DashboardCalendar({ bookings }: { bookings: Booking[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Convert strings to dates for the calendar matcher
    const confirmedDates = bookings
        .filter(b => b.status === 'confirmed' || b.status === 'pending')
        .map(b => new Date(b.date));

    const completedDates = bookings
        .filter(b => b.status === 'completed')
        .map(b => new Date(b.date));

    // Find bookings for the selected date
    const selectedBookings = date
        ? bookings.filter(b =>
            new Date(b.date).toDateString() === date.toDateString()
        )
        : [];

    return (
        <Popover open={!!date && selectedBookings.length > 0} onOpenChange={(open) => {
            if (!open) setDate(undefined);
        }}>
            <div className="bg-card rounded-xl border border-border p-4 shadow-sm h-fit relative">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Calendario</h3>
                <div className="flex justify-center">
                    <PopoverTrigger asChild>
                        <div className="w-fit"> {/* Trigger wrapper */}
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border border-border"
                                modifiers={{
                                    confirmed: confirmedDates,
                                    completed: completedDates
                                }}
                                modifiersStyles={{
                                    confirmed: {
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                        color: 'var(--primary)'
                                    },
                                    completed: {
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                        color: '#16a34a' // green-600
                                    }
                                }}
                            />
                        </div>
                    </PopoverTrigger>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Confirmada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        <span>Completada</span>
                    </div>
                </div>

                <PopoverContent className="w-80 p-0" align="center" side="bottom" sideOffset={10}>
                    <div className="p-4 border-b border-border bg-muted/50 flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-foreground">{date ? format(date, "PPPP") : "Selecciona una fecha"}</h4>
                            <p className="text-xs text-muted-foreground">{selectedBookings.length} reserva(s)</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mr-2 -mt-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setDate(undefined)}
                        >
                            <X size={14} />
                        </Button>
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
                                            {booking.status}
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
