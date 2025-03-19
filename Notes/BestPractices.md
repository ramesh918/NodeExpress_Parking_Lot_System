
# **🎬 Best Practices for Node.js Express API Development**

✅ **Why Best Practices Matter?**
- Performance 🚀
- Security 🔒
- Scalability 📈
- Maintainability 🛠️


## **📌 1. Structuring Your Project**
🔹 Follow **MVC (Model-View-Controller) or Clean Architecture**  
📌 **Recommended Folder Structure**
```
/my-api
│── /src
│   ├── /controllers    # Business logic
│   ├── /routes         # API routes
│   ├── /models         # Database schemas
│   ├── /middlewares    # Middleware functions
│   ├── /config         # Environment variables, DB setup
│   ├── /services       # External integrations (email, payments)
│   ├── /utils          # Helper functions
│   ├── app.ts          # Express app setup
│   ├── server.ts       # Entry point
│── /tests              # Unit and integration tests
│── .env                # Environment variables
│── package.json
│── README.md
│── .gitignore
```
✅ **Why?**
- Improves **readability**
- Separates **concerns**  
- Easier **scalability**

---

## **📌 2. Using Environment Variables**
🔹 **Never hardcode sensitive data in code**  
✅ Use `.env` for configurations:
```env
PORT=3000
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=mystrongsecretkey
```
✅ Use **dotenv** in your `server.ts`:
```typescript
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.PORT);
```
🚨 **Best Practices**
✔ **Never commit `.env` files** → Add to `.gitignore`  
✔ Use **dotenv-safe** for missing env validation  

---

## **📌 3. Implementing Middleware**
🔹 **Middleware enhances API security, logging, and performance**  
✅ **Essential Middleware**
```typescript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
app.use(cors());          // Enable Cross-Origin requests
app.use(helmet());        // Security headers
app.use(morgan("dev"));   // Logging HTTP requests
app.use(express.json());  // Parse JSON requests
```

🚀 **Why?**
✔ **Helmet** → Prevents common vulnerabilities  
✔ **CORS** → Controls access from different domains  
✔ **Morgan** → Logs requests for debugging  

---

## **📌 4. Error Handling & Validation**
🔹 **Always return structured error messages**  
✅ **Centralized Error Handler**
```typescript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});
```
✅ **Use Express Validator**
```typescript
import { body, validationResult } from "express-validator";

app.post(
  "/users",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    res.status(201).json({ message: "User created" });
  }
);
```
🚨 **Best Practices**
✔ Use **centralized error handling**  
✔ Validate user input **before processing requests**  

---

## **📌 5. Database Best Practices**
🔹 **Use ORM (Mongoose / Prisma / Sequelize) for cleaner code**  
✅ **Example: Connecting MongoDB using Mongoose**
```typescript
import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database Connection Error", error);
        process.exit(1);
    }
};
connectDB();
```
🚀 **Best Practices**
✔ Keep **database connection in a separate file**  
✔ Use **Indexes** for better performance  
✔ Implement **Pagination** instead of loading huge data  

---

## **📌 6. Authentication & Authorization**
🔹 **Use JWT (JSON Web Token) for user authentication**  
✅ **Example: Generating JWT**
```typescript
import jwt from "jsonwebtoken";

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};
```
✅ **Middleware to protect routes**
```typescript
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid Token" });
    }
};
```
🚀 **Best Practices**
✔ **Hash passwords** before storing using bcrypt  
✔ Use **refresh tokens** for long sessions  

---

## **📌 7. Rate Limiting & Security**
🔹 **Prevent API abuse and brute force attacks**  
✅ **Rate limiting with express-rate-limit**
```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later.",
});
app.use(limiter);
```
🚀 **Best Practices**
✔ Implement **input sanitization** to prevent SQL injection  
✔ Use **helmet.js** for extra security headers  

---

## **📌 8. Testing Your API**
🔹 **Always write tests for APIs using Jest or Mocha**  
✅ **Example: Supertest with Jest**
```typescript
import request from "supertest";
import app from "../src/app"; // Your Express app

test("GET /health should return 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
});
```
🚀 **Best Practices**
✔ Write **Unit Tests** for Controllers  
✔ Write **Integration Tests** for API responses  

