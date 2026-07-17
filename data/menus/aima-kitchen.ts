export const menu = {
  shopId: "aimas-kitchen-skardu",
  name: "Aima's Kitchen Skardu",
  logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784286414/ChatGPT_Image_Jul_17_2026_04_05_47_PM_hk9ubt.png", // TODO: add real Aima's Kitchen Skardu logo URL
  categories: [
    {
      name: "Deals",
      items: [
        {
          id: "ak-deal-1",
          name: "Full Karahi + 1.5 Ltr Drink + 6 Chapati",
          price: 2550,
          discountPrice: 2300,
          desc: "Full Chicken Karahi with a 1.5 Litre cold drink and 6 chapatis",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784288005/ChatGPT_Image_Jul_17_2026_04_33_05_PM_pwtjpd.png",
          variants: []
        },
        {
          id: "ak-deal-2",
          name: "Biryani + 500ml Drink",
          price: 570,
          discountPrice: 550,
          desc: "1 serving Biryani with a 500ml cold drink",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784288122/ChatGPT_Image_Jul_17_2026_04_35_10_PM_atf6dg.png",
          variants: []
        },
        {
          id: "ak-deal-3",
          name: "Full Chicken Korma + 1.5 Ltr Drink + 6 Chapati",
          price: 2400,
          discountPrice: 2100,
          desc: "Full Chicken Korma with a 1.5 Litre cold drink and 6 chapatis",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784288312/ChatGPT_Image_Jul_17_2026_04_37_54_PM_roenes.png",
          variants: []
        }
      ]
    },
    {
      name: "Rice",
      items: [
        {
          id: "ak-rc-1",
          name: "Biryani",
          price: 470,
          discountPrice: 400,
          desc: "Aromatic spiced rice with chicken (1 serving)",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFLw_bSMIb9SOXs7DBMcY62-VHWCTZNHZeM5hWO4cpoQ&s=10",
          variants: []
        },
        {
          id: "ak-rc-2",
          name: "Pulao",
          price: 470,
          discountPrice: 400,
          desc: "Mildly spiced fragrant rice (1 plate)",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwlSmEFEzOdrIycpSfi98eNEKrqHYUy-ra_N83Hfv48NojBKw04Uy1CDk&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Curries & Karahi",
      items: [
        {
          id: "ak-cur-1",
          name: "Balti Prapu",
          price: 950,
          discountPrice: 800,
          desc: "House-style balti curry",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIGSV2nFXlQ_J0EUeex6-GUazqxTA16HaN6ifTYZzEVoBDxbjJXz7zNSE&s=10",
          variants: [
            { name: "1 Serving", price: 950, discountPrice: 800 },
            { name: "3 Person Serving", price: 2350, discountPrice: 2000 }
          ]
        },
        {
          id: "ak-cur-2",
          name: "Chicken Korma",
          price: 1880,
          discountPrice: 1600,
          desc: "Traditional slow-cooked chicken korma",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbW-V8gVBpjr9XqcvNlW4h3IQlZqs5jVbANx70IIQWxVlsg6nGyvASSPi9&s=10",
          variants: [
            { name: "Half", price: 1180, discountPrice: 1000 },
            { name: "Full", price: 1880, discountPrice: 1600 }
          ]
        },
        {
          id: "ak-cur-3",
          name: "Chicken Karahi",
          price: 2100,
          discountPrice: 1800,
          desc: "Chicken cooked karahi-style with fresh spices",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFNuAQYMaihGGak8wyiqbzPUUaBzVsSsqzflqJz68WZA&s=10",
          variants: [
            { name: "Half", price: 1400, discountPrice: 1200 },
            { name: "Full", price: 2100, discountPrice: 1800 }
          ]
        }
      ]
    },
    {
      name: "Vegetables",
      items: [
        // {
        //   id: "ak-veg-1",
        //   name: "Chaman",
        //   price: 0, // TODO: price not provided — please confirm
        //   discountPrice: 0,
        //   desc: "Traditional Balti-style cheese/paneer curry",
        //   image: "",
        //   variants: []
        // },
        {
          id: "ak-veg-2",
          name: "Mix Sabzi",
          price: 590,
          discountPrice: 500,
          desc: "Seasonal mixed vegetables (1 bowl, serves 1-3)",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTahYiW3ipIs2EGNk68LmNA1-TQe_1BD2nD-L5XZrviPm9HRcA_xQO_C_wp&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Breads",
      items: [
        {
          id: "ak-br-1",
          name: "Aloo Paratha",
          price: 120,
          discountPrice: 100,
          desc: "Stuffed potato paratha",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Fch-m-hZoOYndPhUHBh_4wpFOxarib4Wru-wxf-_NgQnXz-VRoKJISko&s=10",
          variants: []
        },
        {
          id: "ak-br-2",
          name: "Chapati",
          price: 80,
          discountPrice: 50,
          desc: "Homemade chapati",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKu7L7KhCoHZlRDcUawqxAddf0VVGCF89Cqdauyk1sHw&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Snacks",
      items: [
        {
          id: "ak-sn-1",
          name: "Chicken Samosa",
          price: 70,
          discountPrice: 60,
          desc: "Crispy pastry filled with spiced chicken",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMHxzCJ4HQuuCdPuDfnT6SnV85t8CHI8gpmQskRTjsvkyu6llTjZtqYkxw&s=10",
          variants: []
        },
        {
          id: "ak-sn-2",
          name: "Vegetable Samosa",
          price: 60,
          discountPrice: 50,
          desc: "Crispy pastry filled with spiced vegetables",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLYEOcFwfiiRu57Tn6fI3bj65Ew_SEjzCOc6MMlaZJW3eoc7zanBGcFSR&s=10",
          variants: []
        },
        {
          id: "ak-sn-4",
          name: "Chaat",
          price: 95,
          discountPrice: 80,
          desc: "Tangy, spiced street-style chaat (1 plate)",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtN1qpJaurJZTzgyibV8GArRqTINoEzLL0Myn3m16Mlw&s=10",
          variants: []
        },
        {
          id: "ak-sn-5",
          name: "Momos (12 pcs)",
          price: 720,
          discountPrice: 480,
          desc: "Steamed momos, 12 pieces per order",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRka-gUseGsnJ76T5eUHxlgzhRPDGwORh8KHJYIJ4RSjg&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Cold Drinks",
      items: [
        {
          id: "ak-cd-1",
          name: "Cold Drink",
          price: 0, // TODO: prices not provided — please confirm flavors & sizes
          discountPrice: 0,
          desc: "Assorted soft drinks",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpRFQEyUYT1bF_phn_E-vZilzxsAguqGyuJQceOFj6aQ&s=10",
          variants: [
            { name: "Regular 345ml", price: 0, discountPrice: 0 },
            { name: "1.5 Ltr", price: 0, discountPrice: 0 }
          ]
        }
      ]
    }
  ]
};