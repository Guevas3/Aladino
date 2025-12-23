"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { addBooking } from "@/app/actions";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button"; // Assuming I might need button, or use standard HTML button styled
import { cn } from "@/lib/utils"; // Shadcn util if available, otherwise just template string

export function BookingForm({ bookedDates }: { bookedDates: Date[] }) {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isPending, setIsPending] = useState(false);

    // Wrapper to handle the form action
    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            // We need to append the date manually because it's state, not an input
            if (date) {
                formData.set("date", date.toISOString());
            }
            await addBooking(formData);
            // Reset form? browser does it slightly, but React state needs reset
            setDate(undefined);
            // Optional: Show success toast
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre del Cliente</label>
                <input name="clientName" type="text" required className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground" placeholder="Juan Perez" />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Fecha</label>
                {/* Hidden input to ensure standard form submission logic if needed, but we used set() above. 
                     Note: FormData only captures inputs. So we must have a hidden input or append in handler.
                     Using hidden input is robust. */}
                <input type="hidden" name="date" value={date ? date.toISOString() : ""} />

                <div className="border border-border rounded-md p-2 bg-background flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        modifiers={{
                            booked: bookedDates
                        }}
                        modifiersStyles={{
                            booked: {
                                textDecoration: 'line-through',
                                color: 'var(--muted-foreground)'
                            }
                        }}
                        className="rounded-md border-0"
                    />
                </div>
                {date && <p className="text-xs text-primary mt-1 text-center font-medium">Seleccionado: {format(date, "PPP")}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">Observaciones</label>
                <textarea name="observations" rows={3} className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground resize-none" placeholder="Detalles extra (opcional)" />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-3">Horario</label>
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                        <label className="text-xs text-muted-foreground absolute -top-5 left-0">Desde</label>
                        <input name="startTime" type="time" defaultValue="14:00" className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground" />
                    </div>
                    <div className="relative">
                        <label className="text-xs text-muted-foreground absolute -top-5 left-0">Hasta</label>
                        <input name="endTime" type="time" defaultValue="18:00" className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Seña</label>
                    <div className="relative">
                        <span className="absolute left-2 top-2 text-muted-foreground">$</span>
                        <input name="deposit" type="number" required className="w-full border border-border rounded-md p-2 pl-6 text-sm bg-background text-foreground" placeholder="500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Total</label>
                    <div className="relative">
                        <span className="absolute left-2 top-2 text-muted-foreground">$</span>
                        <input name="total" type="number" required className="w-full border border-border rounded-md p-2 pl-6 text-sm bg-background text-foreground" placeholder="2000" />
                    </div>
                </div>
            </div>
            <button type="submit" disabled={!date || isPending} className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending ? "Reservando..." : "Agregar Reserva"}
            </button>
        </form>
    );
}
