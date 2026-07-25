export const menu = {
  shopId: "balti-cuisine-skardu",
  name: "Balti Cuisine Skardu",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4MHJr5IIt6j7rWP1jwfUl8C1isf5e5AciPwkmMyAe0Q&s",
  categories: [
    // ---------- MAIN COURSE ----------
    {
      name: "Main Course",
      items: [
        { id: "bc-mc-1", name: "Mamtu", price: 2000, desc: "10 traditional dumplings with chicken and local herb fillings", image: "", variants: [] },
        { id: "bc-mc-2", name: "Marzan", price: 2000, desc: "Plate of cooked buckwheat served with local butter/Apricot Oil", image: "", variants: [] },
        { id: "bc-mc-3", name: "Prapu", price: 3000, desc: "Plate of cubes of cooked wheat served with Moskot sauce", image: "", variants: [] },
        { id: "bc-mc-4", name: "Rsaqhboor", price: 2000, desc: "3 Barley sprout breads with Apricot Oil/Walnut oil/Milk", image: "", variants: [] },
        {
          id: "bc-mc-5",
          name: "Tras Balay",
          desc: "Bowl of Handmade Noodles in soup with local herbs and Chicken/Beef",
          image: "",
          variants: [
            { name: "Chicken", price: 2800 },
            { name: "Beef", price: 3500 }
          ]
        },
        { id: "bc-mc-6", name: "Rdung Balay", price: 3000, desc: "Traditional Barley Soup with chicken and peas", image: "", variants: [] },
        { id: "bc-mc-7", name: "Moscot Chicken", price: 3000, desc: "Plate of chicken curry made with Moscot (nuts paste) in balti style", image: "", variants: [] }
      ]
    },

    // ---------- DRINKS ----------
    {
      name: "Drinks",
      items: [
        { id: "bc-dr-1", name: "Pharring Chhoo", price: 500, desc: "Glass of apricot juice made with dried natural apricots", image: "", variants: [] },
        { id: "bc-dr-2", name: "Payu Cha", price: 300, desc: "Cup of Salted Pink Tea made with local butter, salt and milk", image: "", variants: [] },
        { id: "bc-dr-3", name: "Tumburu Cha", price: 150, desc: "Cup of tea made with wild tumburu", image: "", variants: [] }
      ]
    },

    // ---------- SPECIAL MENU ----------
    {
      name: "Special Menu",
      items: [
        {
          id: "bc-sp-1",
          name: "Beef Shakoo",
          price: 0, // TODO: price not visible on menu photo — please confirm
          desc: "Beef broth cooked with mountain herbs (1 Kg)",
          image: "",
          variants: []
        },
        {
          id: "bc-sp-2",
          name: "Mutton Shakoo",
          price: 0, // TODO: price not visible on menu photo — please confirm
          desc: "Mutton broth cooked with mountain herbs (1 Kg)",
          image: "",
          variants: []
        },
        {
          id: "bc-sp-3",
          name: "Desi Niya/Trout",
          desc: "Plate of local Fried Fish or Rainbow Trout served with homemade sauce",
          image: "",
          variants: [
            { name: "Desi Niya", price: 3500 },
            { name: "Rainbow Trout", price: 5000 }
          ]
        },
        { id: "bc-sp-4", name: "Balti Dum Pukat", price: 2500, desc: "Plate of Chicken & Vegetable pulao cooked in pressure cooker, served with raita", image: "", variants: [] }
      ]
    },

    // ---------- SIDES ----------
    {
      name: "Sides",
      items: [
        { id: "bc-sd-1", name: "Starmay Krisit", price: 750, desc: "Buckwheat pancakes served with herbal sauce", image: "", variants: [] },
        { id: "bc-sd-2", name: "Kolaq", price: 1500, desc: "Soft cooked barley in local tea with apricot and walnut oil", image: "", variants: [] },
        { id: "bc-sd-3", name: "Pharring Bhalay", price: 900, desc: "1 cup of apricot pure juice cooked in local style", image: "", variants: [] },
        { id: "bc-sd-4", name: "Kulcha", price: 500, desc: "Baked biscuits made with traditional eggs and milk", image: "", variants: [] },
        { id: "bc-sd-5", name: "Anday Kisir", price: 800, desc: "2 traditional egg pancakes served with a paste of honey and milk cream", image: "", variants: [] },
        {
          id: "bc-sd-6",
          name: "Brengas",
          price: 0, // TODO: price not visible on menu photo — please confirm
          desc: "Cake made with baked barley topped with local butter",
          image: "",
          variants: []
        }
      ]
    },

    // ---------- COMBO PLATTERS ----------
    {
      name: "Combo Platters",
      items: [
        {
          id: "bc-cp-1",
          name: "Balti Cuisine Special Platter",
          price: 7999,
          desc: "02 Rsaqhboor, 06 Mamtu, 01 Bowl Tras Balay, 01 Plate Prapu served with 02 Glass Pharring Chhoo, Green Chilli Sauce, Red Chilli Sauce and Apricot Oil",
          image: "",
          variants: []
        },
        {
          id: "bc-cp-2",
          name: "Balti Cuisine Small Platter",
          price: 6999,
          desc: "01 Marzan, 01 Prapu, 01 Starmay Kisir served with 02 Glass Pharring Chhoo, Green Chilli Sauce and Apricot Oil",
          image: "",
          variants: []
        }
      ]
    }
  ]
};