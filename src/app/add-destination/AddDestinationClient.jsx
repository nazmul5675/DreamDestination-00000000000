"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { destinationSchema } from "@/schemas/destinationSchema";
import {
    Upload, Image as ImageIcon, MapPin, Globe, Calendar,
    DollarSign, Loader2, Plus, Info, ChevronRight, Check
} from "lucide-react";

export default function AddDestinationClient() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        country: "",
        location: "",
        shortDescription: "",
        fullDescription: "",
        estimatedBudget: "",
        bestSeason: "",
        category: "Beach",
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-600" size={48} />
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            // Clear image error if any
            const newErrors = { ...errors };
            delete newErrors.image;
            setErrors(newErrors);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // 1. Validate destination data
        const validation = destinationSchema.safeParse(formData);
        if (!validation.success) {
            const fieldErrors = {};
            validation.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            setLoading(false);
            return;
        }

        // 2. Ensure image is selected
        if (!imageFile) {
            setErrors((prev) => ({ ...prev, image: "Please select an image" }));
            setLoading(false);
            toast.error("Please select an image");
            return;
        }

        try {
            // 3. Upload image to ImgBB via proxy
            const uploadFormData = new FormData();
            uploadFormData.append("image", imageFile);

            const uploadRes = await fetch("/api/upload-image", {
                method: "POST",
                body: uploadFormData,
            });

            if (!uploadRes.ok) {
                const errData = await uploadRes.json();
                throw new Error(errData.message || "Failed to upload image");
            }

            const uploadData = await uploadRes.json();
            const imageUrl = uploadData.imageUrl;

            // 4. Save destination to MongoDB
            const finalData = {
                ...validation.data,
                imageUrl,
            };

            const res = await fetch("/api/destinations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });

            if (res.ok) {
                toast.success("Destination added successfully!");
                router.push("/manage-destinations");
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || "Failed to add destination");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-24">
            <div className="container-max">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Add Destination</h1>
                            <p className="text-slate-500 text-lg">Share a new hidden gem with our global community.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 pr-6">
                            <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 font-bold">
                                1
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Step One</p>
                                <p className="text-sm font-bold text-slate-700">Fill Details</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 mx-2" />
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold">
                                2
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-pretty">Step Two</p>
                                <p className="text-sm font-bold text-slate-300">Published</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Form Inputs */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Basic Info */}
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center">
                                        <Info className="text-sky-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Basic Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                                        <input
                                            name="title"
                                            type="text"
                                            className={`w-full px-5 py-3 rounded-2xl border ${errors.title ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50`}
                                            placeholder="e.g. Secret Blue Lagoon"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                        />
                                        {errors.title && <p className="text-red-500 text-xs ml-1">{errors.title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                name="country"
                                                type="text"
                                                className={`w-full pl-12 pr-5 py-3 rounded-2xl border ${errors.country ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50`}
                                                placeholder="e.g. Philippines"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {errors.country && <p className="text-red-500 text-xs ml-1">{errors.country}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                name="location"
                                                type="text"
                                                className={`w-full pl-12 pr-5 py-3 rounded-2xl border ${errors.location ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50`}
                                                placeholder="e.g. Palawan Island"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {errors.location && <p className="text-red-500 text-xs ml-1">{errors.location}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <Plus className="text-emerald-600" size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Details & Story</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Short Description</label>
                                        <input
                                            name="shortDescription"
                                            className={`w-full px-5 py-3 rounded-2xl border ${errors.shortDescription ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50`}
                                            placeholder="Brief catchy summary (150 chars max)"
                                            value={formData.shortDescription}
                                            onChange={handleInputChange}
                                        />
                                        {errors.shortDescription && <p className="text-red-500 text-xs ml-1">{errors.shortDescription}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Full Description</label>
                                        <textarea
                                            name="fullDescription"
                                            rows="6"
                                            className={`w-full px-5 py-3 rounded-2xl border ${errors.fullDescription ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 resize-none`}
                                            placeholder="Describe the overall experience, hidden gems, and local secrets..."
                                            value={formData.fullDescription}
                                            onChange={handleInputChange}
                                        ></textarea>
                                        {errors.fullDescription && <p className="text-red-500 text-xs ml-1">{errors.fullDescription}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Extra Info */}
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                                        <select
                                            name="category"
                                            className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 cursor-pointer appearance-none"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            {["Beach", "Mountain", "City", "Adventure", "Nature", "Historical"].map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Best Season</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                name="bestSeason"
                                                type="text"
                                                className={`w-full pl-12 pr-5 py-3 rounded-2xl border ${errors.bestSeason ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50`}
                                                placeholder="e.g. Nov - Mar"
                                                value={formData.bestSeason}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {errors.bestSeason && <p className="text-red-500 text-xs ml-1">{errors.bestSeason}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Est. Budget ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                name="estimatedBudget"
                                                type="number"
                                                className={`w-full pl-12 pr-5 py-3 rounded-2xl border ${errors.estimatedBudget ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50`}
                                                placeholder="1200"
                                                value={formData.estimatedBudget}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {errors.estimatedBudget && <p className="text-red-500 text-xs ml-1">{errors.estimatedBudget}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Image Preview & Actions */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-200 sticky top-28">
                                <h3 className="text-2xl font-bold mb-8">Cover Image</h3>

                                {previewUrl ? (
                                    <div className="relative group rounded-3xl overflow-hidden mb-8 h-64 border border-white/10 shadow-inner">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm shadow-xl">
                                                Change Image
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className={`block cursor-pointer border-2 border-dashed ${errors.image ? 'border-red-500' : 'border-slate-700'} hover:border-sky-500 hover:bg-slate-800 transition-all rounded-[2rem] h-64 flex flex-col items-center justify-center text-center p-8 mb-8 group`}>
                                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-sky-600 transition-colors">
                                            <Upload className="text-slate-400 group-hover:text-white" size={28} />
                                        </div>
                                        <p className="font-bold text-slate-300">Choose a beautiful photo</p>
                                        <p className="text-xs text-slate-500 mt-2">JPG, PNG or WEBP (max 5MB)</p>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}

                                {errors.image && <p className="text-red-400 text-center text-sm mb-4 font-bold">{errors.image}</p>}

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                                        <Check className="text-sky-500" size={18} />
                                        <span>Hosted on ImgBB Secure Cloud</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                                        <Check className="text-sky-500" size={18} />
                                        <span>Instant SEO Ranking</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                                        <Check className="text-sky-500" size={18} />
                                        <span>Visible to Thousands of Travelers</span>
                                    </div>
                                </div>

                                <div className="pt-10">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-sky-600 hover:bg-sky-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-sky-900/40 disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} /> Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={20} /> Publish Destination
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
                                        By publishing, you agree to our Terms of Service and Privacy Policy. All content is subject to verification.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}