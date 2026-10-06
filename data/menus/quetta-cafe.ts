
export const menu = {
  shopId: "quetta-cafe",
  name: "Quetta Cafe Skardu",
  logo: "https://quettacafetea.com/wp-content/uploads/2024/06/cropped-13-fotor-bg-remover-20240425223114.png",

  categories: [
    {
      name: "Tea",
      items: [
        {
          id: "tea-1",
          name: "Sada Chai",
          price: 90,
          desc: "Traditional Pakistani tea",
          image: "https://foodpanda.dhmedia.io/image/fd-pk/Products/34370422.jpg?width=393.75&height=393.75",
          variants: []
        },
        {
          id: "tea-2",
          name: "Special Tea",
          price: 140,
          desc: "Rich and flavorful special tea",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwuDOWdq1Ii0r55L-y6EHK82001pIqqcTOWkvaM0oqvrl_0dhBwjgru816&s=10",
          variants: []
        }
      ]
    },

    {
      name: "Paratha",
      items: [
        {
          id: "par-1",
          name: "Paratha",
          price: 70,
          desc: "Freshly made crispy paratha",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHWK8u297_imCkPaDDHJYHn0CpMranlKp-x0u3je_4P1Mt15LPu1IZy4Cv&s=10",
          variants: []
        },
        {
          id: "par-2",
          name: "Anda Paratha",
          price: 150,
          desc: "Fresh paratha with egg",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjnmYbFgKc-7lEnnAGndb2pC0u5OPY01UxgKTyQ3JDUK7a9mmkiR4k96Y&s=10",
          variants: []
        },
        {
          id: "par-3",
          name: "Aloo Cheese Paratha",
          price: 300,
          desc: "Stuffed paratha with potato and cheese",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS95YN23WMlQndO0Uv_pCEPfGDz9vwEmI7B_q5jnPLlxP9IGbxA1Tp-Dz3r&s=10",
          variants: []
        }
      ]
    },

    // ---- Drinks & Beverages — left untouched, exactly as before ----
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
          price: 280,
          discountPrice: 280,
          desc: "Chilled soft drink, 1.5 litre",
          image: "https://static.tossdown.com/images/9cf67798-83cc-47e9-8b68-018a5b051325.webp",
          variants: [
            { name: "Pepsi", price: 280, discountPrice: 280 },
            { name: "7Up", price: 280, discountPrice: 280 },
            { name: "Mountain Dew", price: 280, discountPrice: 280 }
          ]
        },

        {
          id: "dr-4",
          name: "Mineral Water (Large)",
          price: 100,
          discountPrice: 150,
          desc: "Pure mountain water",
          image: "https://static.tossdown.com/images/e747f555-54b7-4e81-b017-306abce84ba2.jpg",
          variants: []
        },

        {
          id: "dr-5",
          name: "Sting Energy",
          price: 200,
          discountPrice: 200,
          desc: "Boost your energy",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbiZo_-FAlUMhL1lwWz7jwzSn6o82u-_I6TMf12A9byjJfHV1-pXpty65-&s=10",
          variants: []
        }
      ]
    }
  ]
};

