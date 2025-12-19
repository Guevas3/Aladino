"use client";

import { RotateCcw, EyeOff } from "lucide-react";
import { clearRecentBookings, resetFinancialStats } from "@/app/actions";
import { useState } from "react";

export function ClearListButton() {
    const [isPending, setIsPending] = useState(false);

    async function handleClear() {
        if (!confirm("¿Limpiar la lista de reservas recientes? No afectará las finanzas.")) return;
        setIsPending(true);
        try {
            await clearRecentBookings();
        } finally {
            setIsPending(false);
        }
    }

    return (
        <button
            onClick={handleClear}
            disabled={isPending}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
            title="Limpiar visualmente la lista"
        >
            <EyeOff size={14} /> Limpiar Lista
        </button>
    );
}

export function ResetFinancialsButton() {
    const [isPending, setIsPending] = useState(false);

    async function handleReset() {
        if (!confirm("¿Reiniciar contadores mensuales? Esto pondrá los ingresos y señas en $0 para el periodo actual.")) return;
        setIsPending(true);
        try {
            await resetFinancialStats();
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="flex flex-col justify-center gap-2">
            <button
                onClick={handleReset}
                disabled={isPending}
                className="w-full h-full flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors bg-card border border-border p-2 rounded-lg hover:border-primary/50 shadow-sm disabled:opacity-50"
            >
                <RotateCcw size={14} /> Reiniciar Mensual
            </button>
        </div>
    );
}
