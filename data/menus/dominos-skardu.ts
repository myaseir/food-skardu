export const menu = {
  shopId: "dominos-skardu",
  name: "Domino's Pizza Skardu",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQipAadvX55uIxjvM_YfwT8z-A_IxMxT3Quh1MHxi1g9g&s", // TODO: add real Domino's Skardu logo URL
  categories: [
    {
      name: "Pizza - Classic Flavours",
      items: [
        {
          id: "dp-cf-1",
          name: "Chicken Tikka",
          price: 950,
          discountPrice: 808,
          desc: "Classic chicken tikka flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwRukVeEseCW6uevwlMsQnYy4St6ob6xqAD9mlkzrG9A&s=10",
          variants: [
            { name: "Regular 8\"", price: 950, discountPrice: 808 },
            { name: "Medium 10\"", price: 1850, discountPrice: 1573 },
            { name: "Large 13\"", price: 2650, discountPrice: 2253 }
          ]
        },
        {
          id: "dp-cf-2",
          name: "Chicken Fajita",
          price: 950,
          discountPrice: 808,
          desc: "Mexican style fajita pizza",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbR5ltqZ5Yo4BlGyoS0IVoeCsBqFRCGiPl6wglloA6qRu-MjBi99UNgC8&s=10",
          variants: [
            { name: "Regular 8\"", price: 950, discountPrice: 808 },
            { name: "Medium 10\"", price: 1850, discountPrice: 1573 },
            { name: "Large 13\"", price: 2650, discountPrice: 2253 }
          ]
        },
        {
          id: "dp-cf-3",
          name: "Hot-N-Spicy",
          price: 950,
          discountPrice: 808,
          desc: "For those who like it hot",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9mw9aOy3VGV_eJyCdGdZNAVUFU9q4pOG2xV2Y2Cb2Aw&s=10",
          variants: [
            { name: "Regular 8\"", price: 950, discountPrice: 808 },
            { name: "Medium 10\"", price: 1850, discountPrice: 1573 },
            { name: "Large 13\"", price: 2650, discountPrice: 2253 }
          ]
        },
        {
          id: "dp-cf-4",
          name: "Mexican Chilli",
          price: 950,
          discountPrice: 808,
          desc: "Spicy Mexican chilli topping",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA3kLiosyKBI_KCpiYNtKRhIK3bjuYn61bjg2yENv1EM9VPkXU_vZhMuo&s=10",
          variants: [
            { name: "Regular 8\"", price: 950, discountPrice: 808 },
            { name: "Medium 10\"", price: 1850, discountPrice: 1573 },
            { name: "Large 13\"", price: 2650, discountPrice: 2253 }
          ]
        },
        {
          id: "dp-cf-5",
          name: "Chicken Achar SP",
          price: 950,
          discountPrice: 808,
          desc: "Tangy pickle-spiced chicken",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1SrUA0DePkL0L4WLV9Ks4GqB3HWvQ0JcLjMrS1LGtZxBXMZ5056ltZRA&s=10",
          variants: [
            { name: "Regular 8\"", price: 950, discountPrice: 808 },
            { name: "Medium 10\"", price: 1850, discountPrice: 1573 },
            { name: "Large 13\"", price: 2650, discountPrice: 2253 }
          ]
        },
        {
          id: "dp-cf-6",
          name: "Tandoori",
          price: 950,
          discountPrice: 808,
          desc: "Smoky tandoori chicken pizza",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShEHvkrF9BhspeF7jFeH_M5nXdsgROYtIjkJhDMapsXw&s=10",
          variants: [
            { name: "Regular 8\"", price: 950, discountPrice: 808 },
            { name: "Medium 10\"", price: 1850, discountPrice: 1573 },
            { name: "Large 13\"", price: 2650, discountPrice: 2253 }
          ]
        }
      ]
    },
    {
      name: "Pizza - Special Flavours",
      items: [
        {
          id: "dp-sf-1",
          name: "Domino's Special",
          price: 1050,
          discountPrice: 893,
          desc: "House special recipe",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9nPYmPOJ_hCy3TQB5lKlcMs5Xkp_rtPCWeC3Qm81C7sYMTRfibMj_l8WL&s=10",
          variants: [
            { name: "Regular 8\"", price: 1050, discountPrice: 893 },
            { name: "Medium 10\"", price: 1950, discountPrice: 1658 },
            { name: "Large 13\"", price: 2850, discountPrice: 2423 }
          ]
        },
        {
          id: "dp-sf-2",
          name: "Bar B.Q",
          price: 1050,
          discountPrice: 893,
          desc: "Smoky BBQ flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzESR9BYQ6NNHV9XiYdZMKpOfNwInePlZbaj2XYaPKUhfXMJATN972F1fR&s=10",
          variants: [
            { name: "Regular 8\"", price: 1050, discountPrice: 893 },
            { name: "Medium 10\"", price: 1950, discountPrice: 1658 },
            { name: "Large 13\"", price: 2850, discountPrice: 2423 }
          ]
        },
        {
          id: "dp-sf-3",
          name: "Malai",
          price: 1050,
          discountPrice: 893,
          desc: "Creamy malai flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhyo8OE_Kuc0_xDO2lyG1JCIFwXHRsxyOVrwrIIjf8NLJPaSuMTzcSswY&s=10",
          variants: [
            { name: "Regular 8\"", price: 1050, discountPrice: 893 },
            { name: "Medium 10\"", price: 1950, discountPrice: 1658 },
            { name: "Large 13\"", price: 2850, discountPrice: 2423 }
          ]
        },
        {
          id: "dp-sf-4",
          name: "Kabab Crust",
          price: 1050,
          discountPrice: 893,
          desc: "Kabab-stuffed crust special",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXn0qjg7U6i2meBndBgxTeAsf1b-r-Hmayc5Gfn_2hlA&s=10",
          variants: [
            { name: "Regular 8\"", price: 1050, discountPrice: 893 },
            { name: "Medium 10\"", price: 1950, discountPrice: 1658 },
            { name: "Large 13\"", price: 2850, discountPrice: 2423 }
          ]
        },
        {
          id: "dp-sf-5",
          name: "Pineapple",
          price: 1050,
          discountPrice: 893,
          desc: "Sweet pineapple pizza",
          image: "https://dinnerthendessert.com/wp-content/uploads/2023/06/Hawaiian-Pizza-7.jpg",
          variants: [
            { name: "Regular 8\"", price: 1050, discountPrice: 893 },
            { name: "Medium 10\"", price: 1950, discountPrice: 1658 },
            { name: "Large 13\"", price: 2850, discountPrice: 2423 }
          ]
        }
      ]
    },
    {
      name: "Pizza - Crust Special",
      items: [
        {
          id: "dp-cs-1",
          name: "Crown Crust",
          price: 2050,
          discountPrice: 1743,
          desc: "Cheese-filled crown crust",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3WSpEb8himqJFZdQ6tuNnNSQv5BRG9-8ncatUU9Rfg&s=10",
          variants: [
            { name: "Medium 10\"", price: 2050, discountPrice: 1743 },
            { name: "Large 13\"", price: 3050, discountPrice: 2593 }
          ]
        },
        {
          id: "dp-cs-2",
          name: "Kabab Crust",
          price: 2050,
          discountPrice: 1743,
          desc: "Kabab-filled crust special",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGFPYNE1sN4dhhna-FokPiE7YM_w22Z-tJnvqaLt0EP1Hek3R_Egmi_RF-&s=10",
          variants: [
            { name: "Medium 10\"", price: 2050, discountPrice: 1743 },
            { name: "Large 13\"", price: 3050, discountPrice: 2593 }
          ]
        },
        {
          id: "dp-cs-3",
          name: "King Crust",
          price: 2050,
          discountPrice: 1743,
          desc: "Loaded king-size crust",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2kcdm0UEEnlVZhAxa544x72j_prG_F5IQWymo_pn5UQ&s=10",
          variants: [
            { name: "Medium 10\"", price: 2050, discountPrice: 1743 },
            { name: "Large 13\"", price: 3050, discountPrice: 2593 }
          ]
        },
        {
          id: "dp-cs-4",
          name: "Stuffed Crust",
          price: 2050,
          discountPrice: 1743,
          desc: "Classic cheese-stuffed crust",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHmibMP3lu3dBmO8_uxgkjWkL03QDQnGDqGqlrjxP751Sh-NS7nEf8xo0&s=10",
          variants: [
            { name: "Medium 10\"", price: 2050, discountPrice: 1743 },
            { name: "Large 13\"", price: 3050, discountPrice: 2593 }
          ]
        }
      ]
    },
    {
      name: "Pizza - Without Chicken",
      items: [
        {
          id: "dp-wc-1",
          name: "Margarita",
          price: 900,
          discountPrice: 765,
          desc: "Classic cheese and tomato",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcXBHXYTwnhMHWgjVI2Ke0ob_aRI-yH55TcCMI-j2cXA&s=10",
          variants: [
            { name: "Regular 8\"", price: 900, discountPrice: 765 },
            { name: "Medium 10\"", price: 1800, discountPrice: 1530 },
            { name: "Large 13\"", price: 2600, discountPrice: 2210 }
          ]
        },
        {
          id: "dp-wc-2",
          name: "Vegetable",
          price: 900,
          discountPrice: 765,
          desc: "Fresh garden vegetables",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhgq7DRLE8pxr3EKZoWslIOJVVcZ0khDwSBDEoW9cmjA&s=10",
          variants: [
            { name: "Regular 8\"", price: 900, discountPrice: 765 },
            { name: "Medium 10\"", price: 1800, discountPrice: 1530 },
            { name: "Large 13\"", price: 2600, discountPrice: 2210 }
          ]
        }
      ]
    },
    {
      name: "Extra Toppings",
      items: [
        {
          id: "dp-et-1",
          name: "Extra Toppings",
          price: 300,
          discountPrice: 255,
          desc: "Add extra topping of your choice",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSviEt6EQ5zd38KLDg4RdNuhxh4GM0bSjZizLg9bLKw2A&s=10",
          variants: [
            { name: "Cheese\"", price: 300, discountPrice: 255 },
            { name: "Chicken\"", price: 450, discountPrice: 383 },
            
          ]
        }
      ]
    },
   {
  name: "Burger Deals",
  items: [
    { id: "dp-bg-1", name: "Zinger Burger", price: 550, discountPrice: 495, desc: "Crispy zinger fillet burger", image: "https://fillicafepk.com/wp-content/uploads/2023/12/zinger-burgerpsd-450x450.jpg", variants: [] },
    { id: "dp-bg-2", name: "Zinger Burger with Cheese", price: 650, discountPrice: 585, desc: "Zinger burger topped with cheese", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbmrX4qL28PPpPFfMt2eP6lLddx8cyISAyD6kjomgoug&s=10", variants: [] },
    { id: "dp-bg-3", name: "Chicken Burger", price: 450, discountPrice: 405, desc: "Classic chicken burger", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKdCNYo0jMWeA40ghBbkdCwEpgUfLNeS6O8zhKuE48HQ&s=10", variants: [] },
    { id: "dp-bg-4", name: "Chicken Burger with Cheese", price: 550, discountPrice: 495, desc: "Chicken burger topped with cheese", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThbE1uwYArTh6FF07omIuI_6RqLV18QfWpsBkpHeZrCo2r2ZGCg7V0y7pZ&s=10", variants: [] },
    { id: "dp-bg-5", name: "Tower Burger", price: 1000, discountPrice: 900, desc: "Stacked double-decker tower burger", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYVPNhgEw1i33OM8ZvVMF821S6XF65hNZ3noGzRzVqfw&s=10", variants: [] }
  ]
},
{
  name: "Paratha Rolls",
  items: [
    { id: "dp-pr-1", name: "Zinger Paratha Roll", price: 550, discountPrice: 495, desc: "Zinger wrapped in paratha", image: "", variants: [] },
    { id: "dp-pr-2", name: "Zinger Cheese Paratha Roll", price: 650, discountPrice: 585, desc: "Zinger and cheese paratha roll", image: "", variants: [] },
    { id: "dp-pr-3", name: "Chicken Paratha Roll", price: 450, discountPrice: 405, desc: "Chicken wrapped in paratha", image: "", variants: [] },
    { id: "dp-pr-4", name: "Bihari Paratha Roll", price: 600, discountPrice: 540, desc: "Spiced bihari kabab paratha roll", image: "", variants: [] },
    { id: "dp-pr-5", name: "Chicken Cheese Paratha Roll", price: 550, discountPrice: 495, desc: "Chicken and cheese paratha roll", image: "", variants: [] },
    { id: "dp-pr-6", name: "Vegetarian Paratha Roll", price: 450, discountPrice: 405, desc: "Fresh vegetable paratha roll", image: "", variants: [] }
  ]
},
{
  name: "Shawarma",
  items: [
    { id: "dp-sh-1", name: "Zinger Shawarma", price: 550, discountPrice: 495, desc: "Crispy zinger shawarma wrap", image: "", variants: [] },
    { id: "dp-sh-2", name: "Zinger Shawarma with Cheese", price: 600, discountPrice: 540, desc: "Zinger shawarma with melted cheese", image: "", variants: [] },
    { id: "dp-sh-3", name: "Chicken Shawarma", price: 400, discountPrice: 360, desc: "Classic chicken shawarma", image: "", variants: [] },
    { id: "dp-sh-4", name: "Chicken Shawarma with Cheese", price: 500, discountPrice: 450, desc: "Chicken shawarma with melted cheese", image: "", variants: [] },
    { id: "dp-sh-5", name: "Vegetarian Shawarma", price: 400, discountPrice: 360, desc: "Fresh vegetable shawarma", image: "", variants: [] }
  ]
},
{
  name: "Loaded Fries",
  items: [
    { id: "dp-lf-1", name: "Loaded Fries Regular", price: 900, discountPrice: 810, desc: "Fries loaded with toppings", image: "", variants: [] },
    { id: "dp-lf-2", name: "Loaded Fries Large", price: 1300, discountPrice: 1170, desc: "Large loaded fries", image: "", variants: [] },
    { id: "dp-lf-3", name: "Loaded Fries SP Large", price: 1500, discountPrice: 1350, desc: "Special large loaded fries", image: "", variants: [] }
  ]
},
{
  name: "Pasta",
  items: [
    {
      id: "dp-ps-1",
      name: "Domino's SP Pasta",
      price: 900,
      discountPrice: 810,
      desc: "House special pasta",
      image: "",
      variants: [
        { name: "P-1", price: 900, discountPrice: 810 },
        { name: "P-2", price: 1200, discountPrice: 1080 }
      ]
    },
    {
      id: "dp-ps-2",
      name: "Crunchy Pasta",
      price: 1000,
      discountPrice: 900,
      desc: "Pasta topped with crunchy bits",
      image: "",
      variants: [
        { name: "P-1", price: 1000, discountPrice: 900 },
        { name: "P-2", price: 1400, discountPrice: 1260 }
      ]
    },
    {
      id: "dp-ps-3",
      name: "Alfredo Pasta",
      price: 900,
      discountPrice: 810,
      desc: "Creamy white sauce alfredo pasta",
      image: "",
      variants: [
        { name: "P-1", price: 900, discountPrice: 810 },
        { name: "P-2", price: 1200, discountPrice: 1080 }
      ]
    }
  ]
},
{
  name: "Super Deals",
  items: [
    { id: "dp-sup-1", name: "Super Deal 1 — 3 Chicken Tikka (Regular) + 1 LTR Drink", price: 2850, discountPrice: 2565, desc: "3 Regular Chicken Tikka pizzas with a free 1-liter cold drink", image: "", variants: [] },
    { id: "dp-sup-2", name: "Super Deal 2 — 3 Chicken Tikka (Medium) + 1 LTR Drink", price: 5500, discountPrice: 4950, desc: "3 Medium Chicken Tikka pizzas with a free 1-liter cold drink", image: "", variants: [] },
    { id: "dp-sup-3", name: "Super Deal 3 — 3 Chicken Tikka (Large) + 1 LTR Drink", price: 7800, discountPrice: 7020, desc: "3 Large Chicken Tikka pizzas with a free 1-liter cold drink", image: "", variants: [] }
  ]
},
{
  name: "Fried Chicken",
  items: [
    { id: "dp-fc-1", name: "1 Chicken Piece", price: 350, discountPrice: 315, desc: "Single crispy fried chicken piece", image: "", variants: [] },
    { id: "dp-fc-2", name: "2 Chicken Pieces", price: 680, discountPrice: 612, desc: "Two crispy fried chicken pieces", image: "", variants: [] },
    { id: "dp-fc-3", name: "5 Chicken Pieces", price: 1700, discountPrice: 1530, desc: "Five crispy fried chicken pieces", image: "", variants: [] },
    { id: "dp-fc-4", name: "8 Chicken Pieces", price: 2650, discountPrice: 2385, desc: "Eight crispy fried chicken pieces", image: "", variants: [] },
    { id: "dp-fc-5", name: "Hot Wings (10 pcs)", price: 900, discountPrice: 810, desc: "Ten spicy hot wings", image: "", variants: [] },
    { id: "dp-fc-6", name: "Chicken Nuggets (10 pcs)", price: 900, discountPrice: 810, desc: "Ten crispy chicken nuggets", image: "", variants: [] },
    { id: "dp-fc-7", name: "Hot Shots (10 pcs)", price: 900, discountPrice: 810, desc: "Ten spicy hot shots", image: "", variants: [] }
  ]
},
{
  name: "French Fries",
  items: [
    { id: "dp-ff-1", name: "French Fries Regular", price: 350, discountPrice: 315, desc: "Classic regular fries", image: "", variants: [] },
    { id: "dp-ff-2", name: "French Fries Large", price: 500, discountPrice: 450, desc: "Large portion of fries", image: "", variants: [] },
    { id: "dp-ff-3", name: "French Fries Family", price: 750, discountPrice: 675, desc: "Family-size portion of fries", image: "", variants: [] }
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