"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Loader2, Calendar, MapPin, Clock,
    MessageSquare, ChevronRight, Inbox, RefreshCw,
    User, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MyConsultationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/my-consultations");
        } else if (status === "authenticated") {
            fetchConsultations();
        }
    }, [status]);

    const fetchConsultations = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/consultations");
            if (res.ok) {
                const data = await res.json();
                setConsultations(data);
            } else {
                toast.error("Failed to load consultations");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-amber-50 text-amber-600 border-amber-100";
            case "replied": return "bg-sky-50 text-sky-600 border-sky-100";
            case "contacted": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "closed": return "bg-slate-100 text-slate-500 border-slate-200";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const filteredConsultations = consultations.filter(item => {
        if (activeTab === "all") return true;
        if (activeTab === "pending") return item.status === "pending";
        if (activeTab === "replied") return item.status === "replied";
        return true;
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
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">My Consultations</h1>
                        <p className="text-slate-500 text-lg font-medium">Track your travel planning requests and expert advice.</p>
                    </div>
                    <button
                        onClick={fetchConsultations}
                        className="flex items-center gap-2 text-sky-600 font-bold bg-white px-5 py-2.5 rounded-xl border border-slate-200 hover:border-sky-200 hover:bg-sky-50 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none font-inherit">
                    {["all", "pending", "replied"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-all whitespace-nowrap ${activeTab === tab
                                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
                        </button>
                    ))}
                </div>

                {filteredConsultations.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {filteredConsultations.map((item) => (
                            <div key={item._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col font-inherit">
                                <div className="p-8 md:p-10">
                                    <div className="flex justify-between items-start mb-8 gap-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.destinationImageUrl}
                                                alt={item.destinationTitle}
                                                className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-50"
                                            />
                                            <div>
                                                <h3 className="text-xl font-extrabold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                                                    {item.destinationTitle}
                                                </h3>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1 font-medium">
                                                    <MapPin size={12} className="text-sky-500" />
                                                    <span>{item.destinationCountry}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Calendar size={10} /> Travel Date
                                                </p>
                                                <p className="text-sm font-extrabold text-slate-700">
                                                    {new Date(item.preferredDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                    <Clock size={10} /> Requested
                                                </p>
                                                <p className="text-sm font-extrabold text-slate-700">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <MessageSquare size={10} /> Your Message
                                            </p>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                                "{item.message.length > 120 ? item.message.substring(0, 120) + "..." : item.message}"
                                            </p>
                                        </div>

                                        {item.adminReply ? (
                                            <div className="bg-sky-50 rounded-3xl p-6 border border-sky-100 animate-in slide-in-from-top-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-white">
                                                        <User size={16} />
                                                    </div>
                                                    <span className="text-sm font-bold text-sky-800 tracking-tight">Expert Advice</span>
                                                </div>
                                                <p className="text-slate-700 font-medium leading-relaxed">
                                                    {item.adminReply}
                                                </p>
                                                <p className="text-[10px] text-sky-400 font-bold uppercase mt-4 tracking-tighter">
                                                    Replied on {new Date(item.repliedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 p-5 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                                <AlertCircle className="text-slate-300" size={18} />
                                                <p className="text-sm text-slate-400 font-medium">Awaiting expert review...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-32 text-center max-w-2xl mx-auto font-inherit">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                            <Inbox size={48} />
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">No Requests Yet</h3>
                        <p className="text-slate-500 text-lg mb-10">You haven't booked any consultations. Start your journey by exploring destinations.</p>
                        <Link
                            href="/destinations"
                            className="bg-sky-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-xl shadow-sky-100 inline-block active:scale-95"
                        >
                            Explore Destinations
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
