export const menu = {
  shopId: "pathan-chapli-kabab-skardu",
  name: "Pathan Chapli Kabab",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH_lFWpGliDJkUio2DAuny_MrPUOBMHIq9mzoLXUt2HA&s", // TODO: add Pathan Chapli Kabab logo URL
  contact: {
    // phone: "", // TODO: add phone number
    // easypaisa: "" // TODO: add if available
  },
  notes: "", // TODO: add any notes (e.g. parcel charges)
  categories: [
    {
      name: "Chapli Kabab",
      items: [
        {
          id: "pck-ck-1",
          name: "Chapli Kabab (Without Naan)",
          price: 170,
          discountPrice: 170,
          desc: "Traditional Pathan chapli kabab, served without naan",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1794322263/Sizzling_Chapli_Kebab_with_Raita_caqvxj.jpg",
          variants: []
        },
        {
          id: "pck-ck-2",
          name: "Chapli Kabab with 1 Naan",
          price: 200,
          discountPrice: 200,
          desc: "Traditional Pathan chapli kabab served with 1 naan",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1794322264/Chapli_Kebab_Feast_with_Naan_and_Raita_ubfnti.jpg",
          variants: []
        },
        {
          id: "pck-ck-3",
          name: "Chapli Kabab with 2 Naan",
          price: 220,
          discountPrice: 220,
          desc: "Traditional Pathan chapli kabab served with 2 naan",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1794322263/Chapli_Kebab_with_Naan_and_Raita_cykkal.jpg",
          variants: []
        }
      ]
    },
    {
      name: "Extras",
      items: [
        {
          id: "pck-ex-1",
          name: "Sada Naan",
          price: 30,
          discountPrice: 30,
          desc: "Plain naan",
          image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1794322568/Golden_Bubbled_Naan_on_Dark_Marble_ap9ufs.jpg",
          variants: []
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