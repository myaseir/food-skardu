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
    },
    {
      name: "Donuts",
      items: [
        {
          id: "dn-1",
          name: "Classic Donut",
          price: 40,
          desc: "Soft, fluffy glazed donut, a simple everyday favorite.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREd4GGHcxc0tM5EWrSa8xxWrXD3vKEgJYXGOA0J3zjMViWOb6JeZ42P_8&s=10",
          variants: []
        },
        {
          id: "dn-2",
          name: "Strawberry Donut",
          price: 70,
          desc: "Classic donut topped with sweet strawberry glaze.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCguezfb--Z6DfxhEFejjdKgfVg13qqF7ovdDU3mN8WnW6mMe8h78ErCk&s=10",
          variants: []
        },
        {
          id: "dn-3",
          name: "Chocolate Donut",
          price: 70,
          desc: "Classic donut coated in rich chocolate glaze.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpb-2TBMRxUby6k395XC4sgg5Ll3euLw7Ku398KFnXVk5tbzvT9V-i5EGU&s=10",
          variants: []
        }
      ]
    },
    {
      name: "Balti Azoq",
      items: [
        {
          id: "ba-1",
          name: "Balti Azoq",
          price: 60,
          desc: "Balti Traditional Bread.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT80ht6QWTMnX_P0XpImdvdWTynhEiUMz01CaS2AUjtDwMrkyWY4fPgm6w&s=10",
          variants: [
            { name: "1 Piece", price: 60 },
            { name: "6 Pieces", price: 350 },
            { name: "12 Pieces", price: 650 }
          ]
        },
        {
          id: "ba-2",
          name: "Balti Kulcha Meetha",
          price: 240,
          desc: "Sweet Balti kulcha, traditional and freshly baked.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx1M-3Vkx-c8ZLAPtiMqomEmpTYznwR7uEN-JI-J8-oXkuPVIrf6i8h20&s=10",
          variants: [
            { name: "12 Pieces", price: 240 }
          ]
        },
        {
          id: "ba-3",
          name: "Balti Kulcha Namkeen",
          price: 420,
          desc: "Savory Balti kulcha, traditional and freshly baked.",
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYnIcXym96fOv95U6pFZoQEHT8sVQaddTRyBY35PAeWlnr5l1YgYAYN-Qo&s=10",
          variants: [
            { name: "12 Pieces", price: 420 }
          ]
        }
      ]
    }
  ]
};