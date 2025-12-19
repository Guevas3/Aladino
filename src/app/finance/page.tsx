import { db } from "@/lib/db";
import { expenses } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { DollarSign, Tag, Calendar as CalendarIcon } from "lucide-react";

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
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Finance Management</h1>

                <div className="mb-8">
                    <div className="bg-white p-6 rounded-xl border shadow-sm w-full md:w-1/3">
                        <p className="text-sm font-medium text-slate-500">Total Expenses</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">-${totalExpenses.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="md:col-span-2 space-y-4">
                        {allExpenses.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl border border-dashed text-center">
                                <p className="text-slate-500">No expenses recorded.</p>
                            </div>
                        ) : (
                            allExpenses.map((expense) => (
                                <div key={expense.id} className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{expense.description}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Tag size={14} /> {expense.category}</span>
                                            <span className="flex items-center gap-1"><CalendarIcon size={14} /> {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-red-600">-${expense.amount}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Form */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
                        <h3 className="font-semibold text-lg mb-4">Add Expense</h3>
                        <form action={addExpense} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <input name="description" type="text" required className="w-full border rounded-md p-2 text-sm" placeholder="Rent, Supplies..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select name="category" className="w-full border rounded-md p-2 text-sm">
                                    <option>Maintenance</option>
                                    <option>Supplies</option>
                                    <option>Utilities</option>
                                    <option>Rent</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-2 top-2 text-slate-400">$</span>
                                    <input name="amount" type="number" required className="w-full border rounded-md p-2 pl-6 text-sm" placeholder="100" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition-colors">
                                Add Expense
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
