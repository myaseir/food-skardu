export const menu = {
  shopId: "yak-grill-skardu",
  name: "Yak Grill Skardu",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTCK1MjSAqQF5vWaFQeoB26t69zQdIJEkEBA8pGEZYAs8QhCwkmFSRmwcG&s=10",
  categories: [
    {
      name: "Mains",
      items: [
        { id: "main-1", name: "Yak Steak", price: 4000, desc: "250 grams of yak meat, served with the sideline of fried potatoes, vegetables and sauce.", image: "", variants: [] },
        { id: "main-2", name: "Yak Burger", price: 1200, desc: "120 grams of yak meat mince with cheese, tomato and onion. Served with potato wedges and sauce. (Note: burgers won't be cut into half.)", image: "", variants: [] },
        { id: "main-3", name: "Burger of the House", price: 1500, desc: "Double patty of yak meat mince with cheese, tomato, onion and fried egg on top. Served with the sideline of potato wedges and sauce. (Note: burgers won't be cut into half.)", image: "", variants: [] },
        { id: "main-4", name: "Yak Chilli Dry", price: 1500, desc: "Sliced stir-fried yak meat with mushrooms, carrot, capsicum and sweet corn. Served with egg fried rice.", image: "", variants: [] },
        { id: "main-5", name: "Yak Karahi", price: 4200, desc: "1 kg of yak meat with gravy of tomato and local spices.", image: "", variants: [] },
        { id: "main-6", name: "Pasta", price: 1100, desc: "Fettuccine pasta with mushroom, prepared in creamy white sauce.", image: "", variants: [] },
        { id: "main-7", name: "Passu Potato", price: 450, desc: "A portion of local fried potato with skin, served with sauce.", image: "", variants: [] }
      ]
    },
    {
      name: "Coffee",
      items: [
        { id: "cof-1", name: "Cappuccino", price: 400, desc: "", image: "", variants: [] },
        { id: "cof-2", name: "Americano", price: 300, desc: "", image: "", variants: [] }
      ]
    },
    {
      name: "Sides & Extras",
      items: [
        { id: "side-1", name: "Herbal Tea", price: 150, desc: "", image: "", variants: [] },
        { id: "side-2", name: "Cold Drink", price: 150, desc: "", image: "", variants: [] },
        { id: "side-3", name: "Water", price: 100, desc: "", image: "", variants: [] },
        { id: "side-4", name: "Extra Sauce", price: 50, desc: "", image: "", variants: [] },
        { id: "side-5", name: "Chapati", price: 50, desc: "", image: "", variants: [] }
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