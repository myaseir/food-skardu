import Link from "next/link";
import {
  Banknote,
  ChevronRight,
  Clock,
  MapPin,
  Tag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { CITY, MenuLike, buildDescription, getShopFacts } from "@/lib/shopSeo";

// Your About page route (app/about-us). Keep it the same as the URL in the
// sitemap and in the About page's canonical tag.
const ABOUT_HREF = "/about-us";

interface RestaurantAboutProps {
  shop: object;
  menu: MenuLike;
}

interface Detail {
  label: string;
  value: string;
  icon: LucideIcon;
}

/**
 * Server component: its text is in the initial HTML, so Google can read it.
 * Rendered from the page (not inside a template) so it works for every template.
 * Mobile first: one column on phones, two columns from the "sm" breakpoint up.
 */
export default function RestaurantAbout({ shop, menu }: RestaurantAboutProps) {
  const facts = getShopFacts(shop);
  const description = buildDescription(facts, menu);

  const locationParts = [facts.address, facts.area].filter(
    (part): part is string => Boolean(part)
  );

  const details: (Detail | null)[] = [
    facts.hoursLabel
      ? { label: "Hours", value: facts.hoursLabel, icon: Clock }
      : null,
    facts.priceRange
      ? { label: "Price range", value: facts.priceRange, icon: Tag }
      : null,
    locationParts.length
      ? {
          label: "Location",
          value: [...locationParts, CITY].join(", "),
          icon: MapPin,
        }
      : null,
    {
      label: "Delivery",
      value: `Homes, offices, and hotel rooms across ${CITY}`,
      icon: Truck,
    },
    { label: "Payment", value: "Cash on Delivery", icon: Banknote },
  ];

  const visibleDetails = details.filter((d): d is Detail => d !== null);

  return (
    <section
      aria-labelledby="about-restaurant"
      className="bg-gray-50 px-4 pb-28 pt-2 sm:px-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        {/* Heading and cuisine tags */}
        <h2
          id="about-restaurant"
          className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl"
        >
          About {facts.name}
        </h2>

        {facts.cuisines.length > 0 && (
          <ul aria-label="Cuisine" className="mt-3 flex flex-wrap gap-2">
            {facts.cuisines.map((cuisine) => (
              <li
                key={cuisine}
                className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700"
              >
                {cuisine}
              </li>
            ))}
          </ul>
        )}

        {/* Description */}
        <p className="mt-4 max-w-[65ch] whitespace-pre-line text-[15px] leading-7 text-gray-600">
          {description}
        </p>

        {/* Details */}
        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visibleDetails.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5"
            >
              <dt className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Icon size={14} aria-hidden="true" className="text-purple-600" />
                {label}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold leading-snug text-gray-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Delivery note with link to the About page */}
        <div className="mt-6 flex flex-col gap-4 rounded-xl bg-purple-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-purple-900">
            Ordered through Meal Bear Skardu. The delivery fee depends on
            distance and is shown at checkout before you place your order.
          </p>
          <Link
            href={ABOUT_HREF}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1 rounded-lg bg-purple-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 active:scale-95"
          >
            How delivery works
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}