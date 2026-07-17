export const menu = {
  shopId: "sungum-hotel-restaurant",
  name: "Sungum Hotel & Restaurant",
  logo: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784291847/ChatGPT_Image_Jul_17_2026_05_37_05_PM_t6yq3u.jpg", // TODO: add real Sungum Hotel & Restaurant logo URL
  tagline: "Experience the Flavors of Northern Pakistan",
  address: "Ali Abad, Ali Chowk Skardu",
  contact: {
    phone: "0316-7018580",
    whatsapp: "0317-9174361",
    instagram: "@sungumhotelandrestaurant"
  },
  categories: [
    {
      name: "Starters On The Go",
      items: [
        {
          id: "sg-st-1",
          name: "Chicken Corn Soup",
          price: 850,
          discountPrice: 850,
          desc: "Classic chicken corn soup",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9-hv1EfzBlumNqm0DMhTzOzfJqO7jVn93lw6pT7uBw&s=10",
          variants: [
            { name: "Half", price: 850, discountPrice: 850 },
            { name: "Full", price: 1400, discountPrice: 1400 }
          ]
        },
        {
          id: "sg-st-2",
          name: "Hot n Sour Soup",
          price: 850,
          discountPrice: 850,
          desc: "Spicy and tangy soup",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbtN_AODXowdP-TPSZ1eEGq__pd5Yx2IUky-oF1o8JEw&s=10",
          variants: [
            { name: "Half", price: 850, discountPrice: 850 },
            { name: "Full", price: 1500, discountPrice: 1500 }
          ]
        },
        {
          id: "sg-st-3",
          name: "Sungum Special Soup",
          price: 850,
          discountPrice: 850,
          desc: "House special soup",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH4adKkGBpshZRE2x7Fgp8d4hqEqywW5tT0H_1JyJZhw&s=10",
          variants: [
            { name: "Half", price: 850, discountPrice: 850 },
            { name: "Full", price: 1450, discountPrice: 1450 }
          ]
        },
        {
          id: "sg-st-4",
          name: "French Fries",
          price: 400,
          discountPrice: 400,
          desc: "Crispy golden fries",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRWEO6wEtIhzqcc3OBSGJEz2Q1neFSVA6qCGnVwZ0TtGYYuvfgb9lGRdg&s=10",
          variants: []
        },
        // {
        //   id: "sg-st-5",
        //   name: "Fish Cracker",
        //   price: 400,
        //   discountPrice: 400,
        //   desc: "Crunchy fish crackers",
        //   image: "",
        //   variants: []
        // }
      ]
    },
    {
      name: "Our Beloved Rice (Sungum Special's)",
      items: [
        {
          id: "sg-rc-1",
          name: "Chicken Biryani",
          price: 400,
          discountPrice: 400,
          desc: "Aromatic spiced chicken biryani",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk4MLFi0pdc-9ITH9e9Y_Q_u3C9neeL2MR4gOaEAkN1zx1hVb5SSbVHX0&s=10",
          variants: []
        },
        {
          id: "sg-rc-2",
          name: "Beef Pulao",
          price: 400,
          discountPrice: 400,
          desc: "Fragrant beef pulao",
          image: "https://www.shutterstock.com/image-photo/delicious-spicy-beef-biryani-kabab-260nw-651679711.jpg",
          variants: []
        }
      ]
    },
    {
      name: "Trout Fish",
      items: [
        {
          id: "sg-tr-1",
          name: "Trout Fish",
          price: 2100,
          discountPrice: 2100,
          desc: "Only at Sungum — fresh trout, pure taste",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbQ58OjBP3mPo52BritmASE3uPBX-L9NKJPKKRWQ6HVA&s=10",
          variants: [
            { name: "Half", price: 2100, discountPrice: 2100 },
            { name: "Full", price: 4000, discountPrice: 4000 }
          ]
        }
      ]
    },
    {
      name: "Made With Chicken",
      items: [
        {
          id: "sg-ch-1",
          name: "Chicken Karahi",
          price: 1450,
          discountPrice: 1450,
          desc: "Classic chicken karahi",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQZJY7_wWH8mLPvudzJs4IS9bsgMVbGYkgUrRWvFd_8w&s=10",
          variants: [
            { name: "Half", price: 1450, discountPrice: 1450 },
            { name: "Full", price: 2600, discountPrice: 2600 }
          ]
        },
        {
          id: "sg-ch-2",
          name: "Chicken White Karahi",
          price: 1450,
          discountPrice: 1450,
          desc: "Creamy white karahi",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmQTPsFEV2GXhQcz4hnbok8U-m5uemI-4D5NB-DvAifzCmUKjpBOo_Qug&s=10",
          variants: [
            { name: "Half", price: 1450, discountPrice: 1450 },
            { name: "Full", price: 2700, discountPrice: 2700 }
          ]
        },
        // {
        //   id: "sg-ch-3",
        //   name: "Chicken Namkeen Peshawari",
        //   price: 1500,
        //   discountPrice: 1500,
        //   desc: "Peshawari-style savory chicken",
        //   image: "",
        //   variants: [
        //     { name: "Half", price: 1500, discountPrice: 1500 },
        //     { name: "Full", price: 2700, discountPrice: 2700 }
        //   ]
        // },
        {
          id: "sg-ch-4",
          name: "Chicken Hara Masala",
          price: 1450,
          discountPrice: 1450,
          desc: "Chicken cooked in green masala",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyzS6M-MUPuxmJddLCVtcP9l33_xM6QUpd3aX2MOzApg&s=10",
          variants: [
            { name: "Half", price: 1450, discountPrice: 1450 },
            { name: "Full", price: 2700, discountPrice: 2700 }
          ]
        },
        {
          id: "sg-ch-5",
          name: "Chicken Handi",
          price: 1550,
          discountPrice: 1550,
          desc: "Slow-cooked chicken handi",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU-MIYv6jKB80Wdsz1PTa8Mq38bxLm1SXQNG-aBUokyQ&s=10",
          variants: [
            { name: "Half", price: 1550, discountPrice: 1550 },
            { name: "Full", price: 2800, discountPrice: 2800 }
          ]
        },
        {
          id: "sg-ch-6",
          name: "Chicken Achari Handi",
          price: 1600,
          discountPrice: 1600,
          desc: "Tangy pickle-spiced handi",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDos9KxqZq1t4pjP9moCNn2P613RIZX3IQZWUdLvx3XA&s=10",
          variants: [
            { name: "Half", price: 1600, discountPrice: 1600 },
            { name: "Full", price: 3000, discountPrice: 3000 }
          ]
        },
        {
          id: "sg-ch-7",
          name: "Chicken Green Handi",
          price: 1600,
          discountPrice: 1600,
          desc: "Herb and green chili handi",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCi_-xtHfERTFzcwunjtxEvt233-tOcco-rLEOrKjrAg&s=10",
          variants: [
            { name: "Half", price: 1600, discountPrice: 1600 },
            { name: "Full", price: 3000, discountPrice: 3000 }
          ]
        },
        {
          id: "sg-ch-8",
          name: "Chicken Muglai Handi",
          price: 1550,
          discountPrice: 1550,
          desc: "Rich Mughlai-style handi",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCtm1oyexVihvlrNSZXchRSYNhGmP9X9gontkhRsICBw&s=10",
          variants: [
            { name: "Half", price: 1550, discountPrice: 1550 },
            { name: "Full", price: 2800, discountPrice: 2800 }
          ]
        },
        {
          id: "sg-ch-9",
          name: "Chicken Nawabi",
          price: 1550,
          discountPrice: 1550,
          desc: "Royal nawabi-style chicken",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9HGzbSchCQwlaf3vWvS06A5BRi0cmD7iscQWJSKJ21w&s=10",
          variants: [
            { name: "Half", price: 1550, discountPrice: 1550 },
            { name: "Full", price: 2800, discountPrice: 2800 }
          ]
        }
      ]
    },
    {
      name: "Made With Mutton",
      items: [
        {
          id: "sg-mt-1",
          name: "Mutton Karahi",
          price: 2150,
          discountPrice: 2150,
          desc: "Classic mutton karahi",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbcNDFPhHcrF7pFSGN8QhKd-jscNEkf23wZL5huclsHMY8nzu_wtV97no&s=10",
          variants: [
            { name: "Half", price: 2150, discountPrice: 2150 },
            { name: "Full", price: 4100, discountPrice: 4100 }
          ]
        },
        // {
        //   id: "sg-mt-2",
        //   name: "Mutton Krombo",
        //   price: 2350,
        //   discountPrice: 2350,
        //   desc: "Signature mutton krombo",
        //   image: "",
        //   variants: [
        //     { name: "Half", price: 2350, discountPrice: 2350 },
        //     { name: "Full", price: 4300, discountPrice: 4300 }
        //   ]
        // },
        {
          id: "sg-mt-3",
          name: "Mutton White Karahi",
          price: 2150,
          discountPrice: 2150,
          desc: "Creamy white mutton karahi",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF_xTdqipxkLVhSyFkYSE7jFKYsa8dj56nQhH2AHsBLQ&s=10",
          variants: [
            { name: "Half", price: 2150, discountPrice: 2150 },
            { name: "Full", price: 4100, discountPrice: 4100 }
          ]
        },
        // {
        //   id: "sg-mt-4",
        //   name: "Mutton Namkeen Shinwari Karahi",
        //   price: 2050,
        //   discountPrice: 2050,
        //   desc: "Shinwari-style savory mutton karahi",
        //   image: "",
        //   variants: [
        //     { name: "Half", price: 2050, discountPrice: 2050 },
        //     { name: "Full", price: 4000, discountPrice: 4000 }
        //   ]
        // },
        // {
        //   id: "sg-mt-5",
        //   name: "Mutton Afsha 600 Grams (Sungum Special)",
        //   price: 2300,
        //   discountPrice: 2300,
        //   desc: "House special mutton afsha, 600 grams",
        //   image: "",
        //   variants: []
        // }
      ]
    },
    {
      name: "Sungum Specials",
      items: [
        // {
        //   id: "sg-sp-1",
        //   name: "Chicken Ginger 600 Grams",
        //   price: 1700,
        //   discountPrice: 1700,
        //   desc: "Chicken cooked with fresh ginger",
        //   image: "",
        //   variants: []
        // },
        {
          id: "sg-sp-2",
          name: "Chicken Jalfarezi 600 Grams",
          price: 1900,
          discountPrice: 1900,
          desc: "Spicy jalfarezi-style chicken",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbGJsjL0yWhMU_VlOobWwhlEZM-nvxxIP-Sivowsq5Dw&s=10",
          variants: []
        },
        {
          id: "sg-sp-3",
          name: "Bartha Chicken 600 Grams",
          price: 2000,
          discountPrice: 2000,
          desc: "Smoky mashed-style chicken bartha",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuW-9CSKFNMKF4AZqKJ1k_EzyVTRlgniQsJ28V9H-DJg&s=10",
          variants: []
        },
        // {
        //   id: "sg-sp-4",
        //   name: "Special Murgh Makhni 600 Grams",
        //   price: 2200,
        //   discountPrice: 2200,
        //   desc: "Buttery, rich murgh makhni",
        //   image: "",
        //   variants: []
        // }
      ]
    },
    {
      name: "Add On's",
      items: [
        {
          id: "sg-ad-1",
          name: "Daal Mash",
          price: 599,
          discountPrice: 599,
          desc: "Creamy split lentil daal",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz9BBPCzfhnDKJ8FbUprUMkYQKH6XVPF-zjPTq-W7n8o8-k-BujvpDHSg&s=10",
          variants: []
        },
        {
          id: "sg-ad-2",
          name: "Mix Sabzi",
          price: 599,
          discountPrice: 599,
          desc: "Seasonal mixed vegetables",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg3o_M8uuuX1B3Pyp1MsfxyeLoxIvFZSupDz5VzYcWm1ZA-LyEINc7vh0&s=10",
          variants: []
        }
      ]
    },
    {
      name: "B.B.Q On Fire",
      items: [
        {
          id: "sg-bbq-1",
          name: "Chicken Kabab (4 pcs)",
          price: 1800,
          discountPrice: 1800,
          desc: "Char-grilled chicken kabab, 4 pieces",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK2H_5NSJlq32pXNGaGy8PS-tzXa0Uj22ntYDRBPxGlA&s=10",
          variants: []
        },
        {
          id: "sg-bbq-2",
          name: "Beef Seekh Kabab (4 pcs)",
          price: 1800,
          discountPrice: 1800,
          desc: "Char-grilled beef seekh kabab, 4 pieces",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOIIAaKqa2IwblQm2pfrW3LJdETK7hc_ZhFGPearCFTjv5_PO_cWnZdNnl&s=10",
          variants: []
        },
        {
          id: "sg-bbq-3",
          name: "Malai Boti (12 pcs)",
          price: 1700,
          discountPrice: 1700,
          desc: "Creamy malai boti, 12 pieces",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqOs827t4rH2gKeECVfUR80Mii2ZFekioPeEillUkPW0eMXjDmWHC6DOk&s=10",
          variants: []
        },
        {
          id: "sg-bbq-4",
          name: "Reshmi Kabab (4 pcs)",
          price: 1800,
          discountPrice: 1800,
          desc: "Silky reshmi kabab, 4 pieces",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ-H8mEIDKFoMjqP8G9-x_oKb5_Y5iNMcCGkG-K6fyWw&s=10",
          variants: []
        },
        {
          id: "sg-bbq-5",
          name: "Chicken Tikka Leg Piece",
          price: 520,
          discountPrice: 520,
          desc: "Grilled chicken tikka leg piece",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSrVh2fYDBhOAqzv6Prpaq0PlA02U1c54Lfvtwu7tpsw&s=10",
          variants: []
        },
        {
          id: "sg-bbq-6",
          name: "Chicken Tikka Chest",
          price: 580,
          discountPrice: 580,
          desc: "Grilled chicken tikka chest piece",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSajzhe2VhGr2Vp_9wjwHJoDi1uQrB9OV54Ck8F5dpFZhBDi_rO6pQ29D8&s=10",
          variants: []
        },
        {
          id: "sg-bbq-7",
          name: "Chicken Tikka Boti (12 pcs)",
          price: 1600,
          discountPrice: 1600,
          desc: "Grilled chicken tikka boti, 12 pieces",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEHFu1PjUou5B1UjjDsuQb3BpzChbUAG-X7BSCso7p-w&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Sungum Tandoor",
      items: [
        {
          id: "sg-td-1",
          name: "Tandoori Naan",
          price: 30,
          discountPrice: 30,
          desc: "Classic tandoori naan",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMFSCHnRnwFdF7aXVe1dlU7TRRHl5qNLFma_A8iagqSA&s=10",
          variants: []
        },
        {
          id: "sg-td-2",
          name: "Naan",
          price: 60,
          discountPrice: 60,
          desc: "Soft leavened bread",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiI8pd44iMvbP0B6ut3FgzGhtmOF4WtKUccXDSpqp_tMT9xwiNDK7pDGPx&s=10",
          variants: []
        },
        {
          id: "sg-td-3",
          name: "Roghni Naan",
          price: 150,
          discountPrice: 150,
          desc: "Rich roghni naan",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnL_0Qxy3nV4B7vwUsdWnCHhUToBHmwcVjWxemmfSs6mYXb_dULFjeYf-z&s=10",
          variants: []
        },
        // {
        //   id: "sg-td-4",
        //   name: "Kalonji Naan",
        //   price: 150,
        //   discountPrice: 150,
        //   desc: "Naan topped with kalonji seeds",
        //   image: "",
        //   variants: []
        // },
        {
          id: "sg-td-5",
          name: "Garlic Naan",
          price: 150,
          discountPrice: 150,
          desc: "Naan topped with fresh garlic",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREp7rYW6uPiQ7ye8uN85j6g4OVZbtAMvK4dCA37ug_Dg&s=10",
          variants: []
        },
        {
          id: "sg-td-6",
          name: "Chapati",
          price: 40,
          discountPrice: 40,
          desc: "Homemade chapati",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8R1Y_TVt4jGk3XpLfuq_dwHl1G493ztMIfKoq9UBZZe8pImry2mMsE7Cj&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Hot & Cold Beverages",
      items: [
        {
          id: "sg-bv-1",
          name: "Chai",
          price: 150,
          discountPrice: 150,
          desc: "Traditional milk tea",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxV10O9uSepQh8TW7dCMhRRdZmj4pssBFD7fCodvolmKh_yrpVagx8TJ8&s=10",
          variants: []
        },
        {
          id: "sg-bv-2",
          name: "Mountain Tea",
          price: 150,
          discountPrice: 150,
          desc: "Local mountain herb tea",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiWXHCahFLQ9CTDH1BybAGJW6mWuVRBjjFHzKeUIOQpA&s=10",
          variants: []
        },
        {
          id: "sg-bv-3",
          name: "Doodh Patti",
          price: 200,
          discountPrice: 200,
          desc: "Rich milk tea, brewed strong",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzTqsREjy78uGEamimS_9bZwoEwRxY0ISMxlmBTJNUPA&s=10",
          variants: []
        },
        {
          id: "sg-bv-4",
          name: "Soft Drink 1.5 Ltr",
          price: 250,
          discountPrice: 250,
          desc: "Assorted soft drink, 1.5 litre",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJrBRbuu2bic3fvuxWLvk-xfcPc4lYedLOn8w3E000FwGGDdx8D_6_2rLp&s=10",
          variants: []
        },
        {
          id: "sg-bv-5",
          name: "Soft Drink 1 Ltr",
          price: 200,
          discountPrice: 200,
          desc: "Assorted soft drink, 1 litre",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ95sjntx-Sm7fDlTcQghRlRabSE768JZEM77tnn1OFBtd01UCRGr_uHRg&s=10",
          variants: []
        },
        // {
        //   id: "sg-bv-6",
        //   name: "Soft Drink Can",
        //   price: 180,
        //   discountPrice: 180,
        //   desc: "Assorted soft drink can",
        //   image: "",
        //   variants: []
        // },
        {
          id: "sg-bv-7",
          name: "Mineral Water S",
          price: 80,
          discountPrice: 80,
          desc: "Small bottled mineral water",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Ue-3v81QFrNOyhU7PIvznUQbcggRAKHQGEozb3bh5g&s=10",
          variants: []
        },
        {
          id: "sg-bv-8",
          name: "Mineral Water L",
          price: 160,
          discountPrice: 160,
          desc: "Large bottled mineral water",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvt5V2B6b1t8Bid_LcCSdZKayr7-lcqPF6498jpAXP0Q&s=10",
          variants: []
        }
      ]
    },
    // {
    //   name: "Salads",
    //   items: [
    //     {
    //       id: "sg-sl-1",
    //       name: "Fresh Salad",
    //       price: 180,
    //       discountPrice: 180,
    //       desc: "Crisp fresh vegetable salad",
    //       image: "",
    //       variants: []
    //     },
    //     {
    //       id: "sg-sl-2",
    //       name: "Kachumar Salad (Sungum Special)",
    //       price: 250,
    //       discountPrice: 250,
    //       desc: "House special kachumar salad",
    //       image: "",
    //       variants: []
    //     },
    //     {
    //       id: "sg-sl-3",
    //       name: "Raita",
    //       price: 180,
    //       discountPrice: 180,
    //       desc: "Yogurt raita",
    //       image: "",
    //       variants: []
    //     },
    //     {
    //       id: "sg-sl-4",
    //       name: "Mint Raita",
    //       price: 160,
    //       discountPrice: 160,
    //       desc: "Yogurt raita with fresh mint",
    //       image: "",
    //       variants: []
    //     }
    //   ]
    // },
    // {
    //   name: "Sungum Platters",
    //   items: [
    //     {
    //       id: "sg-pl-1",
    //       name: "Sungum Platter 1",
    //       price: 2700,
    //       discountPrice: 2700,
    //       desc: "Serving for 3 persons: Malai Boti (1 seekh), Chicken Handi (quarter), Tandoori Naan (3 pcs), Fresh Salad, Tikka Boti (1 seekh), Beef Pulao (1 plate), Raita, 1 Ltr Drink",
    //       image: "",
    //       variants: []
    //     },
    //     {
    //       id: "sg-pl-2",
    //       name: "Sungum Platter 2",
    //       price: 4500,
    //       discountPrice: 4500,
    //       desc: "Serving for 5 persons: Reshmi Kabab (2 seekh), Chicken Hara Masala (half), Tandoori Naan (3 pcs), Fresh Salad, Chicken Kabab (2 seekh), Beef Pulao (2 plates), Raita, 1.5 Ltr Drink",
    //       image: "",
    //       variants: []
    //     },
    //     {
    //       id: "sg-pl-3",
    //       name: "Sungum Family Platter",
    //       price: 6500,
    //       discountPrice: 6500,
    //       desc: "Serving for 5 persons: Chicken Kabab (1 seekh), Reshmi Kabab (1 seekh), Malai Boti (1 seekh), Chicken Namkeen Peshawari Karahi (half kg), Beef Pulao (1 plate), Naan (3 pcs), Fresh Salad, Beef Kabab (1 seekh), Chicken Tikka Leg (1 seekh), Tikka Boti (1 seekh), Dry Fruits, Raita, 1.5 Ltr Drink",
    //       image: "",
    //       variants: []
    //     }
    //   ]
    // }
  ]
};