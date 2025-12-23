import Link from "next/link";
import { Calendar as CalendarIcon, DollarSign, Users, Plus, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { bookings } from "@/db/schema";
import { desc, sql, eq, and } from "drizzle-orm";
import { DashboardCalendar } from "@/components/DashboardCalendar";
import { logout } from "@/app/actions";
import { LogOut, Edit2 } from "lucide-react";
import { BookingItem } from "@/components/BookingItem";
import { ClearListButton, ResetFinancialsButton } from "@/components/DashboardActions";


export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Fetch real data
  const upcomingEventsCount = await db.select({ count: sql<number>`count(*)` }).from(bookings).where(and(eq(bookings.status, 'confirmed'), eq(bookings.isExcludedFromStats, false)));
  const totalRevenueResult = await db.select({ total: sql<number>`sum(${bookings.totalAmount})` }).from(bookings).where(and(sql`(status != 'cancelled' OR status IS NULL)`, eq(bookings.isExcludedFromStats, false)));
  const totalDepositsResult = await db.select({ total: sql<number>`sum(${bookings.depositAmount})` }).from(bookings).where(eq(bookings.isExcludedFromStats, false));


  // Recent bookings
  const recentBookings = await db.select().from(bookings).where(eq(bookings.isArchived, false)).orderBy(desc(bookings.date)).limit(5);

  // Confirmed bookings for the bottom of the calendar
  const confirmedBookings = await db.select().from(bookings).where(and(eq(bookings.status, 'confirmed'), eq(bookings.isArchived, false))).orderBy(desc(bookings.date));

  // All booked dates for calendar (exclude cancelled and archived)
  const allBookings = await db.select().from(bookings).where(and(sql`(status != 'cancelled' OR status IS NULL)`, eq(bookings.isArchived, false)));
  const bookedDates = allBookings.map(b => new Date(b.date));

  const upcomingCount = upcomingEventsCount[0]?.count || 0;
  // Convert to number strictly to avoid NaN if null
  const revenue = Number(totalRevenueResult[0]?.total || 0).toLocaleString();
  const deposits = Number(totalDepositsResult[0]?.total || 0).toLocaleString();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Aladino Pelotero</h1>
        <div className="flex items-center gap-4">
          <form action={logout}>
            <button className="text-muted-foreground hover:text-destructive transition-colors" title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </form>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Eventos Confirmados" value={String(upcomingCount)} icon={<CalendarIcon className="text-primary" />} />
          <StatCard
            title="Ingresos Totales"
            value={`$${revenue}`}
            icon={<DollarSign className="text-secondary-foreground" />}
            editHref="/bookings"
          />
          <StatCard
            title="Total Señas"
            value={`$${deposits}`}
            icon={<Users className="text-accent-foreground" />}
            editHref="/bookings"
          />
          <ResetFinancialsButton />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dashboard Calendar - Takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            {/* Passed full bookings array now */}
            <DashboardCalendar bookings={allBookings.map(b => ({
              ...b,
              status: b.status || 'pending'
            }))} />

            {/* Confirmed Bookings list at the bottom of calendar */}
            <div className="mt-8 bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="font-semibold text-lg mb-4 text-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Próximas Confirmadas
              </h3>
              <div className="space-y-4">
                {confirmedBookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">No hay reservas confirmadas.</p>
                ) : (
                  confirmedBookings.map(booking => (
                    <BookingItem key={booking.id} compact={true} booking={{
                      ...booking,
                      status: booking.status || 'pending'
                    }} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity / List - Right column on LG */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-sm border border-border p-4 sm:p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-foreground">Reservas Recientes</h3>
                <ClearListButton />
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentBookings.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground text-sm">No hay reservas recientes.</p>
                  </div>
                ) : (
                  recentBookings.map((booking) => (
                    <BookingItem key={booking.id} booking={{
                      ...booking,
                      status: booking.status || 'pending'
                    }} />
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

function StatCard({ title, value, icon, editHref }: { title: string, value: string, icon: React.ReactNode, editHref?: string }) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between relative group transition-all hover:border-primary/50">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        {editHref && (
          <Link
            href={editHref}
            className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
          >
            <Edit2 size={12} /> Editar Montos
          </Link>
        )}
      </div>
      <div className="p-4 bg-muted/20 rounded-full border border-border/50">
        {icon}
      </div>
    </div>
  )
}
