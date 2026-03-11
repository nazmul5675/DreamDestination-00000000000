import { Shield, Sparkles, Zap, Globe } from "lucide-react";

const features = [
    {
        icon: <Globe className="text-sky-500" size={32} />,
        title: "Global Coverage",
        description: "Explore destinations in over 150 countries with detailed local guides and tips.",
    },
    {
        icon: <Shield className="text-emerald-500" size={32} />,
        title: "Secure Planning",
        description: "Your data and travel plans are safe with our enterprise-grade security systems.",
    },
    {
        icon: <Sparkles className="text-purple-500" size={32} />,
        title: "Premium Experience",
        description: "Access exclusive deals and priority support for all your dream destination needs.",
    },
    {
        icon: <Zap className="text-amber-500" size={32} />,
        title: "Fast Discovery",
        description: "Find your perfect trip in seconds with our advanced filtering and search tools.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="section-padding bg-slate-50">
            <div className="container-max">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
                        Why Travelers Choose Us
                    </h2>
                    <p className="text-slate-600 text-lg">
                        We simplify travel planning so you can focus on creating memories that last a lifetime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
