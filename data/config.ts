export interface Shop {
  id: string;
  name: string;
  type: 'restaurant' | 'mart';
  openTime: string;   // Format "HH:mm"
  closeTime: string;  // Format "HH:mm"
  alwaysOpen: boolean;
  logo: string;       // Added for cleaner UI rendering
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
};

export const shops: Shop[] = [
  { 
    id: "yak-and-bull", 
    name: "Yak & Bull", 
    type: "restaurant", 
    openTime: "10:00", 
    closeTime: "23:00", 
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_s9v8YpPGvHU9y-lQBEtH1KWfYGK93JAqX_L7Zyi5mD_awCYaLjmdxcZ_&s=10"
  },
  { 
    id: "mfc", 
    name: "MFC", 
    type: "restaurant", 
    openTime: "11:00", 
    closeTime: "23:00", 
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMQ6dmqgrHiuXYkuCAjoK9uflq4-G8JiXB6Fglzqfsw9AAN9KhQRlQ6vs&s=10"
  },
  { 
    id: "pizza-king", 
    name: "Pizza King", 
    type: "restaurant", 
    openTime: "10:00", 
    closeTime: "23:00", 
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa8xtMwcGub4wGh9HgvVns3fAAIMH8V7a5rR3IzlQMijEyMbt9XXL4Rhrv&s=10"
  },
  { 
    id: "skyway-pizza", 
    name: "Skyway Pizza", 
    type: "restaurant", 
    openTime: "10:00", 
    closeTime: "00:00", 
    alwaysOpen: false,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUeS45GsAE9jnvKmammejtmSPfBAW92Su-zP4Wj8yMw&s=10"
  },
 { 
    id: "skardu-mart", 
    name: "Skardu Mart", 
    type: "mart", 
    openTime: "00:00", 
    closeTime: "23:59", 
    alwaysOpen: true,
    logo: "https://cdn.dribbble.com/userupload/10093652/file/original-ca4f833ed735ea013f32bb15bc7bc2d8.png?resize=752x&vertical=center" // Ensure this image is in your public/images folder
  }
];