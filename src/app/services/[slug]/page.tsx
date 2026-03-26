import { notFound } from "next/navigation";
import ServiceDetailContent from "@/components/ServiceDetailContent";
import { Metadata } from "next";

export const dynamic = 'auto';

export interface Service {
    slug: string;
    title: string;
    image: string;
    description: string;
    eyebrow: string;
    intro: string;
    longContent: string;
    whatIsCovered: string[];
    whoIsItFor: string[];
    sessionSteps: { title: string; desc: string }[];
}

const servicesDetails: Record<string, Service> = {
    "stress-anxiety-management": {
        slug: "stress-anxiety-management",
        eyebrow: "Stress & Anxiety",
        title: "Finding Calm When Everything Feels Like Too Much",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
        description: "Master tools to navigate life's pressures and find your internal calm using evidence-based techniques.",
        intro: "For when the weight of daily life stops feeling manageable.",
        longContent: "Life's pressures can often feel overwhelming, but you don't have to navigate them alone. Our stress and anxiety management sessions provide a compassionate and professional space to understand the root causes of your tension. We utilize evidence-based techniques such as Cognitive Behavioral Therapy (CBT) and mindfulness-based stress reduction to help you regain control.",
        whatIsCovered: [
            "Understanding what's driving your anxiety beneath the surface",
            "Practical breathing and grounding techniques for daily use",
            "Identifying and reshaping negative thought patterns (CBT-based)",
            "Building a personal toolkit for high-pressure moments",
            "Setting boundaries without guilt"
        ],
        whoIsItFor: [
            "The student before an exam who can't switch off",
            "The person whose mind races at 2am",
            "Anyone who's been told to just relax, and can't"
        ],
        sessionSteps: [
            { title: "Step 1", desc: "We talk about what's happening and when it started" },
            { title: "Step 2", desc: "We identify your specific triggers and stress patterns" },
            { title: "Step 3", desc: "We build habits and responses you can use immediately" }
        ]
    },
    "relationship-counseling": {
        slug: "relationship-counseling",
        eyebrow: "Relationships",
        title: "For the Conversations You Haven't Been Able to Have",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800",
        description: "Foster deeper connections and resolve conflicts through compassionate communication and expert guidance.",
        intro: "Whether it's a partnership, a friendship, or family, relationships are hard.",
        longContent: "Healthy relationships are the cornerstone of a fulfilling life. Whether you're navigating partnership challenges, family dynamics, or workplace connections, our relationship counseling offers a neutral ground for clear, empathetic communication. We focus on identifying destructive patterns and replacing them with constructive dialogue.",
        whatIsCovered: [
            "Identifying communication patterns that create distance",
            "Learning to express needs without conflict escalating",
            "Rebuilding trust after a rupture",
            "Individual sessions for those navigating a relationship alone",
            "Deciding what a relationship needs, or whether it has a future"
        ],
        whoIsItFor: [
            "Couples who love each other but can't stop arguing",
            "Individuals trying to understand a difficult relationship",
            "People recovering from a breakup or betrayal"
        ],
        sessionSteps: [
            { title: "Step 1", desc: "We hear both (or all) sides without taking positions" },
            { title: "Step 2", desc: "We find the patterns underneath the conflict" },
            { title: "Step 3", desc: "We build new ways of communicating that actually hold" }
        ]
    },
    "youth-mentorship": {
        slug: "youth-mentorship",
        eyebrow: "Youth & Adolescence",
        title: "For Young People Figuring Out Who They Are",
        image: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?auto=format&fit=crop&q=80&w=800",
        description: "Empowering the next generation with the confidence and clarity needed to navigate modern adolescence.",
        intro: "Growing up in Kenya today comes with pressures that didn't exist a generation ago.",
        longContent: "Adolescence and young adulthood are periods of profound change and often, confusion. Our youth mentorship program goes beyond traditional counseling to offer active guidance and support. We work with young people to build self-esteem, identify personal goals, and navigate the social and academic pressures of the modern world.",
        whatIsCovered: [
            "Managing school pressure, exams, and parental expectations",
            "Identity, self-esteem, and belonging",
            "Navigating peer pressure and social dynamics",
            "Career uncertainty and life after school",
            "Family conflict from the young person's perspective"
        ],
        whoIsItFor: [
            "The Form 3 student dreading KCSE",
            "The teenager who's withdrawn and won't say why",
            "The university student who picked the wrong course"
        ],
        sessionSteps: [
            { title: "Step 1", desc: "We create a space where they can speak without judgment" },
            { title: "Step 2", desc: "We understand the specific pressures they're facing" },
            { title: "Step 3", desc: "We build confidence and a clearer sense of direction" }
        ]
    },
    "academic-guidance": {
        slug: "academic-guidance",
        eyebrow: "Academic Support",
        title: "When School Stops Feeling Possible",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
        description: "Navigating educational pathways and overcoming learning challenges with strategic personal development.",
        intro: "Struggling academically is rarely just about the subject; it's usually about something deeper.",
        longContent: "Academic success isn't just about hard work; it's about the right strategy and mindset. We provide support for students facing learning hurdles, exam anxiety, or transition challenges between educational levels. From study skills to career pathway exploration, we help students align their strengths with their academic pursuits.",
        whatIsCovered: [
            "Understanding the emotional blocks behind academic difficulty",
            "Study strategies and focus techniques tailored to how you learn",
            "Managing exam anxiety and performance pressure",
            "Navigating teacher and parental expectations",
            "Planning a realistic path forward after setbacks"
        ],
        whoIsItFor: [
            "The student who studies hard but still fails",
            "Parents unsure how to support a struggling child",
            "Anyone reconsidering their academic direction"
        ],
        sessionSteps: [
            { title: "Step 1", desc: "We separate the academic problem from the personal one" },
            { title: "Step 2", desc: "We address both: the mindset and the method" },
            { title: "Step 3", desc: "We build a practical plan with realistic milestones" }
        ]
    },
    "emotional-peer-support": {
        slug: "emotional-peer-support",
        eyebrow: "Emotional Support",
        title: "Sometimes You Just Need to Be Heard",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
        description: "A safe, shared space for connection and mutual understanding led by experienced peer facilitators.",
        intro: "Not every struggle needs a diagnosis; sometimes it just needs a safe space.",
        longContent: "Sometimes, the most powerful healing comes from knowing you are not alone. Our emotional peer support and peer counseling sessions provide a unique space for shared experiences. Facilitated by experienced counselors, these sessions emphasize mutual understanding, validated feelings, and the strength found in community.",
        whatIsCovered: [
            "Processing difficult emotions without judgment",
            "Grief, loss, and life transitions",
            "Loneliness and isolation",
            "Building emotional resilience over time",
            "Peer-facilitated group sessions (available on request)"
        ],
        whoIsItFor: [
            "Someone going through a hard season with no one to talk to",
            "A person processing grief or unexpected change",
            "Anyone who's been told their feelings are an overreaction"
        ],
        sessionSteps: [
            { title: "Step 1", desc: "You speak. We listen fully, without interrupting." },
            { title: "Step 2", desc: "Together we make sense of what you're carrying" },
            { title: "Step 3", desc: "We find small, real steps toward feeling better" }
        ]
    }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const seoData: Record<string, { title: string; description: string }> = {
        "stress-anxiety-management": {
            title: "Stress & Anxiety Counseling in Thika | Hope Counseling",
            description: "Evidence-based stress and anxiety management sessions in Thika, Kenya. Learn practical tools to reclaim calm and navigate life's pressures."
        },
        "relationship-counseling": {
            title: "Relationship Counseling in Thika | Hope Counseling",
            description: "Rebuild communication and resolve conflict with professional relationship counseling in Thika, Kenya. For couples and individuals."
        },
        "youth-mentorship": {
            title: "Youth Mentorship & Guidance in Thika | Hope Counseling",
            description: "Empowering teenagers and young adults in Thika, Kenya with clarity, confidence, and direction through professional youth mentorship."
        },
        "academic-guidance": {
            title: "Academic Guidance & Counseling | Hope Counseling Thika",
            description: "Helping students in Thika overcome academic challenges and find direction through strategic personal development and counseling."
        },
        "emotional-peer-support": {
            title: "Emotional Support & Peer Counseling | Hope Counseling Thika",
            description: "A safe, shared space for emotional support and peer counseling in Thika, Kenya. Facilitated by experienced counselors."
        }
    };

    const seo = seoData[params.slug];
    
    return {
        title: seo?.title || "Specialized Counseling | Hope Counseling",
        description: seo?.description || "Professional psychological support in Thika, Kenya.",
        alternates: {
            canonical: `/services/${params.slug}`,
        },
        openGraph: {
            title: seo?.title,
            description: seo?.description,
            images: ["/ma.jpeg"],
            url: `https://hope-counseling-support-services.vercel.app/services/${params.slug}`,
        }
    };
}

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
