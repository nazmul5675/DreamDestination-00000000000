"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DestinationCard from "@/components/destinations/DestinationCard";
import Pagination from "@/components/shared/Pagination";
import { Search, SlidersHorizontal, MapPin, Loader2 } from "lucide-react";

function DestinationsContent() {
    const searchParams = useSearchParams();
    const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1 });
    const [page, setPage] = useState(1);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");

    const categories = ["All", "Beach", "Mountain", "City", "Adventure", "Nature", "Historical"];

    useEffect(() => {
        fetchDestinations();
    }, [selectedCategory, page]);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            let url = "/api/destinations";
            const params = new URLSearchParams();
            if (selectedCategory !== "All") params.append("category", selectedCategory);
            if (searchTerm) params.append("search", searchTerm);
            params.append("page", page.toString());
            params.append("limit", "9"); // 3x3 grid

            if (params.toString()) url += `?${params.toString()}`;

            const res = await fetch(url);
            const data = await res.json();
            setDestinations(data.destinations);
            setMeta(data.meta);
        } catch (error) {
            console.error("Failed to fetch destinations:", error);
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

    return (
        <div className="pt-32 pb-24 min-h-screen">
            <div className="container-max">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
                        All Destinations
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl">
                        Browse our curated collection of amazing places around the world. Find your next dream destination using our filters.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start lg:items-center justify-between">
                    <div className="w-full lg:w-auto overflow-x-auto pb-2 -mb-2 scrollbar-none">
                        <div className="flex flex-nowrap lg:flex-wrap gap-2 min-w-max lg:min-w-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-6 py-2.5 rounded-full font-semibold transition-all text-sm border whitespace-nowrap ${selectedCategory === cat
                                        ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-100"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search destination, country..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="text-sky-600 animate-spin mb-4" size={48} />
                        <p className="text-slate-500 font-medium tracking-wide">Finding best places for you...</p>
                    </div>
                ) : destinations.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
                            {destinations.map((dest) => (
                                <DestinationCard key={dest._id} destination={dest} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={(p) => {
                                setPage(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    </>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                            <MapPin size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Destinations Found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                        <button
                            onClick={() => { setSelectedCategory("All"); setSearchTerm(""); }}
                            className="mt-6 text-sky-600 font-bold hover:underline"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DestinationsClient() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="text-sky-600 animate-spin" size={48} />
            </div>
        }>
            <DestinationsContent />
        </Suspense>
    );
}
