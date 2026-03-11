"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    MapPin,
    Users,
    MessageSquare,
    Trash2,
    Eye,
    Loader2,
    Settings,
    PlusCircle,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminDashboardClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        destinations: 0,
        users: 0,
        messages: 0,
        consultations: 0
    });
    const [recentDestinations, setRecentDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session && session.user.role !== "admin") {
            router.push("/");
        }

        const fetchAdminData = async () => {
            try {
                const [statsRes, destRes] = await Promise.all([
                    fetch("/api/admin/stats"),
                    fetch("/api/admin/destinations?limit=5")
                ]);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData.stats || statsData);
                }

                if (destRes.ok) {
                    const destData = await destRes.json();
                    // Handle paginated response: { destinations: [], meta: {} }
                    const destinationsList = Array.isArray(destData) ? destData : (destData.destinations || []);
                    setRecentDestinations(destinationsList.slice(0, 5));
                }
            } catch (error) {
                console.error("Failed to fetch admin data", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (status === "authenticated" && session.user.role === "admin") {
            fetchAdminData();
        }
    }, [status, session]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this destination?")) return;
        try {
            const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Deleted successfully");
                setRecentDestinations(prev => prev.filter(d => d._id !== id));
                setStats(prev => ({ ...prev, destinations: prev.destinations - 1 }));
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-sky-600" size={48} />
            </div>
        );
    }

    const cards = [
        { title: "Total Destinations", val: stats.destinations, icon: <MapPin className="text-sky-600" />, color: "bg-sky-50", link: "/admin/destinations" },
        { title: "Active Users", val: stats.users, icon: <Users className="text-indigo-600" />, color: "bg-indigo-50", link: "/admin/users" },
        { title: "Consultations", val: stats.consultations, icon: <MessageSquare className="text-violet-600" />, color: "bg-violet-50", link: "/admin/consultations" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-500 font-medium">Welcome back, {session.user.name}. Here's what's happening today.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/add-destination"
                            className="bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-700 transition-all shadow-md active:scale-95"
                        >
                            <PlusCircle size={20} /> Add Destination
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {cards.map((card, i) => (
                        <Link href={card.link} key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-all group">
                            <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                                <p className="text-3xl font-extrabold text-slate-900">{card.val}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Content Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
                    <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h2 className="text-xl font-extrabold text-slate-900">Recent Destinations</h2>
                        <Link href="/admin/destinations" className="text-sky-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Destination</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Country</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentDestinations.length > 0 ? recentDestinations.map((dest) => (
                                    <tr key={dest._id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={dest.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                <span className="font-bold text-slate-900">{dest.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-600 font-medium">{dest.country}</td>
                                        <td className="px-8 py-4">
                                            <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-xs font-bold">
                                                {dest.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link href={`/destinations/${dest._id}`} className="text-slate-400 hover:text-sky-600 transition-colors">
                                                    <Eye size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(dest._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-medium">No destinations found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-extrabold text-slate-900 mb-6 font-inherit">Admin Quick Navigation</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/users" className="p-6 bg-slate-50 rounded-2xl hover:bg-sky-50 transition-all border border-transparent hover:border-sky-100 group">
                                <Users className="text-slate-400 mb-3 group-hover:text-sky-600 transition-colors" size={24} />
                                <p className="font-bold text-slate-900">Manage Users</p>
                                <p className="text-sm text-slate-500 mt-1">View activity</p>
                            </Link>
                            <Link href="/admin/consultations" className="p-6 bg-slate-50 rounded-2xl hover:bg-violet-50 transition-all border border-transparent hover:border-violet-100 group">
                                <MessageSquare className="text-slate-400 mb-3 group-hover:text-violet-600 transition-colors" size={24} />
                                <p className="font-bold text-slate-900">Consultations</p>
                                <p className="text-sm text-slate-500 mt-1">Inbox management</p>
                            </Link>
                            <Link href="/admin/messages" className="p-6 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 group">
                                <MessageSquare className="text-slate-400 mb-3 group-hover:text-emerald-600 transition-colors" size={24} />
                                <p className="font-bold text-slate-900">Contact Forms</p>
                                <p className="text-sm text-slate-500 mt-1">User inquiries</p>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl shadow-slate-200 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-600/20 transition-all"></div>
                        <h3 className="text-2xl font-extrabold mb-4 relative z-10">Advanced Controls</h3>
                        <p className="text-slate-400 mb-8 font-medium relative z-10">Access global system settings, moderate content, and view deep analytics for your travel platform.</p>
                        <button className="bg-sky-600 text-white font-bold py-4 px-8 rounded-2xl w-fit hover:bg-sky-700 transition-all shadow-xl shadow-sky-900/40 relative z-10 active:scale-95">
                            Platform Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

