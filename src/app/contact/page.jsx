"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { contactSchema } from "@/schemas/contactSchema";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
        setLoading(true);
        setErrors({});

        // Validate with Zod
        const validation = contactSchema.safeParse(formData);
        if (!validation.success) {
            const fieldErrors = {};
            validation.error.issues.forEach(err => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validation.data),
            });

            if (res.ok) {
                toast.success("Your message has been sent successfully!");
                setFormData({
                    name: "",
                    email: "",
                    subject: "General Inquiry",
                    message: "",
                });
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-24">
            <div className="container-max">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">Get in Touch</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Have questions about a destination or need help planning your trip? Our travel experts are here for you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-sky-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-sky-100">
                            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sky-100 text-sm font-bold uppercase tracking-widest mb-1">Call Us</p>
                                        <p className="text-lg font-bold">+1 (234) 567-890</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sky-100 text-sm font-bold uppercase tracking-widest mb-1">Email Us</p>
                                        <p className="text-lg font-bold">hello@dreamdestination.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sky-100 text-sm font-bold uppercase tracking-widest mb-1">Visit Us</p>
                                        <p className="text-lg font-bold text-pretty">123 Travel St, Adventure City, World 45678</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 pt-8 border-t border-white/10 flex gap-6">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <MessageSquare className="text-sky-600" /> Send a Message
                            </h3>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className={`w-full px-5 py-3 rounded-2xl border ${errors.name ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50`}
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className={`w-full px-5 py-3 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50`}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email}</p>}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                                    <select
                                        name="subject"
                                        className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 appearance-none cursor-pointer"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    >
                                        <option>General Inquiry</option>
                                        <option>Booking Support</option>
                                        <option>Destinations Question</option>
                                        <option>Business Partnership</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        placeholder="Tell us more about your travel plans..."
                                        className={`w-full px-5 py-3 rounded-2xl border ${errors.message ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 resize-none`}
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-xs ml-1">{errors.message}</p>}
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                        {loading ? "Sending..." : "Send Message"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

