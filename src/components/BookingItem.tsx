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
import { cancelBooking, completeBooking, updateBookingBudget } from "@/app/actions";
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

export function BookingItem({ booking, compact = false }: { booking: Booking, compact?: boolean }) {
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

    async function handleComplete() {
        setIsPending(true);
        try {
            await completeBooking(booking.id);
        } catch (e) {
            console.error(e);
            alert("Failed to complete");
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
            "bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col transition-all",
            !compact && "sm:flex-row sm:items-center justify-between gap-4",
            compact && "gap-3",
            booking.status === 'cancelled' && "opacity-60 grayscale bg-muted/30"
        )}>
            <div className="flex-1 min-w-0">
                <h3 className={cn(
                    "font-bold text-foreground truncate",
                    compact ? "text-base" : "text-lg",
                    booking.status === 'cancelled' && "line-through"
                )}>
                    {booking.clientName}
                </h3>
                <div className={cn(
                    "flex items-center gap-2 text-muted-foreground mt-1 flex-wrap",
                    compact ? "text-xs" : "text-sm"
                )}>
                    <span className="flex items-center gap-1 whitespace-nowrap"><CalendarIcon size={12} /> {format(new Date(booking.date), "P")}</span>
                    <span className="flex items-center gap-1 whitespace-nowrap"><Clock size={12} /> {booking.timeSlot}</span>
                </div>
            </div>

            <div className={cn(
                "flex items-center justify-between gap-4 pt-3 border-t border-border/50",
                !compact && "sm:pt-0 sm:border-t-0 sm:justify-end w-full sm:w-auto",
                compact && "w-full"
            )}>
                <div className={cn(
                    "flex flex-col",
                    !compact && "sm:text-right"
                )}>
                    <span className={cn(
                        "inline-block px-2 py-0.5 text-[10px] rounded-full font-medium mb-1 capitalize w-fit",
                        !compact && "sm:ml-auto",
                        booking.status === 'confirmed' ? "bg-blue-100 text-blue-700" :
                            booking.status === 'completed' ? "bg-green-100 text-green-700" :
                                booking.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                    )}>
                        {booking.status === 'confirmed' ? 'confirmada' :
                            booking.status === 'completed' ? 'completada' :
                                booking.status === 'cancelled' ? 'cancelada' : 'pendiente'}
                    </span>
                    <p className={cn(
                        "font-bold text-foreground",
                        compact ? "text-base" : "text-lg sm:text-xl"
                    )}>${Math.abs(Number(booking.totalAmount)).toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground whitespace-nowrap">Seña: ${Math.abs(Number(booking.depositAmount)).toLocaleString()}</p>
                </div>

                {/* Actions */}
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <div className="flex gap-1 pl-3 border-l border-border h-fit my-auto">
                        {booking.status === 'confirmed' && (
                            <button
                                onClick={handleComplete}
                                disabled={isPending}
                                className="p-1.5 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                title="Marcar como Completada"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            </button>
                        )}
                        <Popover open={openEdit} onOpenChange={setOpenEdit}>
                            <PopoverTrigger asChild>
                                <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Editar Presupuesto">
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
                                <button disabled={isPending} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Cancelar Reserva">
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
