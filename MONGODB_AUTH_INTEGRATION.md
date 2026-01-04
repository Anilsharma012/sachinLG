# MongoDB Authentication Integration Guide

This guide explains how to integrate the new MongoDB-based authentication with your existing Auth Context.

## Current Setup

Your application currently uses:
- **Mock data** stored in `localStorage`
- **Client-side authentication** with no real backend

The MongoDB integration provides:
- **Real database** for storing users
- **Secure authentication** with JWT tokens
- **Role-based access control**

## Step 1: Update Auth Context to Use MongoDB API

Update the `login` and `signup` functions in `src/contexts/AuthContext.tsx`:

### Updated Login Function

```typescript
import { apiClient } from '@/lib/api';

const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await apiClient.login(email, password);
    
    if (error) {
      return { success: false, error };
    }

    if (data && data.token && data.user) {
      // Store JWT token
      localStorage.setItem('auth_token', data.token);
      
      // Set user in context
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        emailVerified: true,
      };
      
      persistUser(user);
      return { success: true };
    }

    return { success: false, error: 'Login failed' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
  }
}, [persistUser]);
```

### Updated Signup Function

```typescript
const signup = useCallback(async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; otp?: string }> => {
  try {
    const { data, error } = await apiClient.register(name, email, password, 'customer');
    
    if (error) {
      return { success: false, error };
    }

    if (data && data.token && data.user) {
      // Store JWT token
      localStorage.setItem('auth_token', data.token);
      
      // Set user in context
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        emailVerified: true,
      };
      
      persistUser(user);
      return { success: true };
    }

    return { success: false, error: 'Signup failed' };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
  }
}, [persistUser]);
```

### Updated Logout Function

```typescript
const logout = useCallback(() => {
  localStorage.removeItem('auth_token');
  persistUser(null);
}, [persistUser]);
```

## Step 2: Protect Routes with Token Verification

Add token verification to your app initialization:

```typescript
// In App.tsx or a new AuthCheck component
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export function AuthCheck() {
  const { persistUser } = useAuth();
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verify token is still valid
      apiClient.verifyToken(token).then(({ data, error }) => {
        if (error) {
          localStorage.removeItem('auth_token');
          persistUser(null);
        }
      });
    }
  }, []);
  
  return null;
}
```

## Step 3: Use Authenticated API Calls

When making API calls in your components, always pass the token:

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

export function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (token) {
      apiClient.getCustomers(token).then(({ data }) => {
        if (data) {
          setCustomers(data);
        }
      });
    }
  }, [token]);

  return (
    // Render customers
  );
}
```

## Step 4: Test the Integration

### Test Registration
```typescript
// In your component
const { signup } = useAuth();

const handleSignup = async () => {
  const result = await signup('John Doe', 'john@example.com', 'password123');
  if (result.success) {
    // User registered and logged in
    console.log('Signup successful');
  } else {
    console.error('Signup error:', result.error);
  }
};
```

### Test Login
```typescript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login('john@example.com', 'password123');
  if (result.success) {
    // User logged in
    console.log('Login successful');
  } else {
    console.error('Login error:', result.error);
  }
};
```

## Step 5: Handle Different User Roles

The MongoDB setup supports these roles:
- `customer` - Regular customer
- `agent` - Loan agent
- `admin` - Admin user
- `superadmin` - Super admin

Register users with different roles:

```typescript
// Register as customer
await apiClient.register('Jane Doe', 'jane@example.com', 'password123', 'customer');

// Register as admin (requires admin approval)
const { data, error } = await apiClient.register('Admin User', 'admin@example.com', 'password123', 'admin');
```

## Important Notes

### Token Storage
- Store JWT token in `localStorage` or `sessionStorage`
- Never store in plain cookies (unless `HttpOnly` is set on backend)
- Clear token on logout

### Token Expiry
- Tokens expire after 7 days
- Implement token refresh to extend sessions
- Redirect to login on token expiry

### Security
- Always use HTTPS in production
- Validate JWT_SECRET is strong (20+ characters)
- Implement rate limiting on auth endpoints
- Add CSRF protection

### Error Handling
- Handle "Invalid credentials" errors gracefully
- Show user-friendly error messages
- Log errors for debugging (but not in production)

## Migration Checklist

- [ ] Update `login` function in AuthContext
- [ ] Update `signup` function in AuthContext
- [ ] Update `logout` function in AuthContext
- [ ] Add token verification on app load
- [ ] Update all API calls to use authenticated endpoints
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test protected routes
- [ ] Test role-based access
- [ ] Update environment variables for production
- [ ] Change JWT_SECRET to a strong value
- [ ] Configure CORS for production domain
- [ ] Set up error logging

## Troubleshooting

### "Invalid credentials" on login
- Check if user exists in database
- Verify password is correct (case-sensitive)
- Check if account is active (isActive: true)

### "Token expired" error
- Token expires after 7 days
- Re-login to get a new token
- Implement token refresh mechanism

### CORS error when calling API
- Ensure backend is running on correct port (5000)
- Check CORS configuration in server/index.js
- Verify frontend URL is allowed in CORS settings

### Cannot find user after signup
- Verify backend MongoDB connection
- Check if user was saved to database
- Check server logs for errors

## Next Steps

1. **Implement password hashing** - Already done with bcryptjs
2. **Add email verification** - Current system has mock OTP, integrate real email
3. **Add OAuth integration** - Google/GitHub login
4. **Implement refresh tokens** - Extend session without re-login
5. **Add 2FA** - Two-factor authentication
6. **Set up audit logs** - Log all authentication events

## Support

For questions about MongoDB authentication:
- MongoDB Docs: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- JWT Docs: https://jwt.io/

