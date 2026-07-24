export const menu = {
  shopId: "mfc",
  name: "MFC Skardu",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMQ6dmqgrHiuXYkuCAjoK9uflq4-G8JiXB6Fglzqfsw9AAN9KhQRlQ6vs&s=10",
  categories: [
    {
      name: "Soup",
      items: [
        {
          id: "mfc-sp-1",
          name: "Hot & Sour Soup",
          price: 280,
          desc: "Classic hot and sour soup",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgJWU8_wfxC7pmaMpGgrrbfGFuLnpoI6Vhb6CJBk1RC0-h_p6dx61WU2n5&s=10",
          variants: [
            { name: "Single", price: 280 },
            { name: "Family Bowl", price: 1400 }
          ]
        }
      ]
    },
    {
      name: "Pakistani",
      items: [
        {
          id: "mfc-pk-1",
          name: "Chicken Karahi",
          price: 1600,
          desc: "Preparation time: 15 min",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFNuAQYMaihGGak8wyiqbzPUUaBzVsSsqzflqJz68WZA&s=10",
          variants: [
            { name: "Half", price: 1600 },
            { name: "Full", price: 2800 }
          ]
        },
        {
          id: "mfc-pk-2",
          name: "Chicken Handi",
          price: 1800,
          desc: "Preparation time: 15 min",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfadXYEN-wA-16qiHV-YV6vXTkuN7EfFdXU0LucAyYzraY9dBoGE3q4Vnn&s=10",
          variants: [
            { name: "Half", price: 1800 },
            { name: "Full", price: 3000 }
          ]
        },
        {
          id: "mfc-pk-3",
          name: "Chicken Jalfrazi",
          price: 1450,
          desc: "Preparation time: 15 min",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTny3bppu--7TKwOrsVtAAO1xy30muC_osWluPxuy8hLPncZV_5t8seYxk&s=10",
          variants: [
            { name: "Half", price: 1450 },
            { name: "Full", price: 2750 }
          ]
        },
        {
          id: "mfc-pk-4",
          name: "Chicken Kabab Masala",
          price: 1700,
          desc: "Preparation time: 15 min",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGWbiF5fRHgGiwZoVNKdacIvsaylbGmfExelg_xdNKmZp0wF_irHvmYliQ&s=10",
          variants: [
            { name: "Half", price: 1700 },
            { name: "Full", price: 3000 }
          ]
        }
      ]
    },
    {
      name: "BBQ",
      items: [
        { id: "mfc-bbq-1", name: "Chicken Tikka Boti", price: 380, desc: "4 Pieces", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpzZDabXMm3qOd_HTt49pGXI_etpiC3ZdPpnJlj_3M2O1WnYncj7gVAn8&s=10", variants: [] },
        { id: "mfc-bbq-2", name: "Chicken Malai Boti", price: 400, desc: "4 Pieces", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2T2Ua_BKA9Azbnc5PrO83xNhV6DlKYSy77VrXvCIPbwRScBvHjgkOC4c&s=10", variants: [] },
        { id: "mfc-bbq-3", name: "Chicken Seekh Kabab", price: 250, desc: "1 Seekh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyRTS1vZ3Bdm1G0WOtWGIL3kyu61GTvcD4WQjy9_8t5GO4nh3fvxZzXElJ&s=10", variants: [] },
        { id: "mfc-bbq-4", name: "Local Trout Fish", price: 1200, desc: "3 Pieces", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNW0rweGyE1aX1Q0XVwaQJ8qzCwOGtrf4C-Rs0O6aGaPfD2gxw2SM-4R4p&s=10", variants: [] }
      ]
    },
    {
      name: "Platters",
      items: [
        {
          id: "mfc-plt-1",
          name: "MFC Special Platter",
          price: 5200,
          desc: "Serves 4 | Prep time: 20 min. Includes: Chicken Malai Boti (3 Seekh), Chicken Tikka Boti (3 Seekh), Seekh Kabab (4), Roti (4), Masala Rice, Soft Drink (1.5L), Mint Sauce",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784903766/ChatGPT_Image_Jul_24_2026_07_35_37_PM_n8r89k.jpg",
          variants: []
        },
        {
          id: "mfc-plt-2",
          name: "MFC BBQ Platter",
          price: 2100,
          desc: "Serves 3 | Prep time: 10 min. Includes: Chicken Malai Boti (1 Seekh), Chicken Seekh Kabab (3), Chicken Tikka Boti (2 Seekh), Soft Drink (1.5L)",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784904174/ChatGPT_Image_Jul_24_2026_07_42_21_PM_jlwe26.jpg",
          variants: []
        }
      ]
    },
    // {
    //   name: "Traditional Food",
    //   items: [
    //     {
    //       id: "mfc-tf-1",
    //       name: "Chicken Moskot",
    //       price: 1850,
    //       desc: "Preparation time: 25 min",
    //       image: "",
    //       variants: [
    //         { name: "Half", price: 1850 },
    //         { name: "Full", price: 3200 }
    //       ]
    //     },
    //     {
    //       id: "mfc-tf-2",
    //       name: "Chicken Broast",
    //       price: 1650,
    //       desc: "Crispy chicken broast",
    //       image: "",
    //       variants: [
    //         { name: "Half", price: 1650 },
    //         { name: "Full", price: 2500 }
    //       ]
    //     }
    //   ]
    // },
    {
      name: "Fast Food",
      items: [
        { id: "mfc-ff-1", name: "Zinger Burger with Fries", price: 600, desc: "Crispy chicken zinger burger served with fries", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWZ_wfcOpMkRrPfKg7gUTUPtK2cAq__08fslRz2DWYcd54Cj6cpQKtIrhJ&s=10", variants: [] }
      ]
    },
    {
      name: "Chinese",
      items: [
        {
          id: "mfc-ch-1",
          name: "Chicken Chowmein",
          price: 550,
          desc: "Stir-fried noodles",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy4tqSS-XUzHgrw7oUHCeSZRlJryR_dqMOJEakUPvX31A4DxFdpcgAB9xc&s=10",
          variants: [
            { name: "Half", price: 550 },
            { name: "Full", price: 1100 }
          ]
        },
        {
          id: "mfc-ch-2",
          name: "Chicken Chilli Dry with Egg Fried Rice",
          price: 900,
          desc: "Spicy chicken chilli dry served with egg fried rice",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy7PRsoiIbXS1K-1xTuG6TetbGmHRfajnyrh6Ksq8EI9xK8gkMvMXqTIAM&s=10",
          variants: [
            { name: "Half", price: 900 },
            { name: "Full", price: 1800 }
          ]
        },
        {
          id: "mfc-ch-3",
          name: "Chicken Black Pepper with Egg Fried Rice",
          price: 740,
          desc: "Black pepper chicken served with egg fried rice",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBKqyya4QpffRKBaNRepwZLijMKVpgXYLGLzloonxf0w&s=10",
          variants: [
            { name: "Half", price: 740 },
            { name: "Full", price: 1400 }
          ]
        },
        {
          id: "mfc-ch-4",
          name: "Egg Fried Manchurian with Rice",
          price: 650,
          desc: "Manchurian served with egg fried rice",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ0vdsGiT71xEOxEAucOVwY6e5dCZ9umDz7nt6hkF34WeLcWnH-VUo6gM&s=10",
          variants: [
            { name: "Half", price: 650 },
            { name: "Full", price: 1300 }
          ]
        },
     
      ]
    },
        {
      name: "Drinks & Beverages",
      items: [
        {
          id: "dr-1",
          name: "Soft Drink 345ml",
          price: 100,
          discountPrice: 150,
          desc: "Chilled soft drink, 345ml",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3srEYmAd48bCUjjnNHPvz5iHdIlpqILtLDtfZ9wOGa8kGH9MaAAnrNowp&s=10",
          variants: [
            { name: "Pepsi", price: 100, discountPrice: 100 },
            { name: "7Up", price: 100, discountPrice: 100 },
            { name: "Mountain Dew", price: 100, discountPrice: 100 },
            { name: "Coke", price: 100, discountPrice: 100 }
          ]
        },
        {
          id: "dr-1b",
          name: "Soft Drink 1.5 Ltr",
          price: 280, // TODO: 1.5L prices not confirmed — please provide actual values
          discountPrice: 280,
          desc: "Chilled soft drink, 1.5 litre",
          image: "https://static.tossdown.com/images/9cf67798-83cc-47e9-8b68-018a5b051325.webp",
          variants: [
            { name: "Pepsi", price: 280, discountPrice: 280 },
            { name: "7Up", price: 280, discountPrice: 280 },
            { name: "Mountain Dew", price: 280, discountPrice: 280 }
          ]
        },
        { id: "dr-4", name: "Mineral Water (Large)", price: 100, discountPrice: 100, desc: "Pure mountain water", image: "https://static.tossdown.com/images/e747f555-54b7-4e81-b017-306abce84ba2.jpg", variants: [] },
        { id: "dr-5", name: "Sting Energy", price: 200, discountPrice: 200, desc: "Boost your energy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbiZo_-FAlUMhL1lwWz7jwzSn6o82u-_I6TMf12A9byjJfHV1-pXpty65-&s=10", variants: [] }
      ]
    }
  ]
};