import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Adventure Enthusiast",
        content: "DreamDestination helped me plan the most incredible trip to Bali. The local tips were invaluable!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    },
    {
        name: "Michael Chen",
        role: "Digital Nomad",
        content: "The best travel platform I've used. Finding unique historical spots in Kyoto was so easy.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    },
    {
        name: "Elena Rodriguez",
        role: "Family Traveler",
        content: "We found the perfect family-friendly beach in Santorini thanks to the detailed guides here.",
        rating: 4,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    },
];

export default function Testimonials() {
    return (
        <section className="section-padding bg-slate-50">
            <div className="container-max">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        What Our Travelers Say
                    </h2>
                    <p className="text-slate-600 text-lg">
                        Hear from our community about their experiences exploring the world with DreamDestination.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testi, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative"
                        >
                            <Quote className="absolute top-8 right-8 text-slate-100" size={48} />
                            <div className="flex gap-1 text-amber-500 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < testi.rating ? "currentColor" : "none"}
                                        className={i < testi.rating ? "text-amber-500" : "text-slate-200"}
                                    />
                                ))}
                            </div>
                            <p className="text-slate-700 italic mb-8 relative z-10">"{testi.content}"</p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testi.image}
                                    alt={testi.name}
                                    className="w-12 h-12 rounded-full object-cover shadow-md"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900">{testi.name}</h4>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{testi.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
