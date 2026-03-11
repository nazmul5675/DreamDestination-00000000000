"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Calendar, DollarSign, ArrowLeft, Loader2, Star, CheckCircle2, Globe } from "lucide-react";
import Link from "next/link";

export default function DestinationDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchDestination();
        }
    }, [id]);

    const fetchDestination = async () => {
        try {
            const res = await fetch(`/api/destinations/${id}`);
            if (!res.ok) throw new Error("Not found");
            const data = await res.json();
            setDestination(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="text-sky-600 animate-spin" size={48} />
            </div>
        );
    }

    if (!destination) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Destination Not Found</h1>
                <p className="text-slate-600 mb-8">The destination you are looking for does not exist or has been removed.</p>
                <Link href="/destinations" className="bg-sky-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Destinations
                </Link>
            </div>
        );
    }

    return (
        <div className="pb-24">
            {/* Hero Header */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <img
                    src={destination.imageUrl}
                    alt={destination.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                <div className="absolute inset-x-0 bottom-0 pb-16">
                    <div className="container-max">
                        <button
                            onClick={() => router.back()}
                            className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 w-fit"
                        >
                            <ArrowLeft size={18} /> Back
                        </button>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-sky-400 font-bold mb-4 uppercase tracking-[0.2em] text-sm">
                                    <Star size={16} fill="currentColor" />
                                    <span>Premium Experience</span>
                                </div>
                                <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
                                    {destination.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={20} className="text-sky-400" />
                                        <span className="font-medium text-lg">{destination.location}, {destination.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                                        <span className="text-sm font-bold uppercase tracking-wider">{destination.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container-max mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Experience Overview</h2>
                            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap text-pretty">
                                {destination.fullDescription}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5">
                                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Calendar className="text-sky-600" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Best Season</h4>
                                    <p className="text-xl font-bold text-slate-900">{destination.bestSeason}</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-5">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <DollarSign className="text-emerald-600" size={28} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Budget</h4>
                                    <p className="text-xl font-bold text-slate-900">${destination.estimatedBudget}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-6">What's Included</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Expert local guide selection",
                                    "Verified accommodation list",
                                    "Traditional cultural activities",
                                    "Transport & Logistics mapping",
                                    "Hidden gem recommendations",
                                    "24/7 Virtual Support"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <CheckCircle2 className="text-sky-500" size={20} />
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white sticky top-28">
                            <h3 className="text-2xl font-bold mb-6">Plan Your Trip</h3>
                            <p className="text-slate-400 mb-8">
                                Ready to explore <span className="text-white font-bold">{destination.title}</span>? Get started with our premium planning tool.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-3 border-b border-slate-800">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="font-bold">7-14 Days Recommended</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-slate-800">
                                    <span className="text-slate-400">Difficulty</span>
                                    <span className="font-bold text-sky-400">Moderate</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-slate-400">Language</span>
                                    <span className="font-bold">Local & English</span>
                                </div>
                            </div>


                            <button
                                onClick={() => {
                                    if (status === "unauthenticated") {
                                        router.push(`/login?callbackUrl=/destinations/${id}`);
                                    } else {
                                        router.push(`/consultation?destinationId=${id}`);
                                    }
                                }}
                                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-sky-900/40 active:scale-95"
                            >
                                Book a Consultation
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-4 text-slate-500">
                                <Globe size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Global Trusted Service</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
