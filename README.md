# Food Delivery System API

The **Food Delivery System API** is an advanced backend solution crafted to facilitate seamless food ordering and vendor services. Built using .js and TypeScript, this API leverages a robust technology stack including Mongoose for MongoDB integration, Express.js for streamlined routing, and JWT for secure authentication.

## Key Features

- **OTP Verification**: Ensures secure and reliable user authentication and account management.

- **Role-Based Access Control**: Implemented via JWT, allowing precise management of user privileges across different roles such as vendors, admins, shoppers, and customers.

- **Vendor Image Uploads via Cloudinary**: Vendors can enhance their offerings with image uploads using Cloudinary, providing a scalable and efficient solution for storing and serving images. This allows for easy management of product visuals and optimized delivery across various devices and network conditions.

- **Advanced Security Measures**: Includes data sanitization, rate limiting, and HTTPS enforcement to safeguard user data and maintain API integrity.

- **Data Transfer Objects (DTOs)**: Utilized to ensure structured and efficient communication between the client and server.

This API is designed to be a comprehensive solution for modern food order systems, integrating essential features and security practices to deliver a reliable and user-friendly experience.

## API Documentation

This document provides an overview of our API endpoints. For a complete, interactive documentation including detailed request/response examples, please visit our full API documentation at:

[https://amrrdev.github.io/food-order-system-api-documentation/](https://amrrdev.github.io/food-order-system-api-documentation/)

## Table of Contents

1. [Admin Endpoints](#admin-endpoints)
2. [Vendor Endpoints](#vendor-endpoints)
3. [Shopping Endpoints](#shopping-endpoints)
4. [Customer Authentication Endpoints](#customer-authentication-endpoints)
5. [Customer Endpoints](#customer-endpoints)
6. [Order Endpoints](#order-endpoints)
7. [Cart Endpoints](#cart-endpoints)

This structure maintains the original format while adding dedicated sections for Orders and Cart, which are important components of the API. Each of these main sections would then contain their respective subsections and endpoint details.

## Admin Endpoints

### Vendor Management

#### Create a New Vendor

```
POST / api / v1 / admin / vendors;
```

Creates a new vendor in the system. This endpoint allows administrators to add new vendors to the platform.

**Request Body:**

- `name`: String (required) - The name of the vendor
- `email`: String (required) - The email address of the vendor
- `phone`: String (required) - The phone number of the vendor
- `address`: String (required) - The physical address of the vendor

**Response:**

- `201 Created` on success
- `400 Bad Request` if required fields are missing or invalid

#### List All Vendors

```
GET / api / v1 / admin / vendors;
```

Retrieves a list of all vendors registered in the system. This endpoint is useful for administrators to view and manage all vendors.

**Response:**

- `200 OK` with an array of vendor objects

#### Get Vendor Details

```
GET / api / v1 / admin / vendors / { vendorId };
```

Retrieves detailed information about a specific vendor using their unique identifier.

**Path Parameters:**

- `vendorId`: String (required) - The unique identifier of the vendor

**Response:**

- `200 OK` with the vendor object
- `404 Not Found` if the vendor doesn't exist

#### Delete a Vendor

```
DELETE / api / v1 / admin / vendors / { vendorId };
```

Removes a vendor from the system. This action is irreversible and should be used with caution.

**Path Parameters:**

- `vendorId`: String (required) - The unique identifier of the vendor to be deleted

**Response:**

- `204 No Content` on successful deletion
- `404 Not Found` if the vendor doesn't exist

### Transaction Management

#### List All Transactions

```
GET / api / v1 / admin / transactions;
```

Retrieves a list of all transactions in the system. This endpoint allows administrators to view and monitor all financial activities.

**Response:**

- `200 OK` with an array of transaction objects

#### Get Transaction Details

```
GET / api / v1 / admin / transaction / { transactionId };
```

Retrieves detailed information about a specific transaction using its unique identifier.

**Path Parameters:**

- `transactionId`: String (required) - The unique identifier of the transaction

**Response:**

- `200 OK` with the transaction object
- `404 Not Found` if the transaction doesn't exist

## Vendor Endpoints

### Profile Management

#### Get Vendor Profile

```
GET / api / v1 / vendor / profile;
```

Retrieves the profile information of the currently authenticated vendor.

**Response:**

- `200 OK` with the vendor's profile object

#### Update Vendor Profile

```
PATCH / api / v1 / vendor / profile;
```

Updates the profile information of the currently authenticated vendor.

**Request Body:**

- `name`: String (optional) - The updated name of the vendor
- `email`: String (optional) - The updated email address
- `phone`: String (optional) - The updated phone number
- `address`: String (optional) - The updated physical address

**Response:**

- `200 OK` with the updated vendor profile object
- `400 Bad Request` if any field is invalid

#### Delete Vendor Profile

```
DELETE / api / v1 / vendor / profile;
```

Deletes the profile of the currently authenticated vendor. This action is irreversible and will remove the vendor from the platform.

**Response:**

- `204 No Content` on successful deletion

### Food Management

#### List Vendor Foods

```
GET / api / v1 / vendor / foods;
```

Retrieves a list of all food items offered by the currently authenticated vendor.

**Response:**

- `200 OK` with an array of food objects

#### Add New Food Item

```
POST /api/v1/vendor/foods
```

Adds a new food item to the vendor's offerings.

**Request Body:**

- `name`: String (required) - The name of the food item
- `description`: String (required) - A description of the food item
- `price`: Number (required) - The price of the food item
- `category`: String (required) - The category of the food item

**Response:**

- `201 Created` with the newly created food object
- `400 Bad Request` if required fields are missing or invalid

### Order Management

#### List Vendor Orders

```
GET /api/v1/vendor/orders
```

Retrieves a list of all orders placed with the currently authenticated vendor.

**Response:**

- `200 OK` with an array of order objects

#### Get Order Details

```
GET /api/v1/vendor/order/{orderId}
```

Retrieves detailed information about a specific order using its unique identifier.

**Path Parameters:**

- `orderId`: String (required) - The unique identifier of the order

**Response:**

- `200 OK` with the order object
- `404 Not Found` if the order doesn't exist

#### Process Order

```
PATCH /api/v1/vendor/order/{orderId}/process
```

Updates the status of an order (e.g., marks it as completed or in progress).

**Path Parameters:**

- `orderId`: String (required) - The unique identifier of the order

**Request Body:**

- `status`: String (required) - The new status of the order

**Response:**

- `200 OK` with the updated order object
- `400 Bad Request` if the status is invalid
- `404 Not Found` if the order doesn't exist

### Offer Management

#### Create New Offer

```
POST /api/v1/vendor/offers
```

Creates a new offer for the vendor's products.

**Request Body:**

- `title`: String (required) - The title of the offer
- `description`: String (required) - A description of the offer
- `discountPercentage`: Number (required) - The discount percentage
- `startDate`: Date (required) - The start date of the offer
- `endDate`: Date (required) - The end date of the offer

**Response:**

- `201 Created` with the newly created offer object
- `400 Bad Request` if required fields are missing or invalid

#### List All Offers

```
GET /api/v1/vendor/offers
```

Retrieves a list of all offers created by the currently authenticated vendor.

**Response:**

- `200 OK` with an array of offer objects

#### Update Offer

```
PUT /api/v1/vendor/offer/{offerId}
```

Updates an existing offer.

**Path Parameters:**

- `offerId`: String (required) - The unique identifier of the offer

**Request Body:**

- `title`: String (optional) - The updated title of the offer
- `description`: String (optional) - The updated description of the offer
- `discountPercentage`: Number (optional) - The updated discount percentage
- `startDate`: Date (optional) - The updated start date of the offer
- `endDate`: Date (optional) - The updated end date of the offer

**Response:**

- `200 OK` with the updated offer object
- `400 Bad Request` if any field is invalid
- `404 Not Found` if the offer doesn't exist

### Other Vendor Endpoints

#### Get Vendor Cover Image

```
GET /api/v1/vendor/coverimage
```

Retrieves the cover image of the currently authenticated vendor.

**Response:**

- `200 OK` with the image file
- `404 Not Found` if no cover image is set

#### Update Vendor Cover Image

```
PATCH /api/v1/vendor/coverimage
```

Updates the cover image of the currently authenticated vendor.

**Request Body:**

- `image`: File (required) - The new cover image file

**Response:**

- `200 OK` with a success message
- `400 Bad Request` if the image is invalid or too large

#### Get Vendor Service Details

```
GET /api/v1/vendor/service
```

Retrieves the service details of the currently authenticated vendor.

**Response:**

- `200 OK` with the vendor's service object

#### Update Vendor Service Details

```
PATCH /api/v1/vendor/service
```

Updates the service details of the currently authenticated vendor.

**Request Body:**

- `serviceArea`: String (optional) - The updated service area
- `deliveryTime`: Number (optional) - The updated estimated delivery time in minutes
- `minimumOrder`: Number (optional) - The updated minimum order amount

**Response:**

- `200 OK` with the updated service object
- `400 Bad Request` if any field is invalid

## Shopping Endpoints

#### Get Food Availability

```
GET /api/v1/shopping/2932
```

Retrieves food availability information for a specific area.

**Response:**

- `200 OK` with an array of available food items

#### Get Top Restaurants

```
GET /api/v1/shopping/top-restaurant/2932
```

Retrieves a list of top-rated restaurants in a specific area.

return

**Response:**

- `200 OK` with an array of top restaurant objects

#### Get Food Available in 30 Minutes

```
GET /api/v1/shopping/food-in-30-min/2932
```

Retrieves a list of food items available for delivery within 30 minutes in a specific area.

**Response:**

- `200 OK` with an array of food items available for quick delivery

#### Search Food Items

```
GET /api/v1/shopping/search/2932
```

Searches for food items based on keywords and location.

**Response:**

- `200 OK` with an array of matching food items

#### Get Restaurant Details

```
GET /api/v1/shopping/restaurant/{restaurantId}
```

Retrieves detailed information about a specific restaurant.

**Path Parameters:**

- `restaurantId`: String (required) - The unique identifier of the restaurant

**Response:**

- `200 OK` with the restaurant object
- `404 Not Found` if the restaurant doesn't exist

#### Get Available Offers

```
GET /api/v1/shopping/offers/2932
```

Retrieves a list of available offers in a specific area.

**Response:**

- `200 OK` with an array of offer objects

## Customer Authentication Endpoints

#### Customer Sign Up

```
POST /api/v1/auth/signup
```

Creates a new customer account.

**Request Body:**

- `name`: String (required) - The name of the customer
- `email`: String (required) - The email address of the customer
- `phone`: String (required) - The phone number of the customer
- `password`: String (required) - The password for the account

**Response:**

- `201 Created` with the newly created customer object
- `400 Bad Request` if required fields are missing or invalid

#### Customer Login

```
POST /api/v1/auth/login
```

Logs in a customer and returns an authentication token.

**Request Body:**

- `email`: String (required) - The email address of the customer
- `password`: String (required) - The password for the account

**Response:**

- `200 OK` with an authentication token
- `401 Unauthorized` if the credentials are invalid

#### Verify Customer

```
PATCH /api/v1/auth/verify/{verificationToken}
```

Verifies a customer's email or phone number using a verification token.

**Path Parameters:**

- `verificationToken`: String (required) - The verification token sent to the customer

**Response:**

- `200 OK` with a success message
- `400 Bad Request` if the token is invalid or expired

#### Customer Logout

```
GET /api/v1/auth/logout
```

Logs out the currently authenticated customer.

**Response:**

- `200 OK` with a success message

#### Initiate Account Deletion

```
GET /api/v1/auth/delete-me
```

Initiates the process of deleting a customer account by sending an OTP.

**Response:**

- `200 OK` with a message indicating an OTP has been sent

#### Delete Customer Account

```
DELETE /api/v1/auth/delete-me
```

Deletes the customer account after verifying the OTP.

**Request Body:**

- `otp`: String (required) - The one-time password sent to the customer

**Response:**

- `204 No Content` on successful deletion
- `400 Bad Request` if the OTP is invalid

## Customer Endpoints

### Profile Management

#### Get Customer Profile

```
GET /api/v1/customer/profile
```

Retrieves the profile information of the currently authenticated customer.

**Response:**

- `200 OK` with the customer's profile object

#### Update Customer Profile

```
PATCH /api/v1/customer/profile
```

Updates the profile information of the currently authenticated customer.

**Request Body:**

- `name`: String (optional) - The updated name of the customer
- `email`: String (optional) - The updated email address
- `phone`: String (optional) - The updated phone number

**Response:**

- `200 OK` with the updated customer profile object
- `400 Bad Request` if any field is invalid

### Order Endpoints

#### Create New Order

```
POST /api/v1/customer/create-order
```

Creates a new order for the currently authenticated customer.

**Request Body:**

- `items`: Array of objects (required) - The items to be ordered
  - `foodId`: String (required) - The unique identifier of the food item
  - `quantity`: Number (required) - The quantity of the food item

**Response:**

- `201 Created` with the newly created order object
- `400 Bad Request` if required fields are missing or invalid

#### List Customer Orders

```
GET /api/v1/customer/orders
```

Retrieves a list of all orders placed by the currently authenticated customer.

**Response:**

- `200 OK` with an array of order objects

#### Get Order Details

```
GET /api/v1/customer/orders/{orderId}
```

Retrieves detailed information about a specific order placed by the customer.

**Path Parameters:**

- `orderId`: String (required) - The unique identifier of the order

**Response:**

- `200 OK` with the order object
- `404 Not Found` if the order doesn't exist

Certainly. I'll continue with the rest of the Customer Endpoints:

#### Verify Offer

Verifies and applies an offer to an order.

```
GET /api/v1/customer/offer/verify/{offerId}
```

**Response (continued):**

- `200 OK` with the updated order object including the applied offer

- `400 Bad Request` if the offer is invalid or cannot be applied
  `40
- `404 Not Found` if the offer or order doesn't exist

### Cart Endpoints

#### Add Item to Cart

```
POST /api/v1/customer/cart
```

Adds an item to the customer's shopping cart.

**Request Body:**

- `foodId`: String (required) - The unique identifier of the food item
- `quantity`: Number (required) - The quantity of the food item to add

**Response:**

- `200 OK` with the updated cart object
- `400 Bad Request` if the food item doesn't exist or the quantity is invalid

#### Get Cart Contents

```
GET /api/v1/customer/cart
```

Retrieves the contents of the customer's shopping cart.

**Response:**

- `200 OK` with an object containing the cart items and total price

#### Delete Cart

```
DELETE /api/v1/customer/cart
```

Removes all items from the customer's shopping cart.

**Response:**

- `204 No Content` on successful deletion of the cart contents

### Authentication

Most endpoints require authentication. Authentication is handled using HTTP-only cookies, which are automatically included in each request by the browser. This means users don't need to manually include any tokens in the request headers.

When a user successfully logs in, the server will set a secure, HTTP-only cookie containing the session information. This cookie is automatically sent with each subsequent request to authenticate the user.

Key points about the cookie-based authentication:

1. The cookie is set automatically upon successful login.
2. The cookie is HTTP-only, which helps protect against cross-site scripting (XSS) attacks.
3. The cookie should be secure (only transmitted over HTTPS) in production environments.
4. Users don't need to manually handle any tokens or include additional headers in their requests.

Example of how the server might set the cookie upon login:

```
Set-Cookie: session=<encrypted_session_data>; HttpOnly; Secure; SameSite=Strict
```

For logout, the server will clear this cookie, effectively ending the user's session.

### Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: The request was invalid or cannot be served. The exact error should be explained in the error payload.
- `401 Unauthorized`: The request requires authentication.
- `403 Forbidden`: The server understood the request but refuses to authorize it.
- `404 Not Found`: The requested resource could not be found.
- `500 Internal Server Error`: The server encountered an unexpected condition which prevented it from fulfilling the request.

### Rate Limiting

To prevent abuse, API requests are subject to rate limiting. The current limits are:

- 100 requests 15 minutes

### Versioning

The API is versioned using URL path versioning. The current version is v1. As the API evolves, new versions may be introduced.

### Data Formats

- All requests with a body should be sent as JSON with the appropriate `Content-Type: application/json` header.
- All responses will be in JSON format.
- Dates are returned in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

### CORS

Cross-Origin Resource Sharing (CORS) is supported for this API, allowing frontend applications to make requests from different domains.
