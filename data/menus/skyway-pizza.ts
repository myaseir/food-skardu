export const menu = {
  shopId: "skyway-pizza",
  name: "Skyway Pizza Skardu",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtUeS45GsAE9jnvKmammejtmSPfBAW92Su-zP4Wj8yMw&s=10",
  categories: [
    {
  name: "Hot Summer Deals",
  items: [
    { id: "sw-sd-1", name: "Deal 1", price: 1039, discountPrice: 499, desc: "1 Small Pizza + 1 Drink 300ml", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785161946/ChatGPT_Image_Jul_27_2026_07_18_40_PM_cw6jgl.jpg", variants: [] },
    { id: "sw-sd-2", name: "Deal 2", price: 1600, discountPrice: 950, desc: "1 Regular Pizza + 300ml Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785162201/ChatGPT_Image_Jul_27_2026_07_23_02_PM_qpi7t7.jpg", variants: [] },
    { id: "sw-sd-3", name: "Deal 3", price: 2940, discountPrice: 1550, desc: "1 Large Pizza + 1 Liter Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785162372/ChatGPT_Image_Jul_27_2026_07_25_51_PM_xvyxkt.jpg", variants: [] },
    { id: "sw-sd-4", name: "Deal 4", price: 1840, discountPrice: 1250, desc: "1 Small Pizza + 1 Zinger Burger + 1 Pasta or Lasagne", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785163161/ChatGPT_Image_Jul_27_2026_07_38_48_PM_yxypk5.jpg", variants: [] },
    { id: "sw-sd-5", name: "Deal 5", price: 1500, discountPrice: 1350, desc: "3 Zinger Burgers", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785163995/Gemini_Generated_Image_f05tb1f05tb1f05t_lvucyr.jpg", variants: [] },
    { id: "sw-sd-6", name: "Deal 6", price: 5630, discountPrice: 2850, desc: "2 Large Pizzas + 1.5 Liter Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785163997/Gemini_Generated_Image_6r82dh6r82dh6r82_fdd602.jpg", variants: [] },
    { id: "sw-sd-7", name: "Deal 7", price: 3740, discountPrice: 2450, desc: "1 Jumbo Pizza + 1.5 Liter Drink", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785164495/ChatGPT_Image_Jul_27_2026_08_00_43_PM_xh7vzr.jpg", variants: [] }, // CONFIRM: "Jumbo" mapped to Extra Large — let me know if this should be Mighty Jumbo instead
    { id: "sw-sd-8", name: "Deal 8", price: 3079, discountPrice: 1899, desc: "2 Small Pizzas + 2 Zinger Burgers + 4 Wings", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785164351/Gemini_Generated_Image_6n3iml6n3iml6n3i_nhbah3.jpg", variants: [] }
  ]
},
{
  name: "Family Deals",
  items: [
    { id: "sw-fd-1", name: "Family Deal 1", price: 11109, discountPrice: 5549, desc: "4 Large Pizzas, 2 Drinks 1.5 Liter", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785164697/ChatGPT_Image_Jul_27_2026_08_04_14_PM_zlskty.jpg", variants: [] },
    { id: "sw-fd-2", name: "Family Deal 2", price: 9729, discountPrice: 5549, desc: "2 Large Pizzas, 2 Regular Pizzas, 2 Zinger Burgers, 1 Pasta or Lasagna", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785169569/WhatsApp_Image_2026-07-27_at_9.23.09_PM_lht1mv.jpg", variants: [] }
  ]
},
{
  name: "Midnight Deals",
  items: [
    { id: "sw-md-1", name: "2 Large Pizza", price: 5279, discountPrice: 2499, desc: "10:00 PM till 2:00 AM", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785169553/WhatsApp_Image_2026-07-27_at_9.23.09_PM_1_gcmdzb.jpg", variants: [] },
    { id: "sw-md-2", name: "2 Regular Pizza", price: 2999, discountPrice: 1699, desc: "10:00 PM till 2:00 AM", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785169550/WhatsApp_Image_2026-07-27_at_9.23.08_PM_1_deywyv.jpg", variants: [] },
    { id: "sw-md-3", name: "2 Small Pizza", price: 1879, discountPrice: 799, desc: "10:00 PM till 2:00 AM", image: "https://res.cloudinary.com/dxxqrjnje/image/upload/v1785169554/WhatsApp_Image_2026-07-27_at_9.23.08_PM_f980nk.jpg", variants: [] }
  ]
},
    {
      name: "Premium Flavors",
      items: [
        {
          id: "sw-pf-1",
          name: "Seekh Kabab",
          price: 990,
          discountPrice: 450,
          desc: "Extra charges applied for this flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp57C7SFxkcpr3j74Vnc6agWMXcphF-uW_PSQeInKQyQ&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 650 },
            { name: "Regular", price: 1550, discountPrice: 1100 },
            { name: "Large", price: 2890, discountPrice: 1700 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-pf-2",
          name: "Crown Crust",
          price: 990,
          discountPrice: 450,
          desc: "Extra charges applied for this flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjBN3QUWQeL_YHdXxyGW_KjYvGesQR9eaoJzCEd2ZjoMVNu_DScr1xR8U&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 650 },
            { name: "Regular", price: 1550, discountPrice: 1100 },
            { name: "Large", price: 2890, discountPrice: 1800 },
            { name: "Extra Large", price: 3790, discountPrice: 2900 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3960 }
          ]
        },
        {
          id: "sw-pf-3",
          name: "Chicken Supremo",
          price: 990,
          discountPrice: 450,
          desc: "Premium flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHD2SSkBYdR7_OfR96wC0CHLdU_aHVXGfuz-_M8-CzUw&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-pf-4",
          name: "SkyWay Special",
          price: 990,
          discountPrice: 450,
          desc: "Our signature special pizza",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzQptYutm-FRdU2ULK5Mk3dxLbkrAtzKR4KzOkGDdaTw&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-pf-5",
          name: "SkyWay Fiesta",
          price: 990,
          discountPrice: 450,
          desc: "Premium flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIy5N0UyHxM1dqWvB2J3JG5nOefNC91stwdB5PGAPXVA&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-pf-6",
          name: "Malai Boti",
          price: 990,
          discountPrice: 450,
          desc: "Premium flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhyo8OE_Kuc0_xDO2lyG1JCIFwXHRsxyOVrwrIIjf8NLJPaSuMTzcSswY&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-pf-7",
          name: "Arabian Ranch",
          price: 990,
          discountPrice: 450,
          desc: "Premium flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Su7sLwgU8V1JPaFYHo38wHGGKH5oG4jQUD-EGh0T6ANsxUe5ueUnek7s&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-pf-8",
          name: "Margaritha",
          price: 990,
          discountPrice: 450,
          desc: "Premium flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcXBHXYTwnhMHWgjVI2Ke0ob_aRI-yH55TcCMI-j2cXA&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        }
      ]
    },
    {
      name: "Classic Flavors",
      items: [
        {
          id: "sw-cf-1",
          name: "Afghani Chicken",
          price: 990,
          discountPrice: 450,
          desc: "Classic flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqOhJqJGWgwfO7hNOVFKSGfPbV2OIt30WX55oY5jfE-LqeWQxWwSjshTvU&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-cf-2",
          name: "Chicken Tikka",
          price: 990,
          discountPrice: 450,
          desc: "Classic flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOwjDBS0gMStSOHINwQJ-nJSWrNIEHVQT29FfS3gQ8MyRYnEAwVlsBgPYF&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-cf-3",
          name: "Chicken Fajita",
          price: 990,
          discountPrice: 450,
          desc: "Classic flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTlxoVhCapjZVCtENhUFc_0MSQ4WNnnuaO3eZA-Gim1g&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-cf-4",
          name: "Veggie Lover",
          price: 990,
          discountPrice: 450,
          desc: "Classic flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB69-YhNYbCYw0R8dwMD2nxDWMvnDKTZguDokkJRWZeA&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-cf-5",
          name: "Sicilian Chicken",
          price: 990,
          discountPrice: 450,
          desc: "Classic flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGOb3mYFf2Qwd62zCqZB_g9VqKaGxLnBVjlYIT0BcdOwo2nHFIiui7EEs&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-cf-6",
          name: "SkyWay Creamy",
          price: 990,
          discountPrice: 450,
          desc: "Classic flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6eKOTKMH4pPNVBxNifgISa-LzR6ExUCdlZZ2sz5gqKXg8H7lT6RmbkTBs&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        },
        {
          id: "sw-cf-7",
          name: "Creamy Tikka",
          price: 990,
          discountPrice: 450,
          desc: "Classic flavor",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVv3neZUHx15wNIlwx9VsP0hqbWnVbEKfMQHjgDMeXFQ&s=10",
          variants: [
            { name: "Small", price: 990, discountPrice: 450 },
            { name: "Regular", price: 1550, discountPrice: 900 },
            { name: "Large", price: 2890, discountPrice: 1500 },
            { name: "Extra Large", price: 3790, discountPrice: 2500 },
            { name: 'Mighty Jumbo 21"', price: 4650, discountPrice: 3600 }
          ]
        }
      ]
    },
    {
      name: "Burgers",
      items: [
        { id: "sw-bg-1", name: "Zinger Burger", price: 550, discountPrice: 500, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVaMWTrMemdTXu0RoLi402Cxn0c11Eu1iWTbhsbvCS3Q&s=10", variants: [] },
        { id: "sw-bg-2", name: "Zinger Burger with Cheese", price: 605, discountPrice: 550, desc: "", image: "https://efscafechapter2.businesswala.pk/assets/uploads/1609_13b7a58cbbda02a7ba875bf764322efe.png", variants: [] },
        { id: "sw-bg-3", name: "Chicken Burger", price: 440, discountPrice: 400, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKdCNYo0jMWeA40ghBbkdCwEpgUfLNeS6O8zhKuE48HQ&s=10", variants: [] },
        { id: "sw-bg-4", name: "Chicken Burger with Cheese", price: 495, discountPrice: 450, desc: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNAijWuAYYehWp_ciwfYylM0TGFwQ9WHiNBE9J5Cf8ZYpfYPX7JXzcCuW0&s=10", variants: [] }
      ]
    },
    {
      name: "Appetizers",
      items: [
        // { id: "sw-ap-1", name: "Garlic Bread 4 Pcs", price: 300, desc: "", image: "", variants: [] },
        // { id: "sw-ap-2", name: "Garlic Bread with Cheese", price: 500, desc: "", image: "", variants: [] },
        // { id: "sw-ap-3", name: "Cheese Sticks", price: 650, desc: "", image: "", variants: [] },
        // { id: "sw-ap-4", name: "Mozzarella Sticks (6 Pcs)", price: 900, desc: "", image: "", variants: [] }, // CONFIRM: hard to read clearly, could be 650
        {
          id: "sw-ap-5",
          name: "French Fries",
          price: 250,
          desc: "",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQASPgs_Be-GT3FnZRRuafAT-BhDF3DGCbaaqEHwadLm7tYTSxSXCpsPuk&s=10",
          variants: [
            { name: "Small", price: 250 },
            { name: "Large", price: 450 }
          ]
        },
        {
          id: "sw-ap-6",
          name: "Chicken Wings",
          price: 450,
          desc: "",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTakYc2vh81Rw6TrmNzYnYDnq-8D82Caj1S34LjlkpdFzH6wRRaggSD51Bf&s=10",
          variants: [
            { name: "6 Pcs", price: 450 },
            { name: "12 Pcs", price: 900 } // CONFIRM: could be 850
          ]
        },
        // { id: "sw-ap-7", name: "Nuggets (10 Pcs)", price: 800, desc: "", image: "", variants: [] }, // CONFIRM: partly obscured in photo
        // { id: "sw-ap-8", name: "Pizza Fries", price: 650, desc: "", image: "", variants: [] }
      ]
    },
    // {
    //   name: "Sandwiches",
    //   items: [
    //     { id: "sw-sw-1", name: "Chicken Sandwich", price: 400, desc: "", image: "", variants: [] },
    //     { id: "sw-sw-2", name: "Chicken Club Sandwich", price: 400, desc: "", image: "", variants: [] }, // CONFIRM: could be 350
    //     { id: "sw-sw-3", name: "Sticko Chicken Sandwich", price: 550, desc: "", image: "", variants: [] }
    //   ]
    // },
    {
      name: "Pasta",
      items: [
        {
          id: "sw-ps-1",
          name: "Chicken Lasagne",
          price: 450,
          desc: "",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUS8q5zWuij9scoFgoiy_r_ZRDOuD8oYhXxupWWNpetJxKO7_QjdSunAg&s=10",
          variants: [
            { name: "Small", price: 450 },
            { name: "Large", price: 750 }
          ]
        },
        {
          id: "sw-ps-2",
          name: "Chicken Pasta",
          price: 400,
          desc: "",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUfjulqU2Rd__vg0c1n0NG-OVPJropzB2x35QV2XTFfL1vSOSv7BdVHFS8&s=10",
          variants: [
            { name: "Small", price: 400 }, // CONFIRM: could be 350
            { name: "Large", price: 700 }  // CONFIRM: could be 650
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