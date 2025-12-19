import Link from "next/link";
import { db } from "@/lib/db";
import { expenses } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { DollarSign, Tag, Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { ExpenseItem } from "@/components/ExpenseItem";


export default async function FinancePage() {
    const allExpenses = await db.select().from(expenses);

    const totalExpenses = allExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

    async function addExpense(formData: FormData) {
        "use server";
        const description = formData.get("description") as string;
        const amount = formData.get("amount") as string;
        const category = formData.get("category") as string;

        await db.insert(expenses).values({
            description,
            amount,
            category,
            date: new Date() // defaults to now
        });

        revalidatePath("/finance");
        revalidatePath("/");
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-primary">Gestión Financiera</h1>
                </div>

                <div className="mb-8">
                    <div className="bg-card p-6 rounded-xl border border-secondary shadow-sm w-full md:w-1/3">
                        <p className="text-sm font-medium text-muted-foreground">Gastos Totales</p>

                        <p className="text-3xl font-bold text-destructive mt-2">-${totalExpenses.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="md:col-span-2 space-y-4">
                        {allExpenses.length === 0 ? (
                            <div className="bg-card p-8 rounded-xl border border-dashed border-border text-center">
                                <p className="text-muted-foreground">No hay gastos registrados.</p>
                            </div>
                        ) : (
                            allExpenses.map((expense) => (
                                <ExpenseItem key={expense.id} expense={expense} />
                            ))

                        )}
                    </div>

                    {/* Form */}
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit">
                        <h3 className="font-semibold text-lg mb-4 text-primary">Agregar Gasto</h3>
                        <form action={addExpense} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
                                <input name="description" type="text" required className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground" placeholder="Alquiler, Insumos..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Categoría</label>
                                <select name="category" className="w-full border border-border rounded-md p-2 text-sm bg-background text-foreground">
                                    <option>Mantenimiento</option>
                                    <option>Insumos</option>
                                    <option>Servicios</option>
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
                                Agregar Gasto
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
