"use server";

import { db } from "@/lib/db";
import { bookings, expenses } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const USER = process.env.ADMIN_USER || "matias";
const PASS = process.env.ADMIN_PASSWORD || "aladinopelotero";

export async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (username === USER && password === PASS) {
        // Set cookie
        (await cookies()).set("auth_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        redirect("/");
    } else {
        return { error: "Credenciales inválidas" };
    }
}

export async function logout() {
    (await cookies()).delete("auth_session");
    redirect("/login");
}

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

export async function completeBooking(id: number) {
    if (!id) throw new Error("ID required");

    await db.update(bookings)
        .set({ status: 'completed' })
        .where(eq(bookings.id, id));

    revalidatePath("/bookings");
    revalidatePath("/");
}

export async function clearRecentBookings() {
    await db.update(bookings)
        .set({ isArchived: true });

    revalidatePath("/");
    revalidatePath("/bookings");
}

export async function resetFinancialStats() {
    await db.update(bookings)
        .set({ isExcludedFromStats: true });

    await db.update(expenses)
        .set({ isExcludedFromStats: true });

    revalidatePath("/");
    revalidatePath("/finance");
}

export async function addExpense(formData: FormData) {
    const description = formData.get("description") as string;
    const amount = formData.get("amount") as string;
    const category = formData.get("category") as string;
    const type = (formData.get("type") as 'income' | 'expense') || 'expense';

    await db.insert(expenses).values({
        description,
        amount,
        category,
        type,
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
