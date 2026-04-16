# Parking Lot System — Frontend

> The **client side** (screen) of the Parking Lot System. It is a React web application that provides the user interface for managing parking lots, vehicles, tickets, and invoices by communicating with the backend REST API.

---

## Table of Contents

1. [What Does This Frontend Do?](#1-what-does-this-frontend-do)
2. [Tech Stack — Tools Used](#2-tech-stack--tools-used)
3. [Prerequisites — What to Install First](#3-prerequisites--what-to-install-first)
4. [Project Folder Structure Explained](#4-project-folder-structure-explained)
5. [Step-by-Step Setup Guide](#5-step-by-step-setup-guide)
6. [Available Commands](#6-available-commands)
7. [How the App is Organized (Pages & Routing)](#7-how-the-app-is-organized-pages--routing)
8. [Sidebar Navigation — Who Sees What](#8-sidebar-navigation--who-sees-what)
9. [How Authentication Works in the Frontend](#9-how-authentication-works-in-the-frontend)
10. [How API Calls Work](#10-how-api-calls-work)
11. [Page-by-Page Feature Reference](#11-page-by-page-feature-reference)
12. [Shared Components Explained](#12-shared-components-explained)
13. [How the Proxy Works (No CORS Errors)](#13-how-the-proxy-works-no-cors-errors)
14. [Building for Production](#14-building-for-production)
15. [Common Errors & How to Fix Them](#15-common-errors--how-to-fix-them)

---

## 1. What Does This Frontend Do?

This is the **screen that users interact with**. Think of it as the dashboard on a wall of a real parking lot — it shows live data and lets staff and customers perform actions.

| Feature | What the Screen Lets You Do |
|---|---|
| Login | Enter email + password to get access |
| Dashboard | See a live summary of parking lots, spots, tickets, and invoices |
| Parking Lots | View, create, edit, and delete physical parking locations |
| Parking Spots | View spots, filter by type and availability, manage them |
| Vehicles | Register and manage your vehicles |
| Tickets | Park a vehicle, view active parking sessions, exit (checkout) |
| Invoices | Generate bills after exit, pay pending invoices |
| Fee Config | Set base fare and hourly rate per vehicle type (Admin/Super Admin) |
| Users | Create and manage user accounts (Admin/Super Admin) |
| Role Access | Control what each role is allowed to do (Super Admin only) |

The frontend never stores any business logic or data itself — it always calls the backend API to get or change data.

---

## 2. Tech Stack — Tools Used

| Tool | What It Does in Plain English |
|---|---|
| **React 18** | The framework for building the UI using reusable components |
| **Vite** | Lightning-fast development server and build tool — replaces Create React App |
| **React Router v6** | Handles navigation between pages without full page reloads |
| **Axios** | Makes HTTP requests to the backend API — simpler than the built-in fetch |
| **React Context API** | Shares login state (user, token, role) across all components without prop drilling |

No CSS frameworks (like Tailwind or Bootstrap) are used — styles are written in plain CSS with custom properties (CSS variables).

---

## 3. Prerequisites — What to Install First

Before running the frontend, make sure the following are installed.

### Node.js (version 18 or higher)

Vite and React both require Node.js.

- Download from: **https://nodejs.org**
- Choose the **LTS** version
- After installing, verify:
  ```bash
  node --version
  ```
  You should see something like `v20.x.x`.

### npm (comes with Node.js automatically)

```bash
npm --version
```

### The Backend Must Be Running

The frontend is just a screen — without the backend it cannot load any data. Make sure the backend server is running on `http://localhost:5000` before you start the frontend. See the backend README for setup instructions.

---

## 4. Project Folder Structure Explained

```
ParkingLotSystemFrontend/
│
├── index.html                     ← The one HTML file. Vite injects the React app here.
├── vite.config.js                 ← Vite configuration: port, proxy settings
├── package.json                   ← Lists all dependencies and scripts
│
├── dist/                          ← Created by `npm run build`. The production-ready files.
│   ├── index.html
│   └── assets/
│       ├── index-xxxx.js          ← All JavaScript bundled into one file
│       └── index-xxxx.css         ← All CSS bundled into one file
│
└── src/                           ← All source code lives here
    │
    ├── main.jsx                   ← Entry point: mounts the React app into index.html
    │
    ├── App.jsx                    ← Defines all routes (which URL loads which page)
    │
    ├── api/
    │   └── axios.js               ← Configured Axios instance with token injection + 401 handling
    │
    ├── context/
    │   └── AuthContext.jsx        ← Global login state: user, token, login(), logout(), isAdmin, isSuperAdmin
    │
    ├── components/                ← Reusable UI building blocks used across multiple pages
    │   ├── Layout.jsx             ← The shell: Sidebar + Navbar + page content area
    │   ├── Sidebar.jsx            ← Left navigation panel (role-aware)
    │   ├── Navbar.jsx             ← Top bar
    │   ├── ProtectedRoute.jsx     ← Redirects to /login if user is not logged in
    │   ├── Modal.jsx              ← Reusable pop-up dialog (create, delete, confirm forms)
    │   └── Toast.jsx              ← Temporary notification messages (success/error banners)
    │
    └── pages/                     ← One file per screen/page in the app
        ├── Login.jsx              ← Email + password login form
        ├── Dashboard.jsx          ← Overview stats + quick guide
        ├── ParkingLots.jsx        ← List, create, edit, delete parking lots
        ├── ParkingSpots.jsx       ← List, filter, create, edit, delete spots
        ├── Vehicles.jsx           ← Register and manage vehicles
        ├── Tickets.jsx            ← Park vehicle, view sessions, exit
        ├── Invoices.jsx           ← Generate bill, pay, delete
        ├── Fees.jsx               ← Set pricing per vehicle type
        ├── Users.jsx              ← Create and manage user accounts
        └── RoleAccess.jsx         ← Manage permissions for each role
```

---

## 5. Step-by-Step Setup Guide

Follow these steps in exact order the first time you set up the project.

---

### Step 1 — Get the project on your computer

```bash
git clone <repository-url>
cd NodeExpress_Parking_Lot_System/ParkingLotSystemFrontend
```

---

### Step 2 — Install all dependencies

Open a terminal **inside the `ParkingLotSystemFrontend` folder** and run:

```bash
npm install
```

This reads `package.json` and downloads React, Vite, Axios, and React Router into a `node_modules` folder.

---

### Step 3 — Make sure the backend is running

The frontend proxies all `/api` requests to `http://localhost:5000`. The backend must be started first.

In a **separate terminal**, go into `ParkingLotSystemBackend` and run:
```bash
npm start
```

Wait until you see:
```
MongoDB connected successfully
Server running on http://localhost:5000
```

---

### Step 4 — Start the frontend development server

Back in the `ParkingLotSystemFrontend` folder:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

---

### Step 5 — Open the app in your browser

Go to:
```
http://localhost:3000
```

You will be taken to the login page. Use the Super Admin credentials you set up during the backend seed step:
```
Email   : superadmin@parkingsystem.com
Password: SuperSecret123!
```

---

## 6. Available Commands

Run these commands from inside the `ParkingLotSystemFrontend` folder:

| Command | What It Does |
|---|---|
| `npm install` | Installs all dependencies listed in package.json |
| `npm run dev` | Starts the local development server on port 3000 with hot reload |
| `npm run build` | Bundles the app into the `dist/` folder for production deployment |
| `npm run preview` | Serves the built `dist/` folder locally — simulates production |

---

## 7. How the App is Organized (Pages & Routing)

React Router v6 is used. Every URL maps to a specific page component.

| URL | Page Component | Who Can Access |
|---|---|---|
| `/login` | `Login.jsx` | Only unauthenticated users (logged-in users are redirected away) |
| `/` | `Dashboard.jsx` | Any logged-in user |
| `/parking-lots` | `ParkingLots.jsx` | Any logged-in user |
| `/parking-spots` | `ParkingSpots.jsx` | Any logged-in user |
| `/vehicles` | `Vehicles.jsx` | Any logged-in user |
| `/tickets` | `Tickets.jsx` | Any logged-in user |
| `/invoices` | `Invoices.jsx` | Any logged-in user |
| `/fees` | `Fees.jsx` | Admin and Super Admin only (hidden from sidebar for Users) |
| `/users` | `Users.jsx` | Admin and Super Admin only |
| `/role-access` | `RoleAccess.jsx` | Super Admin only |
| Any other URL | — | Redirected to `/` automatically |

**How the route protection works:**

```
User visits any page under /
        ↓
ProtectedRoute checks: is there a logged-in user in AuthContext?
        ↓
  No  → Redirect to /login
  Yes → Render Layout (Sidebar + page content)
        ↓
  Page renders with data fetched from the backend API
```

---

## 8. Sidebar Navigation — Who Sees What

The sidebar changes based on the logged-in user's role. This is purely a UI convenience — the backend enforces real permissions regardless.

### All Roles (USER, ADMIN, SUPER_ADMIN)

| Section | Link | Page |
|---|---|---|
| Main | Dashboard | `/` |
| Parking | Parking Lots | `/parking-lots` |
| Parking | Parking Spots | `/parking-spots` |
| Operations | Vehicles | `/vehicles` |
| Operations | Tickets | `/tickets` |
| Operations | Invoices | `/invoices` |

### ADMIN and SUPER_ADMIN additionally see

| Section | Link | Page |
|---|---|---|
| Management | Fee Config | `/fees` |
| Management | Users | `/users` |

### SUPER_ADMIN additionally sees

| Section | Link | Page |
|---|---|---|
| Management | Role Access | `/role-access` |

The bottom of the sidebar always shows:
- The logged-in user's **name** and **role**
- A **logout button** (the ⎋ icon)

---

## 9. How Authentication Works in the Frontend

Authentication state is managed by `AuthContext` and stored in `localStorage` so it survives page refreshes.

### Login Flow

```
1. User submits the login form (email + password)
        ↓
2. AuthContext calls POST /api/auth/login via Axios
        ↓
3. Backend returns: { token, user: { name, email, role } }
        ↓
4. Frontend stores:
     localStorage.setItem('token', token)
     localStorage.setItem('user', JSON.stringify(userData))
        ↓
5. AuthContext state is updated → user is now "logged in"
        ↓
6. React Router redirects to Dashboard (/)
```

### Staying Logged In After Refresh

When the app loads, `AuthContext` reads from `localStorage`:

```js
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('user')
  return saved ? JSON.parse(saved) : null
})
```

If a user object exists, the session is restored — no new login needed.

### Logout Flow

```
User clicks the logout button (⎋) in the sidebar
        ↓
AuthContext.logout() is called
        ↓
localStorage.removeItem('token')
localStorage.removeItem('user')
        ↓
user state becomes null
        ↓
ProtectedRoute detects null user → redirects to /login
```

### Helper Values in AuthContext

Every component in the app can call `useAuth()` to access:

| Value | Type | What It Is |
|---|---|---|
| `user` | Object or null | The logged-in user: `{ _id, name, email, role }` |
| `login(email, password)` | Function | Calls the login API and updates state |
| `logout()` | Function | Clears everything and redirects to login |
| `isAdmin` | Boolean | `true` if role is `ADMIN` or `SUPER_ADMIN` |
| `isSuperAdmin` | Boolean | `true` only if role is `SUPER_ADMIN` |

---

## 10. How API Calls Work

All API calls go through `src/api/axios.js` — a configured Axios instance.

### Base URL

The base URL is set to `/api` — not a full URL:

```js
const api = axios.create({ baseURL: '/api' })
```

This means a call to `api.get('/parking-lots')` becomes `GET /api/parking-lots`. Vite then proxies that to `http://localhost:5000/api/parking-lots` (see [Section 13](#13-how-the-proxy-works-no-cors-errors)).

### Automatic Token Attachment

Every request automatically includes the JWT token from `localStorage`:

```
Request Interceptor fires before every request
        ↓
Reads token from localStorage
        ↓
Adds header: Authorization: Bearer eyJhbGci...
        ↓
Request is sent to the backend
```

You never need to manually add the `Authorization` header in any page component.

### Automatic Logout on Token Expiry

```
Response comes back with status 401 (Unauthorized)
        ↓
Response Interceptor catches it
        ↓
Clears localStorage (removes token + user)
        ↓
window.location.href = '/login'
```

If your session expires while using the app, you are sent back to the login page automatically.

---

## 11. Page-by-Page Feature Reference

### Login (`/login`)

- Email + password form
- On success: saves token and user to localStorage, redirects to Dashboard
- Already-logged-in users are redirected away from this page automatically

---

### Dashboard (`/`)

Shows a live summary of the system in stat cards:

| Stat Card | What It Shows |
|---|---|
| Parking Lots | Total number of parking lots |
| Available Spots | Spots where `isOccupied` is false |
| Active Tickets | Tickets with status `ACTIVE` |
| Pending Invoices | Invoices with status `PENDING` (your own if User, all if Admin) |
| My Vehicles | Number of vehicles registered under your account |

Also shows a **Quick Guide** — 4 steps that remind users how to park and pay.

---

### Parking Lots (`/parking-lots`)

| Action | Who Can Do It |
|---|---|
| View all lots in a table | Any logged-in user |
| Create a new lot (name, address, city, total spots) | Roles with PARKINGLOT CREATE permission |
| Edit an existing lot | Roles with PARKINGLOT UPDATE permission |
| Delete a lot | Roles with PARKINGLOT DELETE permission |

---

### Parking Spots (`/parking-spots`)

| Action | Who Can Do It |
|---|---|
| View all spots | Any logged-in user |
| Filter by lot, spot type, or availability | Any logged-in user |
| Create a new spot (spot number, type, lot) | Roles with PARKINGSPOT CREATE permission |
| Edit a spot | Any logged-in user |
| Delete a spot | Roles with PARKINGSPOT DELETE permission |

**Spot Types:** `TWO_WHEELER`, `THREE_WHEELER`, `FOUR_WHEELER`

The availability badge shows `FREE` (green) or `OCCUPIED` (red) for each spot.

---

### Vehicles (`/vehicles`)

| Action | Who Can Do It |
|---|---|
| View your own vehicles | Any logged-in user |
| View all vehicles across all users | Roles with VEHICLE READ permission |
| Register a new vehicle (license plate, type, make, model, color) | Any logged-in user |
| Edit a vehicle | Any logged-in user |
| Delete a vehicle | Roles with VEHICLE DELETE permission |

The vehicle is automatically linked to the logged-in user — you do not select an owner when registering.

---

### Tickets (`/tickets`)

Tickets track when a vehicle enters and exits a parking spot.

| Action | Who Can Do It |
|---|---|
| View tickets (your own if User, all if Admin) | Any logged-in user |
| Park a vehicle — creates a ticket | Any logged-in user |
| Exit (checkout) — completes the ticket, frees the spot, auto-generates an invoice | Any logged-in user |
| Delete a ticket | Roles with TICKET DELETE permission (Admin button only) |

**Parking flow in the UI:**
1. Click **+ Park Vehicle**
2. Select one of your registered vehicles from the dropdown
3. The app automatically filters available spots to only show spots that **match your vehicle type**
4. Select a spot → click **Park Vehicle**
5. The ticket is created and the spot is marked as occupied

**Exit flow:**
1. Find the ACTIVE ticket in the table
2. Click **Exit**
3. Confirm → ticket status becomes COMPLETED, spot becomes free, invoice is auto-generated

The table shows each ticket's license plate, spot number, entry time, exit time, live duration, and status badge (`ACTIVE` in green, `COMPLETED` in grey).

---

### Invoices (`/invoices`)

| Action | Who Can Do It |
|---|---|
| View invoices (your own if User, all if Admin) | Any logged-in user |
| Generate an invoice from a completed ticket | Any logged-in user |
| Pay a pending invoice | Any logged-in user |
| Delete an invoice | Roles with INVOICE DELETE permission (Admin button only) |

**Invoice summary cards** at the top of the page show:
- Total Billed (all invoices combined)
- Collected (amount from PAID invoices)
- Pending (amount from PENDING invoices)

The generate dropdown only shows tickets that are:
1. Status = COMPLETED
2. Not yet invoiced

---

### Fee Config (`/fees`)

Only visible to **ADMIN** and **SUPER_ADMIN** in the sidebar.

| Action | Who Can Do It |
|---|---|
| View fee configurations | Any logged-in user |
| Create a fee entry (vehicle type, base fare, rate per hour) | Roles with FEE CREATE permission |
| Edit an existing fee | Roles with FEE UPDATE permission |
| Delete a fee | Roles with FEE DELETE permission |

**Fee Formula:** `Amount = Base Fare + (ceil(Hours Parked) × Rate Per Hour)`

There is one fee per vehicle type — maximum 3 entries total.

---

### Users (`/users`)

Only visible to **ADMIN** and **SUPER_ADMIN** in the sidebar.

| Action | Who Can Do It |
|---|---|
| View all user accounts | ADMIN, SUPER_ADMIN |
| Create a new user (name, email, password, role) | SUPER_ADMIN, ADMIN (ADMIN can only assign USER role) |
| Edit a user | ADMIN, SUPER_ADMIN |
| Delete a user | ADMIN, SUPER_ADMIN |

---

### Role Access (`/role-access`)

Only visible to **SUPER_ADMIN** in the sidebar.

| Action | Who Can Do It |
|---|---|
| View all role-permission entries | Any logged-in user |
| Create a permission (role + resource + actions) | SUPER_ADMIN only |
| Edit actions for an existing entry | SUPER_ADMIN only |
| Delete an entry | SUPER_ADMIN only |

**Resources:** `PARKINGLOT`, `PARKINGSPOT`, `VEHICLE`, `TICKET`, `FEE`, `INVOICE`
**Actions:** `CREATE`, `READ`, `UPDATE`, `DELETE`

---

## 12. Shared Components Explained

### `Layout.jsx`

The outer shell that wraps every page. It renders:
- `Sidebar` on the left
- `Navbar` at the top
- The active page's content in the main area

### `Sidebar.jsx`

The left navigation panel. It:
- Shows different navigation links based on the user's role (`isAdmin`, `isSuperAdmin`)
- Highlights the currently active route
- Shows the user's name and role at the bottom
- Has a logout button

### `Navbar.jsx`

The top bar shown on every page. Displays page context and user info.

### `ProtectedRoute.jsx`

A wrapper component. If the user is not logged in (`user` from AuthContext is null), it redirects to `/login`. Otherwise it renders the wrapped page. Used in `App.jsx` to protect all routes under the main layout.

### `Modal.jsx`

A reusable pop-up dialog used across all pages for:
- Create forms
- Edit forms
- Delete confirmation prompts
- Action confirmations (exit, pay)

Props: `title`, `onClose`, `footer`, `children`

### `Toast.jsx`

A system for showing temporary notification banners at the top of the screen.

- **Green (success):** Action completed — e.g., "Ticket created — vehicle parked!"
- **Red (error):** Something went wrong — e.g., "Vehicle type does not match spot type"

Usage in any page:
```js
const toast = useToast()
toast('Success message')           // green
toast('Error message', 'error')    // red
```

Toasts disappear automatically after a few seconds.

---

## 13. How the Proxy Works (No CORS Errors)

In development, the frontend (port 3000) and backend (port 5000) run on different ports. Normally this causes **CORS errors**. Vite's built-in proxy solves this.

The proxy is configured in `vite.config.js`:

```js
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

**What this means:**

```
Browser sends:   GET http://localhost:3000/api/parking-lots
        ↓
Vite dev server intercepts (same origin — no CORS issue)
        ↓
Vite forwards:   GET http://localhost:5000/api/parking-lots
        ↓
Backend responds → Vite passes the response back to the browser
```

The browser never directly talks to port 5000. From its perspective, everything is on port 3000.

> **Note:** This proxy only works in development (`npm run dev`). In production, you deploy the frontend and backend together or configure the web server (e.g., Nginx) to handle the proxy.

---

## 14. Building for Production

When you are ready to deploy the app:

```bash
npm run build
```

This creates a `dist/` folder with:
- `dist/index.html` — the HTML shell
- `dist/assets/index-xxxx.js` — all JavaScript bundled and minified
- `dist/assets/index-xxxx.css` — all CSS bundled and minified

To preview the production build locally before deploying:

```bash
npm run preview
```

This serves the `dist/` folder on a local port (usually 4173). Open the URL shown in the terminal.

### Deploying

In production, the `dist/` folder can be:
- Served as static files by the backend (Express can serve the `dist` folder)
- Deployed to a static hosting service (Netlify, Vercel, etc.)
- Served by a web server like Nginx in front of the backend

> In production, update the Axios `baseURL` or configure your server to route `/api/*` requests to the backend.

---

## 15. Common Errors & How to Fix Them

| Error / Symptom | Why It Happened | How to Fix It |
|---|---|---|
| Blank screen at `localhost:3000` | The dev server is not running | Run `npm run dev` inside the frontend folder |
| Login fails with "Network Error" | The backend is not running | Start the backend with `npm start` in the backend folder |
| All data shows as empty / requests fail | Vite proxy cannot reach the backend | Make sure the backend is running on port 5000 |
| "You do not have permission" error | Your role lacks the required Role Access entry | Ask Super Admin to grant the permission in the Role Access page |
| Logged out unexpectedly | The JWT token expired | This is expected — log back in to get a new token |
| "No available spots match your vehicle type" | No free spots exist for your vehicle type | Ask an Admin to add more spots of the matching type |
| "No uninvoiced completed tickets found" | All completed tickets already have invoices, or none are completed yet | Exit an active ticket first (checkout), then generate the invoice |
| `npm run dev` fails | Node.js not installed or wrong version | Install Node.js v18+ from https://nodejs.org |
| `node_modules not found` errors | Dependencies not installed | Run `npm install` first |
| Port 3000 already in use | Another app is using that port | Change `port: 3001` in `vite.config.js`, or stop the other app |
| Changes in code not reflected | Browser cache is stale | Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac) |
| Logged in but redirected to login on refresh | `localStorage` was cleared | This happens in private/incognito mode — use a regular browser tab |
