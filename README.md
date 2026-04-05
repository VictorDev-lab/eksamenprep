# 🎓 Exam Platform
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

### Access Points (local development)

- **Frontend**: http://localhost:8080
- **Store**: http://localhost:8080/store.html
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

> On Render, the backend port is provided by the environment and the frontend should use `/api` or the Render backend URL.

### Default Credentials

**Registration Key**: `exam2026`

## 📁 Project Structure

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

## 📡 API Endpoints, and vulnerable code below

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
## shhh
Located in `backend/.env`:

## Tech Stack

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
- yes ai help and a full stack working directory

## 📝 Available Products Just demo/fake prices

1. **JavaScript Course** - 499 NOK
2. **Python Course** - 599 NOK
3. **React Framework** - 699 NOK
4. **Node.js Backend** - 549 NOK
5. **Database Design** - 449 NOK
6. **DevOps Basics** - 799 NOK
7. **Web Design** - 399 NOK
8. **Git & GitHub** - 299 NOK

## 🎯 Testing

1. Register a new account with registration key `exam2026`
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

### Reset everything
```bash
docker-compose down -v
docker-compose up -d
```

# 🎨Images 🤓
### 1. JavaScript Course (499 NOK)
- **Image**: Coffee and code workspace with JavaScript vibes
- **URL**: `https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a`
- **Theme**: Warm, inviting coding environment

### 2. Python Course (599 NOK)
- **Image**: Python programming and tech workspace
- **URL**: `https://images.unsplash.com/photo-1526379095098-d400fd0bf935`
- **Theme**: Clean, professional coding setup

### 3. React Framework (699 NOK)
- **Image**: Modern React development workspace
- **URL**: `https://images.unsplash.com/photo-1633356122544-f134324a6cee`
- **Theme**: Modern frontend development

### 4. Node.js Backend (549 NOK)
- **Image**: Server-side coding environment
- **URL**: `https://images.unsplash.com/photo-1627398242454-45a1465c2479`
- **Theme**: Backend development focus

### 5. Database Design (449 NOK)
- **Image**: Database and data management
- **URL**: `https://images.unsplash.com/photo-1544383835-bda2bc66a55d`
- **Theme**: Data organization and structure

### 6. DevOps Basics (799 NOK)
- **Image**: DevOps and cloud infrastructure
- **URL**: `https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9`
- **Theme**: Modern DevOps practices

### 7. Web Design (399 NOK)
- **Image**: Creative web design workspace
- **URL**: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d`
- **Theme**: UI/UX design focus

### 8. Git & GitHub (299 NOK)
- **Image**: Version control and collaboration
- **URL**: `https://images.unsplash.com/photo-1556075798-4825dfaaf498`


## 🎯 Image Specifications🤓

- **Format**: JPEG from Unsplash CDN
- **Dimensions**: 400x300 (optimized for web)
- **Fit**: Cropped to maintain aspect ratio
- **Quality**: High-resolution, professional photography
- **Loading**: Fast CDN delivery via Unsplash

## 🔄 Changing Images🤓

To update a product image:

```sql
UPDATE products 
SET image_url = 'YOUR_NEW_IMAGE_URL' 
WHERE id = PRODUCT_ID;
```
Or edit the migration file: `backend/migrations/create-store-tables.sql`

## 💡 Image Tips🤓
- Use 400x300 dimensions for consistency
- Keep file sizes optimized for web
- Choose images that represent the course content
- Unsplash provides free, high-quality images
- Add `?w=400&h=300&fit=crop` for proper sizing

## 👨‍💻 License & Author
VBK Built with ❤️ and 🔥 was dumb and called it eksamenprep in the docker file so its better to stick with it.
