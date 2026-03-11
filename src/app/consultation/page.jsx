"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Loader2, ArrowLeft, MapPin, Calendar,
    DollarSign, Users, MessageSquare, Send, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { consultationSchema } from "@/schemas/consultationSchema";

function ConsultationContent() {
    const searchParams = useSearchParams();
    const destinationId = searchParams.get("destinationId");
    const router = useRouter();
    const { data: session, status } = useSession();

    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        preferredDate: "",
        budget: "",
        travelers: "1",
        message: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/consultation?destinationId=${destinationId}`);
            return;
        }

        if (destinationId) {
            fetchDestination();
        } else {
            router.push("/destinations");
        }
    }, [status, destinationId]);

    const fetchDestination = async () => {
        try {
            const res = await fetch(`/api/destinations/${destinationId}`);
            if (res.ok) {
                const data = await res.json();
                setDestination(data);
            } else {
                toast.error("Destination not found");
                router.push("/destinations");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load destination details");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        const validationData = {
            ...formData,
            destinationId: destination._id,
            destinationTitle: destination.title,
            destinationCountry: destination.country,
            destinationImageUrl: destination.imageUrl,
            budget: Number(formData.budget),
            travelers: Number(formData.travelers)
        };

        const result = consultationSchema.safeParse(validationData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach(err => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            setSubmitting(false);
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            const res = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validationData)
            });

            if (res.ok) {
                setSubmitted(true);
                toast.success("Consultation request submitted successfully!");
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-600" size={48} />
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 text-center shadow-xl shadow-slate-200/50 border border-slate-100 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={56} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Request Received!</h1>
                    <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                        Thank you for your interest in <span className="text-slate-900 font-bold">{destination.title}</span>.
                        Our travel experts will review your request and get back to you within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/my-consultations"
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            View My Requests
                        </Link>
                        <Link
                            href="/destinations"
                            className="bg-white text-slate-600 border border-slate-200 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                        >
                            Browse More
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50/50 font-inherit">
            <div className="container-max">
                <div className="max-w-5xl mx-auto">
                    <Link href={`/destinations/${destinationId}`} className="text-sky-600 font-bold flex items-center gap-2 mb-8 hover:gap-3 transition-all w-fit">
                        <ArrowLeft size={18} /> Back to Details
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left: Destination Summary Card */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 sticky top-32">
                                <div className="h-48 relative">
                                    <img
                                        src={destination.imageUrl}
                                        alt={destination.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <p className="text-white font-bold text-2xl">{destination.title}</p>
                                        <p className="text-white/80 text-sm flex items-center gap-1">
                                            <MapPin size={12} /> {destination.country}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Professional Consultation</h4>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Get a personalized travel plan, budget optimization, and local insights for your journey.
                                        </p>
                                    </div>
                                    <div className="space-y-3 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <span className="text-sm font-bold">Expert Local Guides</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <span className="text-sm font-bold">Budget Optimization</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <span className="text-sm font-bold">Flight & Stay Booking</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Booking Form */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                                <div className="mb-10">
                                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Book Your Consultation</h2>
                                    <p className="text-slate-500">Fill in the details below and we'll start planning your dream trip.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+</div>
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="123 456 7890"
                                                    className={`w-full pl-8 pr-5 py-4 rounded-2xl border ${errors.phone ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-medium`}
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Preferred Travel Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    name="preferredDate"
                                                    type="date"
                                                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${errors.preferredDate ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-medium`}
                                                    value={formData.preferredDate}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.preferredDate && <p className="text-red-500 text-xs ml-1">{errors.preferredDate}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Estimated Budget ($)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    name="budget"
                                                    type="number"
                                                    placeholder="5000"
                                                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${errors.budget ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-bold`}
                                                    value={formData.budget}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.budget && <p className="text-red-500 text-xs ml-1">{errors.budget}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Number of Travelers</label>
                                            <div className="relative">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    name="travelers"
                                                    type="number"
                                                    min="1"
                                                    className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${errors.travelers ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-bold`}
                                                    value={formData.travelers}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.travelers && <p className="text-red-500 text-xs ml-1">{errors.travelers}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Anything else we should know?</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-5 text-slate-400" size={18} />
                                            <textarea
                                                name="message"
                                                rows="5"
                                                placeholder="Tell us about your interests, special requirements, or specific places you want to visit..."
                                                className={`w-full pl-12 pr-5 py-4 rounded-2xl border ${errors.message ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-medium resize-none`}
                                                value={formData.message}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                        {errors.message && <p className="text-red-500 text-xs ml-1">{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-sky-600 hover:bg-sky-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-sky-100 disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Processing Request...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Submit Consultation Request
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ConsultationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-600" size={48} />
            </div>
        }>
            <ConsultationContent />
        </Suspense>
    );
}
