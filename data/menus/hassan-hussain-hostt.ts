export const menu = {
  shopId: "hassan-hussain-host",
  name: "Hassan Hussain Host",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Vba66LQaBXtJejMOezwhFNWkX4NVN0yXn0RV03oYNw&s",
  categories: [
    {
      name: "Mamtu",
      items: [
        {
          id: "mmt-1",
          name: "Mamtu Pulao",
          price: 400,
          desc: "Traditional mamtu served with pulao",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpZGs_shvyMZfHuSPwwF9R_ln732uUNjAvxy4vyAOaCw&s=10",
          variants: []
        },
        {
          id: "mmt-2",
          name: "Mamtu",
          price: 180,
          desc: "Steamed mamtu dumplings",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSIT_z6GpA_OkQv1NRWwovQ8gknq9roYBYOK2XZLAmeBSIldz32-7IU-N-&s=10",
          variants: [
            { name: "6 Piece", price: 180 },
            { name: "12 Piece", price: 360 }
          ]
        },
        // {
        //   id: "mmt-3",
        //   name: "Mamtu Pulao Combo",
        //   price: 580,
        //   desc: "Mamtu pulao served with a side of mamtu",
        //   image: "",
        //   variants: [
        //     { name: "With 6 Piece Mamtu", price: 580 },
        //     { name: "With 12 Piece Mamtu", price: 760 }
        //   ]
        // }
      ]
    },
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
  ]
};