import { db } from "@/lib/db";
import { bookings } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { CalendarIcon, Clock, DollarSign } from "lucide-react";

export default async function BookingsPage() {
    const allBookings = await db.select().from(bookings);

    async function addBooking(formData: FormData) {
        "use server";
        const clientName = formData.get("clientName") as string;
        const dateStr = formData.get("date") as string;
        const timeSlot = formData.get("timeSlot") as string;
        const deposit = formData.get("deposit") as string;
        const total = formData.get("total") as string;

        await db.insert(bookings).values({
            clientName,
            date: new Date(dateStr),
            timeSlot,
            depositAmount: deposit,
            totalAmount: total,
            status: 'confirmed'
        });

        revalidatePath("/bookings");
        revalidatePath("/");
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Bookings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="md:col-span-2 space-y-4">
                        {allBookings.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl border border-dashed text-center">
                                <p className="text-slate-500">No bookings yet.</p>
                            </div>
                        ) : (
                            allBookings.map((booking) => (
                                <div key={booking.id} className="bg-white p-6 rounded-xl border shadow-sm flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{booking.clientName}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><CalendarIcon size={14} /> {new Date(booking.date).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {booking.timeSlot}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium mb-1">
                                            {booking.status}
                                        </span>
                                        <p className="font-bold text-slate-900">${booking.totalAmount}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Form */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
                        <h3 className="font-semibold text-lg mb-4">New Booking</h3>
                        <form action={addBooking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                                <input name="clientName" type="text" required className="w-full border rounded-md p-2 text-sm" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input name="date" type="date" required className="w-full border rounded-md p-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
                                <select name="timeSlot" className="w-full border rounded-md p-2 text-sm">
                                    <option>14:00 - 18:00</option>
                                    <option>18:00 - 22:00</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Deposit</label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-slate-400">$</span>
                                        <input name="deposit" type="number" required className="w-full border rounded-md p-2 pl-6 text-sm" placeholder="500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Total</label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-slate-400">$</span>
                                        <input name="total" type="number" required className="w-full border rounded-md p-2 pl-6 text-sm" placeholder="2000" />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition-colors">
                                Add Booking
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
