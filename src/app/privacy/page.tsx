import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Hope Counseling Support Services",
    description: "Clear and straightforward information on how we collect, use, and protect your data at Hope Counseling.",
    alternates: {
        canonical: "/privacy",
    }
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#f9f7f4] pt-32 pb-20 px-6">
            <article className="max-w-[680px] mx-auto">
                <h1 className="font-playfair text-4xl md:text-5xl text-[#0d2b22] mb-4">Privacy Policy</h1>
                <p className="font-sans text-[11px] uppercase tracking-widest text-[#888] mb-12">Last updated: January 2026</p>

                <div className="space-y-10 font-sans text-[15px] text-[#444] leading-[1.8]">
                    <section>
                        <p className="italic text-[#666]">
                            "At Hope Counseling, your privacy is not just a legal requirement — it's the foundation of everything we do. This page explains clearly what information we collect, how we use it, and your rights."
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">What we collect</h2>
                        <div className="space-y-4">
                            <p>When you use this website or book a session, we may collect:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Your name, email address, and phone number when you fill in a form</li>
                                <li>General location information (country/city) from your browser</li>
                                <li>Basic usage data like which pages you visited (no personal identity attached)</li>
                            </ul>
                            <p>We do not collect sensitive medical or psychological records through this website.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">How we use your information</h2>
                        <div className="space-y-4">
                            <p>We only use your information to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Respond to your enquiries</li>
                                <li>Confirm and manage your session bookings</li>
                                <li>Send you relevant information you've asked for</li>
                            </ul>
                            <p>We do not sell, share, or rent your information to any third party. Ever.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">WhatsApp Communication</h2>
                        <p>
                            If you contact us via WhatsApp, your messages are subject to WhatsApp's own privacy policy. We use WhatsApp only to coordinate bookings and respond to enquiries — not for marketing purposes unless you've asked to receive updates.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Session Confidentiality</h2>
                        <div className="space-y-4">
                            <p>
                                Everything discussed in a counseling session is strictly confidential. We will not disclose session content to any third party without your explicit written consent, except in the following limited circumstances required by law:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Where there is a risk of serious harm to yourself or others</li>
                                <li>Where disclosure is required by a court order</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">How we protect your data</h2>
                        <p>
                            Your information is stored securely. We do not store sensitive session notes on this website. Access to your personal information is limited to Maryann Wangari and any administrative support directly involved in your care.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Your Rights</h2>
                        <div className="space-y-4">
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Ask what personal data we hold about you</li>
                                <li>Request that we correct or delete your information</li>
                                <li>Withdraw consent for communications at any time</li>
                            </ul>
                            <p>To exercise any of these rights, email us at <strong>amayakari5924@gmail.com</strong></p>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Changes to this Policy</h2>
                        <p>
                            We may update this policy occasionally. Any significant changes will be noted at the top of this page with a new date.
                        </p>
                    </section>

                    <section className="pt-12 border-t border-black/[0.05]">
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-4">Contact</h2>
                        <div className="font-sans text-sm text-[#888] space-y-1">
                            <p>Hope Counseling Support Services</p>
                            <p>Thika, Kenya</p>
                            <p>amayakari5924@gmail.com | +254 701 279 231</p>
                        </div>
                    </section>
                </div>
            </article>
        </main>
    );
}
