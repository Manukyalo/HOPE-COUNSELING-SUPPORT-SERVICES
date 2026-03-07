import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BookingFlow from "@/components/BookingFlow";
import MoodTracker from "@/components/MoodTracker";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Hero />
            <Services />
            <MoodTracker />
            <section id="book" className="py-20 bg-primary-50">
                <div className="container mx-auto px-4">
                    <BookingFlow />
                </div>
            </section>
        </main>
    );
}
