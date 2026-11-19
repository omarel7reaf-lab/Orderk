import { MenuItem, Order, KDSTicket, TableItem } from '../types/pos';

export const MENU_ITEMS: MenuItem[] = [
  // --- Steaks & Mains ---
  {
    id: 'm1',
    name: 'Prime Ribeye 12oz',
    description: 'USDA Prime aged 28 days, wood-fired with garlic herb butter & roasted shallots',
    price: 52.00,
    category: 'Steaks & Mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Chef Special', type: 'special' },
    margin: '72%',
    soldTonight: 38,
    revenueTonight: 1976
  },
  {
    id: 'm2',
    name: 'Filet Mignon 8oz',
    description: 'Center-cut tenderloin, shallot thyme reduction, truffled potato puree',
    price: 58.00,
    category: 'Steaks & Mains',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    tag: { label: '6 Left', type: 'warning' },
    margin: '68%',
    soldTonight: 18,
    revenueTonight: 1044
  },
  {
    id: 'm13',
    name: 'Dry-Aged Tomahawk 34oz',
    description: '45-day dry-aged bone-in tomahawk, roasted marrow, chimichurri, feeds 2-3',
    price: 135.00,
    category: 'Steaks & Mains',
    image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Chef Special', type: 'special' },
    margin: '75%',
    soldTonight: 7,
    revenueTonight: 945
  },
  {
    id: 'm14',
    name: 'New York Strip 14oz',
    description: 'USDA Prime strip, green peppercorn cognac sauce, grilled asparagus',
    price: 49.00,
    category: 'Steaks & Mains',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop&q=80',
    margin: '71%',
    soldTonight: 21,
    revenueTonight: 1029
  },
  {
    id: 'm6',
    name: 'Pan-Roasted Duck Breast',
    description: 'Maple Leaf Farms duck breast, sour cherry jus, parsnip puree, glazed figs',
    price: 36.00,
    category: 'Steaks & Mains',
    image: 'https://images.unsplash.com/photo-1514944298352-d4a34b2fefd7?w=600&auto=format&fit=crop&q=80',
    margin: '74%',
    soldTonight: 16,
    revenueTonight: 576
  },

  {
    id: 'm15',
    name: '12-Hour Braised Short Ribs',
    description: 'Slow-cooked in Barolo red wine, creamy polenta, gremolata, crispy leeks',
    price: 39.00,
    category: 'Steaks & Mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Popular', type: 'popular' },
    margin: '76%',
    soldTonight: 27,
    revenueTonight: 1053
  },
  {
    id: 'm16',
    name: 'Japanese A5 Wagyu Striploin 6oz',
    description: 'Miyazaki Prefecture certified A5, smoked volcanic salt, fresh wasabi demiglace',
    price: 120.00,
    category: 'Steaks & Mains',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Chef Special', type: 'special' },
    margin: '65%',
    soldTonight: 9,
    revenueTonight: 1080
  },

  // --- Starters ---

  {
    id: 'm11',
    name: 'Burrata & Heirloom Tartare',
    description: 'Pugliese burrata, heirloom cherry tomatoes, cold-pressed basil oil, grilled sourdough',
    price: 22.00,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Vegetarian', type: 'vegetarian' },
    margin: '79%',
    soldTonight: 28,
    revenueTonight: 616
  },
  {
    id: 'm17',
    name: 'Wagyu Beef Carpaccio',
    description: 'Thinly sliced wagyu tenderloin, white truffle oil, fried capers, 24m parmigiano',
    price: 24.00,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    margin: '73%',
    soldTonight: 22,
    revenueTonight: 528
  },
  {
    id: 'm18',
    name: 'French Onion Soup Gratinée',
    description: 'Caramelized sweet onions, rich beef broth, melted Gruyère & aged fontina crust',
    price: 16.00,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    margin: '82%',
    soldTonight: 18,
    revenueTonight: 288
  },
  {
    id: 'm19',
    name: 'Ahi Tuna Tartare',
    description: 'Sashimi-grade yellowfin tuna, diced Hass avocado, ginger ponzu, sesame crisps',
    price: 23.00,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Fresh Catch', type: 'fresh' },
    margin: '75%',
    soldTonight: 25,
    revenueTonight: 575
  },
  {
    id: 'm20',
    name: 'Truffle Mushroom Arancini',
    description: 'Crispy saffron risotto balls, mozzarella di bufala core, black garlic truffle dip',
    price: 17.00,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Vegetarian', type: 'vegetarian' },
    margin: '80%',
    soldTonight: 33,
    revenueTonight: 561
  },
  {
    id: 'm21',
    name: 'Classic Caesar Cardini',
    description: 'Crisp baby romaine, shaved pecorino romano, garlic brioche croutons, anchovy emulsion',
    price: 16.00,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80',
    margin: '85%',
    soldTonight: 41,
    revenueTonight: 656
  },

  // --- Pasta & Risotto ---
  {
    id: 'm4',
    name: 'Truffle Tagliolini',
    description: 'Fresh hand-rolled pasta, Norcia black truffles, French butter, aged parmigiano',
    price: 26.00,
    category: 'Pasta & Risotto',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Vegetarian', type: 'vegetarian' },
    margin: '81%',
    soldTonight: 46,
    revenueTonight: 1196
  },
  {
    id: 'm7',
    name: 'Wild Mushroom Risotto',
    description: 'Acquerello carnaroli rice, porcini & morel forest mushrooms, fresh thyme, mascarpone',
    price: 24.00,
    category: 'Pasta & Risotto',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Vegetarian', type: 'vegetarian' },
    margin: '84%',
    soldTonight: 25,
    revenueTonight: 600
  },
  {
    id: 'm22',
    name: 'Maine Lobster Ravioli',
    description: 'Handmade pasta pillows stuffed with sweet Maine lobster, saffron bisque, tarragon oil',
    price: 34.00,
    category: 'Pasta & Risotto',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Chef Special', type: 'special' },
    margin: '73%',
    soldTonight: 30,
    revenueTonight: 1020
  },
  {
    id: 'm23',
    name: 'Pappardelle al Cinghiale',
    description: 'Wide ribbon pasta, slow-braised wild boar ragu, crushed juniper berries, pecorino',
    price: 28.00,
    category: 'Pasta & Risotto',
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&auto=format&fit=crop&q=80',
    margin: '78%',
    soldTonight: 18,
    revenueTonight: 504
  },
  {
    id: 'm24',
    name: 'Spaghetti alle Vongole',
    description: 'Artisanal spaghetti, Manila clams, Pinot Grigio white wine, garlic, red pepper chili flakes',
    price: 29.00,
    category: 'Pasta & Risotto',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Fresh Catch', type: 'fresh' },
    margin: '76%',
    soldTonight: 21,
    revenueTonight: 609
  },
  {
    id: 'm25',
    name: 'Gnocchi al Gorgonzola Dolce',
    description: 'Pillow-soft handmade potato gnocchi, velvety gorgonzola cream, candied walnuts, sage',
    price: 23.00,
    category: 'Pasta & Risotto',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Vegetarian', type: 'vegetarian' },
    margin: '82%',
    soldTonight: 19,
    revenueTonight: 437
  },

  // --- Seafood ---
  {
    id: 'm5',
    name: 'Chilean Sea Bass',
    description: 'Miso-glazed sustainable sea bass, baby bok choy, shiitake dashi broth, ginger crisps',
    price: 44.00,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Fresh Catch', type: 'fresh' },
    margin: '70%',
    soldTonight: 22,
    revenueTonight: 968
  },
  {
    id: 'm26',
    name: 'Pan-Seared Hokkaido Scallops',
    description: 'Diver scallops, velvety cauliflower puree, crispy pancetta lardons, brown butter foam',
    price: 38.00,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Popular', type: 'popular' },
    margin: '71%',
    soldTonight: 26,
    revenueTonight: 988
  },
  {
    id: 'm27',
    name: 'Grilled Atlantic Salmon',
    description: 'Loch Duart salmon, crispy skin, grilled jumbo asparagus, citrus herb emulsion',
    price: 32.00,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
    margin: '77%',
    soldTonight: 34,
    revenueTonight: 1088
  },
  {
    id: 'm28',
    name: 'Mediterranean Charred Octopus',
    description: 'Spanish octopus tentacle, smoked paprika oil, romesco sauce, roasted marble potatoes',
    price: 31.00,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Chef Special', type: 'special' },
    margin: '74%',
    soldTonight: 20,
    revenueTonight: 620
  },
  {
    id: 'm29',
    name: 'Whole Dover Sole Meunière',
    description: 'Pan-roasted European Dover sole, browned hazelnut butter, Sicilian capers, fresh lemon',
    price: 56.00,
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    margin: '69%',
    soldTonight: 12,
    revenueTonight: 672
  },

  // --- Casual & Burgers ---
  {
    id: 'm3',
    name: 'Wagyu Burger & Fries',
    description: 'Dry-aged wagyu, aged gouda, black garlic aioli, caramelized onion, brioche bun',
    price: 26.00,
    category: 'Casual & Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Popular', type: 'popular' },
    margin: '78%',
    soldTonight: 42,
    revenueTonight: 1092
  },
  {
    id: 'm30',
    name: 'Truffle & Brie Smash Burger',
    description: 'Double wagyu smashed patties, French brie, black truffle aioli, arugula, toasted potato roll',
    price: 24.00,
    category: 'Casual & Burgers',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    margin: '79%',
    soldTonight: 36,
    revenueTonight: 864
  },
  {
    id: 'm31',
    name: 'Crispy Buttermilk Chicken Brioche',
    description: 'Free-range chicken breast, spicy hot honey glaze, dill pickles, purple cabbage slaw',
    price: 21.00,
    category: 'Casual & Burgers',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    margin: '81%',
    soldTonight: 29,
    revenueTonight: 609
  },
  {
    id: 'm32',
    name: 'Maine Lobster Roll',
    description: 'Chilled knuckle & claw Maine lobster meat, warm brown butter, chives, split-top brioche',
    price: 32.00,
    category: 'Casual & Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Popular', type: 'popular' },
    margin: '72%',
    soldTonight: 24,
    revenueTonight: 768
  },

  // --- Bar & Cocktails ---
  {
    id: 'm10',
    name: 'Smoked Old Fashioned',
    description: 'Bourbon whiskey, hickory wood smoke, demerara sugar, angostura bitters, orange peel',
    price: 16.00,
    category: 'Bar & Cocktails',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Popular', type: 'popular' },
    margin: '86%',
    soldTonight: 64,
    revenueTonight: 1024
  },
  {
    id: 'm33',
    name: 'Midnight Espresso Martini',
    description: 'Ketel One vodka, fresh pulled espresso shot, Kahlúa liqueur, vanilla syrup, espresso beans',
    price: 17.00,
    category: 'Bar & Cocktails',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    margin: '88%',
    soldTonight: 52,
    revenueTonight: 884
  },
  {
    id: 'm34',
    name: 'French 75 Reserve',
    description: 'Botanist gin, fresh lemon juice, simple syrup, topped with Veuve Clicquot champagne',
    price: 18.00,
    category: 'Bar & Cocktails',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80',
    margin: '85%',
    soldTonight: 31,
    revenueTonight: 558
  },
  {
    id: 'bev-1',
    name: 'San Pellegrino 750ml',
    description: 'Italian sparkling mineral water, chilled bottle served with lime wedge',
    price: 8.00,
    category: 'Bar & Cocktails',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80',
    margin: '90%',
    soldTonight: 58,
    revenueTonight: 464
  },

  // --- Desserts ---
  {
    id: 'm12',
    name: 'Tiramisù Tradizionale',
    description: 'Espresso-soaked savoiardi ladyfingers, velvety mascarpone cream, Valrhona dark cocoa',
    price: 14.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
    margin: '88%',
    soldTonight: 34,
    revenueTonight: 476
  },
  {
    id: 'm35',
    name: 'Madagascar Vanilla Gelato',
    description: 'Artisanal double scoop gelato, bourbon vanilla bean specks, pizzelle wafer crisp',
    price: 12.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&auto=format&fit=crop&q=80',
    margin: '87%',
    soldTonight: 28,
    revenueTonight: 336
  },
  {
    id: 'm36',
    name: 'Valrhona Chocolate Fondant',
    description: 'Warm molten chocolate cake, dark chocolate lava center, pistachio crumb, vanilla bean gelato',
    price: 15.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Chef Special', type: 'special' },
    margin: '84%',
    soldTonight: 39,
    revenueTonight: 585
  },
  {
    id: 'm37',
    name: 'Basque Burnt Cheesecake',
    description: 'Caramelized rustic crust, ultra-creamy custard interior, wild blackberry compote',
    price: 14.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
    tag: { label: 'Popular', type: 'popular' },
    margin: '85%',
    soldTonight: 26,
    revenueTonight: 364
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1048',
    ticketNumber: '#ORD-1048',
    orderType: 'dine-in',
    tableId: 't-07',
    tableLabel: 'Table 7 (T-07)',
    guestCount: 4,
    server: 'Marcus Cole #04',
    status: 'prep',
    createdAt: '18:42:12',
    elapsedMinutes: 8,
    targetMinutes: 14,
    station: 'Grill & Sauté (Chef Antonio)',
    items: [
      {
        id: 'ci-1',
        menuItemId: 'm1',
        name: 'Prime Ribeye 12oz',
        unitPrice: 52.00,
        quantity: 2,
        modifiers: ['1× Medium-Rare • Peppercorn Sauce', '1× Medium • Chimichurri Sauce'],
        note: 'Guest allergic to rosemary'
      },
      {
        id: 'ci-2',
        menuItemId: 'm4',
        name: 'Truffle Tagliolini',
        unitPrice: 26.00,
        quantity: 1,
        modifiers: ['+ Extra Shaved Norcia Truffle (+$6.00)']
      },
      {
        id: 'ci-3',
        menuItemId: 'm10',
        name: 'Smoked Old Fashioned',
        unitPrice: 16.00,
        quantity: 2,
        modifiers: ['Bar Direct • $16.00 ea']
      },
      {
        id: 'ci-4',
        menuItemId: 'bev-1',
        name: 'San Pellegrino 750ml',
        unitPrice: 8.00,
        quantity: 1,
        modifiers: ['Chilled, Lime Wedge']
      }
    ],
    subtotal: 176.00,
    tax: 15.62,
    gratuity: 31.68,
    total: 223.30
  },
  {
    id: 'ord-1046',
    ticketNumber: '#ORD-1046',
    orderType: 'dine-in',
    tableId: 't-12',
    tableLabel: 'Table 12',
    guestCount: 6,
    server: 'Sarah L.',
    status: 'prep',
    createdAt: '18:24:00',
    elapsedMinutes: 18,
    targetMinutes: 14,
    station: 'Hold at Fish Station • Halibut delay reported',
    isDelayed: true,
    items: [
      {
        id: 'ci-5',
        menuItemId: 'm1',
        name: 'Bone-in Ribeye 16oz',
        unitPrice: 64.00,
        quantity: 2,
        modifiers: ['Medium Rare, No Butter']
      },
      {
        id: 'ci-6',
        menuItemId: 'm5',
        name: 'Chilean Sea Bass',
        unitPrice: 44.00,
        quantity: 2,
        modifiers: ['Extra Crispy Skin']
      },
      {
        id: 'ci-7',
        menuItemId: 'm7',
        name: 'Wild Mushroom Risotto',
        unitPrice: 24.00,
        quantity: 2,
        modifiers: ['Allergy: Garlic Sensitivity']
      }
    ],
    subtotal: 246.00,
    tax: 21.50,
    gratuity: 16.50,
    total: 284.00
  },
  {
    id: 'ord-1051',
    ticketNumber: '#ORD-1051',
    orderType: 'dine-in',
    tableId: 't-04',
    tableLabel: 'Table 4 (VIP)',
    guestCount: 4,
    server: 'Liam R.',
    status: 'new',
    createdAt: '18:40:00',
    elapsedMinutes: 2,
    targetMinutes: 15,
    station: 'Cold Larder & Entree Lines',
    items: [
      {
        id: 'ci-8',
        menuItemId: 'm11',
        name: 'Burrata & Heirloom Tartare',
        unitPrice: 22.00,
        quantity: 2,
        modifiers: ['Cold Larder • APP']
      },
      {
        id: 'ci-9',
        menuItemId: 'm6',
        name: 'Pan-Seared Scallops & Duck Breast',
        unitPrice: 52.00,
        quantity: 2,
        modifiers: ['Micro Herb Garnish']
      }
    ],
    subtotal: 132.00,
    tax: 11.55,
    gratuity: 4.45,
    total: 148.00
  },
  {
    id: 'ord-1052',
    ticketNumber: '#ORD-1052',
    orderType: 'takeout',
    customerName: 'Liam S.',
    server: 'Counter / Takeout',
    status: 'new',
    createdAt: '18:38:00',
    elapsedMinutes: 4,
    targetMinutes: 12,
    station: 'Bag #T-44',
    items: [
      {
        id: 'ci-10',
        menuItemId: 'm3',
        name: 'Truffle Wagyu Burger + Sweet Fries',
        unitPrice: 38.00,
        quantity: 1,
        modifiers: ['Paid Online (Stripe)']
      }
    ],
    subtotal: 38.00,
    tax: 3.32,
    gratuity: 1.18,
    total: 42.50
  },
  {
    id: 'ord-1053',
    ticketNumber: '#ORD-1053',
    orderType: 'dine-in',
    tableId: 't-11',
    tableLabel: 'Table 11',
    guestCount: 2,
    server: 'Chloe P.',
    status: 'new',
    createdAt: '18:41:45',
    elapsedMinutes: 1,
    targetMinutes: 15,
    station: 'Pending Acceptance',
    items: [
      {
        id: 'ci-11',
        menuItemId: 'm4',
        name: 'Truffle Tagliolini & House Salad',
        unitPrice: 32.00,
        quantity: 2,
        modifiers: ['Dressings on side']
      }
    ],
    subtotal: 60.00,
    tax: 5.25,
    gratuity: 2.75,
    total: 68.00
  },
  {
    id: 'ord-1049',
    ticketNumber: '#ORD-1049',
    orderType: 'dine-in',
    tableId: 't-02',
    tableLabel: 'Table 2',
    guestCount: 2,
    server: 'Liam R.',
    status: 'prep',
    createdAt: '18:38:10',
    elapsedMinutes: 4,
    targetMinutes: 14,
    station: 'Cold Line',
    items: [
      {
        id: 'ci-12',
        menuItemId: 'm7',
        name: 'Salads & Flatbread',
        unitPrice: 24.00,
        quantity: 2,
        modifiers: []
      }
    ],
    subtotal: 48.00,
    tax: 4.20,
    gratuity: 1.80,
    total: 54.00
  }
];

