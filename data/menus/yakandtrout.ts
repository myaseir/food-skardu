export const menu = {
  shopId: "yakandtrout", // TODO: make sure this matches the restaurant id in your restaurants list
  name: "The Yak & Trout",
  logo: "https://scontent.fisb29-1.fna.fbcdn.net/v/t39.30808-6/853152386_122093839011539571_9105109906546179367_n.jpg?stp=dst-jpg_tt6&cstp=mx486x476&ctp=s486x476&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=utivO2qOaX8Q7kNvwFZuSgR&_nc_oc=Adp4kNfPu_W9xoi-6eQEsEYKadLz30w0kPrZEoj1e771N2qH3W56HCmMn73v6ut5z8U&_nc_zt=23&_nc_ht=scontent.fisb29-1.fna&_nc_gid=RF2lnx1tgMOG5dZ3cEslIg&_nc_ss=7b389&oh=00_AQTSgiS_OhTzp5jS0W2y6_wMHUJxH-WaCGmU9xii3d5TNg&oe=6B0B1588", // TODO: add The Yak & Trout logo URL
  contact: {
    phone: "03555866682", // second number: 03169379992
    // easypaisa: "" // TODO: add if available
  },
  address: "Skardu", // TODO: add full address
  notes: "Fine Dining • Fresh Catch",
  categories: [
    {
      name: "Soups",
      items: [
        { id: "yt-so-1", name: "Hot & Sour Soup", price: 310, discountPrice: 310, desc: "Hot & sour soup (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNCqtDzAfi7-ZtO4_zFszwPH5w8EjtLLUik2UUbhEoxyWpMZuIAbaF_CM&s=10", variants: [
          { name: "Half", price: 310, discountPrice: 310 },
          { name: "Full", price: 1099, discountPrice: 1099 }
        ] },
        { id: "yt-so-2", name: "Yak Special Soup", price: 410, discountPrice: 410, desc: "Yak special soup (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo_DwFUxdAPJuk9lLuijTHVxDGPV-N1J5MJ6KKBi0khQ&s=10", variants: [
          { name: "Half", price: 410, discountPrice: 410 },
          { name: "Full", price: 1499, discountPrice: 1499 }
        ] },
        { id: "yt-so-3", name: "Traspi Balay", price: 210, discountPrice: 210, desc: "Traspi balay (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPP1XTlhJoKQv9IgKg7f1a15nHac7GznqAq3NlbvHbrZGcjLmHIcDNVjO9&s=10", variants: [
          { name: "Half", price: 210, discountPrice: 210 },
          { name: "Full", price: 970, discountPrice: 970 }
        ] },
        { id: "yt-so-4", name: "Chicken Corn Soup", price: 310, discountPrice: 310, desc: "Chicken corn soup (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT02aOYN525Ee-Qb9kHoBsnhJ_WFaBcMCQNnM3WQQUoiUlw6O62eK36BMI8&s=10", variants: [
          { name: "Half", price: 310, discountPrice: 310 },
          { name: "Full", price: 1099, discountPrice: 1099 }
        ] }
      ]
    },
    {
      name: "Starters",
      items: [
        { id: "yt-st-1", name: "Finger Fish", price: 1030, discountPrice: 1030, desc: "Crispy finger fish (6 pcs)", image: "https://www.recipetineats.com/tachyon/2020/01/Fish-Fingers_5.jpg", variants: [] },
        { id: "yt-st-2", name: "Fish & Chips", price: 1199, discountPrice: 1199, desc: "Fish & chips (4 pcs)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnISNvfYr6bUpXQhOnZrx5Oc1h9NtKkpm_JRNssvskpeF9oq3UATSdNGTc&s=10", variants: [] },
        { id: "yt-st-3", name: "Crispy Chicken Nuggets", price: 620, discountPrice: 620, desc: "Crispy chicken nuggets (6 pcs)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCUUNpweS2AeASO2hW1VKT34R9Frxm7KjAQ8UucdZzzWS7IIy8zKNUloU&s=10", variants: [] },
        { id: "yt-st-4", name: "Chicken Mince Balls", price: 620, discountPrice: 620, desc: "Chicken mince balls (8 pcs)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPxT7ZIhO7yHFFY0XPfeh-L19DOlbQTI9wKbDqQ2_5eWyPS3RdbbfFfwA&s=10", variants: [] },
        { id: "yt-st-5", name: "Cheese Loaded Fries", price: 810, discountPrice: 810, desc: "Fries loaded with cheese", image: "https://www.queensleeappetit.com/wp-content/uploads/2018/01/Loaded-Cheese-Fries-2.jpg", variants: [] },
        { id: "yt-st-6", name: "French Fries Basket", price: 270, discountPrice: 270, desc: "Crispy french fries basket", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVcyeKS5n4CfNnz_zB0Nf88SLFkUfiiNHJ1Q0mUQ-Dq_c49KD8jmkQa5s&s=10", variants: [] },
        { id: "yt-st-7", name: "Mamtu", price: 300, discountPrice: 300, desc: "Traditional mamtu (6 pcs)", image: "https://img.magnific.com/premium-photo/mamtu-dumplings-fast-food-dish-gilgit-baltistan_323283-5865.jpg", variants: [] },
        { id: "yt-st-8", name: "Fresh Salad", price: 170, discountPrice: 170, desc: "Fresh salad", image: "https://www.allrecipes.com/thmb/OfMTXpL1AFdcPupotEVAgt2ur0k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/5557-The-Best-Vegetable-Salad-PIFS-Beauty-4x3-b638b9d372a74ae6ba58f809d3007df2.jpg", variants: [] },
        { id: "yt-st-9", name: "Raita / Mint Sauce", price: 160, discountPrice: 160, desc: "Raita / mint sauce", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCGATrHzSKjPOG-zhlcpIy5dTnBkedDvbJOCTQB5zhZw&s=10", variants: [] }
      ]
    },
    {
      name: "Pasta & Noodles",
      items: [
        { id: "yt-pn-1", name: "Fettuccine Pasta", price: 1199, discountPrice: 1199, desc: "Creamy fettuccine pasta with chicken", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz66pWScYjZFRUzOBNvaSFNEoktsTb_UVcKuxUrE_sPloBS6cNUSfqIyQ&s=10", variants: [] },
        { id: "yt-pn-2", name: "Café Special Pasta", price: 1270, discountPrice: 1270, desc: "Café special pasta", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDTmy4Clyc8VicFdEkL1DadeKs8qCsi8jOl0Q9eDIFcEeqKM9KQA4XHcsV&s=10", variants: [] },
        { id: "yt-pn-3", name: "Chicken Chowmein", price: 650, discountPrice: 650, desc: "Chicken chowmein (single)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRab-p-4LV0WwZiWQ0BVPRwUOdKZWKrsuwBfwMoNt-5YiMtEprnq4KFniQX&s=10", variants: [] }
      ]
    },
    {
      name: "Burgers & Sandwiches",
      items: [
        { id: "yt-bs-1", name: "Zinger Burger", price: 650, discountPrice: 650, desc: "Crispy zinger burger. Served with cold salad, french fries & dip sauce", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReTzPVGIT4rtfj6rkB-fAOk_Z4uo6H9uwZcutxv96tVoTYtbz1gCMUNgoB&s=10", variants: [] },
        { id: "yt-bs-2", name: "Classic Burger", price: 610, discountPrice: 610, desc: "Classic beef burger. Served with cold salad, french fries & dip sauce", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEilD7BZUWsMveuEc8ZQU-s1Mzl_TMJ8JUWCYCgeb9ew&s=10", variants: [] },
        { id: "yt-bs-3", name: "Club Sandwich", price: 630, discountPrice: 630, desc: "Club sandwich. Served with cold salad, french fries & dip sauce", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn6kKnqeP3h-EushpO352ZJhpcdArB5FVJJZaKtD75AQ&s=10", variants: [] },
        { id: "yt-bs-4", name: "Fajita Sandwich", price: 699, discountPrice: 699, desc: "Fajita sandwich. Served with cold salad, french fries & dip sauce", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhx2T40Di9w8AMZR5bS5CBhFB_m2iTjgrFtNH-fiKUqg&s=10", variants: [] }
      ]
    },
    {
      name: "Pizza",
      items: [
        { id: "yt-pz-1", name: "Supreme Tikka Pizza", price: 810, discountPrice: 810, desc: "Supreme tikka pizza", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6wKIDO8McIyFUJmXajuKhpraCZPFIxg5Ts8-yzD0holc-C3oXpP_mbZ2E&s=10", variants: [
          { name: "Small", price: 810, discountPrice: 810 },
          { name: "Medium", price: 1300, discountPrice: 1300 },
          { name: "Large", price: 1899, discountPrice: 1899 }
        ] },
        { id: "yt-pz-2", name: "Spicy Fajita Pizza", price: 810, discountPrice: 810, desc: "Spicy fajita pizza", image: "https://niralaonline.pk/cdn/shop/files/fajitaa.png?v=1790525590&width=1200", variants: [
          { name: "Small", price: 810, discountPrice: 810 },
          { name: "Medium", price: 1300, discountPrice: 1300 },
          { name: "Large", price: 1899, discountPrice: 1899 }
        ] },
        { id: "yt-pz-3", name: "Special Pizza", price: 810, discountPrice: 810, desc: "Special pizza", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp2bRatPsiGUcMupnyyiuWTX_CLLSfO9aDhqrUPzd0fh2yZlr9dK5ccxOg&s=10", variants: [
          { name: "Small", price: 810, discountPrice: 810 },
          { name: "Medium", price: 1300, discountPrice: 1300 },
          { name: "Large", price: 1899, discountPrice: 1899 }
        ] },
        { id: "yt-pz-4", name: "Vegetarian Pizza", price: 810, discountPrice: 810, desc: "Vegetarian pizza", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF9xRO2PHIalAdeFz6rcsVIMkfbrwjiMc_4eg_IN4vig&s=10", variants: [
          { name: "Small", price: 810, discountPrice: 810 },
          { name: "Medium", price: 1300, discountPrice: 1300 },
          { name: "Large", price: 1899, discountPrice: 1899 }
        ] }
      ]
    },
    {
      name: "Desi Entrees",
      items: [
        { id: "yt-de-1", name: "Chicken Karahi", price: 1490, discountPrice: 1490, desc: "Chicken karahi (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNVx4MUH-XhIf4sJF3SNZrlk-r5tziQ7T096HSj7o79g&s=10", variants: [
          { name: "Half", price: 1490, discountPrice: 1490 },
          { name: "Full", price: 2910, discountPrice: 2910 }
        ] },
        { id: "yt-de-2", name: "Chicken Boneless", price: 1780, discountPrice: 1780, desc: "Chicken boneless (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuuSw-Cs6MijwzdxWupdDqiLBZFc1wwfMgZl9gT1__QP9vR71chSR4WVdi&s=10", variants: [
          { name: "Half", price: 1780, discountPrice: 1780 },
          { name: "Full", price: 3550, discountPrice: 3550 }
        ] },
        { id: "yt-de-3", name: "Mix Vegetables", price: 400, discountPrice: 400, desc: "Mixed vegetables (single)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-2T-qLxpqNE2Z3SvJPzrijhaEi6CNb9zG7L91dQE1tg&s=10", variants: [] },
        // { id: "yt-de-4", name: "Dall Mix", price: 400, discountPrice: 400, desc: "Mixed daal (single)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfKw5_EWCUNj5VuUQwrlpY9mor3yaRs8GfC14oQ9gCi0TNahYdp63ZwrM&s=10", variants: [] },
        // { id: "yt-de-5", name: "Chicken Biryani", price: 450, discountPrice: 450, desc: "Chicken biryani (single)", image: "", variants: [] }
      ]
    },
    {
      name: "Yak Exclusive Menu",
      items: [
        { id: "yt-ye-1", name: "Yak Karahi", price: 2150, discountPrice: 2150, desc: "Yak karahi (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtZtvvuX-FR4mAGBiEexgTKxvWGW7tTcjFheVrMnhoiS3jiYHz1PT1qs_V&s=10", variants: [
          { name: "Half", price: 2150, discountPrice: 2150 },
          { name: "Full", price: 4200, discountPrice: 4200 }
        ] },
        { id: "yt-ye-2", name: "Yak Handi", price: 2610, discountPrice: 2610, desc: "Yak handi (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTezXYoWrGwSbHHqL9M-8ZX7AQ53RxmcFPZ2Vp8wWbRMaRzxSkQY6ExxLQ6&s=10", variants: [
          { name: "Half", price: 2610, discountPrice: 2610 },
          { name: "Full", price: 5190, discountPrice: 5190 }
        ] },
        { id: "yt-ye-3", name: "Yak Namkeen Gosht", price: 2050, discountPrice: 2050, desc: "Yak namkeen gosht (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7_89zdf8oYi-f-VfZhTCbNPqayEHnH3q912M3GCe3b-PFpebjVZLTv3g&s=10", variants: [
          { name: "Half", price: 2050, discountPrice: 2050 },
          { name: "Full", price: 4050, discountPrice: 4050 }
        ] },
        { id: "yt-ye-4", name: "Yak Yakhni (Soup)", price: 1600, discountPrice: 1600, desc: "Yak yakhni soup (Half / Full)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBWYbmwmVKfftq0KTUD2QYBRfHjYjQx6Uhugdb3yIq5x8pV0oPUc6pJb3C&s=10", variants: [
          { name: "Half", price: 1600, discountPrice: 1600 },
          { name: "Full", price: 3200, discountPrice: 3200 }
        ] }
      ]
    },
    // {
    //   name: "Trout & Fish Exclusive Menu",
    //   items: [
    //     { id: "yt-tf-1", name: "Grilled Trout Fish", price: 2000, discountPrice: 2000, desc: "Grilled trout fish (Half / Full). Served with two types of dip sauces", image: "", variants: [
    //       { name: "Half", price: 2000, discountPrice: 2000 },
    //       { name: "Full", price: 4000, discountPrice: 4000 }
    //     ] },
    //     { id: "yt-tf-2", name: "Fried Trout Fish", price: 2000, discountPrice: 2000, desc: "Fried trout fish (Half / Full). Served with two types of dip sauces", image: "", variants: [
    //       { name: "Half", price: 2000, discountPrice: 2000 },
    //       { name: "Full", price: 4000, discountPrice: 4000 }
    //     ] },
    //     { id: "yt-tf-3", name: "Oven Baked Trout", price: 2150, discountPrice: 2150, desc: "Oven baked trout (Half / Full). Served with two types of dip sauces", image: "", variants: [
    //       { name: "Half", price: 2150, discountPrice: 2150 },
    //       { name: "Full", price: 4150, discountPrice: 4150 }
    //     ] },
    //     { id: "yt-tf-4", name: "Fried Rohu Fish", price: 1200, discountPrice: 1200, desc: "Fried rohu fish (Half / Full). Served with two types of dip sauces", image: "", variants: [
    //       { name: "Half", price: 1200, discountPrice: 1200 },
    //       { name: "Full", price: 2400, discountPrice: 2400 }
    //     ] },
    //     { id: "yt-tf-5", name: "Grilled Rohu Fish", price: 1200, discountPrice: 1200, desc: "Grilled rohu fish (Half / Full). Served with two types of dip sauces", image: "", variants: [
    //       { name: "Half", price: 1200, discountPrice: 1200 },
    //       { name: "Full", price: 2400, discountPrice: 2400 }
    //     ] }
    //   ]
    // },
    {
      name: "Yak Burger & Sandwiches",
      items: [
        { id: "yt-yb-1", name: "Yak Burger", price: 1190, discountPrice: 1190, desc: "Yak burger", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXpxQOvZ12NqTow7PT_KrOvH07M0Cai4GJ_8d8sk3QI1RRxvwlvrex0A&s=10", variants: [] },
        { id: "yt-yb-2", name: "Yak Cheese Burger", price: 1230, discountPrice: 1230, desc: "Yak cheese burger", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXpxQOvZ12NqTow7PT_KrOvH07M0Cai4GJ_8d8sk3QI1RRxvwlvrex0A&s=10", variants: [] },
        { id: "yt-yb-3", name: "Yak Special Burger", price: 1490, discountPrice: 1490, desc: "Yak special burger", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkuWym6vrV6KVjmzfTOZH2_Ti3slaM-yai9hD9WIW3aA&s=10", variants: [] },
        // { id: "yt-yb-4", name: "Openface Yak Sandwich", price: 1130, discountPrice: 1130, desc: "Openface yak sandwich", image: "", variants: [] },
        { id: "yt-yb-5", name: "Yak Special Pizza (Medium)", price: 1799, discountPrice: 1799, desc: "Yak special pizza, medium", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfFnVtIkPm6t6udaI5o48y80neneSBGiGV06AGxP0REhEj_G16NC5jh00l&s=10", variants: [] }
      ]
    },
    {
      name: "Yak Mix Entrees",
      items: [
        { id: "yt-ym-1", name: "Yak Chow Mein", price: 910, discountPrice: 910, desc: "Yak chow mein (single)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9OKQq8vbX-7X3vRtqeYQujYzv8o3mLf6iZiDSq28GXTVFVmXzTOz89PE&s=10", variants: [] },
        { id: "yt-ym-2", name: "Yak Chilli Dry", price: 1390, discountPrice: 1390, desc: "Yak chilli dry (single)", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWgvsfUJiO4YMwi038bO_kJGWHCV_6nW7aec_MZVkGfA&s=10", variants: [] },
        // { id: "yt-ym-3", name: "Yak Special Compo", price: 1390, discountPrice: 1390, desc: "Yak special compo", image: "", variants: [] }
      ]
    },
    {
      name: "Yak & Trout Combo Platter",
      items: [
        // { id: "yt-cp-1", name: "Yak & Trout Combo Platter", price: 7900, discountPrice: 7900, desc: "For 5/6 persons. Served with biryani or egg fried rice, 1.5 litre cold drink & two types of sauces", image: "", variants: [] }
      ]
    },
    {
      name: "Sides",
      items: [
        { id: "yt-sd-1", name: "Roti", price: 50, discountPrice: 50, desc: "Fresh roti", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkgiQwXnbmU89du2gUh7jjUy3YycqchJQFbiWAhuSGLBP60v4Eca0r3U0&s=10", variants: [] }
      ]
    },
    {
      name: "Drinks & Beverages",
      items: [
       {
          id: "dr-1",
          name: "Soft Drink 345ml",
          price: 120,
          discountPrice: 120,
          desc: "Chilled soft drink, 345ml",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3srEYmAd48bCUjjnNHPvz5iHdIlpqILtLDtfZ9wOGa8kGH9MaAAnrNowp&s=10",
          variants: [
            { name: "Pepsi", price: 120, discountPrice: 120 },
            { name: "7Up", price: 120, discountPrice: 120 },
            { name: "Mountain Dew", price: 120, discountPrice: 120 },
            { name: "Coke", price: 150, discountPrice: 150 },
            { name: "Mirinda", price: 120, discountPrice: 120 }
          ]
        },
        {
          id: "dr-1b",
          name: "Soft Drink 1.5 Ltr",
          price: 250, // TODO: 1.5L prices not confirmed — please provide actual values
          discountPrice: 250,
          desc: "Chilled soft drink, 1.5 litre",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTial3BpGo2hK4HQI2MBTLAEybZ_teTF_ovh7UJsRxFPIjSOxYzIG6p7XW_&s=10",
          variants: [
            { name: "Pepsi", price: 250, discountPrice: 250 },
            { name: "7Up", price: 250, discountPrice: 250 },
            { name: "Mountain Dew", price: 250, discountPrice: 250 }
          ]
        },
        { id: "dr-4", name: "Mineral Water (Large)", price: 150, discountPrice: 150, desc: "Pure mountain water", image: "https://alfatah.pk/cdn/shop/files/grocerapp-aquafina-pure-mineral-water-60faa9188cbdb.jpg?v=1690208281", variants: [] },
        { id: "dr-5", name: "Sting Energy", price: 200, discountPrice: 200, desc: "Boost your energy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbiZo_-FAlUMhL1lwWz7jwzSn6o82u-_I6TMf12A9byjJfHV1-pXpty65-&s=10", variants: [] }
      ]
    }
  ]
};