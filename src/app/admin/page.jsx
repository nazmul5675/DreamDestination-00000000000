import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = {
    title: "Admin Dashboard",
    description: "Overview of your travel platform's performance, stats, and recent activities.",
};

export default function AdminPage() {
    return <AdminDashboardClient />;
}
