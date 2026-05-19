# 💰 Personal Finance Management API

A RESTful API for personal finance management, tracking income and expenses, budget planning, and report generation. The project is built using **Node.js**, **Express**, and **MongoDB**, following a layered architecture (Controllers, Services, Repositories).

## ✨ Key Features

* **🔐 Security & Authentication:** User registration and login utilizing JWTs (transmitted via secure HttpOnly Cookies). Protection of private routes.
* **🗂 Category Management:** Create, read, update, and soft-delete categories for both income and expenses.
* **💳 Transactions:** Record financial transactions linked to categories, with filtering options by date and type.
* **🎯 Budgeting:** Establish budget limits for specific categories and monitor compliance.
* **📊 Analytics & Reports:** Generate summary reports covering overall balance, financial trends, and budget utilization.
* **📈 Export:** Export transaction data directly to Excel sheets (`.xlsx`).
* **📚 Interactive API Documentation:** Automatically generated Swagger UI for seamless API testing.
* **📝 Audit Logging:** Comprehensive logging system for tracking system events and user actions.

## 🛠 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas), Mongoose (ODM)
* **Authentication:** JSON Web Tokens (JWT), bcryptjs, cookie-parser
* **Architecture:** Layered Architecture (MVC-pattern)
* **API Documentation:** Swagger UI Express

## 🚀 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/TokarIvan141/finance-api.git](https://github.com/TokarIvan141/finance-api.git)
cd finance-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory of the project and add the following variables (replace the placeholders with your actual credentials):

```env
# Server Settings
PORT=3000

# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster>.mongodb.net/finance_db?retryWrites=true&w=majority

# JWT Secrets (Use strong random strings)
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
```

### 4. Run the Server
For standard execution:
```bash
npm start
```
For development mode (with nodemon auto-reload):
```bash
npm run dev
```

## 📖 API Documentation (Swagger)
Once the server is up and running, you can access the interactive API documentation to test all endpoints and view data schemas at:

👉 **http://localhost:3000/api-docs**

## 🏗 Project Structure

The project strictly adheres to the Separation of Concerns principle:

* `src/routes/` — Route definitions and HTTP method mapping.
* `src/controllers/` — Handling incoming HTTP requests and formatting responses.
* `src/services/` — Core business logic of the application.
* `src/repositories/` — Data access layer interfacing with Mongoose/MongoDB.
* `src/models/` — Mongoose schemas and database models.
* `src/middlewares/` — Middleware functions (authentication, validation, logging).
