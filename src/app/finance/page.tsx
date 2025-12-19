import Link from "next/link";
import { db } from "@/lib/db";
import { expenses, bookings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { DollarSign, Tag, Calendar as CalendarIcon, ArrowLeft, Users, Plus } from "lucide-react";
import { ExpenseItem } from "@/components/ExpenseItem";
import { sql, eq, and } from "drizzle-orm";
import { addExpense } from "@/app/actions";


export default async function FinancePage() {
    const allMovements = await db.select().from(expenses).where(eq(expenses.isExcludedFromStats, false));

    const totalExpenses = allMovements
        .filter(m => m.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0);

    const otherIncome = allMovements
        .filter(m => m.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0);

    // Fetch totals from bookings
    const totalRevenueResult = await db.select({ total: sql<number>`sum(${bookings.totalAmount})` }).from(bookings).where(and(sql`(status != 'cancelled' OR status IS NULL)`, eq(bookings.isExcludedFromStats, false)));
    const totalDepositsResult = await db.select({ total: sql<number>`sum(${bookings.depositAmount})` }).from(bookings).where(eq(bookings.isExcludedFromStats, false));

    const revenue = Number(totalRevenueResult[0]?.total || 0);
    const deposits = Number(totalDepositsResult[0]?.total || 0);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-primary">Gestión Financiera</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <DollarSign size={16} className="text-primary" />
                            <p className="text-sm font-medium">Ingresos Reservas</p>
                        </div>
                        <p className="text-2xl font-bold text-primary">${revenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Users size={16} className="text-accent-foreground" />
                            <p className="text-sm font-medium">Total Señas</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">${deposits.toLocaleString()}</p>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Plus size={16} className="text-green-500" />
                            <p className="text-sm font-medium">Otros Ingresos</p>
                        </div>
                        <p className="text-2xl font-bold text-green-600">${otherIncome.toLocaleString()}</p>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-secondary shadow-sm">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <DollarSign size={16} className="text-destructive" />
                            <p className="text-sm font-medium">Gastos Totales</p>
                        </div>
                        <p className="text-2xl font-bold text-destructive">-${Math.abs(totalExpenses).toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-semibold text-lg text-foreground mb-2">Movimientos Recientes</h3>
                        {allMovements.length === 0 ? (
                            <div className="bg-card p-8 rounded-xl border border-dashed border-border text-center">
                                <p className="text-muted-foreground">No hay movimientos registrados.</p>
                            </div>
                        ) : (
                            allMovements.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)).map((movement) => (
                                <ExpenseItem key={movement.id} expense={{
                                    ...movement,
                                    type: movement.type as any
                                }} />
                            ))

                        )}
                    </div>

                    {/* Form */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit">
                        <h3 className="font-semibold text-lg mb-4 text-primary">Nuevo Movimiento</h3>
                        <form action={addExpense} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
                                <select name="type" required className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground">
                                    <option value="expense">Egreso (Gasto)</option>
                                    <option value="income">Ingreso (Extra)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
                                <input name="description" type="text" required className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground" placeholder="Ej: Vuelo de globos, Limpieza..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Categoría</label>
                                <select name="category" className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground">
                                    <option>Mantenimiento</option>
                                    <option>Insumos</option>
                                    <option>Servicios</option>
                                    <option>Ventas</option>
                                    <option>Alquiler</option>
                                    <option>Otros</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Monto</label>
                                <div className="relative">
                                    <span className="absolute left-2 top-2 text-muted-foreground">$</span>
                                    <input name="amount" type="number" required className="w-full border border-border rounded-md p-2 pl-6 text-sm bg-background text-foreground" placeholder="100" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors shadow-md">
                                Registrar Movimiento
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
