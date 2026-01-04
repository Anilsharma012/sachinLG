# 🚀 MongoDB Authentication - Quick Start

## ⚡ 30-Second Setup

1. **Start Backend:**
   ```bash
   npm run server
   ```

2. **Start Frontend** (new terminal):
   ```bash
   npm run dev
   ```

3. **Test Login:**
   - Go to: http://localhost:8080/auth/customer
   - Email: `customer1@loanagent.com`
   - Password: `customer123`
   - Click "Sign In"

4. **Verify:** Check browser DevTools (F12) → Application → LocalStorage → `auth_token`

---

## 📋 All Test Credentials

| Role | Email | Password |
|------|-------|----------|
| SuperAdmin | `superadmin@loanagent.com` | `superadmin123` |
| Admin | `admin@loanagent.com` | `admin123` |
| Agent | `agent@loanagent.com` | `agent123` |
| Customer 1 | `customer1@loanagent.com` | `customer123` |
| Customer 2 | `customer2@loanagent.com` | `customer123` |

---

## 🎯 Test Each Portal

### Test SuperAdmin
```
URL: http://localhost:8080/auth/superadmin
Credentials: superadmin@loanagent.com / superadmin123
Expected: Redirects to /superadmin
```

### Test Admin
```
URL: http://localhost:8080/auth/admin
Credentials: admin@loanagent.com / admin123
Expected: Redirects to /admin
Signup: Fill form → new admin created in MongoDB
```

### Test Agent
```
URL: http://localhost:8080/auth/agent
Credentials: agent@loanagent.com / agent123
Expected: Redirects to /agent
Signup: Fill form → new agent created in MongoDB
```

### Test Customer
```
URL: http://localhost:8080/auth/customer
Credentials: customer1@loanagent.com / customer123
Expected: Redirects to /customer
Signup: Fill form → OTP (123456) → new customer in MongoDB
```

---

## 🔌 How It Works

```
FRONTEND                          BACKEND                        DATABASE
┌──────────────────┐             ┌──────────────┐            ┌──────────────┐
│ Login Form       │──POST──────>│ /api/auth    │──QUERY───>│ MongoDB      │
│ - Email          │ /login      │ - Hash pwd   │ users     │ - users      │
│ - Password       │             │ - Create JWT │           │ - customers  │
└──────────────────┘             │ - Return token
                                 └──────────────┘<──RESULT──┘ - agents
                                        │
                                        │ JWT Token
                                        ↓
                            ┌──────────────────┐
                            │ localStorage     │
                            │ auth_token       │
                            └──────────────────┘
```

---

## 📊 Data Collections

### Users Collection
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",    // Hashed with bcryptjs
  role: "admin|agent|customer|superadmin",
  phone: "9876543210",
  isActive: true,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Customers Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,               // Reference to User
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "9876543210",
  address: {
    street: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001"
  },
  panNumber: "ABCDE1234F",
  aadharNumber: "123456789012",
  employmentStatus: "employed",
  monthlyIncome: 50000,
  kycStatus: "approved|pending|rejected",
  loanApplications: [ObjectId],   // References to LoanApplications
  documents: [ObjectId],          // References to Documents
  createdAt: Date,
  updatedAt: Date
}
```

### Agents Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,               // Reference to User
  firstName: "Rahul",
  lastName: "Sharma",
  email: "agent@example.com",
  phone: "9876543210",
  agentCode: "AG001",
  assignedCustomers: [ObjectId],  // References to Customers
  commission: {
    totalEarnings: 25000,
    pendingAmount: 10000,
    paidAmount: 15000
  },
  performance: {
    loansProcessed: 12,
    successRate: 92
  },
  status: "active|inactive|suspended",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Quick Verification Steps

### 1. Backend Running?
```
curl http://localhost:5000/api/health
```
**Expected Response:** `{"status": "Server is running"}`

### 2. Can Login?
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@loanagent.com",
    "password": "admin123"
  }'
```
**Expected Response:** Token + User data

### 3. Check MongoDB
1. Go to https://cloud.mongodb.com
2. Data Explorer → admin database
3. Should see: users, customers, agents collections

### 4. Check Token
1. Open http://localhost:8080
2. Login with any credentials
3. Press F12 → Application → LocalStorage
4. Look for `auth_token` key

---

## 📱 Test Signup Data Creation

### Create New Admin
1. Go to http://localhost:8080/auth/admin
2. Click "Sign Up" tab
3. Fill in:
   - Name: Test Admin
   - Email: test-admin@test.com
   - Password: testpass123
   - Mobile: 9999999999
4. Click "Create Account"
5. Check MongoDB: `users` collection should have new record

### Create New Customer
1. Go to http://localhost:8080/auth/customer
2. Click "Sign Up" tab
3. Fill in:
   - Name: Test Customer
   - Email: test@test.com
   - Password: testpass123
4. Click "Create Account"
5. Enter OTP: `123456`
6. Check MongoDB:
   - `users` collection: new user
   - `customers` collection: new customer with userId reference

---

## 🎯 Where Data Goes

### When User Logs In
1. Frontend sends POST to `/api/auth/login`
2. Backend queries MongoDB `users` collection
3. Backend validates password (bcryptjs)
4. Backend creates JWT token
5. Backend returns token + user info
6. Frontend stores token in localStorage
7. Frontend redirects to dashboard

### When User Signs Up
1. Frontend sends POST to `/api/auth/register`
2. Backend creates new `users` document
3. If customer role: also creates `customers` document
4. If admin/agent role: also creates in pending queue
5. Returns token + user info
6. Frontend stores token and redirects

---

## 🔑 Key Files Updated

- ✅ `src/contexts/AuthContext.tsx` - Uses MongoDB API
- ✅ `src/lib/api.ts` - API client ready
- ✅ `server/index.js` - Backend server
- ✅ `server/config/database.js` - MongoDB connection
- ✅ `server/models/User.js` - User schema
- ✅ `server/models/Customer.js` - Customer schema
- ✅ `server/models/Agent.js` - Agent schema
- ✅ `server/routes/auth.js` - Auth endpoints
- ✅ `server/routes/users.js` - User endpoints
- ✅ `server/routes/customers.js` - Customer endpoints
- ✅ `server/routes/agents.js` - Agent endpoints

---

## ⚡ Common Commands

```bash
# Start backend
npm run server

# Start frontend
npm run dev

# Seed database with test data
npm run seed

# Start both together
npm run dev:all
```

---

## 🔍 Debugging Tips

1. **Check browser console:** F12 → Console
2. **Check backend logs:** Terminal where `npm run server` runs
3. **Check API requests:** F12 → Network tab
4. **Check stored data:** F12 → Application → LocalStorage
5. **Check database:** MongoDB Atlas → Data Explorer

---

## ✅ Checklist for Full Test

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:8080
- [ ] SuperAdmin can login
- [ ] Admin can login
- [ ] Agent can login
- [ ] Customer 1 can login
- [ ] Customer 2 can login
- [ ] New admin signup creates user in MongoDB
- [ ] New agent signup creates user in MongoDB
- [ ] New customer signup creates user AND customer in MongoDB
- [ ] JWT token appears in localStorage after login
- [ ] Can see user data in MongoDB collections

---

## 🎉 You're Ready!

Everything is set up and ready to test. Start the servers and try logging in with any of the test credentials above.

**Need help?** Check the detailed guides:
- `MONGODB_AUTH_TEST_GUIDE.md` - Detailed test instructions
- `MONGODB_TESTING_SUMMARY.md` - Complete summary
- `MONGODB_SETUP.md` - Initial setup documentation

