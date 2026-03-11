"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Loader2 } from "lucide-react";

export default function FeaturedDestinations() {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch("/api/destinations?featured=true&limit=3");
                const data = await res.json();
                setDestinations(data);
            } catch (error) {
                console.error("Failed to fetch featured destinations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <section className="section-padding bg-white">
            <div className="container-max">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                            Featured Destinations
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Carefully curated places for your next unforgettable journey. Handpicked by our travel experts.
                        </p>
                    </div>
                    <Link
                        href="/destinations"
                        className="flex items-center gap-2 text-sky-600 font-bold hover:gap-3 transition-all group"
                    >
                        View All Destinations <ArrowRight size={20} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="text-sky-600 animate-spin mb-4" size={48} />
                        <p className="text-slate-500 font-medium tracking-wide">Loading latest wonders...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((dest) => (
                            <div
                                key={dest._id}
                                className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={dest.imageUrl}
                                        alt={dest.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop";
                                        }}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-600 shadow-sm uppercase tracking-wider">
                                            {dest.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3 font-medium">
                                        <MapPin size={14} className="text-sky-500" />
                                        <span>{dest.country}</span>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-sky-600 transition-colors">
                                        {dest.title}
                                    </h3>
                                    <p className="text-slate-600 mb-8 line-clamp-2">
                                        {dest.shortDescription}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex justify-between items-center py-4 border-t border-slate-50">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Est. Budget</span>
                                                <span className="text-lg font-bold text-slate-900">${dest.estimatedBudget}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Experience</span>
                                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                    <Star size={16} fill="currentColor" />
                                                    <span>Premium</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/destinations/${dest._id}`}
                                            className="w-full bg-slate-900 text-white text-center py-4 rounded-2xl font-bold border border-slate-900 hover:bg-transparent hover:text-slate-900 transition-all block"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
