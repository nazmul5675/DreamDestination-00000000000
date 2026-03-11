"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Loader2, ArrowLeft, Save, Image as ImageIcon,
    MapPin, Globe, Calendar, DollarSign, Info
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { destinationSchema } from "@/schemas/destinationSchema";

export default function AdminEditDestinationPage() {
    // Note: In Next.js App Router, we use useParams()
    // However, I will use a more standard approach compatible with the setup
    const params = useParams();
    const id = params?.id;
    const router = useRouter();
    const { data: session, status } = useSession();

    const [formData, setFormData] = useState({
        title: "",
        country: "",
        location: "",
        shortDescription: "",
        fullDescription: "",
        estimatedBudget: "",
        bestSeason: "",
        category: "Beach",
        imageUrl: "",
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (session && session.user.role !== "admin") {
            router.push("/");
        } else if (status === "authenticated" && id) {
            fetchDestination();
        }
    }, [status, session, id]);

    const fetchDestination = async () => {
        try {
            const res = await fetch(`/api/destinations/${id}`);
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    title: data.title,
                    country: data.country,
                    location: data.location,
                    shortDescription: data.shortDescription,
                    fullDescription: data.fullDescription,
                    estimatedBudget: data.estimatedBudget.toString(),
                    bestSeason: data.bestSeason,
                    category: data.category,
                    imageUrl: data.imageUrl,
                });
                setPreviewUrl(data.imageUrl);
            } else {
                toast.error("Destination not found");
                router.push("/admin/destinations");
            }
        } catch (error) {
            toast.error("Failed to load details");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        setSaving(true);
        setErrors({});

        // Validate
        const validation = destinationSchema.safeParse({
            ...formData,
            estimatedBudget: Number(formData.estimatedBudget)
        });

        if (!validation.success) {
            const fieldErrors = {};
            validation.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            setSaving(false);
            return;
        }

        try {
            let imageUrl = formData.imageUrl;

            // Optional: Upload new image if selected
            if (imageFile) {
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
                imageUrl = uploadData.imageUrl;
            }

            const res = await fetch(`/api/destinations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...validation.data,
                    imageUrl
                }),
            });

            if (res.ok) {
                toast.success("Destination updated successfully");
                router.push("/admin/destinations");
            } else {
                const errorData = await res.json();
                toast.error(errorData.message || "Update failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-sky-600" size={48} />
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 min-h-screen bg-slate-50/50 font-inherit">
            <div className="container-max">
                <div className="max-w-4xl mx-auto">
                    <Link href="/admin/destinations" className="text-sky-600 font-bold flex items-center gap-2 mb-8 hover:gap-3 transition-all w-fit">
                        <ArrowLeft size={18} /> Back to Content
                    </Link>

                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                                <ImageIcon size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900">Edit Destination</h1>
                                <p className="text-slate-500">Refine the details for {formData.title}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Column: Form Inputs */}
                            <div className="lg:col-span-2 space-y-10">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                                            <input
                                                name="title"
                                                type="text"
                                                className={`w-full px-5 py-3 rounded-2xl border ${errors.title ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-medium`}
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
                                                    className={`w-full pl-12 pr-5 py-3 rounded-2xl border ${errors.country ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-medium`}
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
                                                    className={`w-full pl-12 pr-5 py-3 rounded-2xl border ${errors.location ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-medium`}
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            {errors.location && <p className="text-red-500 text-xs ml-1">{errors.location}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Short Description</label>
                                            <input
                                                name="shortDescription"
                                                className={`w-full px-5 py-3 rounded-2xl border ${errors.shortDescription ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-medium`}
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
                                                className={`w-full px-5 py-3 rounded-2xl border ${errors.fullDescription ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 resize-none font-medium`}
                                                value={formData.fullDescription}
                                                onChange={handleInputChange}
                                            ></textarea>
                                            {errors.fullDescription && <p className="text-red-500 text-xs ml-1">{errors.fullDescription}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                                            <select
                                                name="category"
                                                className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 appearance-none cursor-pointer font-bold"
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
                                                    className={`w-full pl-12 pr-5 py-3 rounded-2xl border ${errors.bestSeason ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-medium`}
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
                                                    className={`w-full pl-12 pr-5 py-3 rounded-2xl border ${errors.estimatedBudget ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-slate-50 font-bold`}
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
                                    <h3 className="text-2xl font-bold mb-8">Featured Image</h3>

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
                                        <label className="block cursor-pointer border-2 border-dashed border-slate-700 hover:border-sky-500 hover:bg-slate-800 transition-all rounded-[2rem] h-64 flex flex-col items-center justify-center text-center p-8 mb-8 group">
                                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-sky-600 transition-colors">
                                                <ImageIcon className="text-slate-400 group-hover:text-white" size={28} />
                                            </div>
                                            <p className="font-bold text-slate-300">Choose a photo</p>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    )}

                                    <div className="pt-10 space-y-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-sky-900/40 disabled:opacity-50 active:scale-[0.98]"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} /> Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={20} /> Update Destination
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.back()}
                                            className="w-full py-4 bg-white/5 text-slate-300 font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
                                        Administrators have full control over content moderation. Changes are reflected instantly.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
