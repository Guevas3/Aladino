"use client";

import { CalendarIcon, Clock, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { cancelBooking, updateBookingBudget } from "@/app/actions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Booking = {
    id: number;
    clientName: string;
    date: Date;
    timeSlot: string;
    depositAmount: string;
    totalAmount: string;
    status: string | null;
};

export function BookingItem({ booking }: { booking: Booking }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [isPending, setIsPending] = useState(false);

    async function handleCancel() {
        setIsPending(true);
        try {
            await cancelBooking(booking.id);
        } catch (e) {
            console.error(e);
            alert("Failed to cancel");
        } finally {
            setIsPending(false);
        }
    }

    async function handleUpdate(formData: FormData) {
        setIsPending(true);
        try {
            const total = formData.get("total") as string;
            const deposit = formData.get("deposit") as string;
            await updateBookingBudget(booking.id, total, deposit);
            setOpenEdit(false);
        } catch (e) {
            console.error(e);
            alert("Failed to update");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className={cn(
            "bg-card p-6 rounded-xl border border-border shadow-sm flex justify-between items-center transition-all",
            booking.status === 'cancelled' && "opacity-60 grayscale bg-muted/30"
        )}>
            <div>
                <h3 className={cn("font-semibold text-lg text-foreground", booking.status === 'cancelled' && "line-through")}>
                    {booking.clientName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><CalendarIcon size={14} /> {format(new Date(booking.date), "P")}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {booking.timeSlot}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <span className={cn(
                        "inline-block px-2 py-1 text-xs rounded-full font-medium mb-1",
                        booking.status === 'confirmed' ? "bg-green-100 text-green-700" :
                            booking.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                    )}>
                        {booking.status}
                    </span>
                    <p className="font-bold text-foreground py-1">${booking.totalAmount}</p>
                    <p className="text-xs text-muted-foreground">Seña: ${booking.depositAmount}</p>
                </div>

                {/* Actions */}
                {booking.status !== 'cancelled' && (
                    <div className="flex gap-2 pl-4 border-l border-border">
                        <Popover open={openEdit} onOpenChange={setOpenEdit}>
                            <PopoverTrigger asChild>
                                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Editar Presupuesto">
                                    <Edit2 size={16} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4" align="end">
                                <h4 className="font-semibold mb-3 text-foreground">Editar Presupuesto</h4>
                                <form action={handleUpdate} className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Monto Total</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">$</span>
                                            <input name="total" defaultValue={booking.totalAmount} className="w-full border border-border rounded px-2 py-1 pl-5 text-sm bg-background" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Monto Seña</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">$</span>
                                            <input name="deposit" defaultValue={booking.depositAmount} className="w-full border border-border rounded px-2 py-1 pl-5 text-sm bg-background" />
                                        </div>
                                    </div>
                                    <button disabled={isPending} className="w-full bg-primary text-primary-foreground py-1.5 rounded-md text-sm hover:bg-primary/90">
                                        Guardar Cambios
                                    </button>
                                </form>
                            </PopoverContent>
                        </Popover>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button disabled={isPending} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Cancelar Reserva">
                                    <Trash2 size={16} />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Cancelar Reserva?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto marcará la reserva como cancelada.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Volver</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Sí, Cancelar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </div>
    );
}
