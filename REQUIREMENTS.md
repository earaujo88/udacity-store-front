# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

# API Documentation

## User Handlers

### 1. List Users
- **URI:** `/users`
- **Method:** `GET`
- **Headers:**
  - `Authorization: <token>`
- **Responses:**
  - `200 OK` - Returns a list of users.
  - `401 Unauthorized` - Access denied, invalid token.

---

### 2. Show User
- **URI:** `/users/:id`
- **Method:** `GET`
- **Headers:**
  - `Authorization: <token>`
- **Responses:**
  - `200 OK` - Returns the user object.
  - `404 Not Found` - User not found.

---

### 3. Create User
- **URI:** `/users`
- **Method:** `POST`
- **Headers:**
  - `Authorization: <token>`
- **Body:**
json { "first_name": "string", "last_name": "string", "username": "string", "password_digest": "string" }
- **Responses:**
  - `200 OK` - Returns a token for the newly created user.
  - `401 Unauthorized` - Access denied, invalid token.
  - `400 Bad Request` - Failed to create user.

---

### 4. Authenticate User
- **URI:** `/users/authenticate`
- **Method:** `POST`
- **Body:**
json { "username": "string", "password": "string" }
- **Responses:**
  - `200 OK` - Returns a token for the authenticated user.
  - `403 Forbidden` - Invalid username or password.
  - `400 Bad Request` - Failed to authenticate user.

---

### 5. Show User Orders
- **URI:** `/users/:id/order`
- **Method:** `GET`
- **Headers:**
  - `Authorization: <token>`
- **Responses:**
  - `200 OK` - Returns the user's orders.
  - `401 Unauthorized` - Access denied, invalid token.
  - `400 Bad Request` - Failed to get orders.

---

## Product Handlers

### 1. List Products
- **URI:** `/products`
- **Method:** `GET`
- **Responses:**
  - `200 OK` - Returns a list of products.

---

### 2. Show Product
- **URI:** `/products/:id`
- **Method:** `GET`
- **Responses:**
  - `200 OK` - Returns the product object.
  - `404 Not Found` - Product not found.

---

### 3. Create Product
- **URI:** `/products`
- **Method:** `POST`
- **Headers:**
  - `Authorization: <token>`
- **Body:**
json { "name": "string", "price": "number", "category": "string" }
- **Responses:**
  - `200 OK` - Returns the newly created product.
  - `401 Unauthorized` - Access denied, invalid token.
  - `400 Bad Request` - Failed to create product.

---

## Order Handlers

### 1. List Orders
- **URI:** `/orders`
- **Method:** `GET`
- **Responses:**
  - `200 OK` - Returns a list of orders.

---

### 2. Show Order
- **URI:** `/orders/:id`
- **Method:** `GET`
- **Responses:**
  - `200 OK` - Returns the order object.
  - `404 Not Found` - Order not found.

---

### 3. Create Order
- **URI:** `/orders`
- **Method:** `POST`
- **Headers:**
  - `Authorization: <token>`
- **Body:**
json { "status": "string", "user_id": "number" }
- **Responses:**
  - `200 OK` - Returns the newly created order.
  - `401 Unauthorized` - Access denied, invalid token.
  - `400 Bad Request` - Failed to create order.

---

### 4. Add Product to Order
- **URI:** `/orders/:id/products`
- **Method:** `POST`
- **Headers:**
  - `Authorization: <token>`
- **Body:**
json { "quantity": "number", "order_id": "number", "product_id": "number" }
- **Responses:**
  - `200 OK` - Returns the updated order with the added product.
  - `401 Unauthorized` - Access denied, invalid token.
  - `400 Bad Request` - Failed to add product to order.

---

### 5. Show Products in Order
- **URI:** `/orders/:id/products`
- **Method:** `GET`
- **Headers:**
  - `Authorization: <token>`
- **Responses:**
  - `200 OK` - Returns products associated with the order.
  - `401 Unauthorized` - Access denied, invalid token.
  - `400 Bad Request` - Failed to get products from order.

# Data Shapes
#### Product
-  id (integer)
- name (string)
- price (string)
- [OPTIONAL] category (string)

#### User
- id (integer)
- first_name (string)
- last_name (string)
- username (string)
- password (string)

#### Orders
- id (integer)
- status of order (active or complete) (string)
- user_id (integer)

#### Orders Products
- id (integer)
- order_id (integer)
- product_id (integer)
- quantity (integer)