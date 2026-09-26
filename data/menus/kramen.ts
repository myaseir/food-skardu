// K-Ramen Skardu — menu data transcribed from the physical menu board
// (the two board photos: "THE RAMEN STATION — Build Your Perfect Bowl" +
// "COMBO DEALS") plus the ramen flavors actually stocked, transcribed
// from photos of the individual packets/cups.
//
// The board itself just says "Ramen (Any Flavor) — 900/-", so it does
// not list specific flavor names or per-flavor prices. The `items`
// below break that single line out into the actual flavors on hand,
// with placeholder prices — confirm the real per-flavor prices with
// the shop before publishing, since the board treats all flavors as
// one flat 900/- item.
//
// A few things from the photos aren't wired into the template component
// yet, so they're included here as plain data for when you're ready:
// - phone / address (not currently rendered anywhere)
// - qrCode (component already supports this — just point it at the real
//   QR image once you have it, otherwise it falls back to a placeholder
//   slot)

export const menu = {
  shopId: "kramen",
  name: "K-RAMEN SKARDU",
  logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790331941/WhatsApp_Image_2026-09-25_at_3.25.20_PM_fdhoyq.jpg",
  tagline: "Taste Korea in the Heart of Skardu",

  // Not yet rendered by the template — kept here so it's not lost.
  phone: "0346-3828264",
  address: "Shahzad Market, Near Alamdar Chowk, Next to National Bank Skardu",

  categories: [
    {
      name: "The Ramen Station",
      emoji: "🍜",
      // Base price on the board is a flat 900/- for "any flavor" — these
      // per-item prices are dummy placeholders (900 for the standard
      // flavors, 950 for the specialty ones) until the shop confirms
      // real pricing per flavor.
      items: [
        {
          id: "rm-buldak-original",
          name: "Buldak Hot Chicken (Original)",
          price: 900,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344783/WhatsApp_Image_2026-09-25_at_6.45.48_PM_1_s4t6cp.jpg",
          desc: "The original fire chicken flavor. Sweet, garlicky, and seriously spicy.",
        },
        {
          id: "rm-buldak-2x",
          name: "Buldak 2x Spicy Hot Chicken",
          price: 950,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344783/WhatsApp_Image_2026-09-25_at_6.45.48_PM_xnzyzo.jpg",
          desc: "The original fire chicken flavor turned up a notch, for those chasing extra heat.",
        },
        {
          id: "rm-buldak-cheese",
          name: "Buldak Cheese Hot Chicken",
          price: 950,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344783/WhatsApp_Image_2026-09-25_at_6.45.47_PM_2_m96bgh.jpg",
          desc: "Fire chicken flavor mellowed out with a creamy melted cheese finish.",
        },
        {
          id: "rm-buldak-carbonara",
          name: "Buldak Carbonara Hot Chicken",
          price: 950,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344783/WhatsApp_Image_2026-09-25_at_6.45.47_PM_1_x2bach.jpg",
          desc: "A creamy, buttery carbonara take on the fire chicken flavor. Spicy with a rich finish.",
        },
        {
          id: "rm-buldak-rose",
          name: "Buldak Rosé Spicy Ramen",
          price: 950,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344783/WhatsApp_Image_2026-09-25_at_6.45.47_PM_do6igx.jpg",
          desc: "A smoother, creamy tomato based spicy sauce with a balanced rosé finish.",
        },
        {
          id: "rm-buldak-habanero-lime",
          name: "Buldak Habanero Lime",
          price: 950,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790345736/WhatsApp_Image_2026-09-25_at_7.14.11_PM_mtt97m.jpg",
          desc: "Fire chicken flavor with habanero heat and a tangy citrus lime edge.",
        },
        {
          id: "rm-buldak-jjajang",
          name: "Buldak Jjajang Spicy Ramen",
          price: 950,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790345738/WhatsApp_Image_2026-09-25_at_7.14.11_PM_1_kwimls.jpg",
          desc: "Savory Korean black bean sauce noodles with a mild spicy kick.",
        },
        {
          id: "rm-shin-ramyun",
          name: "Shin Ramyun",
          price: 900,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344784/WhatsApp_Image_2026-09-25_at_6.45.46_PM_1_exqbdo.jpg",
          desc: "Nongshim's classic spicy beef broth ramyun, a Korean noodle soup staple.",
        },
        {
          id: "rm-samyang-spicy",
          name: "Samyang Ramen (Spicy)",
          price: 850,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344784/WhatsApp_Image_2026-09-25_at_6.45.46_PM_x6bhl4.jpg",
          desc: "Samyang's original spicy noodles in broth, lighter on heat than the Buldak range.",
        },
      ],
    },
    {
      name: "Korean Sparkling Refreshment",
      emoji: "🥤",
      items: [
        { id: "kr-drink-1", name: "OKF Blue Lemon 350ml", price: 600, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344784/WhatsApp_Image_2026-09-25_at_6.45.45_PM_2_idugoo.jpg", desc: "" },
        { id: "kr-drink-2", name: "OKF Strawberry Lite 350ml", price: 600, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344786/WhatsApp_Image_2026-09-25_at_6.45.45_PM_1_scuxxq.jpg", desc: "" },
        { id: "kr-drink-3", name: "OKF Lemon Lite 350ml", price: 600, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344795/WhatsApp_Image_2026-09-25_at_6.45.45_PM_hzhzaa.jpg", desc: "" },
        { id: "kr-drink-4", name: "OKF Kiwi Lite 350ml", price: 600, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344795/WhatsApp_Image_2026-09-25_at_6.45.44_PM_3_zvdvgl.jpg", desc: "" },
        { id: "kr-drink-5", name: "OKF Watermelon with Aloe 340ml", price: 600, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344796/WhatsApp_Image_2026-09-25_at_6.45.44_PM_2_yobxmu.jpg", desc: "" },
      ],
    },
  ],

  // "2 — Extra Toppings" on the first board / "Extra Add On" on the
  // combo board — same four items and prices on both, kept as one list.
  addOns: [
    { name: "Sausage", price: 100 , image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344296/WhatsApp_Image_2026-09-25_at_6.45.44_PM_ypylpf.jpg" },
    { name: "Cheese", price: 100, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344296/WhatsApp_Image_2026-09-25_at_6.45.43_PM_b77nhh.jpg" },
    { name: "Boiled Egg", price: 100, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344296/WhatsApp_Image_2026-09-25_at_6.45.41_PM_1_foxpig.jpg" },
    { name: "Sweet Corn", price: 100, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344296/WhatsApp_Image_2026-09-25_at_6.45.41_PM_eezzd1.jpg" },
  ],

  // "3 — Drinks" section on the first board (separate from the Korean
  // sparkling cans above). Soft Drinks here is a flat local option with
  // no flavor list printed on the board (unlike the Korean cans), so it
  // is not linked to a flavor picker.
  drinks: [
    { name: "Soft Drinks", price: 120, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344296/WhatsApp_Image_2026-09-25_at_6.45.39_PM_1_wuqzho.jpg" },
    { name: "Water", price: 100, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344296/WhatsApp_Image_2026-09-25_at_6.45.39_PM_rwfek3.jpg" },
    { name: "Mango Slice", price: 100, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344296/WhatsApp_Image_2026-09-25_at_6.45.38_PM_1_dafy0h.jpg" },
  ],

  // "COMBO DEALS" board. Badge order on the board is 3 / 2 / 1 (Combo A,
  // B, C left to right); kept as Combo A/B/C to match the labels printed
  // on the board rather than the badge numbers.
  //
  // ramenFlavorOptions on every combo lets the customer pick which of
  // the categories[0] ("The Ramen Station") items they want their bowl
  // made from. drinkFlavorOptions works the same way for the drink that
  // comes with the combo — Combo A pulls from the local soft drink line,
  // Combo B and C pull from the five Korean sparkling can flavors.
 combos: [
    {
      name: "Combo A · Starter",
      items: "Any Ramen + Soft Drink (local)",
      price: 950,
      itemImage: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344784/WhatsApp_Image_2026-09-25_at_6.45.46_PM_x6bhl4.jpg",
      drinkImage: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344796/WhatsApp_Image_2026-09-25_at_6.45.44_PM_1_gn4grh.jpg",
      ramenFlavorOptions: [
        "rm-buldak-original",
        "rm-buldak-2x",
        "rm-buldak-cheese",
        "rm-buldak-carbonara",
        "rm-buldak-rose",
        "rm-buldak-habanero-lime",
        "rm-buldak-jjajang",
        "rm-shin-ramyun",
        "rm-samyang-spicy",
      ],
      drinkFlavorOptions: ["Soft Drinks"],
    },
    {
      name: "Combo B · Korean Combo (Best Seller)",
      items: "Any Ramen + Korean Drink",
      price: 1399,
      itemImage: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344784/WhatsApp_Image_2026-09-25_at_6.45.46_PM_2_vca1bq.jpg",
      drinkImage: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344795/WhatsApp_Image_2026-09-25_at_6.45.45_PM_hzhzaa.jpg",
      ramenFlavorOptions: [
        "rm-buldak-original",
        "rm-buldak-2x",
        "rm-buldak-cheese",
        "rm-buldak-carbonara",
        "rm-buldak-rose",
        "rm-buldak-habanero-lime",
        "rm-buldak-jjajang",
        "rm-shin-ramyun",
        "rm-samyang-spicy",
      ],
      drinkFlavorOptions: ["kr-drink-1", "kr-drink-2", "kr-drink-3", "kr-drink-4", "kr-drink-5"],
    },
    {
      name: "Combo C · Premium Korean Combo (For Two Person)",
      items: "Any Ramen + Korean Drink + Boiled Egg + Cheese",
      price: 2850,
      itemImage: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344783/WhatsApp_Image_2026-09-25_at_6.45.47_PM_2_m96bgh.jpg",
      drinkImage: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1790344795/WhatsApp_Image_2026-09-25_at_6.45.44_PM_3_zvdvgl.jpg",
      ramenFlavorOptions: [
        "rm-buldak-original",
        "rm-buldak-2x",
        "rm-buldak-cheese",
        "rm-buldak-carbonara",
        "rm-buldak-rose",
        "rm-buldak-habanero-lime",
        "rm-buldak-jjajang",
        "rm-shin-ramyun",
        "rm-samyang-spicy",
      ],
      drinkFlavorOptions: ["kr-drink-1", "kr-drink-2", "kr-drink-3", "kr-drink-4", "kr-drink-5"],
    },
],

  // Bottom black feature bar on the board: Self Service / Spicy Levels /
  // Fresh & Fast / Thank You.
  footerFeatures: [
    { label: "Self Service — Build Your Bowl", icon: "🍚" },
    { label: "Spicy Levels — Mild · Medium · Hot", icon: "🌶️" },
    { label: "Fresh & Fast — Made For You", icon: "🍜" },
    { label: "Thank You! Enjoy Your Ramen", icon: "😊" },
  ],

  closingLine: "Thank You!\nEnjoy Your Ramen",

  // Point this at the real QR image (the board's "Scan for Menu" code)
  // once you have the file — the template already falls back to a
  // placeholder slot when this is empty.
  qrCode: "",
};