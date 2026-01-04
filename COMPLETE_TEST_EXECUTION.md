# ✅ Complete MongoDB Authentication Testing Execution Guide

## 🎬 Start Here

This guide will walk you through testing all authentication flows with MongoDB. Follow each step exactly.

---

## 📋 Prerequisites Check

Before starting, verify:
- Backend is running on `http://localhost:5000`
- Frontend is running on `http://localhost:8080`
- MongoDB seeded (run `npm run seed` if not done)

---

## 🔴 TEST 1: SuperAdmin Login

### Steps
1. Open browser: `http://localhost:8080/auth/superadmin`
2. Wait for page to load
3. Enter credentials:
   - **Email:** `superadmin@loanagent.com`
   - **Password:** `superadmin123`
4. Click "Sign In"

### Expected Results
- ✅ Page redirects to `http://localhost:8080/superadmin`
- ✅ SuperAdmin dashboard loads
- ✅ No error messages shown

### Verify in Browser DevTools
1. Press `F12` to open DevTools
2. Go to **Application** tab
3. Click **LocalStorage**
4. Look for `auth_token` key
5. Value should be a long JWT token starting with `eyJ`

### Verify in MongoDB
1. Go to https://cloud.mongodb.com
2. Select your project "Loan Agent"
3. Click **Data Explorer**
4. Expand **admin** database → Click **users**
5. Look for document with:
   - `email: "superadmin@loanagent.com"`
   - `role: "superadmin"`
   - `lastLogin: [recent date]`

### ✅ Mark as PASS if:
- Dashboard loads
- Token in localStorage
- No console errors

---

## 🟠 TEST 2: Admin Login

### Steps
1. Open browser: `http://localhost:8080/auth/admin`
2. Verify "Login" tab is selected
3. Enter credentials:
   - **Email:** `admin@loanagent.com`
   - **Password:** `admin123`
4. Click "Sign In as Admin"

### Expected Results
- ✅ Page redirects to `http://localhost:8080/admin`
- ✅ Admin dashboard loads
- ✅ Shows admin-specific features

### Verify in Browser
1. F12 → Application → LocalStorage
2. `auth_token` should be present
3. Console should show no errors

### Verify in MongoDB
1. MongoDB Data Explorer → users collection
2. Find document: `email: "admin@loanagent.com"`
3. Check:
   - `role: "admin"`
   - `lastLogin` updated to recent time
   - `isActive: true`

### ✅ Mark as PASS if:
- Dashboard loads for admin
- Token stored
- No errors

---

## 🟡 TEST 3: Admin Signup

### Steps
1. Go to: `http://localhost:8080/auth/admin`
2. Click "Sign Up" tab
3. Fill in form:
   - **Name:** `Test Admin User`
   - **Email:** `test-admin-001@loanagent.com`
   - **Password:** `testpass123`
   - **Mobile:** `9876543210`
   - **Organization:** `Test Organization`
4. Click "Create Account"

### Expected Results
- ✅ Shows message: "Your signup request has been submitted"
- ✅ Shows message: "Your request is being reviewed"
- ✅ Form clears or stays disabled

### Verify in MongoDB
1. MongoDB Data Explorer → users collection
2. Look for NEW document with:
   - `email: "test-admin-001@loanagent.com"`
   - `name: "Test Admin User"`
   - `role: "admin"`
   - `password: [hashed]` (not plain text)
   - `isActive: true`
   - `createdAt: [today]`

3. Click on the document
4. Expand the document to see full details
5. Verify password looks like: `$2a$10$...` (bcrypt hash)

### ✅ Mark as PASS if:
- Success message shown
- New document in `users` collection
- Password is hashed (not plain text)

---

## 🟣 TEST 4: Agent Login

### Steps
1. Go to: `http://localhost:8080/auth/agent`
2. Verify "Login" tab selected
3. Enter credentials:
   - **Email:** `agent@loanagent.com`
   - **Password:** `agent123`
