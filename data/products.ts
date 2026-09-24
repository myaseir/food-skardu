export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number; // Not populated yet — add later when discount pricing is finalized
  category: string;
  department: "Mart"; // Defines which tab the item belongs to
  shopId: string; // Must match the ID in data/config.ts
  description?: string; // Short note on size/pack/notes for the customer
  image?: string; // Optional: Add this if you plan to use images later
}

export const products: Product[] = [
  // ==========================================
  // MART DEPARTMENT — rebuilt from customer-requested items
  // Categories kept exactly as original: Dairy & Eggs, Bakery & Breakfast,
  // Groceries, Snacks & Chips, Sweets & Chocolates, Cold Beverages,
  // Tea & Coffee, Household & Cleaning, Personal Care, Pharmacy & Wellness,
  // Baby Care
  // ==========================================

  // ---------- DAIRY & EGGS ----------
  { id: "m_da1", name: "Fresh Cow Milk - 1 litre, local farm supply", price: 260, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "1 litre, local farm supply", image: "https://placehold.co/400x400/fff9c4/827717?text=Fresh+Milk" },
  { id: "m_da2", name: "Nestle Milk Pak (UHT) - 1 litre tetra pack", price: 290, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "1 litre tetra pack", image: "https://placehold.co/400x400/fff9c4/827717?text=Nestle+Milk+Pak" },
  { id: "m_da3", name: "Olper's Milk - 1 litre tetra pack", price: 290, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "1 litre tetra pack", image: "https://placehold.co/400x400/fff9c4/827717?text=Olpers+Milk" },
  { id: "m_da4", name: "Nurpur Milk - 1 litre tetra pack", price: 285, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "1 litre tetra pack", image: "https://placehold.co/400x400/fff9c4/827717?text=Nurpur+Milk" },
  { id: "m_da5", name: "Nestle Everyday Powdered Milk - 400g tin", price: 950, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "400g tin", image: "https://placehold.co/400x400/fff9c4/827717?text=Everyday+Milk" },
  { id: "m_da6", name: "Milk Cream / Malai (fresh) - 250g, local", price: 250, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "250g, local", image: "https://placehold.co/400x400/fff9c4/827717?text=Malai" },
  { id: "m_da7", name: "Olper's Dairy Cream - 200ml tetra pack", price: 175, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "200ml tetra pack", image: "https://www.hkarimbuksh.com/cdn/shop/products/engro-foods-limited-olpers-dairy-cream-200ml-6954306601089_1800x.jpg?v=1629530825" },
  { id: "m_da8", name: "Fresh Yogurt (Dahi) - 500g, local", price: 220, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "500g, local", image: "https://placehold.co/400x400/fff9c4/827717?text=Fresh+Yogurt" },
  { id: "m_da9", name: "Nestle Yogurt Cup - 100g cup", price: 90, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "100g cup", image: "https://placehold.co/400x400/fff9c4/827717?text=Nestle+Yogurt" },
  { id: "m_da10", name: "Fresh Farm Eggs - Dozen (12 eggs)", price: 380, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "Dozen (12 eggs)", image: "https://placehold.co/400x400/fff9c4/827717?text=Fresh+Eggs" },
  { id: "m_da11", name: "Mozzarella Cheese - 200g block", price: 500, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "200g block", image: "https://achhaemart.com/cdn/shop/products/12-1800x1676-600x559_46635a4a-007d-432e-8f4e-aa9af73c272f.jpg?v=1755197861&width=480" },
  { id: "m_da12", name: "Cheddar Cheese Slices - 200g pack, 10 slices", price: 450, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "200g pack, 10 slices", image: "https://placehold.co/400x400/fff9c4/827717?text=Cheddar+Slices" },
  { id: "m_da13", name: "Barhaba Honey - Jar", price: 400, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "Jar", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGEBcYQSziuRFmsE52RzJZti2wBI2vgfOQ8d9zMzCifttH41AHyssek1QY&s=10" },
  { id: "m_da14", name: "Frozen Butter - 250g block", price: 450, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "250g block", image: "https://placehold.co/400x400/fff9c4/827717?text=Frozen+Butter" },
  { id: "m_da15", name: "Frozen Mozzarella Block - 250g block", price: 550, category: "Dairy & Eggs", department: "Mart", shopId: "mart-1", description: "250g block", image: "https://placehold.co/400x400/fff9c4/827717?text=Frozen+Mozzarella" },

  // ---------- BAKERY & BREAKFAST ----------
  { id: "m_bb1", name: "Fresh Sliced Bread - 1 loaf, local bakery", price: 150, category: "Bakery & Breakfast", department: "Mart", shopId: "mart-1", description: "1 loaf, local bakery", image: "https://placehold.co/400x400/ffe0b2/e65100?text=Sliced+Bread" },
  { id: "m_bb2", name: "Bismillah Bakery Bread - 1 loaf, local bakery", price: 150, category: "Bakery & Breakfast", department: "Mart", shopId: "mart-1", description: "1 loaf, local bakery", image: "https://placehold.co/400x400/ffe0b2/e65100?text=Bismillah+Bread" },
  { id: "m_bb3", name: "National Bakery Bread - 1 loaf, local bakery", price: 140, category: "Bakery & Breakfast", department: "Mart", shopId: "mart-1", description: "1 loaf, local bakery", image: "https://placehold.co/400x400/ffe0b2/e65100?text=National+Bread" },
  { id: "m_bb4", name: "Bismillah Bakery Rusk - Fresh local bakery rusk pack", price: 150, category: "Bakery & Breakfast", department: "Mart", shopId: "mart-1", description: "Fresh local bakery rusk pack", image: "https://placehold.co/400x400/ffe0b2/e65100?text=Bismillah+Rusk" },
  { id: "m_bb5", name: "National Bakery Biscuits - Local bakery biscuit pack", price: 100, category: "Bakery & Breakfast", department: "Mart", shopId: "mart-1", description: "Local bakery biscuit pack", image: "https://placehold.co/400x400/ffe0b2/e65100?text=National+Bakery" },

  // ---------- GROCERIES ----------
  { id: "m_gs1", name: "Sufi Canola Cooking Oil - 1 litre bottle", price: 750, category: "Groceries", department: "Mart", shopId: "mart-1", description: "1 litre bottle", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Sufi+Oil+1L" },
  { id: "m_gs2", name: "Sufi Canola Cooking Oil - 3 litre bottle", price: 1870, category: "Groceries", department: "Mart", shopId: "mart-1", description: "3 litre bottle", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqnWYA9cKhh1cbpXMZYnAMZgzVPRe9q2P8mDlBOBE5rQMshP2CHTEelzP5&s=10" },
  { id: "m_gs3", name: "Sufi Canola Cooking Oil - 4.5 litre jerry can", price: 3100, category: "Groceries", department: "Mart", shopId: "mart-1", description: "4.5 litre jerry can", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Sufi+Oil+4.5L" },
  { id: "m_gs4", name: "Dalda Cooking Oil - 1 litre bottle", price: 800, category: "Groceries", department: "Mart", shopId: "mart-1", description: "1 litre bottle", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Dalda+Oil" },
  { id: "m_gs5", name: "Sugar (Cheeni) - 1kg pack", price: 220, category: "Groceries", department: "Mart", shopId: "mart-1", description: "1kg pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Sugar" },
  { id: "m_gs6", name: "Iodized Salt - 800g pack", price: 60, category: "Groceries", department: "Mart", shopId: "mart-1", description: "800g pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Iodized+Salt" },
  { id: "m_gs7", name: "Black Pepper Powder (Kali Mirch) - 50g pack", price: 250, category: "Groceries", department: "Mart", shopId: "mart-1", description: "50g pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Black+Pepper" },
  { id: "m_gs8", name: "Red Chili Powder - 100g pack", price: 200, category: "Groceries", department: "Mart", shopId: "mart-1", description: "100g pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Red+Chili" },
  { id: "m_gs9", name: "Turmeric Powder (Haldi) - 100g pack", price: 150, category: "Groceries", department: "Mart", shopId: "mart-1", description: "100g pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Turmeric" },
  { id: "m_gs10", name: "Shan Biryani Masala - 50g sachet", price: 90, category: "Groceries", department: "Mart", shopId: "mart-1", description: "50g sachet", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Shan+Biryani" },
  { id: "m_gs11", name: "Shan Karahi Masala - 50g sachet", price: 90, category: "Groceries", department: "Mart", shopId: "mart-1", description: "50g sachet", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Shan+Karahi" },
  { id: "m_gs12", name: "Shan Qorma Masala - 50g sachet", price: 90, category: "Groceries", department: "Mart", shopId: "mart-1", description: "50g sachet", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Shan+Qorma" },
  { id: "m_gs13", name: "National Biryani Masala - 50g sachet", price: 90, category: "Groceries", department: "Mart", shopId: "mart-1", description: "50g sachet", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=National+Biryani" },
  { id: "m_gs14", name: "National Karahi Masala - 50g sachet", price: 90, category: "Groceries", department: "Mart", shopId: "mart-1", description: "50g sachet", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=National+Karahi" },
  { id: "m_gs15", name: "Mashmoom Mango Jam - 450g jar", price: 500, category: "Groceries", department: "Mart", shopId: "mart-1", description: "450g jar", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Mango+Jam" },
  { id: "m_gs16", name: "National Mixed Pickle in Oil - Jar", price: 200, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Jar", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Mixed+Pickle" },
  { id: "m_gs17", name: "Shangrila Mixed Pickle in Oil - Jar", price: 295, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Jar", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Shangrila+Pickle" },
  { id: "m_gs18", name: "National Tomato Ketchup - 500g bottle", price: 220, category: "Groceries", department: "Mart", shopId: "mart-1", description: "500g bottle", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Ketchup" },
  { id: "m_gs19", name: "Shan Tomato Ketchup - 500g bottle", price: 220, category: "Groceries", department: "Mart", shopId: "mart-1", description: "500g bottle", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Shan+Ketchup" },
  { id: "m_gs20", name: "Bake Parlor Chilli Sauce - Bottle", price: 250, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Chilli+Sauce" },
  { id: "m_gs21", name: "Bake Parlor Soy Sauce - Bottle", price: 280, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Soy+Sauce" },
  { id: "m_gs22", name: "Bake Parlor Synthetic Vinegar - Bottle", price: 150, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Vinegar" },
  { id: "m_gs23", name: "Daal Chana (Chickpea lentil) - 1kg pack", price: 320, category: "Groceries", department: "Mart", shopId: "mart-1", description: "1kg pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Daal+Chana" },
  { id: "m_gs24", name: "Daal Mash - 1kg pack", price: 420, category: "Groceries", department: "Mart", shopId: "mart-1", description: "1kg pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Daal+Mash" },
  { id: "m_gs25", name: "Daal Moong - 1kg pack", price: 380, category: "Groceries", department: "Mart", shopId: "mart-1", description: "1kg pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Daal+Moong" },
  { id: "m_gs26", name: "Daal Masoor - 1kg pack", price: 350, category: "Groceries", department: "Mart", shopId: "mart-1", description: "1kg pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Daal+Masoor" },
  { id: "m_gs27", name: "Lobia (Black-eyed beans) - 1kg pack", price: 350, category: "Groceries", department: "Mart", shopId: "mart-1", description: "1kg pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Lobia" },
  { id: "m_gs28", name: "Wheat Flour (Atta) - 10kg bag, traditional local milling", price: 950, category: "Groceries", department: "Mart", shopId: "mart-1", description: "10kg bag, traditional local milling", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Wheat+Atta" },
  { id: "m_gs29", name: "Wheat Flour (Atta) - small bag - 5kg bag", price: 500, category: "Groceries", department: "Mart", shopId: "mart-1", description: "5kg bag", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Wheat+Atta+5kg" },
  { id: "m_gs30", name: "Barley Flour (Jau Atta) - 2kg bag, traditional local variety", price: 350, category: "Groceries", department: "Mart", shopId: "mart-1", description: "2kg bag, traditional local variety", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Barley+Flour" },
  { id: "m_gs31", name: "Maize Flour (Makai Atta) - 2kg bag", price: 300, category: "Groceries", department: "Mart", shopId: "mart-1", description: "2kg bag", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Maize+Flour" },
  { id: "m_gs32", name: "Knorr Noodles Chicken - Single-serve pack", price: 90, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Single-serve pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Knorr+Chicken" },
  { id: "m_gs33", name: "Knorr Noodles Chatpata - Single-serve pack", price: 90, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Single-serve pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Knorr+Chatpata" },
  { id: "m_gs34", name: "Shoop Noodles Chicken - Family pack", price: 180, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Family pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Shoop+Chicken" },
  { id: "m_gs35", name: "Shoop Noodles Chatpata - Family pack", price: 180, category: "Groceries", department: "Mart", shopId: "mart-1", description: "Family pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Shoop+Chatpata" },
  { id: "m_gs36", name: "Bake Parlor Elbow Macaroni - 400g box", price: 160, category: "Groceries", department: "Mart", shopId: "mart-1", description: "400g box", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Elbow+Macaroni" },
  { id: "m_gs37", name: "Bake Parlor Fajita Spaghetti - 400g box", price: 170, category: "Groceries", department: "Mart", shopId: "mart-1", description: "400g box", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Fajita+Spaghetti" },
  { id: "m_gs38", name: "National Macaroni - 400g box", price: 150, category: "Groceries", department: "Mart", shopId: "mart-1", description: "400g box", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=National+Macaroni" },
  { id: "m_gs39", name: "K&N's Chicken Nuggets - 336g frozen pack", price: 550, category: "Groceries", department: "Mart", shopId: "mart-1", description: "336g frozen pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Chicken+Nuggets" },
  { id: "m_gs40", name: "Menu's Chicken Nuggets - 336g frozen pack", price: 550, category: "Groceries", department: "Mart", shopId: "mart-1", description: "336g frozen pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Menus+Nuggets" },
  { id: "m_gs41", name: "Shami Kabab (frozen) - 10-piece frozen pack", price: 450, category: "Groceries", department: "Mart", shopId: "mart-1", description: "10-piece frozen pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Shami+Kabab" },
  { id: "m_gs42", name: "Frozen Paratha - 5-piece frozen pack", price: 350, category: "Groceries", department: "Mart", shopId: "mart-1", description: "5-piece frozen pack", image: "https://placehold.co/400x400/d7ccc8/4e342e?text=Frozen+Paratha" },

  // ---------- SNACKS & CHIPS ----------
  { id: "m_sc1", name: "Cheetos Flaming Hot - 100g pack, spicy flavour", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "100g pack, spicy flavour", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHSZIVeq4xaD7q6uU9nEq_56jMP-jZ5BUhiEYLgtQwB2hP81XdYSntGUE&s=10" },
  { id: "m_sc2", name: "Cheetos Crunchy - Standard 55g pack", price: 60, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 55g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Cheetos+Crunchy" },
  { id: "m_sc3", name: "Cheetos Small Pack - Small snack-size pack", price: 20, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Small snack-size pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Cheetos+Small" },
  { id: "m_sc4", name: "Lay's Masala - Standard 78g pack", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 78g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Lays+Masala" },
  { id: "m_sc5", name: "Lay's Paprika - Standard 78g pack", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 78g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Lays+Paprika" },
  { id: "m_sc6", name: "Lay's Wavy Texas BBQ - Standard 78g pack", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 78g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Lays+Wavy+Texas" },
  { id: "m_sc7", name: "Lay's Wavy Yogurt & Herb - Standard 78g pack", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 78g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Lays+Wavy+Yogurt" },
  { id: "m_sc8", name: "Lay's Salted - Standard 78g pack", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 78g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Lays+Salted" },
  { id: "m_sc9", name: "Lay's Small Pack (assorted flavours) - Small snack-size pack", price: 20, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Small snack-size pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Lays+Small" },
  { id: "m_sc10", name: "Kurkure Toofani Mirch - Standard 80g pack", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 80g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Kurkure+Toofani" },
  { id: "m_sc11", name: "Kurkure Chutney Chaska - Standard 80g pack", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 80g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Kurkure+Chutney" },
  { id: "m_sc12", name: "Kurkure Solid Masti - Standard 80g pack", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard 80g pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Kurkure+Solid+Masti" },
  { id: "m_sc13", name: "Kurkure Small Pack (assorted flavours) - Small snack-size pack", price: 20, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Small snack-size pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Kurkure+Small" },
  { id: "m_sc14", name: "Kolson Slanty (assorted flavours) - Standard pack", price: 50, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Kolson+Slanty" },
  { id: "m_sc15", name: "LU Gala Egg Biscuits - Value pack", price: 40, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Value pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=LU+Gala+Egg" },
  { id: "m_sc16", name: "LU Prince Chocolate Biscuits - 6 snack packs", price: 90, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "6 snack packs", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=LU+Prince" },
  { id: "m_sc17", name: "LU Zeera Plus Biscuits - 8 snack packs", price: 100, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "8 snack packs", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=LU+Zeera+Plus" },
  { id: "m_sc18", name: "Peek Freans Sooper Biscuits - Standard pack", price: 50, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Sooper" },
  { id: "m_sc19", name: "Peek Freans Marie Biscuits - Standard pack", price: 50, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Marie" },
  { id: "m_sc20", name: "Peek Freans Rio Biscuits - Standard pack", price: 50, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Rio" },
  { id: "m_sc21", name: "Tiger Biscuits - Single pack", price: 20, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Single pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Tiger" },
  { id: "m_sc22", name: "Gala Biscuits (Coconut) - Standard pack", price: 50, category: "Snacks & Chips", department: "Mart", shopId: "mart-1", description: "Standard pack", image: "https://placehold.co/400x400/ffecb3/ff6f00?text=Gala+Coconut" },

  // ---------- SWEETS & CHOCOLATES ----------
  { id: "m_sw1", name: "Cadbury Dairy Milk (small) - 13g bar", price: 50, category: "Sweets & Chocolates", department: "Mart", shopId: "mart-1", description: "13g bar", image: "https://placehold.co/400x400/f8bbd0/880e4f?text=Dairy+Milk+Small" },
  { id: "m_sw2", name: "Cadbury Dairy Milk (standard) - 65g bar", price: 150, category: "Sweets & Chocolates", department: "Mart", shopId: "mart-1", description: "65g bar", image: "https://placehold.co/400x400/f8bbd0/880e4f?text=Dairy+Milk" },
  { id: "m_sw3", name: "Cadbury Dairy Milk Fruit & Nut - 80g bar", price: 200, category: "Sweets & Chocolates", department: "Mart", shopId: "mart-1", description: "80g bar", image: "https://placehold.co/400x400/f8bbd0/880e4f?text=Fruit+Nut" },
  { id: "m_sw4", name: "Cadbury Dairy Milk Roast Almond - 80g bar", price: 200, category: "Sweets & Chocolates", department: "Mart", shopId: "mart-1", description: "80g bar", image: "https://placehold.co/400x400/f8bbd0/880e4f?text=Roast+Almond" },
  { id: "m_sw5", name: "Cadbury Dairy Milk Bubbly - 70g bar", price: 170, category: "Sweets & Chocolates", department: "Mart", shopId: "mart-1", description: "70g bar", image: "https://placehold.co/400x400/f8bbd0/880e4f?text=Bubbly" },
  { id: "m_sw6", name: "Cadbury Dairy Milk Silk - Large 130g bar", price: 450, category: "Sweets & Chocolates", department: "Mart", shopId: "mart-1", description: "Large 130g bar", image: "https://placehold.co/400x400/f8bbd0/880e4f?text=Silk" },

  // ---------- COLD BEVERAGES ----------
  { id: "m_cb1", name: "Pepsi - 345ml bottle", price: 80, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "345ml bottle", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Pepsi" },
  { id: "m_cb2", name: "7Up - 345ml bottle", price: 80, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "345ml bottle", image: "https://placehold.co/400x400/b3e5fc/01579b?text=7Up" },
  { id: "m_cb3", name: "Mountain Dew - 345ml bottle", price: 80, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "345ml bottle", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Mountain+Dew" },
  { id: "m_cb4", name: "Mirinda - 345ml bottle", price: 80, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "345ml bottle", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Mirinda" },
  { id: "m_cb5", name: "Nestle Fruita Vitals Mango Juice - 1 litre tetra pack", price: 180, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "1 litre tetra pack", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Fruita+Mango" },
  { id: "m_cb6", name: "Nestle Fruita Vitals Apple Juice - 1 litre tetra pack", price: 180, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "1 litre tetra pack", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Fruita+Apple" },
  { id: "m_cb7", name: "Nestle Fruita Vitals Guava Juice - 1 litre tetra pack", price: 180, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "1 litre tetra pack", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Fruita+Guava" },
  { id: "m_cb8", name: "Nestle Fruita Vitals Orange Juice - 1 litre tetra pack", price: 180, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "1 litre tetra pack", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Fruita+Orange" },
  { id: "m_cb9", name: "Slice Mango Juice - Small carton", price: 60, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "Small carton", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Slice+Mango" },
  { id: "m_cb10", name: "Sufi Mineral Water - 1.5 litre bottle", price: 40, category: "Cold Beverages", department: "Mart", shopId: "mart-1", description: "1.5 litre bottle", image: "https://placehold.co/400x400/b3e5fc/01579b?text=Sufi+Water" },

  // ---------- TEA & COFFEE ----------
  { id: "m_tc1", name: "Tapal Danedar Tea - 190g pack", price: 100, category: "Tea & Coffee", department: "Mart", shopId: "mart-1", description: "190g pack", image: "https://placehold.co/400x400/d7ccc8/3e2723?text=Tapal+Danedar" },
  { id: "m_tc2", name: "Tapal Danedar Tea (economy) - 40g economy pack", price: 30, category: "Tea & Coffee", department: "Mart", shopId: "mart-1", description: "40g economy pack", image: "https://placehold.co/400x400/d7ccc8/3e2723?text=Tapal+Danedar+Small" },
  { id: "m_tc3", name: "Vital Tea - 190g pack", price: 100, category: "Tea & Coffee", department: "Mart", shopId: "mart-1", description: "190g pack", image: "https://placehold.co/400x400/d7ccc8/3e2723?text=Vital+Tea" },
  { id: "m_tc4", name: "Lipton Yellow Label Tea - 190g pack", price: 150, category: "Tea & Coffee", department: "Mart", shopId: "mart-1", description: "190g pack", image: "https://placehold.co/400x400/d7ccc8/3e2723?text=Lipton+Yellow" },
  { id: "m_tc5", name: "Nescafe Classic Coffee - 50g jar", price: 250, category: "Tea & Coffee", department: "Mart", shopId: "mart-1", description: "50g jar", image: "https://placehold.co/400x400/d7ccc8/3e2723?text=Nescafe+Classic" },

  // ---------- HOUSEHOLD & CLEANING ----------
  { id: "m_hc1", name: "Vim Dishwash Liquid - Bottle", price: 150, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Vim+Dishwash" },
  { id: "m_hc2", name: "Sufi Dishwash Liquid - Bottle", price: 130, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Sufi+Dishwash" },
  { id: "m_hc3", name: "Surf Excel Detergent Powder - 1kg pack", price: 550, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "1kg pack", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Surf+Excel" },
  { id: "m_hc4", name: "Surf Excel Sachet - Small sachet", price: 10, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "Small sachet", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Surf+Sachet" },
  { id: "m_hc5", name: "Ariel Detergent Powder - 1kg pack", price: 600, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "1kg pack", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Ariel" },
  { id: "m_hc6", name: "Sufi Laundry Soap Bar - Bar", price: 60, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "Bar", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Sufi+Laundry+Bar" },
  { id: "m_hc7", name: "Dettol Antiseptic Liquid - Bottle", price: 300, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Dettol+Antiseptic" },
  { id: "m_hc8", name: "Tulip Extra Absorbent Tissue Box - Box", price: 100, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "Box", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Tulip+Tissue" },
  { id: "m_hc9", name: "Rose Petal Pop-up Tissue - Box", price: 100, category: "Household & Cleaning", department: "Mart", shopId: "mart-1", description: "Box", image: "https://placehold.co/400x400/c8e6c9/1b5e20?text=Rose+Petal+Tissue" },

  // ---------- PERSONAL CARE ----------
  { id: "m_pc1", name: "Sufi Classic Beauty Soap - Bar", price: 50, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bar", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Sufi+Soap" },
  { id: "m_pc2", name: "Lux Soap - Bar", price: 60, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bar", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Lux+Soap" },
  { id: "m_pc3", name: "Dove Soap - Bar", price: 90, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bar", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Dove+Soap" },
  { id: "m_pc4", name: "Lifebuoy Soap - Bar", price: 60, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bar", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Lifebuoy+Soap" },
  { id: "m_pc5", name: "Safeguard Soap - Bar", price: 60, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bar", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Safeguard+Soap" },
  { id: "m_pc6", name: "Pantene Shampoo - Bottle", price: 350, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Pantene" },
  { id: "m_pc7", name: "Head & Shoulders Shampoo - Bottle", price: 400, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Head+Shoulders" },
  { id: "m_pc8", name: "Sunsilk Shampoo - Bottle", price: 350, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Sunsilk" },
  { id: "m_pc9", name: "Nivea Intensive Moisture Lotion - Bottle", price: 450, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Nivea+Lotion" },
  { id: "m_pc10", name: "Vaseline Advanced Strength Lotion - Bottle", price: 350, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Vaseline+Lotion" },
  { id: "m_pc11", name: "Colgate Toothpaste - Tube", price: 100, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Tube", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Colgate" },
  { id: "m_pc12", name: "Closeup Toothpaste - Tube", price: 100, category: "Personal Care", department: "Mart", shopId: "mart-1", description: "Tube", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Closeup" },

  // ---------- PHARMACY & WELLNESS ----------
  { id: "m_pw1", name: "Panadol Tablets - 10-tablet strip, for fever/pain relief", price: 30, category: "Pharmacy & Wellness", department: "Mart", shopId: "mart-1", description: "10-tablet strip, for fever/pain relief", image: "https://placehold.co/400x400/ffe0b2/e65100?text=Panadol" },
  { id: "m_pw2", name: "ORS Sachet - Oral rehydration salts, single sachet", price: 25, category: "Pharmacy & Wellness", department: "Mart", shopId: "mart-1", description: "Oral rehydration salts, single sachet", image: "https://placehold.co/400x400/ffe0b2/e65100?text=ORS" },
  { id: "m_pw3", name: "Disprin Tablets - 10-tablet strip", price: 30, category: "Pharmacy & Wellness", department: "Mart", shopId: "mart-1", description: "10-tablet strip", image: "https://placehold.co/400x400/ffe0b2/e65100?text=Disprin" },
  { id: "m_pw4", name: "Glaxose-D - Pack", price: 150, category: "Pharmacy & Wellness", department: "Mart", shopId: "mart-1", description: "Pack", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFeBHLAXvke_wL8o6lZz7G1rvK7y1_leYXtomchGt-vyCE-kmxang0YuPV&s=10" },

  // ---------- BABY CARE ----------
  { id: "m_ba1", name: "Pampers Diapers (Medium) - 5–11kg, pack", price: 1200, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "5–11kg, pack", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Pampers+Medium" },
  { id: "m_ba2", name: "Pampers Diapers (Large) - 9–14kg, pack", price: 1300, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "9–14kg, pack", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Pampers+Large" },
  { id: "m_ba3", name: "Pampers Diapers (X-Large) - 12+kg, pack", price: 1400, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "12+kg, pack", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Pampers+XL" },
  { id: "m_ba4", name: "Baby Wipes - Pack of 80", price: 200, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "Pack of 80", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Baby+Wipes" },
  { id: "m_ba5", name: "Morinaga BF-1 Infant Formula - 300g tin, 0-6 months", price: 1200, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "300g tin, 0-6 months", image: "https://media.naheed.pk/catalog/product/cache/2f2d0cb0c5f92580479e8350be94f387/1/3/1307426-1.jpg" },
  { id: "m_ba6", name: "Morinaga BF-2 Follow-up Formula - 6-scoop pack, 6-12 months", price: 400, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "6-scoop pack, 6-12 months", image: "https://alfatah.pk/cdn/shop/files/NewProject-2026-04-03T144735.080.png?v=1775209774" },
  { id: "m_ba7", name: "Nestle Lactogen 1 - Tin, 0-6 months", price: 750, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "Tin, 0-6 months", image: "https://mykiakia.com/assets/images/backend/product/gallery/68a6f515658641755772181.jpg" },
  { id: "m_ba8", name: "Nestle Lactogen 2 - Tin, 6-12 months", price: 750, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "Tin, 6-12 months", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNB3rPs74d6rf9yoA5NYoxL9Ama39aJR0olOAnumzMUeBIhGNxaiqenCs&s=10" },
  { id: "m_ba9", name: "Nestle Cerelac Wheat - 350g box, baby cereal", price: 550, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "350g box, baby cereal", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Cerelac+Wheat" },
  { id: "m_ba10", name: "Nestle Cerelac Rice - 350g box, baby cereal", price: 550, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "350g box, baby cereal", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Cerelac+Rice" },
  { id: "m_ba11", name: "Johnson's Baby Lotion - Bottle", price: 350, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://placehold.co/400x400/e1bee7/4a148c?text=Johnsons+Baby+Lotion" },
  { id: "m_ba12", name: "Mothercare Baby Oil - Bottle", price: 500, category: "Baby Care", department: "Mart", shopId: "mart-1", description: "Bottle", image: "https://themothercare.pk/cdn/shop/files/Large_to_Family_Mothercare_Baby_Oil_Natural_And_Mild_1000x.webp?v=1778132751" },
];