import Link from "next/link";
import { Calendar as CalendarIcon, DollarSign, Users, Plus, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { bookings } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { DashboardCalendar } from "@/components/DashboardCalendar";

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Fetch real data
  const upcomingEventsCount = await db.select({ count: sql<number>`count(*)` }).from(bookings).where(sql`status = 'confirmed'`);
  const totalRevenueResult = await db.select({ total: sql<number>`sum(${bookings.totalAmount})` }).from(bookings);
  const totalDepositsResult = await db.select({ total: sql<number>`sum(${bookings.depositAmount})` }).from(bookings);


  // Recent bookings
  const recentBookings = await db.select().from(bookings).orderBy(desc(bookings.date)).limit(5);

  // All booked dates for calendar (exclude cancelled)
  const allBookings = await db.select().from(bookings).where(sql`status != 'cancelled' OR status IS NULL`);
  const bookedDates = allBookings.map(b => new Date(b.date));

  const upcomingCount = upcomingEventsCount[0]?.count || 0;
  // Convert to number strictly to avoid NaN if null
  const revenue = Number(totalRevenueResult[0]?.total || 0).toLocaleString();
  const deposits = Number(totalDepositsResult[0]?.total || 0).toLocaleString();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Gestor de Pelotero</h1>
        <div className="flex gap-4">
          <Link href="/bookings" className="text-muted-foreground hover:text-primary font-medium transition-colors">Reservas</Link>
          <Link href="/finance" className="text-muted-foreground hover:text-primary font-medium transition-colors">Finanzas</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-primary tracking-tight">Panel de Control</h2>
            <p className="text-muted-foreground">Resumen de tu salón de eventos.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/bookings" className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md">
              <Plus size={18} /> Nueva Reserva
            </Link>
            <Link href="/finance" className="bg-secondary text-secondary-foreground border border-secondary px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors shadow-sm font-medium flex items-center">
              Agregar Gasto
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Eventos Confirmados" value={String(upcomingCount)} icon={<CalendarIcon className="text-primary" />} />
          <StatCard title="Ingresos Totales" value={`$${revenue}`} icon={<DollarSign className="text-secondary-foreground" />} />
          <StatCard title="Total Señas" value={`$${deposits}`} icon={<Users className="text-accent-foreground" />} />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dashboard Calendar - Takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            {/* Passed full bookings array now */}
            <DashboardCalendar bookings={allBookings} />
          </div>

          {/* Recent Activity / List - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6 h-full">
              <h3 className="font-semibold text-lg mb-4 text-foreground">Reservas Recientes</h3>
              <div className="space-y-4">
                {recentBookings.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground text-sm">No hay reservas recientes.</p>
                  </div>
                ) : (
                  recentBookings.map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center border-b border-border last:border-0 pb-4 last:pb-0">
                      <div>
                        <p className="font-medium text-foreground">{booking.clientName}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarIcon size={14} /> {new Date(booking.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {booking.timeSlot}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-semibold text-primary">${booking.totalAmount}</span>
                        <span className="block text-xs text-muted-foreground">Seña: ${booking.depositAmount}</span>
                        <p className="text-xs text-muted-foreground uppercase mt-1">{booking.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
      </div>
      <div className="p-4 bg-muted/20 rounded-full border border-border/50">
        {icon}
      </div>
    </div>
  )
}