4. Click "Sign In as Agent"

### Expected Results
- ✅ Redirects to `http://localhost:8080/agent`
- ✅ Agent dashboard loads
- ✅ Shows agent-specific data (commissions, customers, etc.)

### Verify in Browser
1. F12 → Application → LocalStorage → `auth_token`
2. Token should be present and valid

### Verify in MongoDB
1. MongoDB Data Explorer → agents collection
2. Find document:
   - `email: "agent@loanagent.com"`
   - `firstName: "Rahul"`
   - `userId: [reference]`
3. Check commission data exists:
   - `commission.totalEarnings: 25000`
   - `commission.pendingAmount: 10000`

### ✅ Mark as PASS if:
- Agent dashboard loads
- Token stored
- Agent data displays correctly

---

## 🟢 TEST 5: Agent Signup

### Steps
1. Go to: `http://localhost:8080/auth/agent`
2. Click "Sign Up" tab
3. Fill in form:
   - **Name:** `Test Agent User`
   - **Email:** `test-agent-001@loanagent.com`
   - **Password:** `testpass123`
   - **Mobile:** `9999999999`
   - **Organization:** `Test Organization`
4. Click "Create Account"

### Expected Results
- ✅ Shows: "Your signup request has been submitted"
- ✅ Shows: "Awaiting approval from admin"
- ✅ Form disabled or cleared

### Verify in MongoDB
1. MongoDB Data Explorer → users collection
2. Find NEW document:
   - `email: "test-agent-001@loanagent.com"`
   - `role: "agent"`
   - `phone: "9999999999"`
   - Password is hashed

### Additional Check
1. MongoDB → agents collection
2. Should NOT be there yet (waiting for admin approval)

### ✅ Mark as PASS if:
- Approval message shown
- New user in `users` collection with role "agent"
- No entry in `agents` collection yet (pending approval)

---

## 🔵 TEST 6: Customer Login

### Steps
1. Go to: `http://localhost:8080/auth/customer`
2. Verify "Login" tab is selected (default)
3. Enter credentials:
   - **Email:** `customer1@loanagent.com`
   - **Password:** `customer123`
4. Click "Sign In"

### Expected Results
- ✅ Redirects to `http://localhost:8080/customer`
- ✅ Customer dashboard loads
- ✅ Shows customer profile (Priya Patel)
- ✅ Shows KYC status: APPROVED

### Verify in Browser
1. F12 → Application → LocalStorage → `auth_token`
2. Token should be stored

### Verify in MongoDB
1. MongoDB Data Explorer → users collection
2. Find: `email: "customer1@loanagent.com"`
   - `role: "customer"`
3. MongoDB Data Explorer → customers collection
4. Find customer with:
   - `firstName: "Priya"`
   - `lastName: "Patel"`
   - `kycStatus: "approved"`
   - `userId: [reference]`

### ✅ Mark as PASS if:
- Customer dashboard loads
- Shows correct customer name (Priya Patel)
- Shows KYC status
- Token stored

---

## 🟢 TEST 7: Customer 2 Login (Different Status)

### Steps
1. Go to: `http://localhost:8080/auth/customer`
2. Enter credentials:
   - **Email:** `customer2@loanagent.com`
   - **Password:** `customer123`
3. Click "Sign In"

### Expected Results
- ✅ Redirects to customer dashboard
- ✅ Shows customer profile (Amit Kumar)
- ✅ Shows KYC status: PENDING

### Verify in MongoDB
1. MongoDB Data Explorer → customers collection
2. Find customer with:
   - `firstName: "Amit"`
   - `kycStatus: "pending"`
   - `monthlyIncome: 75000`

### ✅ Mark as PASS if:
- Different customer profile loads
- Shows correct KYC status (pending vs approved)

---

## 🟡 TEST 8: Customer Signup

