// Custom Next.js image loader for Cloudinary-hosted images.
// Cloudinary handles the actual resizing/compression via URL transformation
// params, so this sidesteps Next's own sharp-based optimizer (and the 500
// that caused you to disable optimization site-wide) — while still letting
// next/image manage responsive srcset, lazy loading, and layout-shift
// prevention, all of which matter for Core Web Vitals / SEO.
//
// Non-Cloudinary URLs (gstatic, tossdown, etc.) pass through unchanged,
// same as they would under unoptimized: true.

type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudinaryLoader({ src, width, quality }: LoaderProps): string {
  if (!src.includes("res.cloudinary.com")) {
    // Not a Cloudinary URL — return as-is, same behavior as unoptimized.
    return src;
  }

  const params = [`w_${width}`, `q_${quality ?? 75}`, "f_auto", "c_limit"].join(",");

  // Cloudinary URLs look like:
  // https://res.cloudinary.com/<cloud_name>/image/upload/v.../file.jpg
  // Inserting transformation params right after "/upload/" applies them.
  return src.replace("/upload/", `/upload/${params}/`);
}