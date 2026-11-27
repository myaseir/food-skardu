export const menu = {
  shopId: "saspolo-fried-chicken",
  name: "Saspolo Fried Chicken",
  logo: "https://play-lh.googleusercontent.com/0WERsNXSo1GjCplYc6q7ZshijcEhiHmfenIhpLRz_U2YyopcW365KU6h0YV6Uh8wPSlunekqfqxZw5c1Z1zoVw", // TODO: add Saspolo logo URL
  categories: [
    {
      name: "Combos",
      items: [
        { id: "sp-cb-1", name: "Combo 1", price: 550, desc: "1 Shapatar Roll + 1 Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776139/Charred_Flatbread_Wrap_and_Iced_Cola_inl726.jpg", variants: [] },
        { id: "sp-cb-2", name: "Combo 2", price: 600, desc: "1 Zinger Burger + 2 Crispy Wings + 1 Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776139/Crispy_Chicken_Burger_Feast_dkqmau.jpg", variants: [] },
        { id: "sp-cb-3", name: "Combo 3", price: 650, desc: "1 Zinger Burger + 1 Chatni Roll + 1 Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776139/Crispy_Chicken_Burger_Wrap_and_Cola_zey7cv.jpg", variants: [] },
        { id: "sp-cb-4", name: "Combo 4", price: 950, desc: "2 Zinger Burgers + 2 Drinks", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776139/Crispy_Chicken_Burgers_with_Cola_rwfl9w.jpg", variants: [] }
        // TODO: Combo 5 (3 Zingeratha + 6 Pieces Nuggets + 1 Liter Drink) — price is not shown in the image
        // { id: "sp-cb-5", name: "Combo 5", price: 0, desc: "3 Zingeratha + 6 Pieces Nuggets + 1 Liter Drink", image: "", variants: [] }
      ]
    },
    {
      name: "Deals",
      items: [
        { id: "sp-dl-1", name: "Deal 01", price: 900, desc: "1 Zinger Burger + 1 Chicken Drumsticks + 1 Regular Fries + 1 Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776139/Crispy_Fried_Chicken_Feast_dmttxy.jpg", variants: [] },
        { id: "sp-dl-2", name: "Deal 02", price: 1250, desc: "3 Zinger Burgers + 1 Ltr Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776139/Crispy_Chicken_Burgers_and_Cola_hchjpo.jpg", variants: [] },
        { id: "sp-dl-3", name: "Deal 03", price: 1300, desc: "2 Zinger Burgers + 2 Chatni Rolls + 2 Regular Drinks", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776139/Crispy_Chicken_Feast_with_Iced_Cola_singmt.jpg", variants: [] },
        { id: "sp-dl-4", name: "Deal 04", price: 1300, desc: "1 Zinger Burger + 1 Crispy Broast + 1 Chicken Burger + 1 Liter Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Crispy_Chicken_Feast_with_Cola_g7ralj.jpg", variants: [] },
        { id: "sp-dl-5", name: "Deal 05", price: 1600, desc: "2 Zinger Burgers + 2 Chicken Drumsticks + 1 Large Fries + 2 Regular Drinks", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Golden_Fried_Chicken_Combo_Feast_admf7n.jpg", variants: [] },
        // { id: "sp-dl-6", name: "Deal 06", price: 1650, desc: "1 Beef Burger + 1 Chicken Burger + 2 Chatni Rolls + 2 Chicken Shawarma + 1 Liter Drink", image: "", variants: [] },
        { id: "sp-dl-7", name: "Deal 07", price: 1750, desc: "3 Zinger Burgers + 1 Chicken Shawarma + 1 Zinger Shawarma + 1 Kabab Shawarma + 1 Liter Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Crispy_Chicken_Feast_with_Cola_1_h36vww.jpg", variants: [] },
        { id: "sp-dl-8", name: "Deal 08", price: 2050, desc: "5 Zinger Burgers + 1.5 Liter Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Crispy_Chicken_Burger_Feast_1_wsbz4i.jpg", variants: [] }
      ]
    },
    {
      name: "Burgers",
      items: [
        { id: "sp-bg-1", name: "Saspolo Big Mac", price: 700, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Saspolo_Big_Mac_Burger_Advertisement_jz7l9c.jpg", variants: [] },
        { id: "sp-bg-2", name: "Zinger Tower", price: 700, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Saspolo_Zinger_Tower_Burger_Ad_aknvc7.jpg", variants: [] },
        { id: "sp-bg-3", name: "Zinger", price: 390, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Crispy_Golden_Chicken_Burger_qwaaxp.jpg", variants: [] },
        { id: "sp-bg-4", name: "Beef Smashed", price: 380, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Gourmet_Smashed_Cheeseburger_Close-Up_yyiaim.jpg", variants: [] },
        { id: "sp-bg-5", name: "Chicken Smashed", price: 360, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776137/Crispy_Golden_Chicken_Burger_1_qf9nzm.jpg", variants: [] },
        { id: "sp-bg-6", name: "Chicken Patty", price: 320, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Crispy_Chicken_Smashed_Burger_jd3pu2.jpg", variants: [] },
        // { id: "sp-bg-7", name: "BBQ", price: 350, desc: "", image: "", variants: [] },
        { id: "sp-bg-8", name: "Anda Shami", price: 200, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776137/Golden_Sesame_Egg_Burger_ag52zn.jpg", variants: [] },
        // { id: "sp-bg-9", name: "Cheese (Add to any Burger)", price: 80, desc: "Add-on, starting from Rs. 80", image: "", variants: [] }
      ]
    },
    {
      name: "Fried Chicken",
      items: [
        { id: "sp-fc-1", name: "Drum Stick", price: 250, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776137/Golden_Crunch_Fried_Chicken_yrqisx.jpg", variants: [] },
        { id: "sp-fc-2", name: "Crispy Broast", price: 550, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776136/Crispy_Fried_Chicken_with_Red_Dip_g1qpt2.jpg", variants: [] },
        { id: "sp-fc-3", name: "6 Pcs Crispy Wings", price: 500, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776136/Crispy_Chicken_Wings_with_Ketchup_c4kmdb.jpg", variants: [] },
        { id: "sp-fc-4", name: "6 Pcs Honey Wings", price: 700, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776136/Sticky_Honey_BBQ_Chicken_Wings_d7726z.jpg", variants: [] },
        // { id: "sp-fc-5", name: "Chicken Strips (4 Pcs)", price: 500, desc: "", image: "", variants: [] },
        { id: "sp-fc-6", name: "6 Pcs Nuggets", price: 500, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776138/Crispy_Chicken_Nuggets_with_Ketchup_tmhgkk.jpg", variants: [] }
      ]
    },
    {
      name: "Shawarma",
      items: [
        { id: "sp-sh-1", name: "Falafel Shawarma", price: 200, desc: "Shami kabab + veges + sauces", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776137/Falafel_Shawarma_Feast_qtqi7a.jpg", variants: [] },
        { id: "sp-sh-2", name: "Chicken Shawarma", price: 200, desc: "Spicy meat + veges + sauces", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776137/Loaded_Chicken_Shawarma_Wraps_h52v5k.jpg", variants: [] },
        { id: "sp-sh-3", name: "Zinger Shawarma", price: 220, desc: "Crispy chicken + onion + sauces", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776137/Golden_Crispy_Chicken_Shawarma_Wrap_fma5u7.jpg", variants: [] },
        // { id: "sp-sh-4", name: "Kabab Shawarma", price: 250, desc: "Fried kabab + veges + chatni", image: "", variants: [] },
        // { id: "sp-sh-5", name: "Labanese Shawarma", price: 250, desc: "Spicy meat + fries + veges + sauces", image: "", variants: [] },
        { id: "sp-sh-6", name: "Special Saspolo Shawarma", price: 300, desc: "Special crispy kabab + veges + sauces", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776136/Special_Shawarma_Feast_iztwvw.jpg", variants: [] }
      ]
    },
    {
      name: "Rolls",
      items: [
        { id: "sp-rl-1", name: "Shapater Roll", price: 500, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776136/Golden_Chicken_Wraps_with_Creamy_Dips_pcae6g.jpg", variants: [] },
        { id: "sp-rl-2", name: "Zingeratha Roll", price: 250, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776136/Special_Shawarma_Feast_iztwvw.jpg", variants: [] },
        // { id: "sp-rl-3", name: "Kabab Roll", price: 250, desc: "", image: "", variants: [] },
        { id: "sp-rl-4", name: "Mayo Roll", price: 250, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776136/Grilled_Chicken_Mayo_Wrap_Stack_p7bw9g.jpg", variants: [] },
        { id: "sp-rl-5", name: "Chicken Chatni Roll", price: 200, desc: "", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1795776136/Golden_Chicken_Chutney_Wraps_sbpqps.jpg", variants: [] }
      ]
    },
    // {
    //   name: "Sandwiches",
    //   items: [
    //     { id: "sp-sw-1", name: "Club Sandwich", price: 400, desc: "", image: "", variants: [] },
    //     { id: "sp-sw-2", name: "BBQ Sandwich", price: 400, desc: "", image: "", variants: [] },
    //     { id: "sp-sw-3", name: "Crispy Sandwich", price: 400, desc: "", image: "", variants: [] }
    //   ]
    // },
    // {
    //   name: "Traditional",
    //   items: [
    //     { id: "sp-tr-1", name: "Yak Burger", price: 800, desc: "", image: "", variants: [] },
    //     { id: "sp-tr-2", name: "Egg Paratha Roll", price: 400, desc: "", image: "", variants: [] },
    //     { id: "sp-tr-3", name: "Yak Roll", price: 400, desc: "", image: "", variants: [] },
    //     { id: "sp-tr-4", name: "Yak Shawarma", price: 400, desc: "", image: "", variants: [] }
    //   ]
    // },
    {
      name: "Fries",
      items: [
        {
          id: "sp-fr-1",
          name: "Fries",
          price: 220,
          desc: "",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX6F-5hulILYwE4O6bqEy5QTbDUfrBS0p99hNZbROQ6w&s=10",
          variants: [
            { name: "Plain", price: 220 },
            { name: "Peri Peri", price: 230 },
            { name: "Chatpata", price: 240 },
            { name: "Cheesy Lover", price: 300 },
            { name: "Mayo", price: 250 },
            { name: "Saspolo Special", price: 300 }
          ]
        }
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
          image: "https://static.tossdown.com/images/9cf67798-83cc-47e9-8b68-018a5b051325.webp",
          variants: [
            { name: "Pepsi", price: 280, discountPrice: 280 },
            { name: "7Up", price: 280, discountPrice: 280 },
            { name: "Mountain Dew", price: 280, discountPrice: 280 }
          ]
        },
        { id: "dr-4", name: "Mineral Water (Large)", price: 150, discountPrice: 150, desc: "Pure mountain water", image: "https://static.tossdown.com/images/e747f555-54b7-4e81-b017-306abce84ba2.jpg", variants: [] },
        { id: "dr-5", name: "Sting Energy", price: 200, discountPrice: 200, desc: "Boost your energy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbiZo_-FAlUMhL1lwWz7jwzSn6o82u-_I6TMf12A9byjJfHV1-pXpty65-&s=10", variants: [] }
      ]
    }
  ]
};