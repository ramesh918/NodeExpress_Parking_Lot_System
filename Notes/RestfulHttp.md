**RESTful API, HTTP Methods, and Status Codes - Complete Guide**

---

## **1. What is a RESTful API?**

### **Definition:**
RESTful API (Representational State Transfer API) is an architectural style for designing networked applications. It uses HTTP requests to perform operations on resources (data).

### **Key Features of RESTful APIs:**
- **Stateless:** Each request is independent, and the server does not store session data.
- **Client-Server Architecture:** Separation of concerns between the client (frontend) and the server (backend).
- **Resource-Based:** Uses **URLs** to represent resources.
- **HTTP Methods:** Uses standard HTTP verbs to perform operations.
- **JSON/XML Data Format:** Common formats for data exchange.
- **Uniform Interface:** Follows a consistent way to access and modify resources.

---

## **2. HTTP Methods (CRUD Operations)**

| **HTTP Method** | **Action**     | **Description**                        |
| --------------- | -------------- | -------------------------------------- |
| **GET**         | Read           | Retrieve data from the server.         |
| **POST**        | Create         | Create a new resource on the server.   |
| **PUT**         | Update/Replace | Replace an existing resource.          |
| **PATCH**       | Update/Modify  | Partially update an existing resource. |
| **DELETE**      | Delete         | Remove a resource from the server.     |

### **Examples:**
1. **GET** /users → Fetch all users.
2. **GET** /users/1 → Fetch user with ID 1.
3. **POST** /users → Create a new user.
4. **PUT** /users/1 → Replace user data with new details.
5. **PATCH** /users/1 → Update only some details of user 1.
6. **DELETE** /users/1 → Remove user 1 from the system.

---

## **3. HTTP Status Codes**

HTTP status codes indicate the outcome of a request. They are grouped into five categories:

### **1xx - Informational**
| Code | Meaning             |
| ---- | ------------------- |
| 100  | Continue            |
| 101  | Switching Protocols |

### **2xx - Success**
| Code | Meaning                                                       |
| ---- | ------------------------------------------------------------- |
| 200  | OK (Request successful)                                       |
| 201  | Created (Resource created)                                    |
| 202  | The request is received but processing is delayed or pending. |
| 204  | No Content (Successful, no data returned)                     |

### **3xx - Redirection**
| Code | Meaning                    |
| ---- | -------------------------- |
| 301  | Moved Permanently          |
| 302  | Found (Temporary redirect) |
| 304  | Not Modified               |

### **4xx - Client Errors**
| Code | Meaning      |
| ---- | ------------ |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |

### **5xx - Server Errors**
| Code | Meaning               |
| ---- | --------------------- |
| 500  | Internal Server Error |
| 502  | Bad Gateway           |
| 503  | Service Unavailable   |

---

## **4. RESTful API Best Practices**

1. **Use Proper HTTP Methods** → Follow the correct CRUD operations.
2. **Use Meaningful URLs** → `/users/123/orders` instead of `/getUserOrders`.
3. **Return Proper Status Codes** → Send correct HTTP responses.
4. **Use JSON Format** → Standard format for easy integration.
5. **Implement Authentication** → Use JWT, OAuth, or API Keys for security.
6. **Paginate Large Results** → `/users?page=2&limit=10` to handle large data.
7. **Use Versioning** → `/api/v1/users` for backward compatibility.

---

## **5. REST vs SOAP**

| Feature          | REST            | SOAP            |
| ---------------- | --------------- | --------------- |
| **Protocol**     | HTTP            | HTTP, SMTP, TCP |
| **Format**       | JSON, XML       | XML             |
| **Lightweight?** | Yes             | No              |
| **Security**     | OAuth, JWT, SSL | WS-Security     |
| **Flexibility**  | High            | Low             |

---

## **Conclusion**

RESTful APIs are a powerful way to build scalable and flexible web services. By using proper HTTP methods, status codes, and best practices, developers can create efficient and secure APIs.


