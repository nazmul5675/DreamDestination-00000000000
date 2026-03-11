import AdminUsersClient from "./AdminUsersClient";

export const metadata = {
    title: "User Management",
    description: "Manage platform members, assign administrative roles, and monitor user activity.",
};

export default function AdminUsersPage() {
    return <AdminUsersClient />;
}
