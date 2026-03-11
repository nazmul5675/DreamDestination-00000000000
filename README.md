# 🌍 DreamDestination - Full-Stack Travel Platform

DreamDestination is a premium, full-stack travel destination showcase built with **Next.js 15 (App Router)** and **MongoDB**. It features a modern, responsive design with role-based authentication, secure image uploads, and comprehensive content management for both administrators and travelers.

---

## ✨ Project Description
DreamDestination provides a seamless platform for travelers to discover and share amazing places. Users can browse a curated list of destinations, while registered members can contribute their own travel experiences. The platform includes a powerful admin dashboard for overseeing users, messages, and all platform content.

---

## 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router, JavaScript/JSX)
- **Database**: MongoDB Atlas with Mongoose
- **Auth**: NextAuth.js v4 (Credentials + Google Auth)
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Image Hosting**: ImgBB API
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## 🛠️ Setup Instructions

### 1. Clone & Install
```bash
git clone <your-repo-link>
cd dream-destination
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
# MongoDB
MONGODB_URI=your_mongodb_atlas_uri

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# Google Auth (Required for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB (Required for image uploads)
IMGBB_API_KEY=your_imgbb_api_key
```

### 3. Seed Initial Data
To populate the database with admin-seeded destinations and the initial admin user:
```bash
node scripts/seedAdminData.js
```
*Note: Ensure your `MONGODB_URI` is set before running.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🛤️ Route Summary

### Public Routes
- `/` - Home Page with featured destinations
- `/destinations` - All Destinations with search, category filters, and **pagination**
- `/destinations/[id]` - Detailed destination view
- `/about` - Platform story
- `/contact` - Support inquiry form
- `/login` / `/register` - Authentication pages

### Protected Routes (User)
- `/add-destination` - Create a new travel post
- `/manage-destinations` - User Dashboard to view/delete own posts (with pagination)

### Protected Routes (Admin)
- `/admin` - Dashboard statistics and overview
- `/admin/destinations` - Management of all platform content (with pagination)
- `/admin/users` - User management and **role assignment**
- `/admin/messages` - Viewing and managing contact inquiries

---

## 🔐 Authentication & Roles

### Auth Flow
1. **Registration**: Users can sign up via the registration form. Passwords are hashed using `bcryptjs`.
2. **Login**: Supports local credentials and Google OAuth.
3. **Session**: Managed by NextAuth.js, storing user data and roles in a secure JWT.

### Role Summary
| Role | Permissions |
| :--- | :--- |
| **Traveler (user)** | View content, add new destinations, manage/delete own posts. |
| **Administrator (admin)** | All user permissions + manage all platform content, delete users, change user roles, and manage contact messages. |

---

## 📸 Core Features

### Image Upload Flow
Destinations use **ImgBB** for reliable image hosting:
1. User selects an image in the "Add Destination" form.
2. The image is sent to a server-side API proxy (`/api/upload-image`).
3. The server uploads the image to ImgBB using the secure API key.
4. ImgBB returns a permanent URL which is then saved in the MongoDB destination document.

### Contact Message Feature
- Users can send inquiries through the `/contact` page.
- Messages are stored in MongoDB.
- Administrators can view and delete these messages in the Admin Dashboard.

### Pagination
- Implemented server-side for all destination lists:
  - Global Destinations Gallery
  - Admin Content Manager
  - User Dashboard
- Reduces initial load time and improves performance as the database grows.

---

## 📦 Deployment Notes
- **Hosting**: Recommended for [Vercel](https://vercel.com) for Next.js 15 compatibility.
- **Environment**: Ensure all `.env.local` variables are added to your hosting provider's environment settings.
- **Database**: Use a MongoDB Atlas cluster for production-ready data persistence.

---

## 📝 License
This project is built for portfolio and educational use.