export const INITIAL_KDS_TICKETS: KDSTicket[] = [
  {
    id: 'kds-1046',
    orderNumber: '#1046',
    tableOrType: 'T-12 (6 Guests) • Sarah L.',
    timeString: '18:45',
    elapsedSeconds: 1125,
    targetMinutes: 14,
    statusBadge: 'LATE +4M',
    headerColor: '#ef4444',
    isRush: true,
    items: [
      {
        id: 'ki-1',
        name: 'Bone-in Ribeye 16oz',
        quantity: 2,
        station: 'Grill • Fired 14m ago',
        mods: ['MOD: Medium Rare, No Butter'],
        completed: false
      },
      {
        id: 'ki-2',
        name: 'Chilean Sea Bass',
        quantity: 1,
        station: 'Sauté Pass',
        mods: ['MOD: Extra Crispy Skin'],
        completed: false
      },
      {
        id: 'ki-3',
        name: 'Truffle Tagliolini',
        quantity: 2,
        station: 'Plated @ Pass',
        mods: ['PREPARED (Plated @ Pass)'],
        completed: true
      },
      {
        id: 'ki-4',
        name: 'Wild Mushroom Risotto',
        quantity: 1,
        station: 'Sauté Station',
        allergy: 'ALLERGY: GARLIC SENSITIVITY',
        completed: false
      }
    ]
  },
  {
    id: 'kds-1048',
    orderNumber: '#1048',
    tableOrType: 'T-7 (4 Guests) • Marcus C.',
    timeString: '08:30',
    elapsedSeconds: 510,
    targetMinutes: 14,
    statusBadge: 'GRILL IN PROGRESS',
    headerColor: '#10b981',
    items: [
      {
        id: 'ki-5',
        name: 'Calamari Fritti',
        quantity: 1,
        station: 'Appetizer • Served',
        completed: true
      },
      {
        id: 'ki-6',
        name: 'Prime Ribeye 12oz',
        quantity: 2,
        station: 'Grill • 4m left',
        mods: ['1x Med-Rare, 1x Med'],
        completed: false
      },
      {
        id: 'ki-7',
        name: 'Truffle Pasta',
        quantity: 1,
        station: 'Sauté',
        mods: ['Note: Table requesting all entrees served together'],
        completed: false
      }
    ]
  },
  {
    id: 'kds-1051',
    orderNumber: '#1051',
    tableOrType: 'T-4 (2 Guests) • Marcus C.',
    timeString: '02:15',
    elapsedSeconds: 135,
    targetMinutes: 15,
    statusBadge: 'NEW ORDER',
    headerColor: '#ff8a7a',
    items: [
      {
        id: 'ki-8',
        name: 'Burrata & Heirloom Tartare',
        quantity: 2,
        station: 'Cold Larder • APP',
        completed: false
      },
      {
        id: 'ki-9',
        name: 'Pan-Seared Scallops',
        quantity: 1,
        station: 'Sauté • ENTREE',
        mods: ['MOD: Micro Herb Garnish'],
        completed: false
      },
      {
        id: 'ki-10',
        name: 'Duck Breast',
        quantity: 1,
        station: 'Grill • ENTREE',
        completed: false
      }
    ]
  },
  {
    id: 'kds-to89',
    orderNumber: '#TO-89',
    tableOrType: 'TAKEOUT • David R. • Call-In',
    timeString: '05:10',
    elapsedSeconds: 310,
    targetMinutes: 12,
    statusBadge: 'PICK 19:15',
    headerColor: '#f97316',
    items: [
      {
        id: 'ki-11',
        name: 'Wagyu Burgers',
        quantity: 2,
        station: 'Grill / Bun Station',
        mods: ['MOD: Both Well-Done, Extra Pickles'],
        completed: false
      },
      {
        id: 'ki-12',
        name: 'Truffle Fries',
        quantity: 2,
        station: 'Fryer • Separate Bag',
        completed: false
      },
      {
        id: 'ki-13',
        name: 'Caesar Salad',
        quantity: 1,
        station: 'Cold Larder • Dressing on Side',
        completed: false
      }
    ]
  },
  {
    id: 'kds-1042',
    orderNumber: '#1042',
    tableOrType: 'T-1 • Pastry Station',
    timeString: '03:40',
    elapsedSeconds: 220,
    targetMinutes: 10,
    statusBadge: 'DESSERT FIRE',
    headerColor: '#8b5cf6',
    items: [
      {
        id: 'ki-14',
        name: 'Tiramisù Tradizionale',
        quantity: 2,
        station: 'Pastry Bar',
        mods: ['MOD: Extra Cocoa Dust'],
        completed: false
      },
      {
        id: 'ki-15',
        name: 'Madagascar Gelato',
        quantity: 1,
        station: 'Pastry Bar • Double Scoop',
        mods: ['Serve with espresso spoon'],
        completed: false
      }
    ]
  }
];

