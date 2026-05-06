import { db, usersTable, sellersTable, productsTable, ordersTable, notificationsTable, walletsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding PaikarMart database...");

  // Users
  const users = [
    { id: "user-1", name: "Rahim Ahmed", phone: "01711234567", email: "rahim@example.com", role: "buyer" as const, district: "Dhaka", area: "Mirpur" },
    { id: "user-2", name: "Karim Seller", phone: "01812345678", email: "karim@example.com", role: "seller" as const, district: "Chittagong", area: "Agrabad" },
    { id: "admin-1", name: "Admin User", phone: "01900000001", email: "admin@paikarmart.com", role: "admin" as const, district: "Dhaka", area: "Gulshan" },
  ];

  for (const u of users) {
    try {
      await db.insert(usersTable).values(u).onConflictDoNothing();
    } catch (e) {
      // ignore
    }
  }

  // Sellers
  const sellers = [
    {
      id: "seller-1",
      shopName: "Dhaka Electronics Hub",
      businessType: "retailer" as const,
      status: "active" as const,
      phone: "01812345678",
      email: "electronics@hub.com",
      address: "Elephant Road, Dhaka",
      location: "Dhaka",
      district: "Dhaka",
      rating: 4.5,
      totalProducts: 45,
      totalSales: 125000,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      description: "Premium electronics retailer with genuine products",
      deliveryTypes: ["seller_delivery", "platform_delivery"],
      coverageAreas: ["Dhaka", "Narayanganj"],
    },
    {
      id: "seller-2",
      shopName: "BD Fashion House",
      businessType: "brand_seller" as const,
      status: "active" as const,
      phone: "01923456789",
      email: "fashion@bd.com",
      address: "Banani, Dhaka",
      location: "Dhaka",
      district: "Dhaka",
      rating: 4.8,
      totalProducts: 120,
      totalSales: 380000,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      description: "Authorized brand seller for premium fashion",
      deliveryTypes: ["platform_delivery"],
      coverageAreas: ["Dhaka", "Gazipur", "Narayanganj"],
    },
    {
      id: "seller-3",
      shopName: "Chittagong Wholesale Market",
      businessType: "wholesaler" as const,
      status: "active" as const,
      phone: "01834567890",
      email: "wholesale@ctg.com",
      address: "Agrabad, Chittagong",
      location: "Chittagong",
      district: "Chittagong",
      rating: 4.2,
      totalProducts: 200,
      totalSales: 850000,
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
      description: "Largest wholesale market in Chittagong",
      deliveryTypes: ["seller_delivery"],
      coverageAreas: ["Chittagong", "Cox's Bazar", "Sylhet"],
    },
    {
      id: "seller-4",
      shopName: "Local Grocery Corner",
      businessType: "local_shop" as const,
      status: "active" as const,
      phone: "01745678901",
      email: "grocery@local.com",
      address: "Mohammadpur, Dhaka",
      location: "Dhaka",
      district: "Dhaka",
      rating: 4.6,
      totalProducts: 300,
      totalSales: 95000,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
      description: "Fresh groceries with same-day delivery",
      deliveryTypes: ["local_delivery", "pickup"],
      coverageAreas: ["Mohammadpur", "Shyamoli", "Adabor"],
    },
    {
      id: "seller-5",
      shopName: "TechDrop Services",
      businessType: "dropship" as const,
      status: "pending" as const,
      phone: "01656789012",
      email: "techdrop@service.com",
      address: "Uttara, Dhaka",
      location: "Dhaka",
      district: "Dhaka",
      rating: 4.0,
      totalProducts: 80,
      totalSales: 45000,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
      description: "Dropshipping tech accessories",
      deliveryTypes: ["platform_delivery"],
      coverageAreas: ["Dhaka"],
    },
  ];

  for (const s of sellers) {
    try {
      await db.insert(sellersTable).values(s).onConflictDoNothing();
    } catch (e) {
      // ignore
    }
  }

  // Products
  const products = [
    // Electronics
    {
      id: "prod-1",
      name: "Samsung Galaxy A54 5G",
      category: "Electronics",
      subcategory: "Smartphones",
      type: "physical" as const,
      price: 32000,
      costPrice: 28000,
      stock: 15,
      description: "Latest Samsung Galaxy A54 5G with 50MP camera, 5000mAh battery and 8GB RAM.",
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400"],
      vendorId: "seller-1",
      vendorName: "Dhaka Electronics Hub",
      location: "Dhaka",
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      deliveryDays: "3-5 days",
    },
    {
      id: "prod-2",
      name: "Wireless Bluetooth Earbuds Pro",
      category: "Electronics",
      subcategory: "Audio",
      type: "physical" as const,
      price: 2500,
      costPrice: 1800,
      stock: 50,
      description: "Premium wireless earbuds with active noise cancellation and 30-hour battery life.",
      images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400"],
      vendorId: "seller-1",
      vendorName: "Dhaka Electronics Hub",
      location: "Dhaka",
      rating: 4.3,
      reviewCount: 75,
      inStock: true,
      deliveryDays: "2-4 days",
    },
    {
      id: "prod-3",
      name: "Dell Inspiron 15 Laptop",
      category: "Electronics",
      subcategory: "Laptops",
      type: "physical" as const,
      price: 65000,
      costPrice: 58000,
      stock: 8,
      description: "Dell Inspiron 15 with Intel Core i5, 8GB RAM, 512GB SSD. Perfect for work and study.",
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
      vendorId: "seller-1",
      vendorName: "Dhaka Electronics Hub",
      location: "Dhaka",
      rating: 4.6,
      reviewCount: 42,
      inStock: true,
      deliveryDays: "3-5 days",
    },
    // Fashion
    {
      id: "prod-4",
      name: "Premium Cotton Panjabi Set",
      category: "Fashion",
      subcategory: "Men's Clothing",
      type: "physical" as const,
      price: 1800,
      costPrice: 1200,
      stock: 30,
      description: "Elegant handcrafted cotton panjabi with matching pajama. Perfect for Eid and special occasions.",
      images: ["https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400"],
      vendorId: "seller-2",
      vendorName: "BD Fashion House",
      location: "Dhaka",
      rating: 4.8,
      reviewCount: 215,
      inStock: true,
      deliveryDays: "2-3 days",
    },
    {
      id: "prod-5",
      name: "Women's Designer Saree",
      category: "Fashion",
      subcategory: "Women's Clothing",
      type: "physical" as const,
      price: 3500,
      costPrice: 2500,
      stock: 20,
      description: "Gorgeous silk saree with intricate embroidery work. Available in multiple colors.",
      images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400"],
      vendorId: "seller-2",
      vendorName: "BD Fashion House",
      location: "Dhaka",
      rating: 4.9,
      reviewCount: 187,
      inStock: true,
      deliveryDays: "2-3 days",
    },
    // Grocery
    {
      id: "prod-6",
      name: "Premium Basmati Rice (5kg)",
      category: "Grocery",
      subcategory: "Grains",
      type: "physical" as const,
      price: 420,
      costPrice: 350,
      stock: 100,
      description: "Long grain premium basmati rice. Ideal for biryani and pilaf.",
      images: ["https://images.unsplash.com/photo-1536304993881-ff86e0c9df8f?w=400"],
      vendorId: "seller-4",
      vendorName: "Local Grocery Corner",
      location: "Dhaka",
      rating: 4.4,
      reviewCount: 320,
      inStock: true,
      deliveryDays: "Same day",
    },
    {
      id: "prod-7",
      name: "Fresh Organic Vegetables Basket",
      category: "Grocery",
      subcategory: "Vegetables",
      type: "physical" as const,
      price: 280,
      costPrice: 200,
      stock: 50,
      description: "Fresh organic mixed vegetable basket including tomatoes, capsicums, carrots and more.",
      images: ["https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400"],
      vendorId: "seller-4",
      vendorName: "Local Grocery Corner",
      location: "Dhaka",
      rating: 4.7,
      reviewCount: 145,
      inStock: true,
      deliveryDays: "Same day",
    },
    // Wholesale
    {
      id: "prod-8",
      name: "Bulk Cotton Fabric Roll (100m)",
      category: "Wholesale",
      subcategory: "Textiles",
      type: "physical" as const,
      price: 0,
      costPrice: 0,
      stock: 500,
      moq: 100,
      description: "High quality cotton fabric for garment industry. Minimum order 100 meters.",
      images: ["https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400"],
      vendorId: "seller-3",
      vendorName: "Chittagong Wholesale Market",
      location: "Chittagong",
      rating: 4.2,
      reviewCount: 56,
      priceOnInquiry: true,
      inStock: true,
      deliveryDays: "7-14 days",
    },
    // Service
    {
      id: "prod-9",
      name: "Website Development Service",
      category: "Services",
      subcategory: "Digital Services",
      type: "service" as const,
      price: 15000,
      costPrice: 0,
      stock: 999,
      description: "Professional website development including design, development and hosting setup.",
      images: ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"],
      vendorId: "seller-5",
      vendorName: "TechDrop Services",
      location: "Dhaka",
      rating: 4.5,
      reviewCount: 28,
      inStock: true,
      deliveryDays: "7-14 days",
    },
    // Digital
    {
      id: "prod-10",
      name: "Microsoft Office 365 License",
      category: "Electronics",
      subcategory: "Software",
      type: "digital" as const,
      price: 3500,
      costPrice: 2800,
      stock: 999,
      description: "Genuine Microsoft Office 365 annual subscription. Includes Word, Excel, PowerPoint and more.",
      images: ["https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400"],
      vendorId: "seller-1",
      vendorName: "Dhaka Electronics Hub",
      location: "Dhaka",
      rating: 4.7,
      reviewCount: 93,
      inStock: true,
      deliveryDays: "Instant",
    },
  ];

  for (const p of products) {
    try {
      await db.insert(productsTable).values(p).onConflictDoNothing();
    } catch (e) {
      // ignore
    }
  }

  // Orders
  const orders = [
    {
      id: "ORD-001",
      userId: "user-1",
      items: [
        { productId: "prod-1", productName: "Samsung Galaxy A54 5G", vendorId: "seller-1", vendorName: "Dhaka Electronics Hub", quantity: 1, price: 32000, subtotal: 32000 },
      ],
      status: "completed" as const,
      deliveryType: "platform_delivery" as const,
      paymentMethod: "cash_on_delivery",
      totalAmount: 32060,
      deliveryCharge: 60,
      trackingCode: "TRK-2024-001",
      customerName: "Rahim Ahmed",
      customerPhone: "01711234567",
      customerAddress: "House 12, Mirpur-10",
      district: "Dhaka",
      area: "Mirpur",
      estimatedDelivery: "Delivered",
    },
    {
      id: "ORD-002",
      userId: "user-1",
      items: [
        { productId: "prod-4", productName: "Premium Cotton Panjabi Set", vendorId: "seller-2", vendorName: "BD Fashion House", quantity: 2, price: 1800, subtotal: 3600 },
      ],
      status: "processing" as const,
      deliveryType: "seller_delivery" as const,
      paymentMethod: "cash_on_delivery",
      totalAmount: 3660,
      deliveryCharge: 60,
      trackingCode: "TRK-2024-002",
      customerName: "Rahim Ahmed",
      customerPhone: "01711234567",
      customerAddress: "House 12, Mirpur-10",
      district: "Dhaka",
      area: "Mirpur",
      estimatedDelivery: "2-3 days",
    },
    {
      id: "ORD-003",
      userId: "user-1",
      items: [
        { productId: "prod-6", productName: "Premium Basmati Rice (5kg)", vendorId: "seller-4", vendorName: "Local Grocery Corner", quantity: 3, price: 420, subtotal: 1260 },
      ],
      status: "pending" as const,
      deliveryType: "local_delivery" as const,
      paymentMethod: "cash_on_delivery",
      totalAmount: 1320,
      deliveryCharge: 60,
      customerName: "Rahim Ahmed",
      customerPhone: "01711234567",
      customerAddress: "House 12, Mirpur-10",
      district: "Dhaka",
      area: "Mirpur",
      estimatedDelivery: "Same day",
    },
  ];

  for (const o of orders) {
    try {
      await db.insert(ordersTable).values(o).onConflictDoNothing();
    } catch (e) {
      // ignore
    }
  }

  // Notifications
  const notifications = [
    {
      id: "notif-1",
      userId: "user-1",
      type: "order" as const,
      title: "Order Confirmed",
      message: "Your order ORD-002 has been confirmed and is being processed.",
      read: false,
    },
    {
      id: "notif-2",
      userId: "user-1",
      type: "delivery" as const,
      title: "Order Shipped",
      message: "Your order ORD-001 has been delivered successfully!",
      read: true,
    },
    {
      id: "notif-3",
      userId: "user-1",
      type: "account" as const,
      title: "Welcome to PaikarMart",
      message: "Your account has been created. Start shopping from thousands of verified sellers!",
      read: true,
    },
    {
      id: "notif-4",
      userId: "user-1",
      type: "system" as const,
      title: "Special Offer",
      message: "Eid Sale! Get up to 30% off on selected products this week.",
      read: false,
    },
    {
      id: "notif-5",
      userId: "user-1",
      type: "order" as const,
      title: "New Order Placed",
      message: "Your order ORD-003 has been placed. Estimated delivery: Same day.",
      read: false,
    },
  ];

  for (const n of notifications) {
    try {
      await db.insert(notificationsTable).values(n).onConflictDoNothing();
    } catch (e) {
      // ignore
    }
  }

  // Wallet
  try {
    await db.insert(walletsTable).values({
      userId: "user-1",
      balance: 125.50,
      totalEarned: 230.75,
      investmentValue: 250.00,
      transactions: [
        { id: "txn-1", type: "reward", amount: 15.50, description: "2.5% reward from ORD-001 purchase", createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
        { id: "txn-2", type: "reward", amount: 8.25, description: "2% reward from ORD-002 purchase", createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: "txn-3", type: "reward", amount: 3.00, description: "Referral bonus", createdAt: new Date(Date.now() - 86400000).toISOString() },
      ],
    }).onConflictDoNothing();
  } catch (e) {
    // ignore
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
