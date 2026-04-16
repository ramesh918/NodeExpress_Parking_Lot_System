# Video 21 — Authorization in Express (Role-Based Access Control)

---

## 1. Authentication vs Authorization

|                        | Authentication             | Authorization            |
| ---------------------- | -------------------------- | ------------------------ |
| Question               | *Who are you?*             | *What can you do?*       |
| When                   | Login / token verification | After authentication     |
| Result                 | Identity confirmed         | Access granted or denied |
| HTTP Status on failure | `401 Unauthorized`         | `403 Forbidden`          |
| Already built?         | Yes (JWT login flow)       | What we build today      |

> **Key rule:** Authorization always comes AFTER authentication.
> You must know WHO the user is before deciding WHAT they can do.

---

## 2. Roles in This Project

We have three roles defined in `RoleAccess.model.js`:

| Role          | Who                 | Access Level                                         |
| ------------- | ------------------- | ---------------------------------------------------- |
| `USER`        | user                | Own vehicle, available slots, make tickets           |
| `ADMIN`       | Parking lot manager | All slots, all tickets, user management              |
| `SUPER_ADMIN` | System owner        | Everything including admin management, system config |

### Role Hierarchy

```
SUPER_ADMIN  (highest)
     |
   ADMIN
     |
   USER      (lowest)
```

---

## 3. Permissions Table (CRUD per Resource)

| Resource                       | USER         | ADMIN                        | SUPER_ADMIN                  |
| ------------------------------ | ------------ | ---------------------------- | ---------------------------- |
| Parking Slots (view available) | READ         | READ                         | READ                         |
| Parking Slots (manage all)     | -            | CREATE, READ, UPDATE, DELETE | CREATE, READ, UPDATE, DELETE |
| Tickets (own)                  | CREATE, READ | READ                         | READ                         |
| Tickets (all)                  | -            | READ, UPDATE                 | READ, UPDATE, DELETE         |
| Users (own profile)            | READ, UPDATE | READ                         | READ, UPDATE, DELETE         |
| Users (all)                    | -            | CREATE, READ, UPDATE, DELETE | CREATE, READ, UPDATE, DELETE        |
| Admins (manage)                | -            | -                            | CREATE, READ, UPDATE, DELETE |
| System Config                  | -            | -                            | READ, UPDATE                 |

---

## 4. Step-by-Step Implementation

---

### Step 1 — Add `role` to User Model

In `src/models/User.model.js`, add the role field:

```js
role: {
  type: String,
  enum: {
    values: ['USER', 'ADMIN', 'SUPER_ADMIN'],
    message: 'Role must be USER, ADMIN, or SUPER_ADMIN',
  },
  default: 'USER',
},
```

**Explain:**
- `enum` restricts values to only valid roles.
- Default is `USER` — safest default, never accidentally create an admin.
- `SUPER_ADMIN` is never assigned by default, only manually or by another super admin.

---

### Step 2 — Include `role` in JWT Payload

In `src/utils/jwt.js`, when signing the token:

```js
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,       // include role in token
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
```

**Explain:** The role is embedded in the token so every request carries the user's role without an extra DB lookup.

---

### Step 3 — `protect` Middleware (Verify JWT)

Create `src/middleware/auth.middleware.js`:

```js
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError('Not authenticated. No token provided.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return next(new ApiError('Invalid or expired token.', 401));
  }
};

module.exports = { protect };
```

---

### Step 4 — `authorize` Middleware (Check Role)

Create `src/middleware/authorize.middleware.js`:

```js
const ApiError = require('../utils/apiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Access denied. Role '${req.user.role}' is not allowed to perform this action.`,
          403
        )
      );
    }

    next();
  };
};

module.exports = { authorize };
```

**Explain:**
- `...roles` means you can pass one or more roles: `authorize('ADMIN', 'SUPER_ADMIN')`
- `403 Forbidden` — the user is authenticated but does not have permission.

---

### Step 5 — Apply Middleware to Routes

```js
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/authorize.middleware');

// --- PUBLIC (no token needed) ---
router.get('/slots/available', getAvailableSlots);

// --- ANY LOGGED-IN USER ---
router.post('/slots/park', protect, parkVehicle);
router.post('/slots/unpark/:id', protect, unparkVehicle);

