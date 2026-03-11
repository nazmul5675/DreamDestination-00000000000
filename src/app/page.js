import Hero from "@/components/home/Hero";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TravelCategories from "@/components/home/TravelCategories";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedDestinations />
      <WhyChooseUs />
      <TravelCategories />
      <Testimonials />

      {/* Call to Action Section */}
      <section className="section-padding bg-sky-600 relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-16 rounded-[3rem] text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sky-100 text-lg mb-10 max-w-xl mx-auto">
              Join DreamDestination today and get exclusive access to hidden gems and premium travel guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="bg-white text-sky-600 px-10 py-4 rounded-2xl font-bold hover:bg-sky-50 transition-all shadow-lg active:scale-95">
                Register for Free
              </a>
              <a href="/destinations" className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
                Explore Destinations
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </section>
    </div>
  );
}
