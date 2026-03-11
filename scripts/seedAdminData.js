const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Import models using require since original files use ES modules but node script might need commonjs or similar handling
// Actually, since this is a Next.js project, it's safer to just define the schemas here or use the existing ones if we can.
// However, to keep it simple and independent, let's just define what we need.

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, default: 'user' },
    provider: { type: String, default: 'credentials' }
}, { timestamps: true });

const DestinationSchema = new mongoose.Schema({
    title: String,
    country: String,
    location: String,
    shortDescription: String,
    fullDescription: String,
    estimatedBudget: Number,
    bestSeason: String,
    category: String,
    imageUrl: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    createdByEmail: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);

const adminData = {
    name: "Admin User",
    email: "admin@dreamdestination.com",
    password: "admin123password", // Change this in production
    role: "admin"
};

const destinations = [
    {
        title: "Santorini Oia Sunset",
        country: "Greece",
        location: "Oia, Santorini",
        shortDescription: "Experience the world's most beautiful sunset over blue-domed churches.",
        fullDescription: "Santorini is famous for its stunning sunsets, white-washed buildings, and blue-domed churches. This trip takes you to Oia, the most picturesque village on the island. You'll enjoy guided walks, local wine tasting, and a private boat tour around the caldera.",
        estimatedBudget: 2500,
        bestSeason: "May - September",
        category: "Beach",
        imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Zermatt Matterhorn View",
        country: "Switzerland",
        location: "Zermatt, Valais",
        shortDescription: "Ski and hike in the shadow of the iconic Matterhorn peak.",
        fullDescription: "Zermatt is a car-free village in the Swiss Alps, known for its world-class skiing, climbing, and hiking. The village lies at the foot of the Matterhorn, one of the most recognizable peaks in the world. Enjoy the Gornergrat Railway for panoramic views of over 29 peaks.",
        estimatedBudget: 3200,
        bestSeason: "December - April (Skiing), June - August (Hiking)",
        category: "Mountain",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Kyoto Sakura Magic",
        country: "Japan",
        location: "Gion, Kyoto",
        shortDescription: "Wander through ancient temples and cherry blossom paths.",
        fullDescription: "Kyoto is the heart of traditional Japan. Visit during the Sakura season to see the city transformed by pink blossoms. Explore the historic Gion district, Fushimi Inari-taisha's thousand torii gates, and the serene Arashiyama Bamboo Grove.",
        estimatedBudget: 2800,
        bestSeason: "late March - early April",
        category: "Historical",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Cappadocia Balloon Flight",
        country: "Turkey",
        location: "Goreme",
        shortDescription: "Float above fairy chimneys in a hot air balloon at sunrise.",
        fullDescription: "Cappadocia is a geological oddity of honeycombed hills and towering boulders. The best way to see it is from a hot air balloon at sunrise. After landing, explore the underground cities and stay in a unique cave hotel.",
        estimatedBudget: 1800,
        bestSeason: "April - June & September - October",
        category: "Adventure",
        imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Banff National Park",
        country: "Canada",
        location: "Lake Louise, Alberta",
        shortDescription: "Turquoise lakes and rugged Rocky Mountain peaks.",
        fullDescription: "Banff National Park is Canada's oldest national park. It features stunning turquoise lakes, massive glaciers, and snow-capped peaks. Lake Louise and Moraine Lake are must-visits for their unbelievable colors and surrounding mountains.",
        estimatedBudget: 2200,
        bestSeason: "June - August & December - March",
        category: "Nature",
        imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Bali Ubud Escapade",
        country: "Indonesia",
        location: "Ubud, Bali",
        shortDescription: "Tropical jungles, rice terraces, and spiritual retreats.",
        fullDescription: "Ubud is the cultural heart of Bali. Surrounded by emerald-green rice terraces and dense tropical jungles, it's a place for healing and adventure. Visit the Sacred Monkey Forest Sanctuary and the Tegalalang Rice Terrace.",
        estimatedBudget: 1500,
        bestSeason: "April - October",
        category: "Nature",
        imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Paris City of Lights",
        country: "France",
        location: "Eiffel Tower area",
        shortDescription: "The ultimate romantic city break with art, food, and culture.",
        fullDescription: "Paris is a global center for art, fashion, and culture. Visit the Louvre, climb the Eiffel Tower, and enjoy the atmosphere of Montmartre. Paris is a city built for walking and exploring its many bistros and cafes.",
        estimatedBudget: 2600,
        bestSeason: "April - June & September - October",
        category: "City",
        imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Petra Treasury Hike",
        country: "Jordan",
        location: "Wadi Musa",
        shortDescription: "Discover the ancient rose-red city carved into rock.",
        fullDescription: "Petra is a world-famous archaeological site in Jordan's southwestern desert. Dating to around 300 B.C., it was the capital of the Nabataean Kingdom. Accessed via a narrow canyon called Al Siq, it contains tombs and temples carved into pink sandstone cliffs.",
        estimatedBudget: 2000,
        bestSeason: "March - May & September - November",
        category: "Historical",
        imageUrl: "https://images.unsplash.com/photo-1579606038751-d41c10418b72?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Maldives Private Island",
        country: "Maldives",
        location: "North Male Atoll",
        shortDescription: "Pure luxury on crystal clear waters and white sand beaches.",
        fullDescription: "The Maldives is a nation of islands in the Indian Ocean, known for its beaches, blue lagoons, and extensive reefs. Stay in an overwater villa and enjoy world-class diving, snorkeling, and pristine tropical scenery.",
        estimatedBudget: 5000,
        bestSeason: "November - April",
        category: "Beach",
        imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Iceland Highlands Adventure",
        country: "Iceland",
        location: "Landmannalaugar",
        shortDescription: "Colorful rhyolite mountains and steaming natural hot springs.",
        fullDescription: "Iceland's Highlands are a dramatic landscape of volcanic deserts, glaciers, and colorful mountains. Landmannalaugar is famous for its natural geothermal hot springs and incredible hiking trails through rainbow-colored peaks.",
        estimatedBudget: 3000,
        bestSeason: "July - August",
        category: "Adventure",
        imageUrl: "https://images.unsplash.com/photo-1531366930499-41f69919d65a?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Prague Old Town Square",
        country: "Czech Republic",
        location: "Staré Město",
        shortDescription: "Medieval architecture and cobblestone streets in the Heart of Europe.",
        fullDescription: "Prague is known as the 'City of a Hundred Spires'. Explore the Old Town Square with its colorful Baroque buildings, Gothic churches, and the medieval Astronomical Clock. Walk across the 14th-century Charles Bridge at dawn.",
        estimatedBudget: 1400,
        bestSeason: "May - September",
        category: "City",
        imageUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Machu Picchu Inca Trail",
        country: "Peru",
        location: "Cusco Region",
        shortDescription: "The mysterious Lost City of the Incas high in the Andes.",
        fullDescription: "Built in the 15th century and later abandoned, Machu Picchu is renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar. The intrigue surrounding its former use and the breathtaking setting make it a world-class destination.",
        estimatedBudget: 2400,
        bestSeason: "May - September",
        category: "Historical",
        imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000&auto=format&fit=crop"
    }
];

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected!");

        // 1. Seed Admin
        console.log("Checking for admin user...");
        let admin = await User.findOne({ email: adminData.email });
        if (!admin) {
            const passwordHash = await bcrypt.hash(adminData.password, 10);
            admin = await User.create({
                name: adminData.name,
                email: adminData.email,
                passwordHash,
                role: adminData.role,
                provider: adminData.provider
            });
            console.log("Admin user created!");
        } else {
            console.log("Admin user already exists.");
        }

        // 2. Seed Destinations
        console.log("Cleaning old seeded destinations...");
        // Optionally delete previously seeded items if you want a fresh start
        // await Destination.deleteMany({ createdBy: admin._id });

        console.log(`Seeding ${destinations.length} destinations...`);
        for (const dest of destinations) {
            const exists = await Destination.findOne({ title: dest.title });
            if (!exists) {
                await Destination.create({
                    ...dest,
                    createdBy: admin._id,
                    createdByEmail: admin.email
                });
                console.log(`Added: ${dest.title}`);
            } else {
                console.log(`Skipped (already exists): ${dest.title}`);
            }
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
