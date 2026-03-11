import { Users, Award, Calendar, Globe, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="pt-32 pb-24">
            <div className="container-max">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-sm font-bold mb-6 uppercase tracking-wider">
                        Our Story
                    </div>
                    <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight">
                        We help you find your <br />
                        <span className="text-sky-600">Perfect Adventure</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto text-pretty">
                        DreamDestination was founded by a group of travel enthusiasts who believed that life is too short for boring vacations. We curate the extraordinary so you can experience the unforgettable.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-32">
                    {[
                        { label: "Founded", value: "2020", icon: <Calendar className="text-sky-600" /> },
                        { label: "Travelers", value: "50k+", icon: <Users className="text-emerald-600" /> },
                        { label: "Countries", value: "120+", icon: <Globe className="text-amber-600" /> },
                        { label: "Awards", value: "15", icon: <Award className="text-purple-600" /> },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                                {stat.icon}
                            </div>
                            <p className="text-4xl font-extrabold text-slate-900 mb-2">{stat.value}</p>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Mission */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=2070&auto=format&fit=crop"
                            alt="Our Mission"
                            className="rounded-[3rem] shadow-2xl relative z-10"
                        />
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-sky-600/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-4xl font-extrabold text-slate-900">Our Mission</h2>
                        <p className="text-lg text-slate-600 leading-relaxed text-pretty">
                            At DreamDestination, we are on a mission to bring people closer to the wonders of our planet. We believe that travel fosters empathy, breaks down barriers, and enriches the soul.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed text-pretty">
                            Every destination on our platform is hand-verified and curated with local expertise. We don't just show you where to go; we show you how to experience it like a local.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Sustainable travel practices first",
                                "Direct support for local communities",
                                "Verified and safe experiences",
                                "Transparent pricing and guides"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-900 font-bold">
                                    <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="text-sky-600" size={14} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}