// --- ADMIN + SUPER_ADMIN ---
router.get('/slots/all', protect, authorize('ADMIN', 'SUPER_ADMIN'), getAllSlots);
router.put('/slots/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateSlot);
router.delete('/slots/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteSlot);

// --- SUPER_ADMIN ONLY ---
router.post('/admin/create', protect, authorize('SUPER_ADMIN'), createAdmin);
router.delete('/admin/:id', protect, authorize('SUPER_ADMIN'), deleteAdmin);
router.get('/system/config', protect, authorize('SUPER_ADMIN'), getSystemConfig);
```

**Explain the middleware chain:**
```
Request → protect (is token valid?) → authorize (is role allowed?) → controller
```

---

### Step 6 — Ownership Check (User can only access their own data)

Even with `USER` role, a user should only unpark their own vehicle:

```js
const unpark = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return next(new ApiError('Ticket not found.', 404));
    }

    // Ownership check — USER can only access their own tickets
    // ADMIN and SUPER_ADMIN can access any ticket
    if (
      req.user.role === 'USER' &&
      ticket.user.toString() !== req.user.id
    ) {
      return next(new ApiError('You are not allowed to access this ticket.', 403));
    }

    // proceed with unpark logic...
  } catch (err) {
    next(err);
  }
};
```

---

### Step 7 — RoleAccess Model (Dynamic Permissions)

We already have `src/models/RoleAccess.model.js` which stores permissions dynamically in the database:

```
RoleAccess collection:
{ role: 'USER',        resource: 'slots',   actions: ['READ'] }
{ role: 'ADMIN',       resource: 'slots',   actions: ['CREATE','READ','UPDATE','DELETE'] }
{ role: 'SUPER_ADMIN', resource: 'slots',   actions: ['CREATE','READ','UPDATE','DELETE'] }
{ role: 'SUPER_ADMIN', resource: 'admins',  actions: ['CREATE','READ','UPDATE','DELETE'] }
```

This allows permissions to be changed from the database without redeploying code.

---

## 5. HTTP Status Codes — Authorization

| Code  | Meaning      | When to use                                  |
| ----- | ------------ | -------------------------------------------- |
| `200` | OK           | Request succeeded                            |
| `401` | Unauthorized | No token / invalid token (not authenticated) |
| `403` | Forbidden    | Valid token but wrong role (not authorized)  |
| `404` | Not Found    | Resource does not exist                      |

> Common mistake: Using `401` when you should use `403`.
> `401` = "I don't know who you are."
> `403` = "I know who you are, but you can't do this."

---

## 6. Postman Test Cases

### Test 1 — No Token (should get 401)
```
GET /api/slots/all
Headers: (none)

Expected: 401 Not authenticated. No token provided.
```

### Test 2 — USER role accessing ADMIN route (should get 403)
```
GET /api/slots/all
Headers: Authorization: Bearer <user_token>

Expected: 403 Access denied. Role 'USER' is not allowed to perform this action.
```

### Test 3 — ADMIN accessing SUPER_ADMIN route (should get 403)
```
POST /api/admin/create
Headers: Authorization: Bearer <admin_token>

Expected: 403 Access denied. Role 'ADMIN' is not allowed to perform this action.
```

### Test 4 — ADMIN on ADMIN route (should succeed)
```
GET /api/slots/all
Headers: Authorization: Bearer <admin_token>

Expected: 200 { slots: [...] }
```

### Test 5 — SUPER_ADMIN on any route (should succeed)
```
POST /api/admin/create
Headers: Authorization: Bearer <super_admin_token>

Expected: 200 { admin: {...} }
```

---

## 7. Files Created / Modified

| Action         | File                                     | What changes                    |
| -------------- | ---------------------------------------- | ------------------------------- |
| Modify         | `src/models/User.model.js`               | Add `role` field with enum      |
| Modify         | `src/utils/jwt.js`                       | Include `role` in token payload |
| Create         | `src/middleware/auth.middleware.js`      | JWT verification (`protect`)    |
| Create         | `src/middleware/authorize.middleware.js` | Role check (`authorize`)        |
| Modify         | `src/routes/*.routes.js`                 | Apply `protect` and `authorize` |
| Already exists | `src/models/RoleAccess.model.js`         | Dynamic permissions per role    |

---

## 8. Video Flow (Script Order)

```
1. Intro — auth vs authorization (2 min)
2. Show role hierarchy diagram — USER, ADMIN, SUPER_ADMIN
3. Permissions table walkthrough
4. Code: Add role to User model
5. Code: Update JWT payload
6. Code: protect middleware
7. Code: authorize middleware — explain ...roles spread
8. Code: Apply to routes — show all 3 levels
9. Code: Ownership check in controller
10. Code: RoleAccess model — dynamic permissions concept
11. Postman demo — all 5 test cases
12. HTTP status codes recap (401 vs 403)
13. Outro — next video preview
```

---

## 9. Key Concepts to Emphasize on Camera

- **401 vs 403** — this confuses many developers, explain clearly
- **Middleware chain order** — `protect` must always come before `authorize`
- **Never default to ADMIN or SUPER_ADMIN** — always default to lowest role
- **SUPER_ADMIN** is not just a more powerful admin — it owns the system itself
- **Ownership check** is separate from role check — both are needed
- **Dynamic vs static permissions** — RoleAccess model allows DB-level control
