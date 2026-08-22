# GlobeTrotter Backend Setup Guide

This guide will help you set up the Node.js backend and local MySQL database on your machine so you can start developing.

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed (v16+ recommended).
2. **MySQL**: Ensure you have a local MySQL server running. You can use **XAMPP** (which includes MySQL), MySQL Workbench, or a standalone installation.

## Step 1: Install Dependencies

Open your terminal, navigate to the `backend` folder, and install all the required Node packages:

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

Create a file named `.env` in the root of the `backend` folder and add the following configuration:

```env
DATABASE_URL="mysql://root:@localhost:3306/globetrotter"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

> **Note on `DATABASE_URL`**: 
> - If you are using **XAMPP default settings**, the username is `root` and there is no password. The URL above will work automatically.
> - If your MySQL root user has a password, update it like this: `mysql://root:YOUR_PASSWORD@localhost:3306/globetrotter`

## Step 3: Create the Database & Schema

We use Prisma as our ORM. You don't need to manually run SQL files! Prisma will automatically create the database and all tables for you.

Run this command to push the schema to your database:

```bash
npx prisma db push
```

*(If Prisma asks if you want to create the `globetrotter` database, say yes!)*

## Step 4: Seed Mock Data

To make testing easier, run the seed script to populate the database with mock cities (Tokyo, Paris, Kyoto) and a demo user account.

```bash
npm run prisma:seed
```

## Step 5: Start the Server

Start the local development server:

```bash
npm run dev
```

The API should now be running at `http://localhost:5000`. 
You can verify it is working by opening your browser to `http://localhost:5000/health`.

---

### Alternate Method: Manual SQL Setup
If you do not want to use Prisma to generate the database, you can run the raw SQL manually:
1. Open MySQL Workbench or phpMyAdmin.
2. Run the `database_setup.sql` script (located in the root or artifacts folder).
3. Then start the server using `npm run dev`.
