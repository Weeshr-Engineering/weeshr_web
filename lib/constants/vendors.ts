// /data/vendors.ts

export interface Vendor {
  id: number;
  name: string;
  image: string;
  rating: number;
  category: string;
  badges: string[];
  giftIdeas: number;
}

export const vendors: Vendor[] = [
  // --- existing vendors (1–12) ---
  {
    id: 1,
    name: "Wakame Restaurant",
    image:
      "https://img.freepik.com/free-photo/cafe-terrace-with-turquoise-sofas-yellow-pillows_140725-2484.jpg?t=st=1757893526~exp=1757897126~hmac=3990e408ae0c85869c39f358b22a6ac2a715c59e6cc7806233ba55df1ce722a5&w=1480",
    rating: 9,
    category: "Food",
    badges: [
      "Pizza",
      "Rib-eye",
      "Steak",
      "Seafood",
      "Cocktails",
   
    ],
    giftIdeas: 9,
  },
  {
    id: 2,
    name: "SLOW",
    image:
      "https://img.freepik.com/free-photo/dinner-table-with-foods-soft-drinks-restaurant_114579-3319.jpg?t=st=1757893525~exp=1757897125~hmac=af5ba6df1c16f3a34fb93218f4328cd6b179333437405a2edc6a83cd50fff473&w=1480",
    rating: 9,
    category: "Food",
    badges: [
      "Delivery",
      "Takeout",
      "Asian Fusion",
      "Vegan Friendly",
 
    ],
    giftIdeas: 9,
  },
  {
    id: 3,
    name: "Shiro Lagos",
    image:
      "https://img.freepik.com/free-photo/group-diverse-friends-taking-selfie-with-mobile-phone-while-drinking-glass-beer-bar-friends-concept_58466-16340.jpg",
    rating: 9,
    category: "Food",
    badges: [
      "Sushi",
      "Cocktails",
      "Nightlife",
      "Live Music",
      "Seafood",
  
    ],
    giftIdeas: 9,
  },
  {
    id: 4,
    name: "Gras Restaurant",
    image:
      "https://img.freepik.com/free-photo/dinner-table-with-foods-soft-drinks-restaurant_114579-3319.jpg",
    rating: 9,
    category: "Food",
    badges: [
      "Italian",
      "Pasta",
      "Wood-fired Pizza",
      "Wine Cellar",
      "Outdoor Seating",

    ],
    giftIdeas: 9,
  },
  {
    id: 5,
    name: "Saturdays",
    image:
      "https://img.freepik.com/free-photo/cafe-terrace-with-turquoise-sofas-yellow-pillows_140725-2484.jpg?t=st=1757893526~exp=1757897126~hmac=3990e408ae0c85869c39f358b22a6ac2a715c59e6cc7806233ba55df1ce722a5&w=2000",
    rating: 9,
    category: "Food",
    badges: [
      "Brunch",
      "Coffee",
      "Smoothies",
      "Bakery",
      "Vegan Options",

    ],
    giftIdeas: 9,
  },
  {
    id: 6,
    name: "Cactus Restaurant",
    image: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Seafood",
      "Steaks",
      "Cocktails",
      "Riverside View",
      "Outdoor Dining",
      "Romantic",

    ],
    giftIdeas: 9,
  },
  {
    id: 7,
    name: "RSVP Restaurant",
    image:
      "https://images.pexels.com/photos/29544344/pexels-photo-29544344.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Fusion Cuisine",
      "Cocktail Bar",
      "Poolside Dining",
      "Late Night",
      "DJ Nights",
      "Small Plates",

    ],
    giftIdeas: 9,
  },
  {
    id: 8,
    name: "Gabby",
    image:
      "https://images.pexels.com/photos/17370228/pexels-photo-17370228.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Grill",
      "Burgers",
      "Craft Beer",
      "Casual Dining",
      "Sports Bar",

    ],
    giftIdeas: 9,
  },
  {
    id: 9,
    name: "Carnival Restaurant & Lounge",
    image:
      "https://images.pexels.com/photos/31321825/pexels-photo-31321825.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Cocktails",
      "Shisha Lounge",
      "Nightlife",
      "Dance Floor",
      "DJ Sets",

    ],
    giftIdeas: 9,
  },
  {
    id: 10,
    name: "Wakame Restaurant",
    image:
      "https://images.pexels.com/photos/33150831/pexels-photo-33150831.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Asian Fusion",
      "Sushi",
      "Noodles",
      "Teppanyaki",
      "Vegetarian",
  
    ],
    giftIdeas: 9,
  },
  {
    id: 11,
    name: "SEE Restaurant",
    image: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Seafood",
      "Steaks",
      "Mediterranean",
      "Romantic",
      "Luxury Dining",

    ],
    giftIdeas: 9,
  },
  {
    id: 12,
    name: "Sundays",
    image: "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Breakfast",
      "Pancakes",
      "Smoothies",
      "Coffee",
      "Family Friendly",
      "Casual Dining",
      "Outdoor Seating",
    ],
    giftIdeas: 9,
  },

  // --- new vendors (13–20) ---
  {
    id: 13,
    name: "The Grill Room",
    image: "https://images.pexels.com/photos/189293/pexels-photo-189293.jpeg",
    rating: 8,
    category: "Food",
    badges: [
      "Steaks",
      "BBQ",
      "Craft Beer",
      "Casual Dining",
      "Sports Screenings",
      "Happy Hour",
    ],
    giftIdeas: 8,
  },
  {
    id: 14,
    name: "Lush Rooftop Bar",
    image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Cocktails",
      "Rooftop View",
      "Nightlife",
      "Live DJ",
      "Tapas",
      "VIP Area",
    ],
    giftIdeas: 9,
  },
  {
    id: 15,
    name: "Mama’s Kitchen",
    image: "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
    rating: 8,
    category: "Food",
    badges: [
      "African Cuisine",
      "Family Friendly",
      "Takeout",
      "Local Specialties",
      "Casual Dining",
    ],
    giftIdeas: 7,
  },
  {
    id: 16,
    name: "Green Bowl Café",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    rating: 8,
    category: "Food",
    badges: [
      "Vegan",
      "Vegetarian",
      "Gluten-Free",
      "Smoothies",
      "Healthy Eating",
      "Organic",
    ],
    giftIdeas: 8,
  },
  {
    id: 17,
    name: "Spice Route",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Indian Cuisine",
      "Curries",
      "Tandoor",
      "Vegetarian Options",
      "Family Style",
    ],
    giftIdeas: 9,
  },
  {
    id: 18,
    name: "La Patisserie",
    image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    rating: 9,
    category: "Food",
    badges: [
      "Bakery",
      "Pastries",
      "Coffee",
      "Desserts",
      "French Cuisine",
      "Brunch",
    ],
    giftIdeas: 9,
  },
  {
    id: 19,
    name: "Ocean Breeze",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    rating: 10,
    category: "Food",
    badges: [
      "Seafood",
      "Beachfront",
      "Cocktails",
      "Romantic",
      "Luxury Dining",
      "Live Music",
    ],
    giftIdeas: 10,
  },
  {
    id: 20,
    name: "Burger Shack",
    image: "https://images.pexels.com/photos/1639567/pexels-photo-1639567.jpeg",
    rating: 8,
    category: "Food",
    badges: [
      "Burgers",
      "Fries",
      "Milkshakes",
      "Casual Dining",
      "Takeaway",
      "Late Night",
    ],
    giftIdeas: 7,
  },
];
