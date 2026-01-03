# 🎓 EksamenPrep - Exam Preparation Platform

A full-stack web application with authentication, user profiles, and an e-commerce store for educational courses.

## ✨ Features

### Authentication System
- 🔐 Secure user registration with registration key
- 🔑 JWT-based login system
- 👤 User profile management
- 🔒 Password hashing with bcrypt

### Store System
- 🛒 Browse 8 programming courses
- 🛍️ Shopping cart with quantity management
- 💳 Checkout and order processing
- 📦 Order history tracking
- 📊 Product categories filtering

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Running the Application

```bash
# Start all services
docker-compose up -d

# View logs
docker logs eksamenprep_backend
docker logs eksamenprep_frontend
docker logs eksamenprep_mysql

# Stop services
docker-compose down
```

### Access Points

- **Frontend**: http://localhost:8080
- **Store**: http://localhost:8080/store.html
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

### Default Credentials

**Registration Key**: `exam2025`

## 📁 Project Structure

```
eksamenprep/
├── backend/
│   ├── controllers/
│   │   ├── auth.controllers.js      # Authentication logic
│   │   ├── store.controllers.js     # Store/cart/orders logic
│   │   └── users.controllers.js     # User profile logic
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── regkey.js                # Registration key check
│   ├── routes/
│   │   ├── auth.routes.js           # Auth endpoints
│   │   ├── store.routes.js          # Store endpoints
│   │   └── api.routes.js            # General API endpoints
│   ├── migrations/
│   │   └── create-store-tables.sql  # Database schema
│   ├── server.js                    # Express server
│   ├── db.js                        # MySQL connection pool
│   └── reset-password.js            # Password reset utility
├── frontend/
│   ├── index.html                   # Login/Register page (spicy! 🔥)
│   └── store.html                   # Store page
└── docker-compose.yml               # Docker services
```

## 🗄️ Database Schema

### Tables
- `users` - User accounts
- `products` - Course catalog
- `cart_items` - Shopping cart items
- `orders` - Order records
- `order_items` - Items in each order

## 🔧 Utility Scripts

### Reset User Password

```bash
docker exec -it eksamenprep_backend node reset-password.js
```

### Test All Endpoints

```bash
./test-endpoints.sh
```

### Direct Database Access

```bash
mysql -h 127.0.0.1 -P 3308 -u eksamenprep_user -peksamenprep_password eksamenprep_db
```

## 🎨 Design Features

### Login Page
- 🌈 Animated gradient background
- ✨ Smooth fade-in animations
- 🎯 Modern glassmorphism design
- 🎪 Floating title animation
- 💫 Hover effects on all interactive elements

### Store Page
- 📱 Responsive grid layout
- 🎨 Product cards with hover effects
- 🛒 Real-time cart badge
- 💰 Order history with status badges
- 🎯 Clean, modern UI

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (requires registration key)
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/profile` - Get user profile (protected)

### Store
- `GET /api/store/products` - List all products
- `GET /api/store/products/:id` - Get single product
- `GET /api/store/categories` - Get all categories
- `GET /api/store/cart` - Get user's cart (protected)
- `POST /api/store/cart` - Add item to cart (protected)
- `PUT /api/store/cart/:id` - Update cart item quantity (protected)
- `DELETE /api/store/cart/:id` - Remove from cart (protected)
- `POST /api/store/checkout` - Place order (protected)
- `GET /api/store/orders` - Get order history (protected)

### System
- `GET /api/health` - Health check

## 🔐 Environment Variables

Located in `backend/.env`:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=eksamenprep_user
DB_PASSWORD=eksamenprep_password
DB_NAME=eksamenprep_db

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=1h

PORT=3000
REGISTRATION_KEY=exam2025
NODE_ENV=development
```

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MySQL 8.0
- JWT for authentication
- bcrypt for password hashing
- Docker for containerization

### Frontend
- Pure HTML/CSS/JavaScript
- Modern CSS animations
- Responsive design
- Fetch API for HTTP requests

## 📝 Available Products

1. **JavaScript Course** - 499 NOK
2. **Python Course** - 599 NOK
3. **React Framework** - 699 NOK
4. **Node.js Backend** - 549 NOK
5. **Database Design** - 449 NOK
6. **DevOps Basics** - 799 NOK
7. **Web Design** - 399 NOK
8. **Git & GitHub** - 299 NOK

## 🎯 Testing

1. Register a new account with registration key `exam2025`
2. Login with your credentials
3. Visit the store from your profile
4. Add products to cart
5. Update quantities
6. Checkout and view order history

## 🐛 Troubleshooting

### Backend won't start
```bash
docker-compose down
docker-compose up -d
docker logs eksamenprep_backend
```

### Database connection issues
```bash
docker restart eksamenprep_mysql
sleep 5
docker restart eksamenprep_backend
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d
```

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ and 🔥
