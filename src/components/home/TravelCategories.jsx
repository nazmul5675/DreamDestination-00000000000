import { Waves, Mountain, Building2, Compass, TreePine, History } from "lucide-react";
import Link from "next/link";

const categories = [
    { name: "Beach", icon: <Waves size={24} />, count: 120, color: "bg-blue-50 text-blue-600" },
    { name: "Mountain", icon: <Mountain size={24} />, count: 85, color: "bg-slate-100 text-slate-700" },
    { name: "City", icon: <Building2 size={24} />, count: 210, color: "bg-amber-50 text-amber-600" },
    { name: "Adventure", icon: <Compass size={24} />, count: 45, color: "bg-red-50 text-red-600" },
    { name: "Nature", icon: <TreePine size={24} />, count: 160, color: "bg-emerald-50 text-emerald-600" },
    { name: "Historical", icon: <History size={24} />, count: 95, color: "bg-purple-50 text-purple-600" },
];

export default function TravelCategories() {
    return (
        <section className="section-padding bg-white">
            <div className="container-max">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        Travel by Category
                    </h2>
                    <p className="text-slate-600 text-lg">
                        What's your travel style? Choose from our curated categories to find your perfect vibe.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={`/destinations?category=${cat.name}`}
                            className="flex flex-col items-center p-6 rounded-3xl border border-slate-100 hover:border-sky-200 hover:shadow-lg transition-all group"
                        >
                            <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                {cat.icon}
                            </div>
                            <h4 className="font-bold text-slate-900 group-hover:text-sky-600">{cat.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{cat.count} Places</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
