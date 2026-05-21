# Order Management System

A full-stack Order Management application built to manage store locations, menu items, orders, and real-time analytics.

## Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion, Recharts, Ant Design, React Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM

---

## 🛠️ Setup Instructions

### 1. Database Setup (Docker - Recommended)
To make database setup incredibly easy and to fulfill the **Docker setup bonus requirement**, a `docker-compose.yml` file is included in the root directory.

1. Ensure you have [Docker](https://www.docker.com/) installed and running.
2. Open a terminal in the root folder and run:
   ```bash
   docker-compose up -d
   ```
This will instantly spin up a PostgreSQL instance on port 5432 with the required database name.

*(Alternative: You can also just install PostgreSQL locally and create a database manually).*

### 2. Backend Setup (`/order-management-server`)
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd order-management-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of `order-management-server` and add your database URL (if using the Docker setup above, use this exact URL):
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/order_management_db?schema=public"
   PORT=5000
   ```
4. Run the database migrations to generate the schema:
   ```bash
   npx prisma migrate dev
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`*

### 3. Frontend Setup (`/order-management-client`)
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd order-management-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root of `order-management-client` and point it to the backend API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
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
