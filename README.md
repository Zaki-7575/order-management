# Order Management System

A full-stack Order Management application built to manage store locations, menu items, orders, and real-time analytics.

## Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion, Recharts, Ant Design, React Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM

---

## 🛠️ Setup Instructions (For Evaluators)

To make testing this application locally as easy as possible, I have included a live testing database connection in the repository. You do not need to install PostgreSQL or Docker to run this.

### 1. Backend Setup (`/order-management-server`)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd order-management-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```
   *(Note: This connects to a live Supabase database that is already seeded with test data!)*
4. Generate the Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`*

### 2. Frontend Setup (`/order-management-client`)
1. Open a **new** terminal and navigate to the frontend folder:
   ```bash
   cd order-management-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by copying the example file:
   ```bash
   cp .env.example .env.local
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on `http://localhost:3000`*

---

## 📚 API Documentation

Base URL: `http://localhost:5000/api/v1`

### **Stores**
- `GET /stores` : Retrieve a list of all active stores.
- `POST /stores` : Create a new store. (Payload: `{ name, location }`)
- `PUT /stores/:id` : Update an existing store by ID.
- `DELETE /stores/:id` : Delete a store by ID.

### **Menu Items**
- `GET /items` : Retrieve the complete menu.
- `POST /items` : Create a new menu item. (Payload: `{ name, price, category }`)
- `PUT /items/:id` : Update an existing menu item by ID.
- `DELETE /items/:id` : Delete an item by ID.

### **Orders**
- `GET /orders` : Retrieve all recent active orders.
- `POST /orders` : Create a new order. 
  - Payload: `{ store_id: string, items: [{ item_id: string, qty: number }] }`
- `PUT /orders/:id` : Update an order's status (e.g., to "COMPLETED").
- `DELETE /orders/:id` : Cancel/delete an order by ID.

### **Analytics & Dashboards**
- `GET /analytics/orders-per-day?type=active|archived` : Returns a time-series array of daily order volumes.
- `GET /analytics/revenue-per-store?type=active|archived` : Returns total revenue segmented by store.
- `GET /analytics/top-items?type=active|archived` : Returns the most frequently purchased menu items.
- `POST /archive-old-orders` : Background job endpoint to migrate orders older than 30 days to the Archive tables.
