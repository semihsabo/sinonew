# JCRes Backend API

E-commerce backend API built with Node.js, Express, and MongoDB.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jcres
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Run

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

- `GET /api/health` - Health check
- `/api/auth` - Authentication routes
- `/api/products` - Products CRUD
- `/api/cart` - Shopping cart
- `/api/orders` - Orders management
- `/api/users` - User management



