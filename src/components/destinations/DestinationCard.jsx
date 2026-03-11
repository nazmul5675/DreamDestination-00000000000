import Link from "next/link";
import { MapPin, Star, Calendar } from "lucide-react";

export default function DestinationCard({ destination }) {
    const { _id, title, country, shortDescription, imageUrl, category, estimatedBudget } = destination;

    return (
        <div className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-600 shadow-sm uppercase tracking-wider">
                        {category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-3 font-medium">
                    <MapPin size={14} className="text-sky-500" />
                    <span>{country}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-sky-600 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-600 mb-8 line-clamp-2">
                    {shortDescription}
                </p>

                <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-center py-4 border-t border-slate-50">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">Est. Budget</span>
                            <span className="text-lg font-bold text-slate-900">${estimatedBudget}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star size={16} fill="currentColor" />
                            <span>4.8</span>
                        </div>
                    </div>
                    <Link
                        href={`/destinations/${_id}`}
                        className="w-full bg-slate-900 text-white text-center py-4 rounded-2xl font-bold border border-slate-900 hover:bg-transparent hover:text-slate-900 transition-all block"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
