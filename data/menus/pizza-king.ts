export const menu = {
  shopId: "pizza-king",
  name: "Pizza King Skardu",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa8xtMwcGub4wGh9HgvVns3fAAIMH8V7a5rR3IzlQMijEyMbt9XXL4Rhrv&s=10",
  categories: [
    // ---------- FAMILY DEALS ----------
    {
      name: "Family Deals",
      items: [
        { id: "pk-dl-1", name: "Deal 01", price: 4950, desc: "2 Large Pizza, 2 Burgers, 1 Drink (1.5 Ltr)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784923090/ChatGPT_Image_Jul_25_2026_12_57_27_AM_hmztmy.jpg", variants: [] },
        { id: "pk-dl-2", name: "Deal 02", price: 3490, desc: "1 Large Pizza, 1 Regular Pizza, 1 Small Pizza, 1 Drink (1.5 Ltr)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784923385/ChatGPT_Image_Jul_25_2026_01_00_26_AM_myxapa.jpg", variants: [] },
        { id: "pk-dl-3", name: "Deal 03", price: 1990, desc: "2 Small Pizza, 2 Burgers, 1 Drink (1 Ltr)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784923518/ChatGPT_Image_Jul_25_2026_01_04_48_AM_o1ttoh.jpg", variants: [] },
        { id: "pk-dl-4", name: "Deal 04", price: 1990, desc: "1 Regular Pizza, 2 Burgers, 1 Drink (1 Ltr)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784923660/ChatGPT_Image_Jul_25_2026_01_07_17_AM_pb5rpz.jpg", variants: [] },
        { id: "pk-dl-5", name: "Deal 05", price: 1890, desc: "3 Burgers, 1 Fries, 1 Drink (1 Ltr)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784923775/ChatGPT_Image_Jul_25_2026_01_09_13_AM_jd8iax.jpg", variants: [] },
        { id: "pk-dl-6", name: "Deal 06", price: 1090, desc: "1 Small Pizza, 1 Burger, 1 Drink (500ml)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784923934/ChatGPT_Image_Jul_25_2026_01_11_50_AM_k5ln7e.jpg", variants: [] },
        { id: "pk-dl-7", name: "Deal 07", price: 2490, desc: "5 Burgers, 1 Drink (1.5 Ltr)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784924101/ChatGPT_Image_Jul_25_2026_01_14_14_AM_krs9qw.jpg", variants: [] },
        { id: "pk-dl-8", name: "Birthday Special Deal", price: 8550, desc: "3 Large Pizza, 5 Burgers, 4 Fries, 2 Drink (1.5 Ltr)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784924225/ChatGPT_Image_Jul_25_2026_01_16_43_AM_a1okqz.jpg", variants: [] }
      ]
    },

    // ---------- MIDNIGHT DEALS ----------
    {
      name: "Midnight Deals",
      items: [
        { id: "pk-md-1", name: "Midnight Deal 01", price: 2190, desc: "1 Large Pizza, 1 Burger, 1 Drink (1 Ltr)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784924342/ChatGPT_Image_Jul_25_2026_01_18_33_AM_cwldze.jpg", variants: [] },
        { id: "pk-md-2", name: "Midnight Deal 02", price: 1390, desc: "1 Regular Pizza, 1 Drum Stick, 1 Drink (500ml)", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784924431/ChatGPT_Image_Jul_25_2026_01_20_08_AM_h02sd0.jpg", variants: [] },
        { id: "pk-md-3", name: "Midnight Deal 03", price: 890, desc: "1 Zinger Burger, 1 Drum Stick, 1 Can", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784924631/ChatGPT_Image_Jul_25_2026_01_23_30_AM_iq0z2l.jpg", variants: [] },
        { id: "pk-md-4", name: "Midnight Deal 04", price: 590, desc: "1 Zinger Burger, 1 Can", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784924828/ChatGPT_Image_Jul_25_2026_01_26_21_AM_es18vm.jpg", variants: [] }
      ]
    },

    // ---------- PIZZA: PK SPECIALITY (no discount — explicitly excluded) ----------
    {
      name: "PK Speciality",
      items: [
        {
          id: "pk-spc-1",
          name: "King Beef (Yak Beef)",
          desc: "Yak Beef, Pizza Sauce, Onion, Capsicum, Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Jm3dr498cmdGXVpSj9Y7SL2PN_hoVweRixTS6KqX3w&s=10",
          variants: [
            { name: "16\" Extra Large", price: 2590 },
            { name: "12\" Large", price: 1990 },
            { name: "9\" Regular", price: 1190 },
            { name: "6\" Small", price: 750 }
          ]
        },
        {
          id: "pk-spc-2",
          name: "Crown Crust",
          desc: "Creamy Sauce, Onion, Capsicum, Chicken Fajita, Sausages, Mushroom, Olives & Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkjzbMBL2tvggG3ub0AA3wErAmEuhWB3l-UOC9SnfpkQ&s=10",
          variants: [
            { name: "16\" Extra Large", price: 2590 },
            { name: "12\" Large", price: 1990 },
            { name: "9\" Regular", price: 1190 },
            { name: "6\" Small", price: 750 }
          ]
        },
        {
          id: "pk-spc-3",
          name: "Stuff Crust",
          desc: "Any flavour from menu with Kabab or Cheese stuffed crust. Not included in deals & discount card.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZMXwKijonJjInAp29NBEcSMgdqVzIJpVm4zSnS3lKNQ&s=10",
          variants: [
            { name: "16\" Extra Large", price: 2590 },
            { name: "12\" Large", price: 1990 },
            { name: "9\" Regular", price: 1190 },
            { name: "6\" Small", price: 750 }
          ]
        }
      ]
    },

    // ---------- PIZZA: PAKISTANI FLAVOUR (30% off) ----------
    {
      name: "Pakistani Flavour",
      items: [
        {
          id: "pk-pf-1",
          name: "King Kababish",
          desc: "Pizza Sauce, Onion, Seekh Kabab, Capsicum, Black Olives, Mozzarella Cheese, Tomatoes",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsWsmGtOrlkdmwXXLtaTN9J2ltGVq24FDj1Do8ukEmNNDW60B_wLK1JPU&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-pf-2",
          name: "Shahi Malai Boti",
          desc: "Juicy Malai Boti, Fresh Green Chillies, Onions, Pizza Sauce & Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDBChvOq4FYScYWDukZLLeD1cFMErSQO7gL2IAX-WaXA&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-pf-3",
          name: "King Chicken Tikka",
          desc: "Traditional Chicken Tikka, Onions, Pizza Sauce & Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWW_mUNV4D9XQGvTFPWDEVN2_ErAhl23KwKs43ZyB1JFPlQgKHDFasZoFE&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-pf-4",
          name: "Creamy Tikka",
          desc: "Creamy Sauce, Onion, Black Olives, Chicken Tikka, Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVv3neZUHx15wNIlwx9VsP0hqbWnVbEKfMQHjgDMeXFQ&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-pf-5",
          name: "Chicken Tandoori",
          desc: "Creamy Sauce, Onion, Black Olives, Chicken Tikka, Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShEHvkrF9BhspeF7jFeH_M5nXdsgROYtIjkJhDMapsXw&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        }
      ]
    },

    // ---------- PIZZA: ARABIC FLAVOUR (20% off) ----------
    {
      name: "Arabic Flavour",
      items: [
        {
          id: "pk-af-1",
          name: "Arabian",
          desc: "Beef Pepperoni, Pizza Sauce & Mozzarella Cheese",
          image: "https://tastesbetterfromscratch.com/wp-content/uploads/2023/06/Pepperoni-Pizza-1.jpg",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-af-2",
          name: "Mild Tikka",
          desc: "Mild Tikka Chicken, Onion & Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT03KZoPVpGPd3g0XBvEWClSEA5TI3JDW427EoExRShww&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        }

      ]
    },

    // ---------- PIZZA: WESTERN FLAVOUR (20% off) ----------
    {
      name: "Western Flavour",
      items: [
        {
          id: "pk-wf-1",
          name: "Mexican Ole",
          desc: "Marinated Chicken, Jalapeno, Capsicum, Black Olives, Mushrooms, Tomatoes, Pizza Sauce & Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQADcOKvYHR2bmZOhuWilXut-GLfXTf9lRKMPeeCfpIvQ&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-wf-2",
          name: "Euro King",
          desc: "Chicken Topping, Mushroom, Capsicum, Onions, Tomatoes, Pizza Sauce & Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbb_oT53I8xUgcR8Nl8cWn380PHroXGpTFxLvv4a06wPcX5lMCE1T8_Hs&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-wf-3",
          name: "Fajita Sicilian",
          desc: "Fajita Chicken, Fresh Green Chillies, Capsicum, Onions, Pizza Sauce & Mozzarella Cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1QDxntBAy0AjYShJnbR3Ey-7MelJudA5n1-6V0O-u0w&s=10",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        }
      ]
    },

    // ---------- PIZZA: ROYALTY FLAVOUR (20% off) ----------
    {
      name: "Royalty Flavour",
      items: [
        {
          id: "pk-rf-1",
          name: "Royal Chicken Supremo",
          desc: "Chicken Pepperoni, Fajita Chicken, Chicken Tikka, Mushrooms, Black Olives, Onion, Capsicum, Pizza Sauce & Mozzarella Cheese",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784914603/ChatGPT_Image_Jul_24_2026_10_36_09_PM_ynhk6c.jpg",
          variants: [
            { name: "16\" Extra Large", price: 3890, discountPrice: 3112 },
            { name: "12\" Large", price: 2990, discountPrice: 2392 },
            { name: "9\" Regular", price: 1590, discountPrice: 1272 },
            { name: "6\" Small", price: 1050, discountPrice: 840 }
          ]
        },
        {
          id: "pk-rf-2",
          name: "Creamy King Supremo",
          desc: "Fajita Chicken, Creamy Sauce, Onion, Capsicum, Mushroom, Chicken Sausages, Jalapeno Pepper, Black Olive & Mozzarella Cheese",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784914737/ChatGPT_Image_Jul_24_2026_10_38_37_PM_jlyuui.jpg",
          variants: [
            { name: "16\" Extra Large", price: 3890, discountPrice: 3112 },
            { name: "12\" Large", price: 2990, discountPrice: 2392 },
            { name: "9\" Regular", price: 1590, discountPrice: 1272 },
            { name: "6\" Small", price: 1050, discountPrice: 840 }
          ]
        },
        {
          id: "pk-rf-3",
          name: "King Special",
          desc: "Fajita Chicken, Mushrooms, Sweet Corn, Jalapeno, Peppers, Onion, Capsicum, Pizza Sauce, Creamy Sauce & Mozzarella Cheese",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784914856/ChatGPT_Image_Jul_24_2026_10_40_34_PM_ixhumf.jpg",
          variants: [
            { name: "16\" Extra Large", price: 3890, discountPrice: 3112 },
            { name: "12\" Large", price: 2990, discountPrice: 2392 },
            { name: "9\" Regular", price: 1590, discountPrice: 1272 },
            { name: "6\" Small", price: 1050, discountPrice: 840 }
          ]
        }
      ]
    },

    // ---------- PIZZA: VEGGIE & CHEESE (20% off) ----------
    {
      name: "Veggie & Cheese",
      items: [
        {
          id: "pk-vc-1",
          name: "Vegetarian",
          desc: "Pizza Sauce, Mushrooms, Olives, Onions, Capsicum, Jalapeno, Tomatoes & Mozzarella Cheese",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784915020/ChatGPT_Image_Jul_24_2026_10_43_18_PM_uylvs2.jpg",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-vc-2",
          name: "Margherita",
          desc: "Pizza Sauce, Herbs & Lots of Mozzarella Cheese",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784921387/ChatGPT_Image_Jul_25_2026_12_29_07_AM_itbqn9.jpg",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        },
        {
          id: "pk-vc-3",
          name: "King Mushroom",
          desc: "Pizza Sauce, Mushrooms, Herbs & Mozzarella Cheese",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784922204/ChatGPT_Image_Jul_25_2026_12_42_10_AM_ycpikj.jpg",
          variants: [
            { name: "16\" Extra Large", price: 3790, discountPrice: 3032 },
            { name: "12\" Large", price: 2890, discountPrice: 2312 },
            { name: "9\" Regular", price: 1550, discountPrice: 1240 },
            { name: "6\" Small", price: 990, discountPrice: 792 }
          ]
        }
      ]
    },

    // ---------- EXTRA TOPPING (no discount — it's a modifier, not a pizza flavour) ----------
    {
      name: "Extra Topping",
      items: [
        {
          id: "pk-top-1",
          name: "Extra Topping",
          desc: "Add extra topping to any pizza",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1784922568/ChatGPT_Image_Jul_25_2026_12_48_23_AM_lgv6rj.jpg",
          variants: [
            { name: "16\" Extra Large", price: 290 },
            { name: "12\" Large", price: 190 },
            { name: "9\" Regular", price: 90 },
            { name: "6\" Small", price: 60 }
          ]
        }
      ]
    },

    // ---------- STARTERS (no discount) ----------
    // {
    //   name: "Starters",
    //   items: [
    //     { id: "pk-st-1", name: "Pizza Fries", price: 750, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB_-5qcQ_-MLE2yg2vcrQoUIBkukiIfHlXWjQksXkw2A&s=10", variants: [] },
    //     { id: "pk-st-2", name: "Chicken Wings Oven Baked (6pcs)", price: 750, desc: "", image: "", variants: [] },
    //     { id: "pk-st-3", name: "Hot Wings (8pcs)", price: 690, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbbj9E6WOO0lO_GzC2WFFUU-MtDE4Hm-4QDj2r7nO1SA&s=10", variants: [] },
    //     { id: "pk-st-4", name: "Chicken Nuggets (12pcs)", price: 790, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHJoLtYhSTCh43Ja6eF0chR_MS8bRwGdTh8pG0mwx2Mw&s=10", variants: [] },
    //     { id: "pk-st-5", name: "Chicken Nuggets (6pcs)", price: 390, desc: "", image: "", variants: [] },
    //     { id: "pk-st-6", name: "Drum Stick (2pcs)", price: 690, desc: "", image: "", variants: [] },
    //     { id: "pk-st-7", name: "Fries", price: 350, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcGYsgmcgQcCNfO9OugSgXImRphPcOPBriS02zRsxuIQ&s=10", variants: [] }
    //   ]
    // },

    // ---------- BURGERS (no discount) ----------
    {
      name: "Burgers",
      items: [
        { id: "pk-bg-1", name: "Zinger Burger", price: 550, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGgACT-osZtnChf_spU1uoBPuE898ERHlt95k8DFx7k6whzygw9FUC8RQ&s=10", variants: [] },
        { id: "pk-bg-2", name: "Zinger Burger with Cheese", price: 590, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReTzPVGIT4rtfj6rkB-fAOk_Z4uo6H9uwZcutxv96tVoTYtbz1gCMUNgoB&s=10", variants: [] },
        // { id: "pk-bg-3", name: "King Burger", price: 350, desc: "", image: "", variants: [] },
        // { id: "pk-bg-4", name: "King Burger with Cheese", price: 390, desc: "", image: "", variants: [] },
        // { id: "pk-bg-5", name: "Extra Cheese Slice", price: 50, desc: "", image: "", variants: [] }
      ]
    },

    // ---------- SOUPS (no discount) ----------
    // {
    //   name: "Soups",
    //   items: [
    //     { id: "pk-sp-1", name: "King Special Soup", price: 290, desc: "", image: "", variants: [] },
    //     { id: "pk-sp-2", name: "Hot n Sour Soup", price: 250, desc: "", image: "", variants: [] },
    //     { id: "pk-sp-3", name: "Chicken Corn Soup", price: 250, desc: "", image: "", variants: [] },
    //     { id: "pk-sp-4", name: "Chicken Vegetable Soup", price: 250, desc: "", image: "", variants: [] }
    //   ]
    // },

    // ---------- HOT DRINK & BEVERAGES (no discount) ----------
   {
      name: "Drinks & Beverages",
      items: [
        {
          id: "dr-1",
          name: "Soft Drink 345ml",
          price: 150,
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

    // ---------- BROAST & ROLLS (no discount) ----------
    // {
    //   name: "Broast & Rolls",
    //   items: [
    //     { id: "pk-br-1", name: "Broast Full (8 pcs)", price: 2490, desc: "", image: "", variants: [] },
    //     { id: "pk-br-2", name: "Broast Half (4 pcs)", price: 1290, desc: "", image: "", variants: [] },
    //     { id: "pk-br-3", name: "Broast Quarter (2 pcs)", price: 790, desc: "Served with Fries & Bun", image: "", variants: [] },
    //     { id: "pk-br-4", name: "Pratha Roll", price: 290, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Y4E_N6rLMdddEppI_3vasLCDY_RAVa4NFEAyDNjm7w&s=10", variants: [] },
    //     { id: "pk-br-5", name: "Pratha Roll with Cheese", price: 350, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROKloEDsqAcNuBdm6ISKwVyxkFA8cwJwGWp8qdoym37Q&s", variants: [] },
    //     { id: "pk-br-6", name: "Drum Sticks (2pcs)", price: 750, desc: "Served with Fries", image: "", variants: [] },
    //     { id: "pk-br-7", name: "Drum Stick (1 pc)", price: 350, desc: "Served with Fries", image: "", variants: [] }
    //   ]
    // }
  ]
};