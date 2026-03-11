import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Compass } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-white">
                            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center font-bold text-xl">
                                D
                            </div>
                            <span className="text-xl font-bold tracking-tight">DreamDestination</span>
                        </Link>
                        <p className="text-slate-400 max-w-xs">
                            Your ultimate guide to exploring the world's most beautiful destinations. Start your journey with us today.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-600 transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-600 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-600 transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-sky-500 shrink-0" />
                                <span>123 Travel St, Adventure City, World 45678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-sky-500 shrink-0" />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-sky-500 shrink-0" />
                                <span>hello@dreamdestination.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} DreamDestination. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Compass size={16} />
                        <span>Built for Travelers Everywhere</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
