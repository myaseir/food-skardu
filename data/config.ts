export interface Shop {
  id: string;
  name: string;
  type: "restaurant" | "mart";
  openTime: string; // Format "HH:mm" (24-hour, zero-padded)
  closeTime: string; // Format "HH:mm" (24-hour, zero-padded)
  alwaysOpen: boolean;
  logo: string; // Added for cleaner UI rendering
  isActive?: boolean; // Master switch to manually close a shop anytime
  distanceFromHub: number; // Distance in km, used for delivery fee calculation
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
    openTime: "10:00",
    closeTime: "01:00",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_s9v8YpPGvHU9y-lQBEtH1KWfYGK93JAqX_L7Zyi5mD_awCYaLjmdxcZ_&s=10",
    distanceFromHub: 4.5,
    rating: 4.6,
    reviews: 185,
  },
  {
    id: "dominos-skardu",
    name: "Domino's Pizza Skardu",
    type: "restaurant",
    openTime: "11:00",
    closeTime: "01:00",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQipAadvX55uIxjvM_YfwT8z-A_IxMxT3Quh1MHxi1g9g&s", // TODO: paste real logo URL
    distanceFromHub: 4, // adjust to actual distance
    rating: 4.5,          // adjust as needed
    reviews: 46,
  },
  {
    id: "the-kitchen-skardu",
    name: "The Kitchen",
    type: "restaurant",
    openTime: "12:00", // TODO: confirm actual opening time
    closeTime: "21:00", // TODO: confirm actual closing time
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpO1EPdDa0L41JIdnK45cWhQVFiulx09fx2p5amMNXFXwBXUiOyj8itdI&s=10", // TODO: paste real logo URL
    distanceFromHub: 3.9, // TODO: adjust to actual distance
    rating: 4.8, // TODO: adjust once real reviews exist
    reviews: 61, // TODO: adjust once real reviews exist
  },
    {
    id: "aima-kitchen",
    name: "Aima's Kitchen Skardu",
    type: "restaurant",
    openTime: "11:00",
    closeTime: "22:00",
    alwaysOpen: false,
    logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784286414/ChatGPT_Image_Jul_17_2026_04_05_47_PM_hk9ubt.png",
    distanceFromHub: 4.5,
    rating: 0.0,
    reviews: 0,
  },
    {
    id: "sungum-hotel-restaurant",
    name: "Sungum Hotel Restaurant Skardu ",
    type: "restaurant",
    openTime: "11:00",
    closeTime: "22:00",
    alwaysOpen: false,
    logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784291847/ChatGPT_Image_Jul_17_2026_05_37_05_PM_t6yq3u.jpg",
    distanceFromHub: 4.5,
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
    distanceFromHub: 4.5,
    rating: 4.3,
    reviews: 21,
  },

  {
    id: "pizza-king",
    name: "Pizza King Skardu",
    type: "restaurant",
    openTime: "11:00",
    closeTime: "23:00",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa8xtMwcGub4wGh9HgvVns3fAAIMH8V7a5rR3IzlQMijEyMbt9XXL4Rhrv&s=10",
    distanceFromHub: 4,
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
    distanceFromHub: 3.8,
    rating: 4.2,
    reviews: 37,
  },
  {
    id: "skyway-pizza",
    name: "Skyway Pizza Skardu",
    type: "restaurant",
    openTime: "12:00",
    closeTime: "01:00",
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUeS45GsAE9jnvKmammejtmSPfBAW92Su-zP4Wj8yMw&s=10",
    distanceFromHub: 4.6,
    rating: 4.1,
    reviews: 106,
  },
];