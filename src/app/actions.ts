"use server";

import { db } from "@/lib/db";
import { bookings, expenses } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function addBooking(formData: FormData) {
    const clientName = formData.get("clientName") as string;
    const dateStr = formData.get("date") as string;
    const timeSlot = formData.get("timeSlot") as string;
    const deposit = formData.get("deposit") as string;
    const total = formData.get("total") as string;

    if (!dateStr) {
        throw new Error("Date is required");
    }

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

export async function updateBookingBudget(id: number, total: string, deposit: string) {
    if (!id) throw new Error("ID required");

    await db.update(bookings)
        .set({
            totalAmount: total,
            depositAmount: deposit
        })
        .where(eq(bookings.id, id));

    revalidatePath("/bookings");
    revalidatePath("/");
}

export async function cancelBooking(id: number) {
    if (!id) throw new Error("ID required");

    await db.update(bookings)
        .set({ status: 'cancelled' })
        .where(eq(bookings.id, id));

    revalidatePath("/bookings");
    revalidatePath("/");
}

export async function addExpense(formData: FormData) {
    const description = formData.get("description") as string;
    const amount = formData.get("amount") as string;
    const category = formData.get("category") as string;

    await db.insert(expenses).values({
        description,
        amount,
        category,
        date: new Date()
    });

    revalidatePath("/finance");
    revalidatePath("/");
}

export async function updateExpense(id: number, amount: string, description: string) {
    if (!id) throw new Error("ID required");

    await db.update(expenses)
        .set({
            amount,
            description
        })
        .where(eq(expenses.id, id));

    revalidatePath("/finance");
    revalidatePath("/");
}

export async function deleteExpense(id: number) {
    if (!id) throw new Error("ID required");

    await db.delete(expenses)
        .where(eq(expenses.id, id));

    revalidatePath("/finance");
    revalidatePath("/");
}
