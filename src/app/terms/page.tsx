import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Hope Counseling Support Services",
    description: "Our straightforward terms of service, written in plain English to be clear and easy to understand.",
    alternates: {
        canonical: "/terms",
    }
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#f9f7f4] pt-32 pb-20 px-6">
            <article className="max-w-[680px] mx-auto">
                <h1 className="font-playfair text-4xl md:text-5xl text-[#0d2b22] mb-4">Terms of Service</h1>
                <p className="font-sans text-[11px] uppercase tracking-widest text-[#888] mb-12">Last updated: January 2026</p>

                <div className="space-y-10 font-sans text-[15px] text-[#444] leading-[1.8]">
                    <section>
                        <p className="italic text-[#666]">
                            "By using this website or booking a session with Hope Counseling, you agree to the following terms. We've written these to be as clear and straightforward as possible."
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">About this service</h2>
                        <p>
                            Hope Counseling Support Services provides psychological counseling and mentorship. Our services are offered by Maryann Wangari, a trained counselor based in Thika, Kenya.
                        </p>
                    </section>

                    <section className="bg-white p-8 rounded-2xl border border-[#c0392b]/10">
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#c0392b] font-medium mb-4">This is not an emergency service</h2>
                        <p className="text-[#c0392b]/80">
                            If you or someone you know is in immediate danger, please contact emergency services (999 or 112) or go to your nearest hospital. This website and our counseling sessions are not a substitute for emergency mental health care.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Booking & Sessions</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Sessions are 45 minutes unless otherwise agreed</li>
                            <li>Bookings are confirmed via WhatsApp</li>
                            <li>Please give at least 24 hours notice if you need to cancel or reschedule</li>
                            <li>Repeated late cancellations may affect your ability to book future sessions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Payment</h2>
                        <p>
                            Session fees are agreed before the first session. Payment is due before or at the start of each session unless a prior arrangement has been made.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Confidentiality</h2>
                        <p>
                            All session content is confidential. See our Privacy Policy for full details on the limited exceptions to this.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Your Responsibility</h2>
                        <p>
                            You agree to engage with sessions honestly and in good faith. Counseling works best as a partnership — we bring our expertise, you bring your openness.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Limitation of Liability</h2>
                        <p>
                            Hope Counseling provides professional support but cannot guarantee specific outcomes. Progress in counseling depends on many factors. We are not liable for decisions you make based on session content.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Intellectual Property</h2>
                        <p>
                            All content on this website — text, design, and structure — belongs to Hope Counseling Support Services and may not be reproduced without permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-[13px] uppercase tracking-[0.15em] text-[#2d6e5a] font-medium mb-6 mt-10">Changes to these Terms</h2>
                        <p>
                            We may update these terms from time to time. The date at the top of this page will always reflect the most recent version.
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