export const INITIAL_TABLES: TableItem[] = [
  {
    id: 't-01',
    number: 'T-01',
    type: '4-Top',
    capacity: 4,
    room: 'main',
    status: 'bill-requested',
    guestCount: 3,
    server: 'Sarah L.',
    elapsedMinutes: 52,
    orderTotal: 142.00,
    specialNote: 'Bill requested'
  },
  {
    id: 't-02',
    number: 'T-02',
    type: '2P',
    capacity: 2,
    room: 'main',
    status: 'occupied',
    guestCount: 2,
    server: 'Liam R.',
    elapsedMinutes: 24,
    orderTotal: 54.00,
    specialNote: 'Mains Served'
  },
  {
    id: 't-03',
    number: 'T-03',
    type: 'READY',
    capacity: 2,
    room: 'main',
    status: 'available',
    specialNote: 'Available • 2 Seats • Walk-in Ready'
  },
  {
    id: 't-04',
    number: 'T-04',
    type: '6-Top',
    capacity: 6,
    room: 'main',
    status: 'held',
    guestCount: 5,
    server: 'David K.',
    elapsedMinutes: 12,
    orderTotal: 88.50,
    specialNote: '★ VIP GUEST • Cocktails Poured'
  },
  {
    id: 't-05',
    number: 'T-05',
    type: '4-Top',
    capacity: 4,
    room: 'main',
    status: 'reserved',
    server: 'Hold for Host',
    specialNote: 'Dr. Aris Thorne • 4 Guests VIP Member • Arriving in 18 min'
  },
  {
    id: 't-06',
    number: 'T-06',
    type: '4P',
    capacity: 4,
    room: 'main',
    status: 'occupied',
    guestCount: 4,
    server: 'Sarah L.',
    elapsedMinutes: 18,
    orderTotal: 76.00,
    specialNote: 'Party of 4 • Appetizers'
  },
  {
    id: 't-07',
    number: 'T-07',
    type: '4-Top',
    capacity: 4,
    room: 'main',
    status: 'selected',
    guestCount: 4,
    server: 'Marcus Cole #04',
    elapsedMinutes: 42,
    currentTicket: '#ORD-1048',
    orderTotal: 223.30,
    specialNote: 'Active Selection • Kitchen: Prep (8m)'
  },
  {
    id: 't-08',
    number: 'T-08',
    type: '8-Top',
    capacity: 8,
    room: 'main',
    status: 'cleaning',
    specialNote: 'Needs Turnover • Clean & Reset • Departed 8m ago'
  },
  {
    id: 't-09',
    number: 'T-09',
    type: 'Booth 4P',
    capacity: 4,
    room: 'main',
    status: 'occupied',
    guestCount: 3,
    server: 'Sarah L.',
    elapsedMinutes: 61,
    orderTotal: 168.00,
    specialNote: 'Party of 3 • Dessert & Coffee'
  },
  {
    id: 't-10',
    number: 'T-10',
    type: '2P',
    capacity: 2,
    room: 'main',
    status: 'occupied',
    guestCount: 2,
    server: 'Marcus C.',
    elapsedMinutes: 31,
    orderTotal: 92.20,
    specialNote: 'Party of 2 • Mains'
  },
  {
    id: 't-11',
    number: 'T-11',
    type: '2P',
    capacity: 2,
    room: 'main',
    status: 'occupied',
    guestCount: 2,
    server: 'David K.',
    elapsedMinutes: 15,
    orderTotal: 54.00,
    specialNote: 'Party of 2 • Drinks'
  },
  {
    id: 't-12',
    number: 'T-12',
    type: 'READY',
    capacity: 4,
    room: 'main',
    status: 'available',
    specialNote: 'Available • 4 Seats • Ready to Seat'
  },
  {
    id: 't-13',
    number: 'T-13',
    type: 'Booth 6P',
    capacity: 6,
    room: 'main',
    status: 'occupied',
    guestCount: 6,
    server: 'Marcus C.',
    elapsedMinutes: 40,
    orderTotal: 275.50,
    specialNote: 'Party of 6 • Mains'
  },
  {
    id: 't-14',
    number: 'T-14',
    type: '4P',
    capacity: 4,
    room: 'main',
    status: 'occupied',
    guestCount: 4,
    server: 'Sarah L.',
    elapsedMinutes: 22,
    orderTotal: 115.00,
    specialNote: 'Party of 4 • Appetizers'
  },
  {
    id: 't-15',
    number: 'T-15',
    type: '4P',
    capacity: 4,
    room: 'main',
    status: 'occupied',
    guestCount: 3,
    server: 'David K.',
    elapsedMinutes: 7,
    orderTotal: 32.00,
    specialNote: 'Party of 3 • Seated 7m'
  },
  {
    id: 't-16',
    number: 'T-16',
    type: '4P',
    capacity: 4,
    room: 'main',
    status: 'occupied',
    guestCount: 4,
    server: 'Marcus C.',
    elapsedMinutes: 38,
    orderTotal: 189.40,
    specialNote: 'Party of 4 • Entrees'
  }
];

