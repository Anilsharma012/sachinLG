# MongoDB Authentication Testing Guide

## ✅ Database Setup Complete

Your MongoDB database has been seeded with the following test data:

### 🔐 Test Credentials

#### SuperAdmin Portal
- **Email:** `superadmin@loanagent.com`
- **Password:** `superadmin123`
- **Dashboard:** `/superadmin`
- **Role:** SuperAdmin (highest privilege)

#### Admin Portal
- **Email:** `admin@loanagent.com`
- **Password:** `admin123`
- **Dashboard:** `/admin`
- **Role:** Admin

#### Agent Portal
- **Email:** `agent@loanagent.com`
- **Password:** `agent123`
- **Dashboard:** `/agent`
- **Role:** Agent

#### Customer Portals
**Customer 1:**
- **Email:** `customer1@loanagent.com`
- **Password:** `customer123`
- **Name:** Priya Patel
- **Dashboard:** `/customer`
- **KYC Status:** ✅ Approved

**Customer 2:**
- **Email:** `customer2@loanagent.com`
- **Password:** `customer123`
- **Name:** Amit Kumar
- **Dashboard:** `/customer`
- **KYC Status:** ⏳ Pending

---

## 🚀 How to Test

### Step 1: Start Both Servers

**Terminal 1 - Start Backend:**
```bash
npm run server
```
Backend should run on: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend should run on: `http://localhost:5173`

### Step 2: Test Each Authentication Portal

#### Test SuperAdmin Login
1. Navigate to: `http://localhost:5173/auth/superadmin`
2. Enter credentials:
   - Email: `superadmin@loanagent.com`
   - Password: `superadmin123`
3. Click "Sign In"
4. **Expected:** Redirects to `/superadmin` dashboard
5. **Verify:** Token is stored in browser localStorage as `auth_token`

#### Test Admin Login
1. Navigate to: `http://localhost:5173/auth/admin`
2. Click on "Login" tab
3. Enter credentials:
   - Email: `admin@loanagent.com`
   - Password: `admin123`
4. Click "Sign In as Admin"
5. **Expected:** Redirects to `/admin` dashboard
6. **Verify:** Data comes from MongoDB

#### Test Admin Signup
1. Navigate to: `http://localhost:5173/auth/admin`
2. Click on "Sign Up" tab
3. Enter details:
   - Name: `Test Admin`
   - Email: `test-admin@loanagent.com`
   - Password: `testpass123`
   - Mobile: `9876543210`
   - Organization: `Test Org`
4. Click "Create Account"
5. **Expected:** Shows "Your signup request has been submitted"
6. **Verify in MongoDB:**
   - New user created in `users` collection
   - Check role = "admin"

#### Test Agent Login
1. Navigate to: `http://localhost:5173/auth/agent`
2. Click on "Login" tab
3. Enter credentials:
   - Email: `agent@loanagent.com`
   - Password: `agent123`
4. Click "Sign In as Agent"
5. **Expected:** Redirects to `/agent` dashboard
6. **Verify:** Agent data with commission info displays

#### Test Agent Signup
1. Navigate to: `http://localhost:5173/auth/agent`
2. Click on "Sign Up" tab
3. Enter details:
   - Name: `Test Agent`
   - Email: `test-agent@loanagent.com`
   - Password: `testpass123`
   - Mobile: `9999999999`
   - Organization: `Test Org`
4. Click "Create Account"
5. **Expected:** Shows signup pending message
6. **Verify in MongoDB:**
   - New user created with role = "agent"

#### Test Customer Login
1. Navigate to: `http://localhost:5173/auth/customer`
2. Click on "Login" tab (default tab)
3. Enter credentials:
   - Email: `customer1@loanagent.com`
   - Password: `customer123`
4. Click "Sign In"
5. **Expected:** Redirects to `/customer` dashboard
6. **Verify:** Customer profile displays with KYC status

#### Test Customer Signup
1. Navigate to: `http://localhost:5173/auth/customer`
2. Click on "Sign Up" tab
3. Enter details:
   - Name: `Test Customer`
   - Email: `test-customer@loanagent.com`
   - Password: `testpass123`
4. Click "Create Account"
5. **Expected:** Shows OTP verification screen (demo OTP shown)
6. Enter OTP: `123456` (demo OTP)
7. Click "Verify"
8. **Expected:** Redirects to `/customer` dashboard
9. **Verify in MongoDB:**
   - New user and customer created
   - Check `users` collection: role = "customer"
   - Check `customers` collection: new customer record with userId reference

---

## 🔍 Verify Data in MongoDB

### Check MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Navigate to your project: `Loan Agent`
3. Click "Data Explorer"
4. Expand `admin` database
5. View collections:
   - **users** - All user accounts
   - **customers** - Customer profiles
   - **agents** - Agent information

### Check Test Data

