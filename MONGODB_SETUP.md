# MongoDB Atlas Integration Guide

Your application has been successfully configured to connect with MongoDB Atlas!

## 🎯 What's Been Set Up

### Backend Server
- **Express.js** server with MongoDB integration
- **Authentication** system with JWT tokens
- **RESTful API** endpoints for managing:
  - Users (registration, login, profile management)
  - Customers (customer profiles and data)
  - Agents (agent management)

### Database Models
1. **User** - Authentication and user accounts
2. **Customer** - Customer profiles and information
3. **Agent** - Agent profiles and performance data

### API Endpoints
All endpoints are prefixed with `/api`

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/verify` - Verify JWT token

#### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (admin only)

#### Customers
- `GET /customers` - Get all customers
- `POST /customers` - Create customer profile
- `GET /customers/:id` - Get customer by ID
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer (admin only)

#### Agents
- `GET /agents` - Get all agents
- `POST /agents` - Create agent profile
- `GET /agents/:id` - Get agent by ID
- `PUT /agents/:id` - Update agent
- `DELETE /agents/:id` - Delete agent (admin only)

## 🚀 How to Run

### 1. Start Both Servers
Run the frontend and backend together:
```bash
npm run dev:all
```

Or run them separately in different terminals:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### 2. Verify Connection
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Backend Health Check: http://localhost:5000/api/health

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (server/.env)
```
MONGODB_URI=mongodb+srv://sachin:SACHIN123@cluster0.kptiarg.mongodb.net/
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

**⚠️ Important:** Change `JWT_SECRET` to a strong value in production!

## 💻 Using the API in Frontend

The frontend API client is ready to use. Here's how to use it in your components:

```typescript
import { apiClient } from '@/lib/api';

// Register
const { data, error } = await apiClient.register('John Doe', 'john@example.com', 'password123', 'customer');
if (data && data.token) {
  localStorage.setItem('token', data.token);
}

// Login
const { data: loginData, error: loginError } = await apiClient.login('john@example.com', 'password123');

// Get all customers
const token = localStorage.getItem('token');
const { data: customers } = await apiClient.getCustomers(token);

// Create customer profile
const { data: newCustomer } = await apiClient.createCustomer({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  address: { city: 'Mumbai', state: 'MH' }
}, token);
```

## 🔐 Security Notes

1. **HTTPS in Production**: Use HTTPS URLs in production
2. **Change JWT Secret**: Replace the default JWT secret with a strong value
3. **Environment Variables**: Never commit `.env` files with secrets
4. **CORS**: Update CORS configuration in `server/index.js` for production domains
5. **Password Security**: Passwords are hashed using bcryptjs before storing

## 📊 Database Schema

### User Document
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer|agent|admin|superadmin),
  phone: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Customer Document
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  panNumber: String,
  aadharNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  employmentStatus: String,
  monthlyIncome: Number,
  kycStatus: String (pending|approved|rejected),
  loanApplications: [ObjectId],
  documents: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Agent Document
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  agentCode: String (unique),
  assignedCustomers: [ObjectId],
  commission: {
    totalEarnings: Number,
    pendingAmount: Number,
    paidAmount: Number
  },
  performance: {
    loansProcessed: Number,
    successRate: Number
  },
  status: String (active|inactive|suspended),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the API

Use curl or Postman to test:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get customers (requires token)
curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas (IP whitelist)
- Ensure internet connection is active

### JWT Token Invalid
- Token might have expired (7-day expiry)
- Check JWT_SECRET matches between frontend and backend
- Re-login to get a new token

### CORS Error
- Ensure frontend URL is allowed in backend CORS settings
- Check if backend server is running on port 5000

### Port Already in Use
- Change PORT in server/.env
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

## 📚 Next Steps

1. **Connect your components** to the API using `apiClient`
2. **Update Auth Context** to use the new login/register endpoints
3. **Create additional models** for Loans, Documents, etc.
4. **Set up error handling** for API calls
5. **Implement data validation** on the backend
6. **Deploy** to production with proper environment variables

## 📞 Support

For more information about MongoDB Mongoose:
- https://mongoosejs.com/docs/

For Express.js documentation:
- https://expressjs.com/

For MongoDB documentation:
- https://docs.mongodb.com/
