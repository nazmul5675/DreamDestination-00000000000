"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    MapPin, Trash2, Edit3, Eye, Loader2, ArrowLeft,
    Search, Filter, Plus, Calendar, DollarSign
} from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/shared/Pagination";

export default function AdminDestinationsClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Beach", "Mountain", "City", "Adventure", "Nature", "Historical"];

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session && session.user.role !== "admin") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchDestinations();
        }
    }, [status, session, page, selectedCategory]);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== "All") params.append("category", selectedCategory);
            if (searchTerm) params.append("search", searchTerm);
            params.append("page", page.toString());
            params.append("limit", "10");

            const res = await fetch(`/api/admin/destinations?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setDestinations(data.destinations);
                setMeta(data.meta);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchDestinations();
    };

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setPage(1);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this destination? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Destination removed successfully");
                setDestinations(prev => prev.filter(d => d._id !== id));
            } else {
                toast.error("Failed to delete destination");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filtered = destinations.filter(dest => {
        const matchesSearch = dest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-600" size={48} />
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50/50">
            <div className="container-max">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <Link href="/admin" className="text-sky-600 font-bold flex items-center gap-2 mb-4 hover:gap-3 transition-all">
                            <ArrowLeft size={18} /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">Platform Content</h1>
                        <p className="text-slate-500 text-lg">Manage all {destinations.length} destinations published on the platform.</p>
                    </div>
                    <Link
                        href="/add-destination"
                        className="bg-sky-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95"
                    >
                        <Plus size={20} /> Create New
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center justify-between font-inherit">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all ${selectedCategory === cat
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or country..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Destination</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Creator</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Budget</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {destinations.map((dest) => (
                                    <tr key={dest._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <img src={dest.imageUrl} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-100" />
                                                <div>
                                                    <p className="font-bold text-slate-900 text-lg leading-tight">{dest.title}</p>
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                                                        <MapPin size={12} className="text-sky-500" />
                                                        <span>{dest.location}, {dest.country}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-slate-600 font-medium text-sm">
                                                <p className="text-slate-900 font-bold">{dest.createdByEmail === "admin@dreamdestination.com" ? "System Admin" : "User Contributor"}</p>
                                                <p className="text-slate-400 text-xs">{dest.createdByEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-extrabold text-lg">${dest.estimatedBudget}</span>
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">{dest.bestSeason}</span>
                                            </div>
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
                                                <Link
                                                    href={`/admin/destinations/${dest._id}/edit`}
                                                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-amber-600 hover:border-amber-100 hover:bg-amber-50 transition-all shadow-sm"
                                                    title="Edit Content"
                                                >
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(dest._id)}
                                                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {destinations.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Search size={48} className="mb-4 opacity-20" />
                                                <p className="text-xl font-bold">No results found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination
                    currentPage={meta.currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={(p) => setPage(p)}
                />
            </div>
        </div>
    );
}
