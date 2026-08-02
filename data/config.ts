export interface Shop {
  id: string;
  name: string;
  type: "restaurant" | "mart";
  openTime: string; // Format "HH:mm" (24-hour, zero-padded)
  closeTime: string; // Format "HH:mm" (24-hour, zero-padded)
  alwaysOpen: boolean;
  logo: string; // Added for cleaner UI rendering
  isActive?: boolean; // Master switch to manually close a shop anytime
  lat: number; // Shop's coordinates — used to compute distance from hub automatically
  lng: number;
  whatsapp: string;
  rating: number; // e.g. 4.5
  reviews: number; // e.g. 42
}

export interface CategoryConfig {
  [key: string]: {
    isAvailable: boolean;
  };
}

export const categoryConfig: CategoryConfig = {
  Food: { isAvailable: true },
  Mart: { isAvailable: true },
  Electronics: { isAvailable: true },
  Pharmacy: { isAvailable: true },
  Hardware: { isAvailable: true },

  // Panda Mart categories — listed here so they can be toggled off
  // centrally in the future without touching product data.
  "Fresh Food & Dairy": { isAvailable: true },
  "Pantry & Cooking Staples": { isAvailable: true },
  "Snacks & Beverages": { isAvailable: true },
  "Household & Personal Needs": { isAvailable: true },
  "Specialty & Promos": { isAvailable: true },
};