**Users Collection should contain:**
```
- superadmin@loanagent.com (role: superadmin)
- admin@loanagent.com (role: admin)
- agent@loanagent.com (role: agent)
- customer1@loanagent.com (role: customer)
- customer2@loanagent.com (role: customer)
- test-admin@loanagent.com (role: admin) [if you tested signup]
- test-agent@loanagent.com (role: agent) [if you tested signup]
- test-customer@loanagent.com (role: customer) [if you tested signup]
```

**Customers Collection should contain:**
```
- Priya Patel (email: customer1@loanagent.com, kycStatus: approved)
- Amit Kumar (email: customer2@loanagent.com, kycStatus: pending)
- Test Customer [if you tested signup]
```

**Agents Collection should contain:**
```
- Rahul Sharma (email: agent@loanagent.com)
```

---

## 🔐 Browser DevTools Check

### Check Stored Token

1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage"
4. Select `http://localhost:5173`
5. **Look for:**
   - Key: `auth_token`
   - Value: JWT token (long string starting with `eyJ...`)
   - This token expires after 7 days

### Check Network Requests

1. Open Chrome DevTools (F12)
2. Go to "Network" tab
3. Reload page with login
4. Look for requests to:
   - `http://localhost:5000/api/auth/login` - POST request
   - **Response should contain:** `token` and `user` object

### Example Successful Login Response

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@loanagent.com",
    "role": "admin"
  }
}
```

---

## ✅ Testing Checklist

### Superadmin Flow
- [ ] Superadmin can login successfully
- [ ] Redirects to `/superadmin` dashboard
- [ ] JWT token stored in localStorage
- [ ] Can see superadmin-specific features

### Admin Flow
- [ ] Admin can login successfully
- [ ] Redirects to `/admin` dashboard
- [ ] Admin can access admin features
- [ ] Admin can view pending admin/agent approvals
- [ ] Admin signup creates new user in database

### Agent Flow
- [ ] Agent can login successfully
- [ ] Redirects to `/agent` dashboard
- [ ] Agent can see assigned customers
- [ ] Agent can see commission details
- [ ] Agent signup creates new user in database

### Customer Flow
- [ ] Customer 1 can login
- [ ] Customer 2 can login
- [ ] Redirects to `/customer` dashboard
- [ ] Can see customer profile
- [ ] Can see KYC status
- [ ] Customer signup creates new user and customer in database
- [ ] New customer appears in customers collection

### General Authentication
- [ ] JWT token stored after successful login
- [ ] Token used for subsequent API calls
- [ ] Logout clears token
- [ ] Cannot access protected routes without authentication
- [ ] Role-based access control works (admin can't access agent routes)

---

## 🐛 Troubleshooting

### Login Fails with "User not found"
- **Problem:** User doesn't exist in MongoDB
- **Solution:** Verify email is correct, reseed database with `npm run seed`

### Login Fails with "Invalid credentials"
- **Problem:** Password is incorrect or doesn't match
- **Solution:** Check password spelling, passwords are case-sensitive

### No token in localStorage
- **Problem:** Login succeeded but token not stored
- **Solution:** Check browser console for errors, verify API response includes token

### "Cannot access /admin" (redirects to /auth)
- **Problem:** User not authenticated or wrong role
- **Solution:** Login with correct credentials, check user's role in MongoDB

### Backend returns CORS error
- **Problem:** Frontend can't communicate with backend
- **Solution:** Ensure backend is running on http://localhost:5000, check CORS settings in server/index.js

### "Token expired" error
- **Problem:** JWT token older than 7 days
- **Solution:** Logout and login again to get new token

---

## 📊 API Endpoints Reference

All endpoints require JWT token in Authorization header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints (Public)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify
```

### User Endpoints (Protected)
```
GET    /api/users             (Admin only)
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id         (Admin only)
```

### Customer Endpoints (Protected)
```
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
DELETE /api/customers/:id     (Admin only)
```

### Agent Endpoints (Protected)
```
GET    /api/agents            (Admin only)
POST   /api/agents            (Admin only)
GET    /api/agents/:id
PUT    /api/agents/:id
DELETE /api/agents/:id        (Admin only)
```

---

## 🚀 Next Steps After Testing

1. **Fix any issues found** during testing
2. **Update dashboard pages** to fetch real data from MongoDB
3. **Implement additional features:**
   - Email verification for customers
   - Admin approval workflow for admin/agent signups
   - Password reset with real emails
   - Customer KYC verification process
   - Loan application management
   - Payment tracking
4. **Deploy to production:**
   - Use production MongoDB URI
   - Set strong JWT_SECRET
   - Configure CORS for production domain
   - Set up HTTPS
   - Enable database backups

---

## 📞 Support

If you encounter any issues:

1. Check browser console for errors (F12)
2. Check backend server logs
3. Verify MongoDB connection string is correct
4. Ensure all environments variables are set
5. Check that both servers are running

Good luck with your testing! 🎉

