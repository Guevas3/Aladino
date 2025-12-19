import Link from "next/link";
import { Calendar, DollarSign, Users, Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar placeholder */}
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Pelotero Manager</h1>
        <div className="flex gap-4">
          <Link href="/bookings" className="text-slate-600 hover:text-slate-900 font-medium">Bookings</Link>
          <Link href="/finance" className="text-slate-600 hover:text-slate-900 font-medium">Finance</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
            <p className="text-slate-500">Overview of your event venue.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-slate-900 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-slate-800 transition-colors">
              <Plus size={18} /> New Booking
            </button>
            <button className="bg-white border text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors">
              Add Expense
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Upcoming Events" value="12" icon={<Calendar className="text-blue-500" />} />
          <StatCard title="Monthly Revenue" value="$4,250" icon={<DollarSign className="text-emerald-500" />} />
          <StatCard title="Pending Deposits" value="$800" icon={<Users className="text-orange-500" />} />
        </div>

        {/* Recent Activity / List */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-semibold text-lg mb-4 text-slate-900">Recent Bookings</h3>
          <div className="space-y-4">
            <div className="p-8 text-center border-2 border-dashed rounded-lg">
              <p className="text-slate-500 text-sm">No recent bookings found.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-full border">
        {icon}
      </div>
    </div>
  )
}
