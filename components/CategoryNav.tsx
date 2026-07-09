"use client"; // This tells Next.js this is a Client Component

export default function CategoryNav({ categories }: { categories: any[] }) {
  return (
    <nav className="sticky top-0 bg-white z-20 border-b border-gray-100 overflow-x-auto flex px-6 py-4 gap-6 no-scrollbar">
      {categories.map((cat: any) => (
        <button
          key={cat.name}
          onClick={() => {
            const element = document.getElementById(cat.name);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="font-bold text-xs uppercase tracking-widest whitespace-nowrap text-gray-600 hover:text-purple-600 transition-colors"
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
}