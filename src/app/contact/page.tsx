import { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata: Metadata = {
    title: "Contact Us | Hope Counseling Support Services Thika",
    description: "Get in touch with Hope Counseling in Thika, Kenya. Call, email, or message us on WhatsApp to book a session or ask any questions.",
    alternates: {
        canonical: "/contact",
    },
    openGraph: {
        title: "Contact Us | Hope Counseling Support Services",
        description: "Get in touch for professional counseling in Thika, Kenya.",
        images: ["/ma.jpeg"],
        url: "https://hope-counseling-support-services.vercel.app/contact",
    }
};

export default function ContactPage() {
    return <ContactContent />;
}
