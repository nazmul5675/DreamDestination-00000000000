"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare, Mail, User, Clock, Loader2, ArrowLeft, MoreHorizontal, Inbox, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminMessagesClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session && session.user.role !== "admin") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchMessages();
        }
    }, [status, session]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/messages");
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Message deleted");
                setMessages(prev => prev.filter(m => m._id !== id));
            } else {
                toast.error("Failed to delete message");
            }
        } catch (error) {
            toast.error("An error occurred");
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
        <div className="pt-32 pb-24 min-h-screen bg-slate-50/50">
            <div className="container-max">
                <div className="mb-12">
                    <Link href="/admin" className="text-sky-600 font-bold flex items-center gap-2 mb-4 hover:gap-3 transition-all">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">User Feedback</h1>
                    <p className="text-slate-500 text-lg">Read and respond to messages from your global travel community.</p>
                </div>

                {messages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {messages.map((msg) => (
                            <div key={msg._id} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all group font-inherit">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-extrabold text-slate-900 leading-tight">{msg.name}</p>
                                            <div className="flex items-center gap-2 text-slate-400 text-sm mt-1 font-bold">
                                                <Mail size={14} /> <span>{msg.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full text-slate-400 text-xs font-bold uppercase tracking-tighter">
                                        <Clock size={12} />
                                        <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="inline-block bg-slate-50 px-4 py-1 rounded-xl text-sky-600 text-xs font-bold uppercase tracking-widest border border-slate-100">
                                        {msg.subject || "General Inquiry"}
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-pretty font-medium whitespace-pre-wrap">
                                        "{msg.message}"
                                    </p>
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-50 flex justify-between items-center">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleDelete(msg._id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <button className="text-slate-400 hover:text-sky-600 transition-colors p-2 hover:bg-sky-50 rounded-lg">
                                            <MoreHorizontal size={24} />
                                        </button>
                                    </div>
                                    <a
                                        href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-sky-600 transition-all active:scale-95"
                                    >
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 py-32 text-center max-w-2xl mx-auto font-inherit">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                            <Inbox size={48} />
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Inbox is Clear</h3>
                        <p className="text-slate-500 text-lg">No one has sent a message yet. Good things take time!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
