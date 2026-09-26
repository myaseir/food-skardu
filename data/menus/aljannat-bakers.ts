export const menu = {
  shopId: "aljannat-bakers",
  name: "Al Jannat Bakers and Sweets Skardu",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvy9ePYYMn2brEYQeP8lw4JhnuQOPILsfwoL-A3sHWx0jVnxlPyqbcamY&s=10",
  categories: [
    {
      name: "Cakes",
      items: [
        {
          id: "cc-1",
          name: "Cream Cake",
          price: 600,
          desc: "Soft, fluffy sponge layered with rich cream — a classic favorite.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtdIxrI5DUEDuN7_g_HWEmU6JJdxev5UclNdEJWCTgSg&s=10",
          variants: [
            { name: "1 Pound", price: 600 },
            { name: "2 Pound", price: 1100 }
          ],
          customizations: [
            {
              id: "cake-message",
              label: "Message on Cake (optional)",
              type: "text",
              maxLength: 30,
              placeholder: "e.g. Happy Birthday Ali"
            }
          ]
        },
        {
          id: "chc-1",
          name: "Chocolate Cake",
          price: 650,
          desc: "Moist chocolate sponge with smooth chocolate frosting.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA5Gv2VvmtyD_GdtR6dj2NZLKjYIWNdZPUMih_2-ptYw&s=10",
          variants: [
            { name: "1 Pound", price: 650 },
            { name: "2 Pound", price: 1200 }
          ],
          customizations: [
            {
              id: "cake-message",
              label: "Message on Cake (optional)",
              type: "text",
              maxLength: 30,
              placeholder: "e.g. Happy Birthday Ali"
            }
          ]
        }
      ]
    },
    {
      name: "Pastries",
      items: [
        {
          id: "pst-1",
          name: "Chocolate Pastry",
          price: 100,
          desc: "A single-serve chocolate pastry, rich and indulgent.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwzubLMpfWscJhvFocyGcEkcjEpd1UxLgl1lpwXSLfZPdNiz-SQAeDXMo&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Dry Cakes",
      items: [
        {
          id: "dc-1",
          name: "Dry Cake",
          price: 450,
          desc: "Classic plain dry cake, light and simple.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrkpXL58M9l1hN-qBoqU2wvyFAwSQ-7e6XegniMnA0pt7bPXU4FteBhgp-&s=10",
          variants: [
            { name: "1 Pound", price: 450 },
            { name: "2 Pound", price: 650 }
          ]
        }
      ]
    }
  ]
};