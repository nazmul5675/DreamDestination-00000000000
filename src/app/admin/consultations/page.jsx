"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Loader2, Search, Filter, Inbox, User,
    Mail, MapPin, Calendar, DollarSign, Users,
    MessageSquare, Send, CheckCircle2, Clock,
    ArrowLeft, MoreHorizontal, UserCheck, CheckCircle,
    ChevronRight, X, Phone
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminConsultationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showDetails, setShowDetails] = useState(false);

    // Reply form state
    const [adminReply, setAdminReply] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session && session.user.role !== "admin") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchConsultations();
        }
    }, [status, session]);

    // Update form state when selection changes
    useEffect(() => {
        const selected = consultations.find(c => c._id === selectedId);
        if (selected) {
            setAdminReply(selected.adminReply || "");
            setAdminNote(selected.adminNote || "");
        }
    }, [selectedId, consultations]);

    const fetchConsultations = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/consultations");
            if (res.ok) {
                const data = await res.json();
                setConsultations(data);
                if (data.length > 0 && !selectedId) {
                    setSelectedId(data[0]._id);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load consultations");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (statusOverride = null) => {
        if (!selectedId) return;
        setUpdatingStatus(true);

        const selected = consultations.find(c => c._id === selectedId);
        const newStatus = statusOverride || selected.status;

        try {
            const res = await fetch(`/api/consultations/${selectedId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: newStatus,
                    adminReply: adminReply,
                    adminNote: adminNote
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setConsultations(prev => prev.map(c => c._id === selectedId ? updated : c));
                toast.success("Consultation updated");
            } else {
                toast.error("Failed to update");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const selectedConsultation = consultations.find(c => c._id === selectedId);

    const filteredConsultations = consultations.filter(c => {
        const matchesSearch = c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.destinationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case "pending": return "bg-amber-100 text-amber-700";
            case "replied": return "bg-sky-100 text-sky-700";
            case "contacted": return "bg-emerald-100 text-emerald-700";
            case "closed": return "bg-slate-100 text-slate-500";
            default: return "bg-slate-100 text-slate-500";
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-600" size={48} />
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-slate-50 flex flex-col font-inherit">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            <MessageSquare className="text-sky-600" size={24} />
                            Consultation Inbox
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Manage {consultations.length} total customer inquiries</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by user, destination or email..."
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="replied">Replied</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Inbox Layout */}
            <div className="flex-grow flex overflow-hidden max-w-[1600px] mx-auto w-full relative">
                {/* Left Panel: List */}
                <div className={`w-full md:w-[400px] lg:w-[450px] border-r border-slate-200 bg-white overflow-y-auto no-scrollbar transition-all duration-300 ${showDetails ? 'hidden md:block' : 'block'}`}>
                    {filteredConsultations.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {filteredConsultations.map((item) => (
                                <button
                                    key={item._id}
                                    onClick={() => {
                                        setSelectedId(item._id);
                                        setShowDetails(true);
                                    }}
                                    className={`w-full text-left p-6 transition-all border-l-4 hover:bg-slate-50 ${selectedId === item._id
                                        ? "bg-sky-50/50 border-sky-600"
                                        : "border-transparent"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-extrabold text-slate-900 truncate pr-4">{item.userName}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0 ${getStatusStyles(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-sky-600 mb-2">{item.destinationTitle}</p>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8">
                                        {item.message}
                                    </p>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} /> {new Date(item.preferredDate).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1 italic">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center text-slate-400">
                            <Inbox size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold">No results found</p>
                        </div>
                    )}
                </div>

                {/* Right Panel: Details */}
                <div className={`flex-grow flex flex-col bg-slate-50/30 overflow-y-auto no-scrollbar transition-all duration-300 ${showDetails ? 'block' : 'hidden md:block'}`}>
                    {selectedConsultation ? (
                        <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-right-4 duration-500 font-inherit">
                            {/* Mobile Back Button */}
                            <button
                                onClick={() => setShowDetails(false)}
                                className="md:hidden flex items-center gap-2 text-sky-600 font-bold mb-6"
                            >
                                <ArrowLeft size={18} /> Back to Inbox
                            </button>

                            {/* User & Destination Hero */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center text-sky-600 shadow-inner">
                                            <User size={40} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">{selectedConsultation.userName}</h2>
                                            <div className="flex flex-wrap items-center gap-4 text-slate-500 mt-2 font-medium">
                                                <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400" /> {selectedConsultation.userEmail}</span>
                                                <span className="flex items-center gap-1.5"><Phone size={16} className="text-slate-400" /> {selectedConsultation.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Update Status</p>
                                        <div className="flex gap-2">
                                            {['pending', 'contacted', 'closed'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleUpdate(s)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedConsultation.status === s
                                                        ? "bg-slate-900 text-white border-slate-900"
                                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                                        }`}
                                                >
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Travel To</p>
                                        <p className="font-extrabold text-slate-900 flex items-center gap-1 italic"><MapPin size={14} className="text-sky-500" /> {selectedConsultation.destinationTitle}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Preferred Date</p>
                                        <p className="font-extrabold text-slate-900 flex items-center gap-1"><Calendar size={14} className="text-sky-500" /> {new Date(selectedConsultation.preferredDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Budget Plan</p>
                                        <p className="font-extrabold text-sky-600 flex items-center gap-1 leading-none text-xl">${selectedConsultation.budget}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Group Size</p>
                                        <p className="font-extrabold text-slate-900 flex items-center gap-1"><Users size={14} className="text-sky-500" /> {selectedConsultation.travelers} Persons</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                        <MessageSquare size={16} className="text-sky-600" />
                                        User Requirement Message
                                    </h4>
                                    <div className="p-8 bg-sky-50/30 rounded-3xl border border-sky-100/50 relative overflow-hidden">
                                        <p className="text-slate-700 leading-relaxed text-lg font-medium relative z-10 whitespace-pre-wrap italic">
                                            "{selectedConsultation.message}"
                                        </p>
                                        <MessageSquare size={120} className="absolute -bottom-10 -right-10 text-sky-50/50" />
                                    </div>
                                </div>
                            </div>

                            {/* Reply & Internal Notes Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col">
                                    <h4 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                                        <Send size={20} className="text-sky-600" />
                                        Expert Response
                                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-auto tracking-widest">(Visible to User)</span>
                                    </h4>
                                    <textarea
                                        className="flex-grow w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-slate-700 mb-6 resize-none"
                                        placeholder="Type your expert travel advice here..."
                                        rows="6"
                                        value={adminReply}
                                        onChange={(e) => setAdminReply(e.target.value)}
                                    ></textarea>
                                    <button
                                        onClick={() => handleUpdate("replied")}
                                        disabled={updatingStatus}
                                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-600 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {updatingStatus ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Send Advice Response</>}
                                    </button>
                                </div>

                                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-200 flex flex-col">
                                    <h4 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                                        <UserCheck size={20} className="text-sky-400" />
                                        Internal Admin Notes
                                        <span className="text-[10px] font-bold text-slate-500 uppercase ml-auto tracking-widest">(Private)</span>
                                    </h4>
                                    <textarea
                                        className="flex-grow w-full p-6 bg-white/5 border border-white/10 rounded-3xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium text-slate-300 mb-6 resize-none shadow-inner"
                                        placeholder="Add private observations, team notes, or follow-up details..."
                                        rows="6"
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                    ></textarea>
                                    <button
                                        onClick={() => handleUpdate()}
                                        className="w-full bg-white text-slate-900 font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-400 transition-all active:scale-[0.98]"
                                    >
                                        Save Private Notes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-300">
                            <MessageSquare size={80} className="mb-6 opacity-10" />
                            <p className="text-xl font-bold">Select a message to start expert consultation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
