- **What is Express.js?**
  - A minimal and flexible Node.js web application framework.
  - Used for building APIs, web apps, and backend services.
- **Why learn Express.js?**
  - Easy to learn, lightweight, and widely used in the industry.
  - Great for beginners and professionals alike.

####  **Setting Up Express.js (1:00 - 3:00)**
- **Prerequisites**:
  - Node.js and npm installed.
  - Basic knowledge of JavaScript.
- **Steps**:
  1. Create a new project folder.
  2. Initialize a Node.js project:
     ```bash
     npm init -y
     ```
  3. Install Express.js:
     ```bash
     npm install express
     ```
  4. Create an `index.js` file.
  5. Write a basic Express server:
     ```javascript
     const express = require('express');
     const app = express();
     const port = 3000;

     app.get('/', (req, res) => {
       res.send('Hello, World!');
     });

     app.listen(port, () => {
       console.log(`Server running at http://localhost:${port}`);
     });
     ```
  6. Run the server:
     ```bash
     node index.js
     ```
  7. Show the output in the browser: `http://localhost:3000`.

---