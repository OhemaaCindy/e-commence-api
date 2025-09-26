import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Utility: sample without replacement
function sampleWithoutReplacement<T>(source: T[], count: number): T[] {
  const copy = source.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = temp;
  }
  return copy.slice(0, Math.max(0, Math.min(count, copy.length)));
}

// Utility: build a fixed-size list of images from a pool, cycling if needed
function buildImagesFromPool(pool: string[], count: number): string[] {
  if (pool.length === 0 || count <= 0) return [];
  const shuffled = sampleWithoutReplacement(pool, pool.length);
  const result: string[] = [];
  for (let k = 0; k < count; k++) {
    result.push(shuffled[k % shuffled.length]!);
  }
  return result;
}

// Category-specific image pools to ensure visual relevance
const categoryImageUrls: Record<string, string[]> = {
  Dresses: [
    "https://images.unsplash.com/photo-1520975940469-923f9fdd2e6a?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1520975922284-7bcd4633b9a0?w=800&h=1000&fit=crop&auto=format",
    "https://images.pexels.com/photos/6311573/pexels-photo-6311573.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ],
  "Tops & Blouses": [
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1503342452485-86ff0a4c7e88?w=800&h=1000&fit=crop&auto=format",
    "https://images.pexels.com/photos/6311394/pexels-photo-6311394.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ],
  Bottoms: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1503342452485-86ff0a4c7e88?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=1000&fit=crop&auto=format",
    "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/6311391/pexels-photo-6311391.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ],
  "Shoes & Heels": [
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1520975693416-35a0f871b3f9?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&auto=format",
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/769108/pexels-photo-769108.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&h=1000&fit=crop&auto=format",
    "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/3774930/pexels-photo-3774930.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ],
  Outerwear: [
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&h=1000&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1000&fit=crop&auto=format",
    "https://images.pexels.com/photos/6311391/pexels-photo-6311391.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/6311394/pexels-photo-6311394.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ],
};

// Fashion categories with images
const categories = [
  {
    name: "Dresses",
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
    publicId: "dresses-category",
  },
  {
    name: "Tops & Blouses",
    imageUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
    publicId: "tops-category",
  },
  {
    name: "Bottoms",
    imageUrl:
      "https://images.unsplash.com/photo-1506629905241-8c5b4e7e8b8f?w=500&h=500&fit=crop",
    publicId: "bottoms-category",
  },
  {
    name: "Shoes & Heels",
    imageUrl:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
    publicId: "shoes-category",
  },
  {
    name: "Accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1506629905241-8c5b4e7e8b8f?w=500&h=500&fit=crop",
    publicId: "accessories-category",
  },
  {
    name: "Outerwear",
    imageUrl:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=500&fit=crop",
    publicId: "outerwear-category",
  },
];

// Product data for each category
const productsData = {
  Dresses: [
    {
      name: "Floral Midi Dress",
      description:
        "Beautiful floral print midi dress perfect for spring and summer occasions",
      price: 8900,
      brand: "Zara",
      color: "Floral",
      size: "M",
      rating: "4.8",
    },
    {
      name: "Elegant Evening Gown",
      description: "Stunning floor-length evening gown for special events",
      price: 15000,
      brand: "H&M",
      color: "Black",
      size: "L",
      rating: "4.9",
    },
    {
      name: "Casual Summer Dress",
      description: "Light and breezy summer dress for everyday wear",
      price: 6500,
      brand: "Uniqlo",
      color: "Blue",
      size: "S",
      rating: "4.6",
    },
    {
      name: "Office Professional Dress",
      description: "Sophisticated work dress in classic navy blue",
      price: 7500,
      brand: "Mango",
      color: "Navy",
      size: "M",
      rating: "4.7",
    },
    {
      name: "Wrap Dress",
      description: "Flattering wrap dress that suits all body types",
      price: 8200,
      brand: "ASOS",
      color: "Red",
      size: "L",
      rating: "4.8",
    },
    {
      name: "Maxi Bohemian Dress",
      description: "Free-spirited boho maxi dress with flowing fabric",
      price: 9200,
      brand: "Free People",
      color: "Multi",
      size: "M",
      rating: "4.5",
    },
    {
      name: "Little Black Dress",
      description: "Classic LBD that never goes out of style",
      price: 6800,
      brand: "Zara",
      color: "Black",
      size: "S",
      rating: "4.9",
    },
    {
      name: "Cocktail Party Dress",
      description: "Perfect for cocktail parties and semi-formal events",
      price: 11000,
      brand: "Mango",
      color: "Emerald",
      size: "M",
      rating: "4.7",
    },
    {
      name: "Vintage Style Dress",
      description: "Retro-inspired dress with modern comfort",
      price: 7800,
      brand: "ASOS",
      color: "Pink",
      size: "L",
      rating: "4.6",
    },
    {
      name: "Day to Night Dress",
      description: "Versatile dress that transitions from day to evening",
      price: 8500,
      brand: "H&M",
      color: "Burgundy",
      size: "S",
      rating: "4.8",
    },
    {
      name: "A-Line Sundress",
      description: "Classic A-line silhouette perfect for warm weather",
      price: 7200,
      brand: "Uniqlo",
      color: "Yellow",
      size: "M",
      rating: "4.5",
    },
    {
      name: "Sequin Party Dress",
      description: "Sparkling sequin dress for special celebrations",
      price: 13000,
      brand: "Zara",
      color: "Silver",
      size: "L",
      rating: "4.9",
    },
  ],
  "Tops & Blouses": [
    {
      name: "Silk Blouse",
      description: "Luxurious silk blouse perfect for professional settings",
      price: 4500,
      brand: "Mango",
      color: "White",
      size: "M",
      rating: "4.8",
    },
    {
      name: "Oversized T-Shirt",
      description: "Comfortable oversized tee for casual days",
      price: 2500,
      brand: "Uniqlo",
      color: "Gray",
      size: "L",
      rating: "4.5",
    },
    {
      name: "Ruffled Top",
      description: "Feminine ruffled top with romantic details",
      price: 3800,
      brand: "Zara",
      color: "Blush",
      size: "S",
      rating: "4.7",
    },
    {
      name: "Crop Top",
      description: "Trendy crop top perfect for layering",
      price: 2200,
      brand: "ASOS",
      color: "Black",
      size: "M",
      rating: "4.6",
    },
    {
      name: "Button-Down Shirt",
      description: "Classic button-down shirt in crisp cotton",
      price: 3200,
      brand: "H&M",
      color: "Blue",
      size: "L",
      rating: "4.8",
    },
    {
      name: "Off-Shoulder Top",
      description: "Stylish off-shoulder top for date nights",
      price: 3500,
      brand: "Zara",
      color: "Red",
      size: "S",
      rating: "4.7",
    },
    {
      name: "Turtleneck Sweater",
      description: "Cozy turtleneck perfect for layering",
      price: 4200,
      brand: "Uniqlo",
      color: "Cream",
      size: "M",
      rating: "4.6",
    },
    {
      name: "Wrap Top",
      description: "Flattering wrap-style top with tie closure",
      price: 3900,
      brand: "Mango",
      color: "Navy",
      size: "L",
      rating: "4.8",
    },
    {
      name: "Peplum Blouse",
      description: "Elegant peplum blouse with structured silhouette",
      price: 4600,
      brand: "ASOS",
      color: "Pink",
      size: "S",
      rating: "4.7",
    },
    {
      name: "Lace Camisole",
      description: "Delicate lace camisole for layering or standalone wear",
      price: 2800,
      brand: "H&M",
      color: "Black",
      size: "M",
      rating: "4.6",
    },
    {
      name: "Graphic Tee",
      description: "Fun graphic tee with inspirational message",
      price: 2000,
      brand: "Uniqlo",
      color: "White",
      size: "L",
      rating: "4.5",
    },
    {
      name: "Cold-Shoulder Top",
      description: "Trendy cold-shoulder design for modern style",
      price: 3400,
      brand: "Zara",
      color: "Green",
      size: "S",
      rating: "4.7",
    },
  ],
  Bottoms: [
    {
      name: "High-Waisted Jeans",
      description: "Flattering high-waisted jeans with stretch",
      price: 5500,
      brand: "Levi's",
      color: "Blue",
      size: "28",
      rating: "4.8",
    },
    {
      name: "Wide-Leg Trousers",
      description: "Elegant wide-leg trousers for office wear",
      price: 4800,
      brand: "Mango",
      color: "Black",
      size: "30",
      rating: "4.7",
    },
    {
      name: "Midi Skirt",
      description: "Versatile midi skirt perfect for any occasion",
      price: 3500,
      brand: "Zara",
      color: "Navy",
      size: "M",
      rating: "4.6",
    },
    {
      name: "Leather Pants",
      description: "Stylish faux leather pants for edgy looks",
      price: 6200,
      brand: "ASOS",
      color: "Black",
      size: "29",
      rating: "4.8",
    },
    {
      name: "Paperbag Shorts",
      description: "Trendy paperbag waist shorts for summer",
      price: 3200,
      brand: "H&M",
      color: "Khaki",
      size: "S",
      rating: "4.5",
    },
    {
      name: "Pleated Skirt",
      description: "Classic pleated skirt with modern fit",
      price: 3800,
      brand: "Uniqlo",
      color: "Gray",
      size: "M",
      rating: "4.7",
    },
    {
      name: "Jogger Pants",
      description: "Comfortable jogger pants for athleisure style",
      price: 2800,
      brand: "Nike",
      color: "Black",
      size: "L",
      rating: "4.6",
    },
    {
      name: "A-Line Skirt",
      description: "Flattering A-line skirt in timeless silhouette",
      price: 3300,
      brand: "Zara",
      color: "Red",
      size: "L",
      rating: "4.7",
    },
    {
      name: "Culottes",
      description: "Modern culottes perfect for transitional weather",
      price: 4200,
      brand: "Mango",
      color: "Cream",
      size: "S",
      rating: "4.8",
    },
    {
      name: "Distressed Jeans",
      description: "Trendy distressed jeans with vintage appeal",
      price: 5800,
      brand: "Levi's",
      color: "Light Blue",
      size: "30",
      rating: "4.6",
    },
    {
      name: "Maxi Skirt",
      description: "Flowing maxi skirt for bohemian style",
      price: 3900,
      brand: "Free People",
      color: "Floral",
      size: "M",
      rating: "4.7",
    },
    {
      name: "Tailored Shorts",
      description: "Professional tailored shorts for smart casual",
      price: 3600,
      brand: "H&M",
      color: "Navy",
      size: "S",
      rating: "4.8",
    },
  ],
  "Shoes & Heels": [
    {
      name: "Classic Black Heels",
      description: "Timeless black heels perfect for any occasion",
      price: 8500,
      brand: "Zara",
      color: "Black",
      size: "38",
      rating: "4.9",
    },
    {
      name: "White Sneakers",
      description: "Clean white sneakers for casual comfort",
      price: 6500,
      brand: "Adidas",
      color: "White",
      size: "37",
      rating: "4.8",
    },
    {
      name: "Ankle Boots",
      description: "Stylish ankle boots for fall and winter",
      price: 9200,
      brand: "Steve Madden",
      color: "Brown",
      size: "39",
      rating: "4.7",
    },
    {
      name: "Strappy Sandals",
      description: "Elegant strappy sandals for summer evenings",
      price: 6800,
      brand: "Zara",
      color: "Nude",
      size: "38",
      rating: "4.6",
    },
    {
      name: "Ballet Flats",
      description: "Comfortable ballet flats for everyday wear",
      price: 4200,
      brand: "H&M",
      color: "Black",
      size: "37",
      rating: "4.7",
    },
    {
      name: "Wedges",
      description: "Comfortable wedge heels for all-day wear",
      price: 7200,
      brand: "Mango",
      color: "Beige",
      size: "38",
      rating: "4.8",
    },
    {
      name: "Knee-High Boots",
      description: "Chic knee-high boots for winter style",
      price: 11500,
      brand: "Steve Madden",
      color: "Black",
      size: "39",
      rating: "4.9",
    },
    {
      name: "Espadrilles",
      description: "Summer espadrilles with rope sole",
      price: 5500,
      brand: "ASOS",
      color: "White",
      size: "37",
      rating: "4.6",
    },
    {
      name: "Platform Sneakers",
      description: "Trendy platform sneakers for street style",
      price: 7800,
      brand: "Nike",
      color: "Pink",
      size: "38",
      rating: "4.7",
    },
    {
      name: "Mules",
      description: "Slip-on mules for easy on-the-go style",
      price: 4800,
      brand: "H&M",
      color: "Tan",
      size: "39",
      rating: "4.5",
    },
    {
      name: "Pumps",
      description: "Classic pumps for professional settings",
      price: 7500,
      brand: "Zara",
      color: "Navy",
      size: "38",
      rating: "4.8",
    },
    {
      name: "Block Heels",
      description: "Stable block heels for comfortable height",
      price: 6800,
      brand: "Mango",
      color: "Red",
      size: "37",
      rating: "4.7",
    },
  ],
  Accessories: [
    {
      name: "Leather Handbag",
      description: "Quality leather handbag in classic design",
      price: 3200,
      brand: "Zara",
      color: "Brown",
      size: "One Size",
      rating: "4.8",
    },
    {
      name: "Statement Necklace",
      description: "Bold statement necklace for special occasions",
      price: 1800,
      brand: "ASOS",
      color: "Gold",
      size: "One Size",
      rating: "4.6",
    },
    {
      name: "Silk Scarf",
      description: "Luxurious silk scarf with beautiful pattern",
      price: 2200,
      brand: "H&M",
      color: "Multi",
      size: "One Size",
      rating: "4.7",
    },
    {
      name: "Crossbody Bag",
      description: "Practical crossbody bag for hands-free style",
      price: 2800,
      brand: "Mango",
      color: "Black",
      size: "One Size",
      rating: "4.8",
    },
    {
      name: "Oversized Sunglasses",
      description: "Stylish oversized sunglasses for sun protection",
      price: 1500,
      brand: "Zara",
      color: "Black",
      size: "One Size",
      rating: "4.5",
    },
    {
      name: "Pearl Earrings",
      description: "Classic pearl earrings for elegant looks",
      price: 1200,
      brand: "ASOS",
      color: "White",
      size: "One Size",
      rating: "4.9",
    },
    {
      name: "Woven Belt",
      description: "Trendy woven belt to cinch waistlines",
      price: 800,
      brand: "H&M",
      color: "Brown",
      size: "M",
      rating: "4.6",
    },
    {
      name: "Clutch Purse",
      description: "Evening clutch purse for formal events",
      price: 2500,
      brand: "Mango",
      color: "Silver",
      size: "One Size",
      rating: "4.7",
    },
    {
      name: "Beaded Bracelet",
      description: "Delicate beaded bracelet for layered looks",
      price: 600,
      brand: "Zara",
      color: "Multi",
      size: "One Size",
      rating: "4.5",
    },
    {
      name: "Wide-Brim Hat",
      description: "Stylish wide-brim hat for sun protection",
      price: 1800,
      brand: "ASOS",
      color: "Black",
      size: "One Size",
      rating: "4.6",
    },
    {
      name: "Chain Wallet",
      description: "Trendy chain wallet for hands-free convenience",
      price: 2100,
      brand: "H&M",
      color: "Gold",
      size: "One Size",
      rating: "4.7",
    },
    {
      name: "Stacking Rings",
      description: "Set of stacking rings for layered jewelry",
      price: 900,
      brand: "Zara",
      color: "Gold",
      size: "One Size",
      rating: "4.8",
    },
  ],
  Outerwear: [
    {
      name: "Trench Coat",
      description: "Classic trench coat for timeless style",
      price: 12500,
      brand: "Mango",
      color: "Beige",
      size: "M",
      rating: "4.9",
    },
    {
      name: "Denim Jacket",
      description: "Versatile denim jacket for casual layering",
      price: 6800,
      brand: "Levi's",
      color: "Blue",
      size: "L",
      rating: "4.8",
    },
    {
      name: "Wool Blazer",
      description: "Professional wool blazer for office wear",
      price: 9200,
      brand: "Zara",
      color: "Navy",
      size: "S",
      rating: "4.7",
    },
    {
      name: "Puffer Jacket",
      description: "Warm puffer jacket for cold weather",
      price: 8500,
      brand: "H&M",
      color: "Black",
      size: "M",
      rating: "4.6",
    },
    {
      name: "Leather Jacket",
      description: "Edgy faux leather jacket for cool style",
      price: 11200,
      brand: "ASOS",
      color: "Black",
      size: "L",
      rating: "4.8",
    },
    {
      name: "Cardigan Sweater",
      description: "Cozy cardigan for layering and warmth",
      price: 4500,
      brand: "Uniqlo",
      color: "Gray",
      size: "S",
      rating: "4.7",
    },
    {
      name: "Windbreaker",
      description: "Lightweight windbreaker for active days",
      price: 3800,
      brand: "Nike",
      color: "Pink",
      size: "M",
      rating: "4.5",
    },
    {
      name: "Oversized Coat",
      description: "Trendy oversized coat for winter style",
      price: 9800,
      brand: "Zara",
      color: "Cream",
      size: "L",
      rating: "4.8",
    },
    {
      name: "Bomber Jacket",
      description: "Classic bomber jacket for casual cool",
      price: 6200,
      brand: "H&M",
      color: "Green",
      size: "S",
      rating: "4.6",
    },
    {
      name: "Peacoat",
      description: "Navy peacoat for classic winter style",
      price: 10500,
      brand: "Mango",
      color: "Navy",
      size: "M",
      rating: "4.9",
    },
    {
      name: "Hoodie",
      description: "Comfortable hoodie for relaxed days",
      price: 3500,
      brand: "Uniqlo",
      color: "Black",
      size: "L",
      rating: "4.5",
    },
    {
      name: "Blazer Dress",
      description: "Versatile blazer dress for work and play",
      price: 7800,
      brand: "ASOS",
      color: "Burgundy",
      size: "S",
      rating: "4.7",
    },
  ],
};

async function main() {
  console.log("🌱 Seeding feminine fashion e-commerce database...");

  console.log("🧹 Clearing existing data...");
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Database cleared successfully");

  // Create users
  console.log("👤 Creating users...");
  const adminEmail = "admin@fashionstore.com";
  const adminPassword = await bcrypt.hash("AdminPass123!", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("UserPass123!", 10);
  const user = await prisma.user.create({
    data: {
      username: "fashionista",
      email: "user@fashionstore.com",
      password: userPassword,
      role: "USER",
    },
  });
  console.log("✅ Users created successfully");

  // Create categories
  console.log("📂 Creating categories...");
  const createdCategories: any[] = [];

  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: categoryData,
    });
    createdCategories.push(category);
  }
  console.log(`✅ Created ${createdCategories.length} categories`);

  // Create products for each category
  console.log("👗 Creating products...");
  const allProducts: any[] = [];

  for (let i = 0; i < createdCategories.length; i++) {
    const category = createdCategories[i];
    const categoryProducts =
      productsData[category.name as keyof typeof productsData];

    for (const productData of categoryProducts) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
          brand: productData.brand,
          color: productData.color,
          size: productData.size,
          rating: productData.rating,
          discount:
            Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : null, // 30% chance of discount
          categoryId: category.id,
        },
      });

      // Create exactly 4 product images strictly from category pool
      const desiredImageCount = 4;
      const categoryPool = categoryImageUrls[category.name] || [];
      if (categoryPool.length === 0) {
        throw new Error(`No images configured for category: ${category.name}`);
      }
      const selectedImageUrls = buildImagesFromPool(
        categoryPool,
        desiredImageCount
      );
      const productImages: any[] = [];

      for (let j = 0; j < selectedImageUrls.length; j++) {
        const imageUrl = selectedImageUrls[j]!;
        const publicId = `product-${product.id}-${j}`;

        const productImage = await prisma.productImage.create({
          data: {
            imageUrl,
            publicId,
            productId: product.id,
          },
        });
        productImages.push(productImage);
      }

      allProducts.push({ ...product, images: productImages });
    }
  }
  console.log(`✅ Created ${allProducts.length} products with images`);

  // Create sample orders
  console.log("📦 Creating sample orders...");
  const sampleOrderProducts = allProducts.slice(0, 3);
  const totalPrice = sampleOrderProducts.reduce(
    (sum: number, product: any) => sum + product.price,
    0
  );

  await prisma.order.create({
    data: {
      orderItems: sampleOrderProducts.map((product: any) => ({
        name: product.name,
        qty: Math.floor(Math.random() * 3) + 1,
        image: product.images[0]?.imageUrl || "",
        price: product.price,
        productId: product.id,
      })),
      shippingAddress: {
        address: "123 Fashion Street",
        city: "New York",
        postalCode: "10001",
        country: "USA",
      },
      paymentMethod: "Credit Card",
      totalPrice,
      userId: user.id,
      isPaid: true,
      status: "PAID",
      paidAt: new Date(),
    },
  });
  console.log("✅ Sample order created");

  console.log("🎉 Seeding completed successfully!");
  console.log("📊 Summary:");
  console.log(`   - 1 Admin user: ${admin.email}`);
  console.log(`   - 1 Regular user: ${user.email}`);
  console.log(`   - ${createdCategories.length} categories`);
  console.log(`   - ${allProducts.length} products`);
  console.log(`   - 1 sample order`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
