# Parking Lot System

A full-stack web application for managing parking lots, spots, vehicles, tickets, and invoices. It supports role-based access control with three user roles — **Super Admin**, **Admin**, and **User** — each with configurable permissions.

---

## What the System Does

| Capability | Description |
|---|---|
| Parking Lot Management | Create and manage physical parking locations |
| Spot Management | Track individual parking spots by type and availability |
| Vehicle Registration | Users register their vehicles (car, bike, auto) |
| Ticketing | Generate a ticket when a vehicle enters; complete it on exit |
| Invoicing | Automatically calculate and bill parking fees on exit |
| Payments | Mark invoices as paid |
| User Management | Admins create and manage user accounts |
| Role-Based Permissions | Super Admin controls exactly what each role can do |

---

## How It Works

The system is split into two parts: a **backend** that stores data and enforces business rules, and a **frontend** that provides the user interface. The frontend never holds business logic — it calls the backend API for every action.

```
Browser (React App)
       ↓  HTTP requests
Backend REST API (Node.js + Express)
       ↓  queries / writes
MongoDB Database
```

---

## User Roles

| Role | What They Can Do |
|---|---|
| **Super Admin** | Full access — manages users, roles, permissions, fee config, and all resources |
| **Admin** | Manages parking operations and can create User-level accounts |
| **User** | Parks vehicles, views own tickets and invoices |

Permissions are dynamic — the Super Admin can grant or revoke specific actions (Create, Read, Update, Delete) per resource per role from the Role Access page.

---

## Fee Calculation

```
Amount = Base Fare + (ceil(Hours Parked) × Rate Per Hour)
```

Fees are configured per vehicle type (Two-Wheeler, Three-Wheeler, Four-Wheeler) by an Admin or Super Admin.

---

## Tech Stack

### Backend

| Tool | Purpose |
|---|---|
| **Node.js** | Server-side JavaScript runtime |
| **Express.js v5** | HTTP routing and middleware |
| **MongoDB** | NoSQL document database |
| **Mongoose** | MongoDB schema modeling for Node.js |
| **JWT (jsonwebtoken)** | Stateless authentication tokens |
| **bcryptjs** | Password hashing |
| **Joi** | Request input validation |
| **dotenv** | Environment variable management |
| **Morgan** | HTTP request logging |
| **Winston** | Structured application logging |
| **CORS** | Cross-origin resource sharing |

### Frontend

| Tool | Purpose |
|---|---|
| **React 18** | Component-based UI framework |
| **Vite** | Development server and production build tool |
| **React Router v6** | Client-side page routing |
| **Axios** | HTTP client for API calls |
| **React Context API** | Global authentication state management |

Styles are written in plain CSS with custom properties — no CSS framework is used.

---

## Project Structure

```
NodeExpress_Parking_Lot_System/
├── ParkingLotSystemBackend/    ← REST API server
│   └── Readme.md               ← Backend setup and API reference
├── ParkingLotSystemFrontend/   ← React web application
│   └── README.md               ← Frontend setup and page reference
└── README.md                   ← This file
```

See each folder's README for setup instructions, environment variables, and a full feature reference.
