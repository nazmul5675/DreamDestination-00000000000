"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Trash2, Eye, MapPin, Loader2, Plus, AlertCircle,
    ExternalLink, Layers, Search, Compass, MoreVertical
} from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import Link from "next/link";

export default function ManageDestinationsClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchMyDestinations();
        }
    }, [status, page]);

    const fetchMyDestinations = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/destinations?userOnly=true&page=${page}&limit=10`);
            const data = await res.json();
            setDestinations(data.destinations);
            setMeta(data.meta);
        } catch (error) {
            toast.error("Failed to load your destinations");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this destination?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/destinations/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Destination deleted successfully");
                setDestinations(destinations.filter(d => d._id !== id));
            } else {
                const err = await res.json();
                toast.error(err.message || "Delete failed");
            }
        } catch (error) {
            toast.error("An error occurred while deleting");
        } finally {
            setDeletingId(null);
        }
    };

    if (status === "loading" || loading && status === "authenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-600" size={48} />
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50/50">
            <div className="container-max">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-sky-600 font-bold mb-2 uppercase tracking-widest text-xs">
                            <Layers size={14} />
                            <span>User Dashboard</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">Manage Destinations</h1>
                        <p className="text-slate-500 text-lg">You have published {destinations.length} destinations so far.</p>
                    </div>
                    <Link
                        href="/add-destination"
                        className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-sky-100 hover:shadow-sky-200 active:scale-95"
                    >
                        <Plus size={20} /> Add New Destination
                    </Link>
                </div>

                {/* Content Section */}
                {destinations.length > 0 ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Destination</th>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Location</th>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Category</th>
                                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {destinations.map((dest) => (
                                        <tr key={dest._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={dest.imageUrl}
                                                        alt={dest.title}
                                                        className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-100"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-lg">{dest.title}</p>
                                                        <p className="text-sm text-slate-400 font-medium">Added on {new Date(dest.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                                    <MapPin size={16} className="text-sky-500" />
                                                    <span>{dest.country}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                    {dest.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={`/destinations/${dest._id}`}
                                                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-sky-600 hover:border-sky-100 hover:bg-sky-50 transition-all shadow-sm"
                                                        title="View Publicly"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(dest._id)}
                                                        disabled={deletingId === dest._id}
                                                        className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
                                                        title="Delete Permanently"
                                                    >
                                                        {deletingId === dest._id ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                            {destinations.map((dest) => (
                                <div key={dest._id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={dest.imageUrl}
                                            alt={dest.title}
                                            className="w-20 h-20 rounded-2xl object-cover shadow-sm"
                                        />
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight">{dest.title}</h3>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleDelete(dest._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                                                <MapPin size={14} className="text-sky-500" />
                                                <span>{dest.country}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {dest.category}
                                        </span>
                                        <Link href={`/destinations/${dest._id}`} className="text-sky-600 font-bold text-sm flex items-center gap-1">
                                            View Details <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={(p) => setPage(p)}
                        />
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-32 text-center max-w-3xl mx-auto overflow-hidden relative">
                        <div className="absolute inset-0 z-0 opacity-[0.03]">
                            <Compass size={400} className="mx-auto rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-8 text-sky-600">
                                <Compass size={48} className="animate-pulse" />
                            </div>
                            <h3 className="text-3xl font-extrabold text-slate-900 mb-4">No Destinations Yet</h3>
                            <p className="text-slate-500 text-lg mb-10 max-w-sm mx-auto">
                                Your travel portfolio is waiting for its first masterpiece. Start sharing your adventures today.
                            </p>
                            <Link
                                href="/add-destination"
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all inline-block active:scale-95"
                            >
                                Add Your First Destination
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}