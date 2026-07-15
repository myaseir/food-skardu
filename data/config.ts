export interface Shop {
  id: string;
  name: string;
  type: 'restaurant' | 'mart';
  openTime: string;   // Format "HH:mm"
  closeTime: string;  // Format "HH:mm"
  alwaysOpen: boolean;
  logo: string;       // Added for cleaner UI rendering
  isActive?: boolean;
  distanceFromHub: number; // NEW: Master switch to manually close a shop anytime
}

export interface CategoryConfig {
  [key: string]: {
    isAvailable: boolean;
  };
}

export const categoryConfig: CategoryConfig = {
  "Food": { isAvailable: true },
  "Mart": { isAvailable: true },
  "Electronics": { isAvailable: true },
  "Pharmacy": { isAvailable: true },
  "Hardware": { isAvailable: true },
  
  // Optional: You can explicitly list your new Panda Mart categories here 
  // if you want a central place to toggle them off in the future.
  "Fresh Food & Dairy": { isAvailable: true },
  "Pantry & Cooking Staples": { isAvailable: true },
  "Snacks & Beverages": { isAvailable: true },
  "Household & Personal Needs": { isAvailable: true },
  "Specialty & Promos": { isAvailable: true },
};

export const shops: Shop[] = [
  { 
    id: "yak-and-bull", 
    name: "Yak and Bull Cafe", 
    type: "restaurant", 
    openTime: "10:00", 
    closeTime: "23:00", 
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_s9v8YpPGvHU9y-lQBEtH1KWfYGK93JAqX_L7Zyi5mD_awCYaLjmdxcZ_&s=10",
  distanceFromHub: 1.5
  },
  { 
    id: "mfc", 
    name: "MFC", 
    type: "restaurant", 
    openTime: "11:00", 
    closeTime: "23:00", 
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMQ6dmqgrHiuXYkuCAjoK9uflq4-G8JiXB6Fglzqfsw9AAN9KhQRlQ6vs&s=10",
    distanceFromHub: 1.5
  },
  { 
    id: "pizza-king", 
    name: "Pizza King", 
    type: "restaurant", 
    openTime: "10:00", 
    closeTime: "23:00", 
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa8xtMwcGub4wGh9HgvVns3fAAIMH8V7a5rR3IzlQMijEyMbt9XXL4Rhrv&s=10",
    distanceFromHub: 1.5
  },
  { 
    id: "skyway-pizza", 
    name: "Skyway Pizza", 
    type: "restaurant", 
    openTime: "10:00", 
    closeTime: "00:00", 
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUeS45GsAE9jnvKmammejtmSPfBAW92Su-zP4Wj8yMw&s=10",
    distanceFromHub: 1.5
  },
  

];