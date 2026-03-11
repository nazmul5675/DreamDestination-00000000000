"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, Mail, Shield, ShieldCheck, Loader2, ArrowLeft, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminUsersClient() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session && session.user.role !== "admin") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchUsers();
        }
    }, [status, session]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [updatingRole, setUpdatingRole] = useState(null);

    const handleRoleChange = async (user) => {
        if (user.email === session.user.email) {
            toast.error("You cannot change your own role");
            return;
        }

        const newRole = user.role === "admin" ? "user" : "admin";
        setUpdatingRole(user._id);

        try {
            const res = await fetch(`/api/admin/users/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (res.ok) {
                toast.success(`Role updated to ${newRole}`);
                setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to update role");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setUpdatingRole(null);
        }
    };

    const handleDelete = async (user) => {
        if (user.email === session.user.email) {
            toast.error("You cannot delete your own account");
            return;
        }

        if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/users/${user._id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("User deleted successfully");
                setUsers(prev => prev.filter(u => u._id !== user._id));
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to delete user");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">Manage Users</h1>
                        <p className="text-slate-500 text-lg">Detailed overview of all registered platform members.</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search names or emails..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
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
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">User Profile</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Auth Method</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Role</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Joined Date</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 font-inherit">
                                                    {user.image ? (
                                                        <img src={user.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-slate-400 font-bold">{user.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.name}</p>
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                                        <Mail size={12} /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.provider === "google" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"
                                                }`}>
                                                {user.provider}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => handleRoleChange(user)}
                                                disabled={updatingRole === user._id || user.email === session.user.email}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${user.role === "admin"
                                                    ? "bg-sky-50 border-sky-100 text-sky-600 font-bold"
                                                    : "bg-slate-50 border-slate-100 text-slate-500 font-medium hover:bg-slate-100"
                                                    } ${user.email === session.user.email ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                                            >
                                                {updatingRole === user._id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : user.role === "admin" ? (
                                                    <ShieldCheck size={16} />
                                                ) : (
                                                    <Shield size={16} />
                                                )}
                                                <span>{user.role === "admin" ? "Administrator" : "Traveler"}</span>
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-slate-400 font-medium font-inherit">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className={`p-3 rounded-xl transition-all shadow-sm border ${user.email === session.user.email
                                                    ? "opacity-50 cursor-not-allowed bg-slate-50 text-slate-300 border-slate-100"
                                                    : "bg-white border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50"
                                                    }`}
                                                disabled={user.email === session.user.email}
                                                title={user.email === session.user.email ? "Cannot delete yourself" : "Delete User"}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-12 text-center text-slate-400 font-bold">No users found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
