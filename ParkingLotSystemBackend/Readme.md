# Parking Lot System — Backend API

> The **server side** (brain) of the Parking Lot System. It stores all data, handles all business logic, and provides a REST API that the frontend screen talks to.

---

## Table of Contents

1. [What Does This Backend Do?](#1-what-does-this-backend-do)
2. [Tech Stack — Tools Used](#2-tech-stack--tools-used)
3. [Prerequisites — What to Install First](#3-prerequisites--what-to-install-first)
4. [Project Folder Structure Explained](#4-project-folder-structure-explained)
5. [Step-by-Step Setup Guide](#5-step-by-step-setup-guide)
6. [Environment Variables (.env File)](#6-environment-variables-env-file)
7. [Available Commands](#7-available-commands)
8. [User Roles — Who Can Do What](#8-user-roles--who-can-do-what)
9. [How Authentication Works](#9-how-authentication-works)
10. [How Permissions Work](#10-how-permissions-work)
11. [Database Collections Explained](#11-database-collections-explained)
12. [How a Request Flows Through the Code](#12-how-a-request-flows-through-the-code)
13. [Complete API Endpoints Reference](#13-complete-api-endpoints-reference)
14. [Invoice Calculation Formula](#14-invoice-calculation-formula)
15. [Testing with the api.http File](#15-testing-with-the-apihttp-file)
16. [Common Errors & How to Fix Them](#16-common-errors--how-to-fix-them)

---

## 1. What Does This Backend Do?

Think of this backend as the **invisible back-office manager** of a real parking lot. When a car enters, parks, and exits — the backend tracks everything. Specifically it handles:

| Task | What Happens |
|---|---|
| User Login | Verifies email + password, issues a secure token |
| Parking Lots | Create/manage physical parking locations |
| Parking Spots | Create/manage individual spots inside those lots |
| Vehicles | Users register their cars/bikes here |
| Tickets | Generated when a vehicle enters a spot; completed when it exits |
| Invoices | Automatically created on exit, with amount calculated from parking duration |
| Payments | Users can mark their invoice as PAID |
| Roles & Permissions | Super Admin controls exactly what Admins and Users can do |

The frontend (the React web app) is just a nice screen — all real work, data storage, and validation happens here.

---

## 2. Tech Stack — Tools Used

| Tool | What It Does in Plain English |
|---|---|
| **Node.js** | Runs JavaScript code on the server (not in a browser) |
| **Express.js v5** | Handles incoming web requests and routes them to the right function |
| **MongoDB** | The database — stores all data in JSON-like documents |
| **Mongoose** | Connects Node.js to MongoDB; defines the shape of each document |
| **JWT (jsonwebtoken)** | Creates secure login tokens — like a digital ID card |
| **bcryptjs** | Scrambles passwords before saving so they are never stored as plain text |
| **Joi** | Validates request data — rejects missing or badly formatted input before it reaches the database |
| **dotenv** | Loads secret settings (like passwords and keys) from a `.env` file |
| **Morgan** | Prints every incoming request to the console — great for debugging |
| **Winston** | Structured application logging |
| **CORS** | Allows the frontend (on a different port) to communicate with this backend |

---

## 3. Prerequisites — What to Install First

Before you can run this project, make sure the following software is installed on your computer.

### Node.js (version 18 or higher)

Node.js is what runs JavaScript outside a browser.

- Download it from: **https://nodejs.org**
- Choose the **LTS (Long Term Support)** version
- After installing, open a terminal and verify:
  ```bash
  node --version
  ```
  You should see something like `v20.x.x`. If you see a version number, you are good.

### npm (comes with Node.js automatically)

npm is used to install packages. Verify it works:
```bash
npm --version
```

### MongoDB

MongoDB is the database where all parking data is stored.

**Option A — Install MongoDB locally (recommended for development):**
- Download from: **https://www.mongodb.com/try/download/community**
- Install it and make sure the MongoDB service is **running** before starting the backend
- Verify by running: `mongod --version`

**Option B — Use MongoDB Atlas (free cloud database, no installation needed):**
- Go to **https://www.mongodb.com/atlas**
- Create a free account and a free cluster
- Get your connection string (looks like `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dbname`)
- Paste it as the `MONGO_URI` in your `.env` file

---

## 4. Project Folder Structure Explained

```
ParkingLotSystemBackend/
│
├── server.js                      ← Entry point: starts the HTTP server, connects to DB
├── app.js                         ← Registers all routes and middleware with Express
├── .env                           ← Your secret settings (NEVER commit this to Git)
├── api.http                       ← All API requests pre-written for testing in VS Code
├── package.json                   ← Lists all dependencies and available commands
│
└── src/
    │
    ├── config/
    │   ├── config.js              ← Reads values from .env (PORT, MONGO_URI, JWT_SECRET)
    │   └── db.js                  ← Connects to MongoDB on server startup
    │
    ├── middleware/                 ← Code that runs before every request reaches the controller
    │   ├── authentication.middleware.js  ← Checks: "Is the user logged in?" (validates JWT token)
    │   ├── authorization.middleware.js   ← Checks: "Does this role have permission?" (RBAC)
    │   ├── validate.middleware.js        ← Checks: "Is the request body valid?" (Joi schemas)
    │   └── error.middleware.js           ← Catches all unhandled errors, sends a clean JSON response
    │
    ├── models/                    ← Defines the shape of every document stored in MongoDB
    │   ├── User.model.js          ← name, email, password (hashed), role
    │   ├── RoleAccess.model.js    ← role + resource + allowed actions
    │   ├── Resource.model.js      ← list of named resources in the system
    │   ├── ParkingLot.model.js    ← name, address, city, totalSpots
    │   ├── ParkingSpot.model.js   ← spotNumber, spotType, isOccupied, linked to ParkingLot
    │   ├── Vehicle.model.js       ← licensePlate, type, make, model, color, linked to User
    │   ├── Ticket.model.js        ← vehicle + spot + entryTime + exitTime + status
    │   ├── Fee.model.js           ← vehicleType + baseFare + ratePerHour
    │   └── Invoice.model.js       ← ticket + user + amount + status (PENDING / PAID)
    │
    ├── validations/               ← Joi schemas — rules for what each request body must look like
    │   ├── user.validation.js
    │   ├── parkingLot.validation.js
    │   ├── parkingSpot.validation.js
    │   ├── vehicle.validation.js
    │   ├── ticket.validation.js
    │   ├── fee.validation.js
    │   ├── invoice.validation.js
    │   └── roleAccess.validation.js
    │
    ├── services/                  ← All actual business logic lives here
    │   ├── parkingLot.service.js
    │   ├── parkingSpot.service.js
    │   ├── vehicle.service.js
    │   ├── ticket.service.js      ← Checks vehicle/spot type match, marks spot as occupied
    │   ├── fee.service.js
    │   └── invoice.service.js     ← Calculates invoice amount using fee config
    │
    ├── controllers/               ← Receives the request, calls a service, sends back a response
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── roleAccess.controller.js
    │   ├── resource.controller.js
    │   ├── parkingLot.controller.js
    │   ├── parkingSpot.controller.js
    │   ├── vehicle.controller.js
    │   ├── ticket.controller.js
    │   ├── fee.controller.js
    │   └── invoice.controller.js
    │
    ├── routes/                    ← Maps URLs to the right controller function
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── roleAccess.routes.js
    │   ├── resource.routes.js
    │   ├── parkingLot.routes.js
    │   ├── parkingSpot.routes.js
    │   ├── vehicle.routes.js
    │   ├── ticket.routes.js
    │   ├── fee.routes.js
    │   └── invoice.routes.js
    │
    └── scripts/
        └── seedSuperAdmin.js      ← One-time script to create the very first Super Admin account
```

---

## 5. Step-by-Step Setup Guide

Follow these steps **in exact order** the very first time you set up the project.

---

### Step 1 — Get the project on your computer

If you downloaded a ZIP file, extract it. If using Git:
```bash
git clone <repository-url>
cd NodeExpress_Parking_Lot_System/ParkingLotSystemBackend
```

---

### Step 2 — Install all dependencies

Open a terminal **inside the `ParkingLotSystemBackend` folder** and run:

```bash
npm install
```

This reads `package.json` and downloads all required packages (Express, Mongoose, etc.) into a `node_modules` folder. This may take 1–2 minutes.

---

### Step 3 — Create your `.env` file

The `.env` file contains secret configuration values. Create a new file named exactly `.env` (with a dot at the start) in the `ParkingLotSystemBackend` folder.

Copy and paste the following, then edit it to match your setup:

```env
# Port the server will run on
PORT=5000

# MongoDB connection string
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/parking_lot

# For MongoDB Atlas (cloud), use your connection string:
# MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/parking_lot

# Secret key for signing JWT tokens — make this long and random in production!
JWT_SECRET=change_this_to_a_very_long_random_secret_key

# Super Admin credentials — used only by the seed script (npm run seed)
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=superadmin@parkingsystem.com
SUPER_ADMIN_PASSWORD=SuperSecret123!
```

> **Security tip:** In a real production environment, never use simple values for `JWT_SECRET`. Use something like: `JWT_SECRET=Kd9$mR2!pQw8#nLv4@eZx6&uYt0*cAf3`

---

### Step 4 — Start MongoDB

- **Local MongoDB (Windows):** Search for "Services" in the Start menu → find "MongoDB Server" → make sure it is **Running**
- **Local MongoDB (Mac):** Run `brew services start mongodb-community`
- **Local MongoDB (Linux):** Run `sudo systemctl start mongod`
- **MongoDB Atlas:** Nothing to do — it is always online in the cloud

---

### Step 5 — Create the first Super Admin account

The system cannot work without at least one Super Admin. There is no sign-up page for Super Admins — they must be created by running this one-time seed command:

```bash
npm run seed
```

If successful, you will see:
```
Connected to MongoDB
Super admin created successfully
  Email   : superadmin@parkingsystem.com
  Password: SuperSecret123!
```

> This command is **safe to run multiple times**. If a Super Admin already exists, it simply skips and exits without doing anything.

After the Super Admin is created, they can log in and create Admin and User accounts from the web app.

---

### Step 6 — Start the backend server

```bash
npm start
```

You should see output like:
```
MongoDB connected successfully
Server running on http://localhost:5000
```

The backend is now live at `http://localhost:5000`.

---

### Step 7 — Confirm it is working

Open your browser and go to:
```
http://localhost:5000/health
```

You should see:
```json
{ "status": "ok" }
```

If you see this, the backend is running correctly.

---

## 6. Environment Variables (.env File)

| Variable | What It Is | Example Value |
|---|---|---|
| `PORT` | The port number the server will listen on | `5000` |
| `MONGO_URI` | Full connection string to your MongoDB database | `mongodb://localhost:27017/parking_lot` |
| `JWT_SECRET` | A secret key used to sign and verify login tokens | `myS3cretK3y!` |
| `SUPER_ADMIN_NAME` | The name given to the seeded Super Admin account | `Super Admin` |
| `SUPER_ADMIN_EMAIL` | The email for the seeded Super Admin | `superadmin@parkingsystem.com` |
| `SUPER_ADMIN_PASSWORD` | The password for the seeded Super Admin | `SuperSecret123!` |

> **Never share your `.env` file publicly.** Add `.env` to your `.gitignore` file so it is never accidentally committed to Git.

---

## 7. Available Commands

Run these commands from inside the `ParkingLotSystemBackend` folder:

| Command | What It Does |
|---|---|
| `npm install` | Installs all dependencies listed in package.json |
| `npm start` | Starts the backend server on the configured PORT |
| `npm run seed` | Creates the first Super Admin account in the database |

---

## 8. User Roles — Who Can Do What

There are **3 roles** in the system. Understanding them is essential to using the app correctly.

---

### SUPER_ADMIN — The All-Powerful Administrator

There is usually only **one** Super Admin. This account is created via `npm run seed` — it cannot be created from the web app.

**What SUPER_ADMIN can do:**
- Everything. No restrictions whatsoever.
- Create, edit, and delete **Admin** and **User** accounts
- Control **Role Access** — define exactly what Admins and Users are allowed to do
- Manage **Resources** — the list of named features in the system
- Create, edit, delete Parking Lots, Spots, Vehicles, Tickets, Fees, Invoices
- View all data across all users

---

### ADMIN — The Manager

An Admin is created **by the Super Admin** through the web app.

**What ADMIN can do (based on Role Access configuration):**
- Create **User** accounts only — cannot create Admin or Super Admin accounts
- Create and manage Parking Lots, Parking Spots, Fee configurations
- View all vehicles, tickets, and invoices across all users
- Cannot manage Role Access or Resources

> Note: An Admin's exact permissions depend on what the Super Admin has granted via Role Access. If the Super Admin hasn't granted `PARKINGLOT CREATE` to Admins, even an Admin cannot create parking lots.

---

### USER — The Regular Customer

A User account is created **by an Admin or Super Admin**. Users are the people who actually use the parking lot.

**What USER can do:**
- Register their own vehicles
- Create a parking ticket (park a vehicle in an available spot)
- Exit (complete a ticket) — this auto-generates an invoice
- Pay their invoice
- View only their **own** vehicles, tickets, and invoices — they cannot see other users' data

**What USER cannot do:**
- Create, edit, or delete Parking Lots or Parking Spots
- View other users' data
- Manage fees, roles, or permissions
- Delete tickets or invoices

---

## 9. How Authentication Works

Authentication answers the question: **"Who are you?"**

Here is the complete flow:

```
1. User sends POST /api/auth/login  with email + password
        ↓
2. Backend looks up the user in the database
        ↓
3. Backend compares the sent password with the stored (hashed) password
        ↓
4. If correct → Backend creates a JWT token (a signed digital ID card)
        ↓
5. Token is returned to the user (frontend stores it in the browser)
        ↓
6. For every future request, the user sends the token in the header:
        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        ↓
7. Backend's authentication middleware reads and verifies the token
        ↓
8. If valid → user info (id, role, email) is attached to the request and it proceeds
   If invalid or missing → 401 Unauthorized is returned
```

**What is a JWT Token?**
A JWT (JSON Web Token) is a long string of characters that encodes the user's identity. It cannot be faked because it is signed with a secret key (`JWT_SECRET` from your `.env` file). It has an expiry time, after which the user must log in again.

---

## 10. How Permissions Work

Authorization answers: **"Are you allowed to do this?"**

The system has two layers:

### Layer 1 — Hard-coded Role Guards
Some routes are restricted to specific roles regardless of Role Access settings:
- Only `SUPER_ADMIN` can create/edit/delete Role Access entries
- Only `SUPER_ADMIN` can create/edit/delete Resources
- Only `SUPER_ADMIN` and `ADMIN` can create new users

### Layer 2 — Dynamic Role Access (configured by Super Admin)
For most features (Parking Lots, Spots, Vehicles, Tickets, Fees, Invoices), the Super Admin defines permissions by creating **Role Access** entries.

**Example:** To give Admins full control over parking lots:
```json
{
  "role": "ADMIN",
  "resource": "PARKINGLOT",
  "actions": ["CREATE", "READ", "UPDATE", "DELETE"]
}
```

**SUPER_ADMIN always bypasses all permission checks.** They can always do everything.

---

## 11. Database Collections Explained

MongoDB stores data in **collections** (similar to tables in a spreadsheet). Here are all 9 collections:

### Users
Stores every account in the system.

| Field | Type | Rules |
|---|---|---|
| `name` | Text | Required, 2–50 characters |
| `email` | Text | Required, must be unique, stored in lowercase |
| `password` | Text | Required, minimum 6 chars, **stored as a hash — never readable** |
| `role` | Text | One of: `SUPER_ADMIN`, `ADMIN`, `USER` (default: `USER`) |
| `createdAt` | Date | Auto-set by the system |

### Parking Lots
The physical parking location (a building, floor, or area).

| Field | Type | Rules |
|---|---|---|
| `name` | Text | Required |
| `address` | Text | Required |
| `city` | Text | Required |
| `totalSpots` | Number | Required, minimum 1 |

### Parking Spots
Individual spots inside a parking lot. One lot can have many spots.

| Field | Type | Rules |
|---|---|---|
| `parkingLotId` | Reference → ParkingLot | Required |
| `spotNumber` | Text | Required, e.g., `T-01`, `F-05` |
| `spotType` | Text | One of: `TWO_WHEELER`, `THREE_WHEELER`, `FOUR_WHEELER` |
| `isOccupied` | True/False | Default: `false`. Set to `true` when a vehicle is parked |

### Vehicles
Vehicles registered by users.

| Field | Type | Rules |
|---|---|---|
| `userId` | Reference → User | Auto-set from the logged-in user's token |
| `licensePlate` | Text | Required, unique, auto-converted to uppercase |
| `vehicleType` | Text | One of: `TWO_WHEELER`, `THREE_WHEELER`, `FOUR_WHEELER` |
| `make` | Text | Brand name, e.g., `Honda` |
| `model` | Text | Model name, e.g., `Activa` |
| `color` | Text | e.g., `Red` |

### Tickets
A ticket is created when a vehicle enters and completed when it exits.

| Field | Type | Rules |
|---|---|---|
| `vehicleId` | Reference → Vehicle | Required |
| `parkingSpotId` | Reference → ParkingSpot | Required — spot type must match vehicle type |
| `entryTime` | Date | Auto-set to current time on creation |
| `exitTime` | Date | Set when ticket is completed (vehicle exits) |
| `status` | Text | `ACTIVE` (parked) or `COMPLETED` (exited) |

### Fees
Pricing configuration — set by Admins/Super Admin. One entry per vehicle type.

| Field | Type | Rules |
|---|---|---|
| `vehicleType` | Text | Unique — one fee per type |
| `baseFare` | Number | Flat charge applied every time (e.g., ₹20) |
| `ratePerHour` | Number | Additional charge per hour of parking (e.g., ₹10) |

### Invoices
The bill generated after a vehicle exits.

| Field | Type | Rules |
|---|---|---|
| `ticketId` | Reference → Ticket | Must be a COMPLETED ticket |
| `userId` | Reference → User | The person who is billed |
| `amount` | Number | Auto-calculated (see formula in section 14) |
| `status` | Text | `PENDING` or `PAID` |

### Role Access
Defines what each role is allowed to do on each resource. Managed entirely by Super Admin.

| Field | Type | Rules |
|---|---|---|
| `role` | Text | `SUPER_ADMIN`, `ADMIN`, or `USER` |
| `resource` | Text | e.g., `PARKINGLOT`, `VEHICLE`, `TICKET` |
| `actions` | List | Any combination of: `CREATE`, `READ`, `UPDATE`, `DELETE` |

### Resources
A simple list of named resources available in the system (e.g., PARKINGLOT, VEHICLE, etc.).

---

## 12. How a Request Flows Through the Code

When you make an API call, here is what happens step by step:

```
Your Request (e.g., POST /api/tickets)
           │
           ▼
      ┌─────────┐
      │  Route  │  ← Matches the URL and HTTP method
      └────┬────┘
           │
           ▼
 ┌──────────────────┐
 │  Authentication  │  ← Is the user logged in? Is the token valid?
 │   Middleware     │    If NO → return 401
 └────────┬─────────┘
           │
           ▼
 ┌──────────────────┐
 │  Authorization   │  ← Does this role have permission for this action?
 │   Middleware     │    If NO → return 403
 └────────┬─────────┘
           │
           ▼
 ┌──────────────────┐
 │   Validation     │  ← Is the request body correct? (Joi checks)
 │   Middleware     │    If NO → return 400 with details
 └────────┬─────────┘
           │
           ▼
 ┌──────────────────┐
 │   Controller     │  ← Receives the clean, validated request
 └────────┬─────────┘
           │
           ▼
 ┌──────────────────┐
 │    Service       │  ← Runs the business logic (e.g., checks spot type matches vehicle)
 └────────┬─────────┘
           │
           ▼
 ┌──────────────────┐
 │     Model        │  ← Talks to MongoDB, reads/writes data
 └────────┬─────────┘
           │
           ▼
 ┌──────────────────┐
 │   Controller     │  ← Sends the JSON response back to you
 └──────────────────┘
```

---

## 13. Complete API Endpoints Reference

**Base URL:** `http://localhost:5000/api`

For protected routes, include this header in every request:
```
Authorization: Bearer <your_jwt_token_here>
```

You get the token when you log in.

---

### Auth — `/api/auth`

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| POST | `/api/auth/login` | No | Everyone | Login with email + password. Returns JWT token. |
| GET | `/api/auth/profile` | Yes | Any logged-in user | Returns the currently logged-in user's profile. |

**Login — Request Body:**
```json
{
  "email": "superadmin@parkingsystem.com",
  "password": "SuperSecret123!"
}
```

**Login — Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "abc123",
      "name": "Super Admin",
      "email": "superadmin@parkingsystem.com",
      "role": "SUPER_ADMIN"
    }
  }
}
```

> Save the `token` value. Add it to the `Authorization` header for all subsequent requests.

---

### Users — `/api/users`

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| POST | `/api/users` | Yes | SUPER_ADMIN, ADMIN | Create a new user. ADMIN can only assign USER role. |
| GET | `/api/users` | No | Anyone | Get list of all users. |
| GET | `/api/users/:id` | No | Anyone | Get one user by ID. |
| PATCH | `/api/users/:id` | No | Anyone | Update a user's name or role. |
| DELETE | `/api/users/:id` | No | Anyone | Delete a user. |

**Create User — Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

> Valid roles: `USER`, `ADMIN`, `SUPER_ADMIN`. ADMIN users can only set role to `USER`.

---

### Role Access — `/api/role-access`

Controls what each role (ADMIN, USER) is allowed to do on each resource.

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| POST | `/api/role-access` | Yes | SUPER_ADMIN only | Create a permission entry. |
| GET | `/api/role-access` | Yes | Any logged-in user | List all permission entries. |
| GET | `/api/role-access/:id` | Yes | Any logged-in user | Get one permission entry. |
| PATCH | `/api/role-access/:id` | Yes | SUPER_ADMIN only | Update allowed actions. |
| DELETE | `/api/role-access/:id` | Yes | SUPER_ADMIN only | Delete a permission entry. |

**Create Permission — Request Body:**
```json
{
  "role": "ADMIN",
  "resource": "PARKINGLOT",
  "actions": ["CREATE", "READ", "UPDATE", "DELETE"]
}
```

> Valid resources: `PARKINGLOT`, `PARKINGSPOT`, `VEHICLE`, `TICKET`, `FEE`, `INVOICE`
> Valid actions: `CREATE`, `READ`, `UPDATE`, `DELETE`

---

### Parking Lots — `/api/parking-lots`

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| GET | `/api/parking-lots` | Yes | Any logged-in user | List all parking lots. |
| GET | `/api/parking-lots/:id` | Yes | Any logged-in user | Get one parking lot. |
| POST | `/api/parking-lots` | Yes | Roles with PARKINGLOT CREATE permission | Create a parking lot. |
| PATCH | `/api/parking-lots/:id` | Yes | Roles with PARKINGLOT UPDATE permission | Update a parking lot. |
| DELETE | `/api/parking-lots/:id` | Yes | Roles with PARKINGLOT DELETE permission | Delete a parking lot. |

**Create Parking Lot — Request Body:**
```json
{
  "name": "Downtown Parking Plaza",
  "address": "123 Main Street",
  "city": "Hyderabad",
  "totalSpots": 50
}
```

---

### Parking Spots — `/api/parking-spots`

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| GET | `/api/parking-spots` | Yes | Any logged-in user | List spots. Supports filters. |
| GET | `/api/parking-spots/:id` | Yes | Any logged-in user | Get one spot. |
| POST | `/api/parking-spots` | Yes | Roles with PARKINGSPOT CREATE permission | Create a spot inside a lot. |
| PATCH | `/api/parking-spots/:id` | Yes | Any logged-in user | Update spot details. |
| DELETE | `/api/parking-spots/:id` | Yes | Roles with PARKINGSPOT DELETE permission | Delete a spot. |

**Filters for GET /api/parking-spots:**
```
/api/parking-spots?parkingLotId=abc123&spotType=TWO_WHEELER&isOccupied=false
```

**Create Spot — Request Body:**
```json
{
  "parkingLotId": "<parking_lot_id>",
  "spotNumber": "T-01",
  "spotType": "TWO_WHEELER"
}
```

> Valid spot types: `TWO_WHEELER`, `THREE_WHEELER`, `FOUR_WHEELER`

---

### Vehicles — `/api/vehicles`

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| POST | `/api/vehicles` | Yes | Any logged-in user | Register a new vehicle (auto-linked to current user). |
| GET | `/api/vehicles/my` | Yes | Any logged-in user | Get only your own vehicles. |
| GET | `/api/vehicles` | Yes | Roles with VEHICLE READ permission | Get all vehicles from all users. |
| GET | `/api/vehicles/:id` | Yes | Any logged-in user | Get one vehicle by ID. |
| PATCH | `/api/vehicles/:id` | Yes | Any logged-in user | Update a vehicle's details. |
| DELETE | `/api/vehicles/:id` | Yes | Roles with VEHICLE DELETE permission | Delete a vehicle. |

**Register Vehicle — Request Body:**
```json
{
  "licensePlate": "TS09AB1234",
  "vehicleType": "TWO_WHEELER",
  "make": "Honda",
  "model": "Activa",
  "color": "Red"
}
```

> You do NOT send a userId — the backend takes it automatically from your login token.

---

### Tickets — `/api/tickets`

A ticket is created when a vehicle enters a spot, and completed when it exits.

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| POST | `/api/tickets` | Yes | Any logged-in user | Park a vehicle (create a ticket). |
| GET | `/api/tickets` | Yes | Any logged-in user | Get all tickets. |
| GET | `/api/tickets/:id` | Yes | Any logged-in user | Get one ticket. |
| POST | `/api/tickets/:id/checkout` | Yes | Any logged-in user | Exit the parking lot (complete the ticket, auto-generate invoice). |
| PATCH | `/api/tickets/:id` | Yes | Any logged-in user | Update a ticket. |
| DELETE | `/api/tickets/:id` | Yes | Roles with TICKET DELETE permission | Delete a ticket. |

**Park Vehicle (Create Ticket) — Request Body:**
```json
{
  "vehicleId": "<your_vehicle_id>",
  "parkingSpotId": "<available_spot_id>"
}
```

> The vehicle type and spot type **must match** — e.g., you cannot park a TWO_WHEELER in a FOUR_WHEELER spot.
> The spot is automatically marked as **occupied** when the ticket is created.
> When checkout is called, the spot is automatically **freed** and an invoice is auto-generated.

---

### Fees — `/api/fees`

Fees define how much to charge per vehicle type.

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| GET | `/api/fees` | Yes | Any logged-in user | List all fee configs. |
| GET | `/api/fees/:id` | Yes | Any logged-in user | Get one fee config. |
| POST | `/api/fees` | Yes | Roles with FEE CREATE permission | Create a fee for a vehicle type. |
| PATCH | `/api/fees/:id` | Yes | Roles with FEE UPDATE permission | Update base fare or hourly rate. |
| DELETE | `/api/fees/:id` | Yes | Roles with FEE DELETE permission | Delete a fee config. |

**Create Fee — Request Body:**
```json
{
  "vehicleType": "TWO_WHEELER",
  "baseFare": 20,
  "ratePerHour": 10
}
```

> Only **one fee per vehicle type** is allowed. There are 3 types, so max 3 fee entries total.

---

### Invoices — `/api/invoices`

| Method | Endpoint | Login Required | Who Can Use | Description |
|---|---|---|---|---|
| POST | `/api/invoices/generate` | Yes | Any logged-in user | Auto-generate invoice from a completed ticket. |
| POST | `/api/invoices` | Yes | Roles with INVOICE CREATE permission | Manually create an invoice. |
| GET | `/api/invoices/my` | Yes | Any logged-in user | Get only your own invoices. |
| GET | `/api/invoices` | Yes | Roles with INVOICE READ permission | Get all invoices from all users. |
| GET | `/api/invoices/:id` | Yes | Any logged-in user | Get one invoice. |
| POST | `/api/invoices/:id/pay` | Yes | Any logged-in user | Mark an invoice as PAID. |
| PATCH | `/api/invoices/:id` | Yes | Any logged-in user | Update an invoice. |
| DELETE | `/api/invoices/:id` | Yes | Roles with INVOICE DELETE permission | Delete an invoice. |

**Generate Invoice — Request Body:**
```json
{
  "ticketId": "<your_completed_ticket_id>"
}
```

> The ticket **must have status `COMPLETED`** (the vehicle must have exited first).

---

## 14. Invoice Calculation Formula

When an invoice is generated, the amount is automatically calculated:

```
Invoice Amount = Base Fare + ( ceil(Hours Parked) × Rate Per Hour )
```

- `ceil` means the hours are always **rounded UP** to the nearest whole number
- So 2.1 hours = 3 hours, 0.5 hours = 1 hour

**Example:**
```
Vehicle Type     : TWO_WHEELER
Base Fare        : ₹20
Rate Per Hour    : ₹10
Entry Time       : 10:00 AM
Exit Time        : 12:30 PM
Hours Parked     : 2.5 hours → rounded UP to 3 hours
─────────────────────────────────────────────────────
Invoice Amount   = ₹20 + (3 × ₹10) = ₹50
```

> **Important:** Fee configuration for each vehicle type must be set up by an Admin before invoices can be generated. If no fee exists for a vehicle type, invoice generation will fail.

---

## 15. Testing with the api.http File

The project includes an `api.http` file with **all API requests pre-written** and ready to run directly in VS Code — no Postman needed.

### Step 1 — Install the REST Client extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for **REST Client** by *Huachao Mao*
4. Click **Install**

### Step 2 — Open api.http

Open the `api.http` file in VS Code. You will see clickable **"Send Request"** links above every request block.

### Step 3 — How variables work

The file automatically captures tokens and IDs between requests:

```http
# @name loginSuperAdmin
POST http://localhost:5000/api/auth/login
...

@superAdminToken = {{loginSuperAdmin.response.body.data.token}}
```

After you run the login request, the token is stored in `@superAdminToken` and automatically included in every subsequent request that needs it. No copy-pasting required.

### Recommended Order to Run Requests

```
Phase 1 — First Time Setup (run once)
  → Login as Super Admin
  → Create Role Access permissions for ADMIN role
  → Create an Admin account

Phase 2 — Admin Sets Up Parking Infrastructure
  → Login as Admin
  → Create a Parking Lot
  → Create Parking Spots inside the lot
  → Configure Fees for each vehicle type
  → Create a User account

Phase 3 — User Parks and Pays
  → Login as User
  → Register a Vehicle
  → Get available spots matching vehicle type
  → Create a Ticket (park the vehicle)
  → Checkout (exit) → invoice is auto-generated
  → Pay the invoice

Phase 4 — Admin Oversight
  → Login as Admin
  → View all tickets, invoices, users
```

---

## 16. Common Errors & How to Fix Them

| Error Message | Why It Happened | How to Fix It |
|---|---|---|
| `Cannot connect to MongoDB` | MongoDB is not running | Start the MongoDB service on your computer |
| `401 Unauthorized` / `Authentication required` | You did not send a token, or the token is expired | Log in again to get a fresh token |
| `403 Forbidden` / `You do not have permission` | Your role is not allowed to do this | Ask Super Admin to grant the permission via Role Access |
| `400 Bad Request` | The request body has missing or invalid fields | Check the required fields listed in the endpoint reference above |
| `Vehicle type does not match spot type` | You tried to park a TWO_WHEELER in a FOUR_WHEELER spot | Select a spot whose type matches your vehicle's type |
| `Parking spot is already occupied` | Another vehicle is parked in that spot | Choose a different spot where `isOccupied` is `false` |
| `Invoice can only be generated for COMPLETED tickets` | The vehicle has not exited yet | Complete the ticket (checkout) before generating the invoice |
| `409 Conflict — email already exists` | Another user already has that email | Use a different email address |
| `409 Conflict — fee already exists for this type` | You already set a fee for that vehicle type | Use PATCH to update the existing fee instead |
| `Port 5000 already in use` | Another app is using that port | Change `PORT=5001` in `.env`, or stop the other app |
| `jwt malformed` | The token in the Authorization header is corrupted | Log out, log back in, and use the new token |
| `npm: command not found` | Node.js is not installed | Download and install from https://nodejs.org |
| Server starts but API calls fail | `.env` file is missing or has wrong values | Re-check your `.env` file contents |