export const STAFF_ASSIGNMENTS = [
  { name: 'Marcus C.', initials: 'MC', section: 'Section A (Main)', tables: 6, sales: 2410.00, status: 'active', avatarColor: 'bg-indigo-600' },
  { name: 'Sarah L.', initials: 'SL', section: 'Section B (Booth)', tables: 5, sales: 1980.50, status: 'active', avatarColor: 'bg-purple-600' },
  { name: 'David K.', initials: 'DK', section: 'Section C (Patio)', tables: 5, sales: 1630.00, status: 'active', avatarColor: 'bg-blue-600' },
  { name: 'Chef Antonio', initials: 'CA', section: 'Kitchen Lead / Expediter', outputRate: '11.4m Turn', status: 'expediter', avatarColor: 'bg-emerald-600' }
];

export const ACTIVITY_FEED = [
  {
    id: 'act-1',
    type: 'vip',
    time: '2 mins ago',
    title: 'Table 4: VIP Guest Seated',
    subtitle: 'Allergy Alert: Shellfish • Assigned Server: Marcus C.',
    icon: 'star',
    color: 'text-amber-400 bg-amber-500/10'
  },
  {
    id: 'act-2',
    type: 'inventory',
    time: '6 mins ago',
    badge: '86 Item',
    title: 'Kitchen Inventory Alert',
    subtitle: 'Prime Ribeye Steak low stock threshold reached: 4 portions remaining in walk-in.',
    icon: 'alert-triangle',
    color: 'text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'act-3',
    type: 'settled',
    time: '11 mins ago',
    title: 'Order #1042 Settled',
    subtitle: 'Table 8 • Payment of $184.20 closed via Contactless Visa (Tip: $35.00 / 19%).',
    icon: 'credit-card',
    color: 'text-blue-400 bg-blue-500/10'
  },
  {
    id: 'act-4',
    type: 'delay',
    time: '14 mins ago',
    tag: '22m Wait',
    title: 'Table 12: Ticket Delay Alert',
    subtitle: 'Main course surpassed 20m threshold. Expeditor notified. Lead server: Sarah L.',
    icon: 'clock',
    color: 'text-rose-400 bg-rose-500/10',
    hasPing: true
  }
];