export const shops: Shop[] = [
  {
    id: "yak-and-bull",
    name: "Yak and Bull Cafe Skardu",
    type: "restaurant",
    openTime: "12:00",
    closeTime: "01:00",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_s9v8YpPGvHU9y-lQBEtH1KWfYGK93JAqX_L7Zyi5mD_awCYaLjmdxcZ_&s=10",
    lat: 35.289211, lng: 75.631235, // TODO: replace with real coordinates
    whatsapp: "923485825247",
    rating: 4.6,
    reviews: 185,
  },
// {
//     id: "balti-cuisine-skardu",
//     name: "Balti Cuisine Skardu",
//     type: "restaurant",
//     openTime: "11:00", // TODO: confirm actual opening time
//     closeTime: "23:00", // TODO: confirm actual closing time
//     alwaysOpen: false,
//     logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4MHJr5IIt6j7rWP1jwfUl8C1isf5e5AciPwkmMyAe0Q&s", // TODO: no logo image available yet
//     lat: 35.2900162, // TODO: replace with real coordinates (Marafie Colony, Skardu)
//     lng: 75.6374406, // TODO: replace with real coordinates (Marafie Colony, Skardu)
//     rating: 4.9, // TODO: confirm actual rating
//     reviews: 467, // TODO: confirm actual review count
//   },
  {
    id: "the-kitchen-skardu",
    name: "The Kitchen",
    type: "restaurant",
    openTime: "12:00", // TODO: confirm actual opening time
    closeTime: "21:00", // TODO: confirm actual closing time
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpO1EPdDa0L41JIdnK45cWhQVFiulx09fx2p5amMNXFXwBXUiOyj8itdI&s=10", // TODO: paste real logo URL
    lat: 35.28872, // TODO: replace with real coordinates
    lng: 75.630066, // TODO: replace with real coordinates
    whatsapp: "923555709276",
    rating: 4.8, // TODO: adjust once real reviews exist
    reviews: 61, // TODO: adjust once real reviews exist
  },
   {
    id: "dominos-skardu",
    name: "Domino's Pizza Skardu",
    type: "restaurant",
    openTime: "13:00",
    closeTime: "01:30",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQipAadvX55uIxjvM_YfwT8z-A_IxMxT3Quh1MHxi1g9g&s", // TODO: paste real logo URL
    lat: 35.302132, // TODO: replace with real coordinates
    lng: 75.625344, // TODO: replace with real coordinates
    whatsapp: "923441518777",
    rating: 4.5,          // adjust as needed
    reviews: 46,
  },
    {
    id: "the-balti-table",
    name: "The Balti Table",
    type: "restaurant",
    openTime: "12:00",
    closeTime: "23:30",
    alwaysOpen: false,
    logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785659359/WhatsApp_Image_2026-08-02_at_1.26.33_PM_webhxh.jpg",
    lat: 35.2899888, // TODO: replace with real coordinates
    lng: 75.6415605, // TODO: replace with real coordinates
    whatsapp: "923554395551",
    rating: 4.7,
    reviews: 89,
  },
   {
    id: "skyway-pizza",
    name: "Skyway Pizza Skardu",
    type: "restaurant",
    openTime: "13:00",
    closeTime: "01:30",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUeS45GsAE9jnvKmammejtmSPfBAW92Su-zP4Wj8yMw&s=10",
    lat: 35.288921, // TODO: replace with real coordinates
    lng: 75.629178, // TODO: replace with real coordinates
    whatsapp: "923554524401",
    rating: 4.1,
    reviews: 106,
  },
   {
    id: "thefoodcorridor-skardu",
    name: "The Food Corridor Skardu",
    type: "restaurant",
    openTime: "12:00",
    closeTime: "01:30",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhq9-b5Lbb5KFY0BOxoJrhwSbP4_aaqDECxxfbuzc8XA&s=10",
    lat: 35.2897981, // TODO: replace with real coordinates
    lng: 75.6406073, // TODO: replace with real coordinates
    whatsapp: "03169030178",
    rating: 4.1,
    reviews: 360,
  },

 
  // {
  //   id: "aima-kitchen",
  //   name: "Aima's Kitchen Skardu",
  //   type: "restaurant",
  //   openTime: "11:00",
  //   closeTime: "22:00",
  //   alwaysOpen: false,
  //   logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784286414/ChatGPT_Image_Jul_17_2026_04_05_47_PM_hk9ubt.png",
  //   lat: 0, // TODO: replace with real coordinates
  //   lng: 0, // TODO: replace with real coordinates
  //   rating: 0.0,
  //   reviews: 0,
  // },
  {
    id: "sungum-hotel-restaurant",
    name: "Sungum Hotel Restaurant Skardu ",
    type: "restaurant",
    openTime: "11:00",
    closeTime: "22:00",
    alwaysOpen: false,
    logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784291847/ChatGPT_Image_Jul_17_2026_05_37_05_PM_t6yq3u.jpg",
    lat: 35.2900162, // TODO: replace with real coordinates
    lng: 75.6374406, // TODO: replace with real coordinates
    whatsapp: "923167018580",
    rating: 4.5,
    reviews: 15,
  },

  {
    id: "mfc",
    name: "MFC Skardu",
    type: "restaurant",
    openTime: "11:00",
    closeTime: "23:00",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMQ6dmqgrHiuXYkuCAjoK9uflq4-G8JiXB6Fglzqfsw9AAN9KhQRlQ6vs&s=10",
    lat: 35.289893, // TODO: replace with real coordinates
    lng: 75.637079, // TODO: replace with real coordinates
    whatsapp: "923554220114",
    rating: 4.3,
    reviews: 21,
  },
  {
    id: "baltistan-tea-grill-house",
    name: "Baltistan Tea and Grill House",
    type: "restaurant",
    openTime: "11:00",
    closeTime: "23:00",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk_kbQo7Hg9dJ0cNp8MBi2eIwtU5H9YtFc6jZ50JvxeA&s",
    lat: 35.298864, // TODO: replace with real coordinates
    lng: 75.637217, // TODO: replace with real coordinates
    whatsapp: "923554718865",
    rating: 5.0,
    reviews: 24,
  },
  {
    id: "hassan-hussain-host",
    name: "Hassan Hussain Host",
    type: "restaurant",
    openTime: "11:00",
    closeTime: "22:30",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Vba66LQaBXtJejMOezwhFNWkX4NVN0yXn0RV03oYNw&s",
     lat: 35.2899888, // TODO: replace with real coordinates
    lng: 75.6415605, // TODO: replace with real coordinates
    whatsapp: "923554395551",
    rating: 0.0,
    reviews: 0,
  },
   
  {
    id: "pizza-king",
    name: "Pizza King Skardu",
    type: "restaurant",
    openTime: "13:00",
    closeTime: "01:00",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa8xtMwcGub4wGh9HgvVns3fAAIMH8V7a5rR3IzlQMijEyMbt9XXL4Rhrv&s=10",
    lat: 35.289174, // TODO: replace with real coordinates
    lng: 75.636453, // TODO: replace with real coordinates
    whatsapp: "923453220824",
    rating: 4.0,
    reviews: 29,
  },
  {
    id: "yak-grill-skardu",
    name: "Yak Grill Skardu",
    type: "restaurant",
    openTime: "12:00",
    closeTime: "23:30",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTCK1MjSAqQF5vWaFQeoB26t69zQdIJEkEBA8pGEZYAs8QhCwkmFSRmwcG&s=10",
    lat: 35.296598, // TODO: replace with real coordinates
    lng: 75.643991, // TODO: replace with real coordinates
    whatsapp: "923408922555",
    rating: 4.2,
    reviews: 37,
  },

  {
    id: "mart-1", // MUST match shopId used in products.ts
    name: "Meal Mart", // TODO: real name
    type: "mart",
    openTime: "24:00",
    closeTime: "8:00",
    alwaysOpen: false,
    logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785169551/WhatsApp_Image_2026-07-27_at_9.23.27_PM_eap0bl.jpg", // TODO: paste real logo URL
    lat: 35.309838, // TODO: replace with the mart's real coordinates
    lng: 75.609356, // TODO: replace with the mart's real coordinates
    whatsapp: "923169030178",
    isActive: true,
    rating: 0,
    reviews: 0,
  },
  
 
];