### Steps
1. Go to: `http://localhost:8080/auth/customer`
2. Click "Sign Up" tab
3. Fill in form:
   - **Name:** `Test Customer`
   - **Email:** `test-customer-001@test.com`
   - **Password:** `testpass123`
4. Click "Create Account"

### Expected Results
- ✅ Shows "OTP Verification" screen
- ✅ Shows message: "Enter the 6-digit OTP sent to your email"
- ✅ Shows demo OTP: `123456`

### Next Steps
1. Enter OTP: `123456` (shown on screen)
2. Click "Verify OTP"

### Expected Results
- ✅ Redirects to customer dashboard
- ✅ Welcome message or customer profile loads

### Verify in MongoDB
1. MongoDB Data Explorer → users collection
2. Find NEW document:
   - `email: "test-customer-001@test.com"`
   - `name: "Test Customer"`
   - `role: "customer"`
   - Password is hashed
3. MongoDB Data Explorer → customers collection
4. Find NEW document:
   - `firstName: "Test"`
   - `lastName: "Customer"`
   - `email: "test-customer-001@test.com"`
   - `userId: [matches user _id]`

### ✅ Mark as PASS if:
- OTP screen appears
- After OTP verification, redirects to dashboard
- NEW user in `users` collection
- NEW customer in `customers` collection
- Both have matching userId relationship

---

## 📊 Final Verification Checklist

### Login Tests Passed
- [ ] SuperAdmin login ✅
- [ ] Admin login ✅
- [ ] Agent login ✅
- [ ] Customer login ✅
- [ ] Customer 2 login ✅

### Signup Tests Passed
- [ ] Admin signup creates user ✅
- [ ] Agent signup creates user ✅
- [ ] Customer signup creates user AND customer ✅

### MongoDB Data Verified
- [ ] users collection contains all test users ✅
- [ ] customers collection contains customers with userId references ✅
- [ ] agents collection contains agents ✅
- [ ] All passwords are hashed (not plain text) ✅

### Browser Functionality
- [ ] JWT token stored in localStorage after login ✅
- [ ] No console errors ✅
- [ ] Page redirects work correctly ✅
- [ ] Dashboard loads after authentication ✅

### API Connectivity
- [ ] Backend receiving login requests ✅
- [ ] Backend querying MongoDB ✅
- [ ] Frontend receiving token response ✅
- [ ] Frontend storing token ✅

---

## 🎉 Testing Complete!

If all tests pass:
1. ✅ MongoDB connection working
2. ✅ Authentication system functional
3. ✅ Data persisting correctly
4. ✅ Frontend-Backend integration successful
5. ✅ JWT tokens working
6. ✅ All roles (SuperAdmin, Admin, Agent, Customer) functional

---

## 🔧 If Tests Fail

### Issue: Login shows "User not found"
**Solution:** Verify credentials are correct, reseed database
```bash
npm run seed
```

### Issue: No token in localStorage
**Solution:** Check browser console for errors (F12)

### Issue: Backend returns CORS error
**Solution:** Ensure both servers running:
- Backend: `npm run server`
- Frontend: `npm run dev`

### Issue: New signup not appearing in MongoDB
**Solution:** Check backend console for errors, verify MongoDB connection

### Issue: Password shows as plain text in MongoDB
**Solution:** This shouldn't happen - check User model pre-save hook

---

## 📈 Next Steps After Testing

1. Update dashboard pages to fetch real data
2. Add more models (Loans, Documents, etc.)
3. Implement real email OTP verification
4. Set up admin approval workflow
5. Deploy to production

---

## 📞 Support

If you get stuck:
1. Read `MONGODB_QUICK_START.md` for quick reference
2. Read `MONGODB_AUTH_TEST_GUIDE.md` for detailed guide
3. Check browser console: F12 → Console
4. Check backend logs in terminal
5. Verify MongoDB connection in Data Explorer

---

## ✨ You've Successfully Tested MongoDB Authentication!

All test credentials and data are live and ready. Your authentication system is fully functional with MongoDB as the backend database!

