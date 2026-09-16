export const menu = {
  shopId: "cafe-anime",
  name: "Cafe Anime",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZew7aI9U5lf-fasPaMAih5aLtcxc-KUaCchazG4RBtA&s=10",
  categories: [
    {
      name: "Appetizer",
      emoji: "🍟",
      items: [
        { id: "ca-1", name: "Fries", price: 150, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568613/ChatGPT_Image_Sep_16_2026_05_55_53_PM_dkokuh.jpg", sound: "", desc: "Golden crispy power-up snack!" },
        { id: "ca-2", name: "Balay", price: 180, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568613/ChatGPT_Image_Sep_16_2026_05_56_46_PM_ogrism.jpg", sound: "", desc: "Crunchy bite, secret recipe!" },
        { id: "ca-3", name: "Corn Soup", price: 180, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568613/ChatGPT_Image_Sep_16_2026_06_14_41_PM_npu2wl.jpg", sound: "", desc: "Warm hug in a bowl!" },
        { id: "ca-4", name: "Momos(6 Pcs)", price: 180, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568612/ChatGPT_Image_Sep_16_2026_06_17_11_PM_shz2ow.jpg", sound: "", desc: "Juicy dumplings, senpai approved!" },
        // Mumtu (6 Pcs) — price wasn't legible in the menu photo, add once confirmed.
      ],
    },
    {
      name: "Chinese",
      emoji: "🥡",
      items: [
        { id: "ca-20", name: "Dry Chilli Chicken", price: 800, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568604/ChatGPT_Image_Sep_16_2026_06_49_00_PM_cyss3h.jpg", sound: "/sounds/items/ca-20.mp3", desc: "Fiery flavor explosion, nya!" },
        { id: "ca-21", name: "Kung Pao Chicken", price: 850, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568604/ChatGPT_Image_Sep_16_2026_06_50_30_PM_hjofkd.jpg", sound: "/sounds/items/ca-21.mp3", desc: "Spicy nutty battle fuel!" },
        { id: "ca-22", name: "Chicken Chow Mein", price: 550, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568603/ChatGPT_Image_Sep_16_2026_06_51_57_PM_tobqog.jpg", sound: "/sounds/items/ca-22.mp3", desc: "Slurp-worthy noodle adventure!" },
      ],
    },
    {
      name: "Italian",
      emoji: "🍽️",
      items: [
        { id: "ca-23", name: "Napoleon Chicken", price: 1700, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568603/ChatGPT_Image_Sep_16_2026_06_53_38_PM_ctmisu.jpg", sound: "/sounds/items/ca-23.mp3", desc: "Legendary chicken, epic taste!" },
        { id: "ca-24", name: "Mushroom Chicken Steak", price: 1600, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568604/ChatGPT_Image_Sep_16_2026_06_55_16_PM_ntlaga.jpg", sound: "/sounds/items/ca-24.mp3", desc: "Savory steak, boss level!" },
        { id: "ca-25", name: "Stuffed Butter Chicken", price: 1650, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568604/ChatGPT_Image_Sep_16_2026_06_56_57_PM_nuvxx2.jpg", sound: "/sounds/items/ca-25.mp3", desc: "Creamy surprise, ultimate comfort!" },
        { id: "ca-26", name: "Crispy Chicken", price: 1500, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568603/ChatGPT_Image_Sep_16_2026_06_58_22_PM_eysg2d.jpg", sound: "/sounds/items/ca-26.mp3", desc: "Crunch so satisfying, sugoi!" },
      ],
    },
    {
      name: "Fast Food",
      emoji: "🍔",
      items: [
        { id: "ca-4", name: "Crispy Zinger Burger", price: 650, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568612/ChatGPT_Image_Sep_16_2026_06_18_50_PM_rq10f8.jpg", sound: "/sounds/items/ca-4.mp3", desc: "Spicy crunch, main character energy!" },
        { id: "ca-5", name: "Café Special Chicken Burger", price: 700, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568611/ChatGPT_Image_Sep_16_2026_06_20_14_PM_uzy16k.jpg", sound: "/sounds/items/ca-5.mp3", desc: "House special, flavor overload!" },

        { id: "ca-7", name: "Club Sandwich", price: 580, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568611/ChatGPT_Image_Sep_16_2026_06_23_57_PM_ivuraf.jpg", sound: "/sounds/items/ca-7.mp3", desc: "Stacked layers, triple treat!" },
        // { id: "ca-8", name: "Chef's Special Sandwich", price: 600, image: "/anime/items/ca-8.png", sound: "/sounds/items/ca-8.mp3" },
        { id: "ca-9", name: "Open-Faced Sandwich", price: 450, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568611/ChatGPT_Image_Sep_16_2026_06_25_29_PM_uf6syd.jpg", sound: "/sounds/items/ca-9.mp3", desc: "Simple bite, big flavor!" },
      ],
    },
    {
      name: "Pizza",
      emoji: "🍕",
      items: [
        {
          id: "ca-10",
          name: "Tikka Pizza",
          price: 550,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568610/ChatGPT_Image_Sep_16_2026_06_30_38_PM_z2eirt.jpg",
          sound: "/sounds/items/ca-10.mp3",
          desc: "Spicy tikka, cheesy delight!",
          variants: [
            { name: "Small", price: 550 },
            { name: "Medium", price: 900 },
            { name: "Large", price: 1550 },
            { name: "Jumbo", price: 2300 },
          ],
        },
        {
          id: "ca-11",
          name: "Moroccan Pizza",
          price: 550,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568611/ChatGPT_Image_Sep_16_2026_06_32_08_PM_w4xoxk.jpg",
          sound: "/sounds/items/ca-11.mp3",
          desc: "Exotic spices, flavor journey!",
          variants: [
            { name: "Small", price: 550 },
            { name: "Medium", price: 900 },
            { name: "Large", price: 1550 },
            { name: "Jumbo", price: 2300 },
          ],
        },
        {
          id: "ca-12",
          name: "Café Special Pizza",
          price: 550,
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568607/ChatGPT_Image_Sep_16_2026_06_33_49_PM_kbsbdk.jpg",
          sound: "/sounds/items/ca-12.mp3",
          desc: "Chef's secret topping magic!",
          variants: [
            { name: "Small", price: 550 },
            { name: "Medium", price: 900 },
            { name: "Large", price: 1550 },
            { name: "Jumbo", price: 2300 },
          ],
        },
      ],
    },
    {
      name: "Pasta",
      emoji: "🍝",
      items: [
        { id: "ca-13", name: "Alfredo Pasta", price: 850, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568607/ChatGPT_Image_Sep_16_2026_06_35_46_PM_ffxswt.jpg", sound: "/sounds/items/ca-13.mp3", desc: "Creamy dreamy pasta hug!" },
        { id: "ca-14", name: "Café Special Pasta", price: 900, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568606/ChatGPT_Image_Sep_16_2026_06_38_03_PM_gsvvmq.jpg", sound: "/sounds/items/ca-14.mp3", desc: "House twist, extra yum!" },
      ],
    },
    {
      name: "Tea & Coffee",
      emoji: "☕",
      items: [
        { id: "ca-15", name: "Doodh Patti Tea", price: 160, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568606/ChatGPT_Image_Sep_16_2026_06_39_45_PM_gam45o.jpg", sound: "/sounds/items/ca-15.mp3", desc: "Classic milky tea comfort!" },
        { id: "ca-16", name: "Chai", price: 100, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568606/ChatGPT_Image_Sep_16_2026_06_41_11_PM_ykxko7.jpg", sound: "/sounds/items/ca-16.mp3", desc: "Cozy cup, warm vibes!" },
        { id: "ca-17", name: "Green Tea", price: 50, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568606/ChatGPT_Image_Sep_16_2026_06_43_00_PM_ogjplu.jpg", sound: "/sounds/items/ca-17.mp3", desc: "Light, calm, zen sip!" },
        { id: "ca-18", name: "Black Coffee", price: 200, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568606/ChatGPT_Image_Sep_16_2026_06_45_52_PM_vno6rt.jpg", sound: "/sounds/items/ca-18.mp3", desc: "Bold jolt, no sugar!" },
        { id: "ca-19", name: "Milk Coffee", price: 280, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568606/ChatGPT_Image_Sep_16_2026_06_47_16_PM_cyitwq.jpg", sound: "/sounds/items/ca-19.mp3", desc: "Smooth, sweet caffeine hug!" },
      ],
    },
    
    {
      name: "Milkshakes",
      emoji: "🥤",
      items: [
        { id: "ca-27", name: "Banana Special Shake", price: 250, image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1789568602/ChatGPT_Image_Sep_16_2026_07_15_04_PM_tm3c0h.jpg", sound: "/sounds/items/ca-27.mp3", desc: "Sweet banana power blend!" },
      ],
    },
  ],
};