import bcrypt from "bcryptjs";

export const demoProducts = [
  {
    _id: "demo-potato",
    name: "Potato 500g",
    category: "Vegetables",
    price: 25,
    offerPrice: 20,
    image: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80"],
    description: ["Fresh and organic", "Ideal for curries and fries", "Sourced from local farms"],
    inStock: true,
  },
  {
    _id: "demo-apple",
    name: "Apple 1 kg",
    category: "Fruits",
    price: 120,
    offerPrice: 110,
    image: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=80"],
    description: ["Crisp and juicy", "Rich in fiber", "Great for snacking"],
    inStock: true,
  },
  {
    _id: "demo-milk",
    name: "Fresh Milk 1L",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    image: ["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80"],
    description: ["Pure and fresh", "Rich in calcium", "Delivered chilled"],
    inStock: true,
  },
  {
    _id: "demo-cola",
    name: "Cola 1.5L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    image: ["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=80"],
    description: ["Refreshing and fizzy", "Best served chilled", "Great for gatherings"],
    inStock: true,
  },
  {
    _id: "demo-rice",
    name: "Basmati Rice 5kg",
    category: "Grains",
    price: 550,
    offerPrice: 520,
    image: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80"],
    description: ["Long grain and aromatic", "Premium quality", "Perfect for biryani"],
    inStock: true,
  },
  {
    _id: "demo-bread",
    name: "Brown Bread 400g",
    category: "Bakery",
    price: 40,
    offerPrice: 35,
    image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80"],
    description: ["Soft and healthy", "Made from whole wheat", "Ideal for breakfast"],
    inStock: true,
  },
  {
    _id: "demo-noodles",
    name: "Instant Noodles 280g",
    category: "Instant",
    price: 55,
    offerPrice: 50,
    image: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80"],
    description: ["Quick and easy to cook", "Comfort snack", "Ready in minutes"],
    inStock: true,
  },
];

const demoPasswordHash = bcrypt.hashSync("password123", 10);

export const demoUsers = [
  {
    _id: "demo-user",
    name: "Demo User",
    email: "demo@greencart.dev",
    password: demoPasswordHash,
    cartItems: {},
  },
];

export const demoAddresses = [
  {
    _id: "demo-address",
    userId: "demo-user",
    firstName: "Demo",
    lastName: "Customer",
    email: "demo@greencart.dev",
    street: "MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    zipcode: 560001,
    country: "India",
    phone: "9876543210",
  },
];

export const demoOrders = [];

export const createDemoId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  cartItems: user.cartItems || {},
});

export const hydrateOrder = (order) => ({
  ...order,
  items: order.items.map((item) => ({
    ...item,
    product: demoProducts.find((product) => product._id === item.product) || item.product,
  })),
  address: demoAddresses.find((address) => address._id === order.address) || order.address,
});
