"use client";

import { Calendar, DollarSign, Edit2, Tag, Trash2 } from "lucide-react";
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
import { deleteExpense, updateExpense } from "@/app/actions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Expense = {
    id: number;
    description: string;
    amount: string;
    category: string;
    date: Date | null;
};

export function ExpenseItem({ expense }: { expense: Expense }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [isPending, setIsPending] = useState(false);

    async function handleDelete() {
        setIsPending(true);
        try {
            await deleteExpense(expense.id);
        } catch (e) {
            console.error(e);
            alert("Failed to delete");
        } finally {
            setIsPending(false);
        }
    }

    async function handleUpdate(formData: FormData) {
        setIsPending(true);
        try {
            const amount = formData.get("amount") as string;
            const description = formData.get("description") as string;
            await updateExpense(expense.id, amount, description);
            setOpenEdit(false);
        } catch (e) {
            console.error(e);
            alert("Failed to update");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex justify-between items-center transition-all bg-card/50 hover:bg-card">
            <div>
                <h3 className="font-semibold text-lg text-foreground">{expense.description}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Tag size={14} /> {expense.category}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {expense.date ? format(new Date(expense.date), "P") : 'N/A'}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-bold text-destructive text-lg">-${expense.amount}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pl-4 border-l border-border">
                    <Popover open={openEdit} onOpenChange={setOpenEdit}>
                        <PopoverTrigger asChild>
                            <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Editar Gasto">
                                <Edit2 size={16} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-4" align="end">
                            <h4 className="font-semibold mb-3 text-foreground">Editar Gasto</h4>
                            <form action={handleUpdate} className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Descripción</label>
                                    <input name="description" defaultValue={expense.description} className="w-full border border-border rounded px-2 py-1 text-sm bg-background" />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Monto</label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">$</span>
                                        <input name="amount" defaultValue={expense.amount} type="number" className="w-full border border-border rounded px-2 py-1 pl-5 text-sm bg-background" />
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
                            <button disabled={isPending} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Eliminar Gasto">
                                <Trash2 size={16} />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar Gasto?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente este registro de gasto.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Eliminar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}
