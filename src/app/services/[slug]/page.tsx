import { notFound } from "next/navigation";
import ServiceDetailContent from "@/components/ServiceDetailContent";

export const dynamic = 'auto'; // Re-enable SSG

interface Service {
    title: string;
    image: string;
    description: string;
    longContent: string[];
    benefits: string[];
}

const servicesDetails: Record<string, Service> = {
    "stress-anxiety-management": {
        title: "Stress and Anxiety management",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
        description: "Master tools to navigate life's pressures and find your internal calm using evidence-based techniques.",
        longContent: [
            "Life's pressures can often feel overwhelming, but you don't have to navigate them alone. Our stress and anxiety management sessions provide a compassionate and professional space to understand the root causes of your tension.",
            "We utilize evidence-based techniques such as Cognitive Behavioral Therapy (CBT) and mindfulness-based stress reduction to help you regain control. Together, we'll develop a personalized toolkit of coping mechanisms that fit your lifestyle and help you find lasting calm."
        ],
        benefits: ["Reduced physical symptoms of stress", "Improved emotional regulation", "Better sleep and focus", "Enhanced decision-making clarity"]
    },
    "relationship-counseling": {
        title: "Relationship Counseling",
        image: "https://images.unsplash.com/photo-1534120247760-c44c5cd41c8f?auto=format&fit=crop&q=80&w=800",
        description: "Foster deeper connections and resolve conflicts through compassionate communication and expert guidance.",
        longContent: [
            "Healthy relationships are the cornerstone of a fulfilling life. Whether you're navigating partnership challenges, family dynamics, or workplace connections, our relationship counseling offers a neutral ground for clear, empathetic communication.",
            "We focus on identifying destructive patterns and replacing them with constructive dialogue. Our goal is to help you build stronger, more resilient connections based on mutual respect and understanding."
        ],
        benefits: ["Improved communication skills", "Conflict resolution strategies", "Deeper emotional intimacy", "Clearer boundary setting"]
    },
    "youth-mentorship": {
        title: "Youth mentorship and guidance",
        image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?auto=format&fit=crop&q=80&w=800",
        description: "Empowering the next generation with the confidence and clarity needed to navigate modern adolescence.",
        longContent: [
            "Adolescence and young adulthood are periods of profound change and often, confusion. Our youth mentorship program goes beyond traditional counseling to offer active guidance and support.",
            "We work with young people to build self-esteem, identify personal goals, and navigate the social and academic pressures of the modern world. It's about empowering them to become the healthiest versions of themselves."
        ],
        benefits: ["Increased self-confidence", "Goal identification and planning", "Better social navigation", "Improved parent-child dynamics"]
    },
    "academic-guidance": {
        title: "Academic guidance",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
        description: "Navigating educational pathways and overcoming learning challenges with strategic personal development.",
        longContent: [
            "Academic success isn't just about hard work; it's about the right strategy and mindset. We provide support for students facing learning hurdles, exam anxiety, or transition challenges between educational levels.",
            "From study skills to career pathway exploration, we help students align their strengths with their academic pursuits for a more meaningful and successful educational journey."
        ],
        benefits: ["Strategic study techniques", "Reduced academic anxiety", "Clarity on career pathways", "Improved time management"]
    },
    "emotional-peer-support": {
        title: "Emotional support and Peer Counseling",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
        description: "A safe, shared space for connection and mutual understanding led by experienced peer facilitators.",
        longContent: [
            "Sometimes, the most powerful healing comes from knowing you are not alone. Our emotional peer support and peer counseling sessions provide a unique space for shared experiences.",
            "Facilitated by experienced counselors, these sessions emphasize mutual understanding, validated feelings, and the strength found in community. It's a sanctuary for those seeking connection on their mental wellness journey."
        ],
        benefits: ["Sense of community and belonging", "Validation from shared lived experience", "Reduced feelings of isolation", "Social skill reinforcement"]
    }
};

export async function generateStaticParams() {
    return Object.keys(servicesDetails).map((slug) => ({
        slug: slug,
    }));
}

export default function ServicePage({ params }: { params: { slug: string } }) {
    const service = servicesDetails[params.slug];

    if (!service) {
        notFound();
    }

    return <ServiceDetailContent service={service} />;
}
