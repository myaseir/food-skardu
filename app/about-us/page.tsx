import Link from "next/link";
import { ArrowLeft, Zap, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";

export const metadata = {
  title: "About Us | Food Skardu",
  description: "Learn about Food Skardu, the premium on-demand food delivery platform for Skardu.",
};

const values = [
  {
    icon: Zap,
    title: "Speed & Reliability",
    body: "We connect Skardu's finest restaurants with your door through a streamlined ordering and delivery process, built for consistency.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Partners",
    body: "We work only with reputable, quality-focused restaurants so every order meets a high standard, from kitchen to doorstep.",
  },
  {
    icon: HeartHandshake,
    title: "Hospitality First",
    body: "From hotel guests to local residents, we treat every order as a chance to represent Skardu's hospitality at its best.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-purple-600 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            About Food Skardu
          </h1>
          <p className="text-[13px] text-gray-500 mt-3 leading-relaxed max-w-xl">
            Food Skardu is a premium, on-demand food delivery platform bringing
            the best culinary experiences in Skardu directly to your door, or
            your hotel room.
          </p>
        </header>

        {/* Intro Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 mb-8">
          <h2 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-3">
            Our Mission
          </h2>
          <p className="text-[13px] leading-relaxed text-gray-600 mb-4">
            We bridge the gap between Skardu's finest local restaurants and
            the people who want to enjoy them, without the wait, the walk, or
            the guesswork. Whether you are relaxing at home or staying at a
            partner hotel, Food Skardu brings quality meals to you with
            reliability, speed, and care in every order.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-600">
            We are proud to serve Skardu, a place known for its warmth and
            hospitality, by making great food more accessible than ever
            before.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="bg-purple-50 text-purple-600 p-2 rounded-full w-fit mb-3">
                <value.icon size={16} />
              </div>
              <h3 className="text-[12px] font-black uppercase tracking-tight text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-gray-600">
                {value.body}
              </p>
            </div>
          ))}
        </div>

        {/* Coverage */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 flex items-start gap-4">
          <div className="bg-purple-50 text-purple-600 p-2.5 rounded-full shrink-0">
            <MapPin size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-2">
              Where We Deliver
            </h2>
            <p className="text-[13px] leading-relaxed text-gray-600">
              We currently operate across Skardu, Gilgit-Baltistan, partnering
              with local restaurants and hotels to bring dependable delivery
              to residents, travelers, and guests throughout the city.
            </p>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 mt-8 text-center">
          Questions about our service?{" "}
          <Link href="/contact" className="text-purple-600 font-bold hover:underline">
            Get in touch
          </Link>
        </p>
      </div>
    </main>
  );
}