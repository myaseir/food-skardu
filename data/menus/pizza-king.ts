export const menu = {
  shopId: "pizza-king",
  name: "Pizza King Skardu",
  logo: "/images/pizza-king-logo.png",
  categories: [
    {
      name: "Deals",
      items: [
        { id: "pk-dl-1", name: "Deal 01", price: 4390, desc: "1 Large pizza, 1 Regular pizza, 2 Burgers, 1 Drink 1.5 Ltr", image: "", variants: [] },
        { id: "pk-dl-2", name: "Deal 02", price: 5490, desc: "2 Large pizzas, 2 Regular pizzas, 1 Drink 1.5 Ltr", image: "", variants: [] },
        { id: "pk-dl-3", name: "Deal 03", price: 2190, desc: "2 Small pizzas, 2 Burgers, 1 Drink 1.5 Ltr", image: "", variants: [] },
        { id: "pk-dl-4", name: "Deal 04", price: 2690, desc: "1 Regular pizza, 1 Small pizza, 2 Burgers, 1 Drink 1.5 Ltr", image: "", variants: [] },
        { id: "pk-dl-5", name: "Deal 05", price: 1990, desc: "3 Burgers, 1 Fries, 1 Drink 1 Ltr", image: "", variants: [] },
        { id: "pk-dl-6", name: "Deal 06", price: 1190, desc: "1 Small pizza, 1 Burgers, 1 Drink 500ml", image: "", variants: [] },
        { id: "pk-dl-7", name: "Deal 07", price: 3190, desc: "6 Burgers, 1 Drink 1.5 Ltr", image: "", variants: [] },
        { id: "pk-dl-8", name: "Deal 08", price: 2690, desc: "2 Large pizzas, 2 Regular pizzas, 4 Burgers, 3 Fries, 2 Drink 1.5 Ltr", image: "", variants: [] }
      ]
    },
    {
      name: "Midnight Deals",
      items: [
        { id: "pk-md-1", name: "Midnight Deal 01", price: 2790, desc: "1 Large Pizza, 2 Burgers, 1 Drink Ltr", image: "", variants: [] },
        { id: "pk-md-2", name: "Midnight Deal 02", price: 1490, desc: "1 Regular Pizza, 1 Burger, 1 Drink (500 ml)", image: "", variants: [] },
        { id: "pk-md-3", name: "Midnight Deal 03", price: 1190, desc: "2 Burger, 2 Can", image: "", variants: [] },
        { id: "pk-md-4", name: "Midnight Deal 04", price: 650, desc: "1 Burger, 1 Can", image: "", variants: [] }
      ]
    },
    {
      name: "Pizzas",
      items: [
        { id: "pk-pz-1", name: "King Special", price: 1600, desc: "Loaded with toppings", image: "/images/king-pizza.jpg", variants: [] },
        { id: "pk-pz-2", name: "Fajita Pizza", price: 1400, desc: "Spicy chicken and peppers", image: "/images/fajita.jpg", variants: [] }
      ]
    },
    {
      name: "Snacks & Sides",
      items: [
        { id: "pk-sn-1", name: "Pizza Fries", price: 750, desc: "Crispy fries topped with melted cheese and pizza flavors for a perfect snack", image: "", variants: [] },
        { id: "pk-sn-2", name: "Hot Wings (8pcs)", price: 750, desc: "Zesty wings tossed in a spicy sauce to give your taste buds a fiery", image: "", variants: [] },
        { id: "pk-sn-3", name: "Chicken Nuggets (12pcs)", price: 850, desc: "Twelve pieces of golden, crispy bite-sized chicken served", image: "", variants: [] },
        { id: "pk-sn-4", name: "Fries", price: 390, desc: "Lightly salted, crispy golden potato fries served hot for the perfect simple side", image: "", variants: [] },
        { id: "pk-sn-5", name: "Chicken Wings (6pcs)", price: 790, desc: "Freshly oven-baked wings, perfectly", image: "", variants: [] },
        { id: "pk-sn-6", name: "Drum Stick (2pcs)", price: 750, desc: "Two pieces of succulent, deep-fried chicken", image: "", variants: [] }
      ]
    },
    {
      name: "Burgers",
      items: [
        { id: "pk-bg-1", name: "Zinger Burger", price: 590, desc: "Classic crispy chicken crunch", image: "", variants: [] },
        { id: "pk-bg-2", name: "Zinger Burger (Cheesy)", price: 650, desc: "Classic crispy chicken crunch with cheese", image: "", variants: [] },
        { id: "pk-bg-3", name: "King Burger", price: 390, desc: "Savory beef, royal taste", image: "", variants: [] },
        { id: "pk-bg-4", name: "King Burger (Cheesy)", price: 450, desc: "Rich cheese, classic beef flavor", image: "", variants: [] }
      ]
    },
    {
      name: "Broast & Rolls",
      items: [
        { id: "pk-br-1", name: "Bihari Roll", price: 290, desc: "Juicy bihari wrapped in soft paratha", image: "", variants: [] },
        { id: "pk-br-2", name: "Paratha Roll (Cheese)", price: 450, desc: "Loaded paratha roll with cheesy goodness", image: "", variants: [] },
        { id: "pk-br-3", name: "Paratha Roll", price: 350, desc: "Tender chicken wrapped in flaky crispy wrap", image: "", variants: [] },
        { id: "pk-br-4", name: "Shawarma", price: 390, desc: "Tender chicken with Arabic Flavors", image: "", variants: [] },
        { id: "pk-br-5", name: "Chicken Breast (4 pcs)", price: 1290, desc: "Juicy, tender fried chicken", image: "", variants: [] },
        { id: "pk-br-6", name: "Broast Quarter (2 pcs)", price: 790, desc: "Crispy, perfectly seasoned piece", image: "", variants: [] }
      ]
    },
    {
      name: "Soups",
      items: [
        { id: "pk-sp-1", name: "King Special Soup", price: 290, desc: "Hearty, savory signature blend", image: "", variants: [] },
        { id: "pk-sp-2", name: "Chicken Corn Soup", price: 250, desc: "Creamy, wholesome chicken delight", image: "", variants: [] },
        { id: "pk-sp-3", name: "Hot & Sour Soup", price: 290, desc: "Spicy, tangy classic broth", image: "", variants: [] },
        { id: "pk-sp-4", name: "Chicken Veg Soup", price: 290, desc: "Fresh, healthy vegetable medley", image: "", variants: [] }
      ]
    },
    {
      name: "Drinks & Desserts",
      items: [
        { id: "pk-dd-1", name: "Ice Cream", price: 150, desc: "Cool velvety scoop… Single Flavor", image: "", variants: [] },
        { id: "pk-dd-2", name: "Drink (1.5 Ltr)", price: 150, desc: "Chilled, refreshing fizzy Drink.", image: "", variants: [] },
        { id: "pk-dd-3", name: "Drink (500 ml)", price: 150, desc: "Chilled, refreshing fizzy Drink.", image: "", variants: [] },
        { id: "pk-dd-4", name: "Can", price: 150, desc: "Cold, crisp refreshing can", image: "", variants: [] },
        { id: "dr-20", name: "Pepsi Large", price: 200, desc: "Cold drink", image: "/images/pepsi.jpg", variants: [] },
        { id: "dr-21", name: "Water (Small)", price: 60, desc: "Clean drinking water", image: "/images/water.jpg", variants: [] }
      ]
    }
  ]
};