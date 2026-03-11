"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, PlusCircle, LayoutDashboard, ChevronDown, Calendar, MessageSquare } from "lucide-react";

export default function Navbar() {
    // Navbar Version: 1.2 (Updated Labels)
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Progress Bar Logic
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            const progressBar = document.getElementById("scroll-progress");
            if (progressBar) progressBar.style.width = scrolled + "%";
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Destinations", href: "/destinations" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/50 py-3" : "bg-transparent py-5"
                }`}
        >
            {/* Scroll Progress Bar */}
            <div className="absolute top-0 left-0 h-[2px] bg-sky-600 transition-all duration-150 z-[60]" id="scroll-progress"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-[20deg] group-hover:scale-110 transition-all duration-300 shadow-lg shadow-sky-600/20">
                            D
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${scrolled ? "text-slate-900" : "text-slate-900"}`}>
                            DreamDestination
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-slate-600 hover:text-sky-600 font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors"
                                >
                                    {session.user.image ? (
                                        <img src={session.user.image} alt={session.user.name} className="w-6 h-6 rounded-full" />
                                    ) : (
                                        <User size={18} className="text-slate-600" />
                                    )}
                                    <span className="text-sm font-semibold text-slate-700">{session.user.name.split(" ")[0]}</span>
                                    <ChevronDown size={14} className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-[60]">
                                        <div className="px-5 py-4 border-b border-slate-50 mb-2 bg-slate-50/50">
                                            <p className="text-sm font-extrabold text-slate-900 truncate">{session.user.name}</p>
                                            <p className="text-xs text-slate-500 truncate font-medium">{session.user.email}</p>
                                        </div>
                                        <div className="px-2 pb-2 space-y-1">
                                            {session.user.role === "admin" && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setShowDropdown(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-sky-600 bg-sky-50/50 hover:bg-sky-50 rounded-xl transition-all group border border-sky-100"
                                                >
                                                    <LayoutDashboard size={18} className="text-sky-600" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            )}
                                            <Link
                                                href="/add-destination"
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all group"
                                            >
                                                <PlusCircle size={18} className="text-slate-400 group-hover:text-sky-600" />
                                                <span>Add Destination</span>
                                            </Link>
                                            <Link
                                                href="/manage-destinations"
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all group"
                                            >
                                                <LayoutDashboard size={18} className="text-slate-400 group-hover:text-sky-600" />
                                                <span>Manage Destinations</span>
                                            </Link>
                                            {session.user.role !== "admin" && (
                                                <Link
                                                    href="/my-consultations"
                                                    onClick={() => setShowDropdown(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all group"
                                                >
                                                    <Calendar size={18} className="text-slate-400 group-hover:text-sky-600" />
                                                    <span>My Consultations</span>
                                                </Link>
                                            )}
                                            {session.user.role === "admin" && (
                                                <Link
                                                    href="/admin/consultations"
                                                    onClick={() => setShowDropdown(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-sky-600 hover:bg-sky-50 rounded-xl transition-all group"
                                                >
                                                    <MessageSquare size={18} className="text-sky-400 group-hover:text-sky-600" />
                                                    <span>Consultations Inbox</span>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="px-2 py-2 border-t border-slate-50 bg-slate-50/30">
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout User</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-slate-600 font-medium hover:text-sky-600 transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl p-6 animate-in slide-in-from-top-4">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-slate-700 hover:text-sky-600"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-slate-100" />
                        {session ? (
                            <>
                                <div className="flex items-center gap-3 px-2">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                                        {session.user.image ? (
                                            <img src={session.user.image} alt="" className="rounded-full" />
                                        ) : (
                                            <User />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{session.user.name}</p>
                                        <p className="text-sm text-slate-500">{session.user.email}</p>
                                    </div>
                                </div>
                                {session.user.role === "admin" && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-3 py-4 text-sky-700 font-bold bg-sky-50 rounded-2xl border border-sky-100"
                                    >
                                        <LayoutDashboard size={22} className="text-sky-600" /> Admin Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/add-destination"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-4 text-slate-700 font-bold bg-slate-50 rounded-2xl"
                                >
                                    <PlusCircle size={22} className="text-sky-600" /> Add Destination
                                </Link>

                                {session.user.role !== "admin" && (
                                    <Link
                                        href="/my-consultations"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-3 py-4 text-slate-700 font-bold bg-slate-50 rounded-2xl"
                                    >
                                        <Calendar size={22} className="text-sky-600" /> My Consultations
                                    </Link>
                                )}
                                {session.user.role === "admin" && (
                                    <Link
                                        href="/admin/consultations"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-3 py-4 text-sky-700 font-bold bg-sky-50 rounded-2xl"
                                    >
                                        <MessageSquare size={22} className="text-sky-600" /> Consultations Inbox
                                    </Link>
                                )}
                                <Link
                                    href="/manage-destinations"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-4 text-slate-700 font-bold bg-slate-50 rounded-2xl"
                                >
                                    <LayoutDashboard size={22} className="text-sky-600" /> Manage Destinations
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center gap-3 px-3 py-4 text-red-600 font-bold bg-red-50 rounded-2xl mt-2"
                                >
                                    <LogOut size={22} /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="text-center py-2 text-slate-700 font-medium border border-slate-200 rounded-xl"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="text-center py-2 bg-sky-600 text-white font-medium rounded-xl"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}