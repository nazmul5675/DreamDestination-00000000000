import AdminDestinationsClient from "./AdminDestinationsClient";

export const metadata = {
    title: "Content Management",
    description: "Manage, edit, and moderate all travel destinations published on the platform.",
};

export default function AdminDestinationsPage() {
    return <AdminDestinationsClient />;
}
