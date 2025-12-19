"use client";

import { useState } from "react";
import { BookingItem } from "./BookingItem";
import { Calendar, Filter } from "lucide-react";

type Booking = {
    id: number;
    clientName: string;
    date: string | Date; // Depending on how it's passed from server
    timeSlot: string;
    depositAmount: string;
    totalAmount: string;
    status: string;
    createdAt?: Date | null;
};

export function BookingList({ bookings }: { bookings: Booking[] }) {
    const [sortBy, setSortBy] = useState<'date' | 'status'>('date');

    const sortedBookings = [...bookings].sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        // Group by status: confirmed first? Or just alphabetical.
        // Usually confirmed is more important.
        const statusOrder: Record<string, number> = {
            'confirmed': 1,
            'pending': 2,
            'completed': 3,
            'cancelled': 4
        };
        const orderA = statusOrder[a.status as keyof typeof statusOrder] || 99;
        const orderB = statusOrder[b.status as keyof typeof statusOrder] || 99;
        return orderA - orderB;
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border shadow-sm">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Filter size={16} /> Ordenar por:
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy('date')}
                        className={`px-3 py-1 text-xs rounded-full transition-all border ${sortBy === 'date'
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                            }`}
                    >
                        Fecha
                    </button>
                    <button
                        onClick={() => setSortBy('status')}
                        className={`px-3 py-1 text-xs rounded-full transition-all border ${sortBy === 'status'
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                            }`}
                    >
                        Estado
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {sortedBookings.length === 0 ? (
                    <div className="bg-card p-8 rounded-xl border border-dashed border-border text-center">
                        <p className="text-muted-foreground">No hay reservas aún.</p>
                    </div>
                ) : (
                    sortedBookings.map((booking) => (
                        <BookingItem key={booking.id} booking={{
                            ...booking,
                            date: new Date(booking.date),
                            status: booking.status as any
                        }} />
                    ))
                )}
            </div>
        </div>
    );
}
