interface Props {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
}

export default function Categories({ selectedCategory, setSelectedCategory, categories }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
            selectedCategory === cat 
              ? "bg-gray-900 text-white shadow-lg shadow-purple-200" 
              : "bg-white border border-gray-200 text-gray-500 hover:border-purple-600 hover:text-purple-600"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}