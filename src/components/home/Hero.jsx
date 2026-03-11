import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
                    alt="Travel Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
            </div>

            <div className="container-max relative z-10">
                <div className="max-w-2xl text-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 backdrop-blur-md text-sky-400 text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <MapPin size={14} />
                        <span>Discover your next adventure</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Explore the World <br />
                        <span className="text-sky-400">Beyond Boundaries</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 text-pretty">
                        Join thousands of travelers who have found their dream destinations. From serene beaches to majestic mountains, your journey starts here.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <Link
                            href="/destinations"
                            className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-sky-500/25 group"
                        >
                            Start Exploring <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <div className="relative group min-w-[280px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Where to go next?"
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating stats */}
            <div className="hidden lg:flex absolute bottom-12 right-12 gap-8 animate-in fade-in slide-in-from-right-10 duration-1000 delay-500">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-white">
                    <p className="text-3xl font-bold">500+</p>
                    <p className="text-sm text-slate-300">Destinations</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-white">
                    <p className="text-3xl font-bold">12k+</p>
                    <p className="text-sm text-slate-300">Happy Travelers</p>
                </div>
            </div>
        </section>
    );
}
