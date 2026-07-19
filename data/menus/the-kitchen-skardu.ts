export const menu = {
  shopId: "the-kitchen-skardu",
  name: "The Kitchen",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpO1EPdDa0L41JIdnK45cWhQVFiulx09fx2p5amMNXFXwBXUiOyj8itdI&s=10",
  contact: {
    easypaisa: "03448895733"
  },
  notes: "Parcel charge Rs. 20 extra",
  categories: [
    {
      name: "Biryani & Pulao",
      items: [
        {
          id: "tk-bp-1",
          name: "Chicken Biryani",
          price: 400,
          discountPrice: 400,
          desc: "Classic spiced chicken biryani",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAGb4GlhonJ7KfUeJ_xEd2nEx9BJwmtQVeXysB-9weBg&s=10",
          variants: []
        },
        {
          id: "tk-bp-2",
          name: "Double Chicken Biryani",
          price: 570,
          discountPrice: 570,
          desc: "Extra loaded chicken biryani, double portion of chicken",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAGb4GlhonJ7KfUeJ_xEd2nEx9BJwmtQVeXysB-9weBg&s=10",
          variants: []
        },
        {
          id: "tk-bp-3",
          name: "Sada Biryani",
          price: 300,
          discountPrice: 300,
          desc: "Plain biryani rice, no chicken",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWVyM9kAiegClpBY3xjR4DZSe0AFsDExytrCGrw9T0NbyQXQpxlb2m8m8&s=10",
          variants: []
        },
        {
          id: "tk-bp-4",
          name: "Beef Pulao",
          price: 470,
          discountPrice: 470,
          desc: "Fragrant beef pulao",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL3Oo9i7nKSUMMigPT0WX4ihI3ngZ_y7jENQVWPRs9VQ&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Drinks & Beverages",
      items: [
        {
          id: "dr-1",
          name: "Soft Drink 500ml",
          price: 150,
          discountPrice: 150,
          desc: "Chilled soft drink, 500ml",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3srEYmAd48bCUjjnNHPvz5iHdIlpqILtLDtfZ9wOGa8kGH9MaAAnrNowp&s=10",
          variants: [
            { name: "Pepsi", price: 150, discountPrice: 150 },
            { name: "7Up", price: 150, discountPrice: 150 },
            { name: "Mountain Dew", price: 150, discountPrice: 150 }
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