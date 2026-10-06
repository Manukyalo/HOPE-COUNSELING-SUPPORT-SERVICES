import { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata: Metadata = {
    title: "Contact Us | Hope Counseling Support Services Nairobi",
    description: "Get in touch with Hope Counseling in Nairobi, Kenya. Call, email, or message us on WhatsApp to book a session or ask any questions.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Us | Hope Counseling Support Services",
        description: "Get in touch for professional counseling in Nairobi, Kenya.",
        images: ["/footer.jpeg"],
        url: "https://hope-counseling-support-services.vercel.app/contact",
    }
};

export default function ContactPage() {
    return <ContactContent />;
}
