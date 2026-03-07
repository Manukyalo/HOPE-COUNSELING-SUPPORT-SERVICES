export default function SessionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <section className="min-h-screen bg-gray-900">{children}</section>;
}
