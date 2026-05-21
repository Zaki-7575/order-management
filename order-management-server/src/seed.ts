import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const stores = [
  { name: "Downtown Branch", location: "New York, NY" },
  { name: "Uptown Cafe", location: "New York, NY" },
  { name: "Westside Express", location: "Los Angeles, CA" },
  { name: "Eastside Bistro", location: "Los Angeles, CA" },
  { name: "Central Kiosk", location: "Chicago, IL" },
  { name: "North Station", location: "Chicago, IL" },
  { name: "South Market", location: "Houston, TX" },
  { name: "Bay Area Store", location: "San Francisco, CA" },
  { name: "Tech Hub Cafe", location: "San Jose, CA" },
  { name: "Beachside Shop", location: "Miami, FL" },
  { name: "Mountain View", location: "Denver, CO" },
  { name: "Valley Store", location: "Phoenix, AZ" },
  { name: "Lakefront Branch", location: "Seattle, WA" },
  { name: "Capital Cafe", location: "Washington, DC" },
  { name: "Riverside Market", location: "Portland, OR" }
];

const menus = [
  { name: "Classic Cheeseburger", category: "Burgers", price: 8.99 },
  { name: "Double Bacon Burger", category: "Burgers", price: 11.99 },
  { name: "Spicy Chicken Sandwich", category: "Sandwiches", price: 9.50 },
  { name: "Grilled Veggie Wrap", category: "Sandwiches", price: 7.99 },
  { name: "Caesar Salad", category: "Salads", price: 8.50 },
  { name: "Cobb Salad", category: "Salads", price: 10.99 },
  { name: "French Fries", category: "Sides", price: 3.99 },
  { name: "Onion Rings", category: "Sides", price: 4.99 },
  { name: "Mozzarella Sticks", category: "Sides", price: 5.99 },
  { name: "Chocolate Shake", category: "Desserts", price: 4.50 },
  { name: "Vanilla Ice Cream", category: "Desserts", price: 3.50 },
  { name: "Apple Pie", category: "Desserts", price: 4.00 },
  { name: "Cola", category: "Beverages", price: 1.99 },
  { name: "Iced Tea", category: "Beverages", price: 2.25 },
  { name: "Lemonade", category: "Beverages", price: 2.50 }
];

async function main() {
  console.log("Seeding stores...");
  for (const store of stores) {
    await prisma.store.create({ data: store });
  }
  
  console.log("Seeding menus...");
  for (const menu of menus) {
    await prisma.item.create({ data: menu });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });