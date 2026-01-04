import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { apiClient } from '@/lib/api';

export type UserRole = 'superadmin' | 'admin' | 'agent' | 'customer';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  emailVerified?: boolean;
  mobile?: string;
  organizationName?: string;
  parentAdminId?: string;
}

export interface PendingRoleSignup {
  id: string;
  email: string;
  name: string;
  password: string;
  mobile: string;
  role: 'admin' | 'agent';
  organizationName?: string;
  parentAdminId?: string;
  status: VerificationStatus;
  createdAt: number;
}

interface PendingVerification {
  email: string;
  name: string;
  password: string;
  otp: string;
  expiresAt: number;
}

interface PendingPasswordReset {
  email: string;
  otp: string;
  expiresAt: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  pendingVerification: string | null;
  pendingPasswordReset: string | null;
  pendingAdmins: PendingRoleSignup[];
  pendingAgents: PendingRoleSignup[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; otp?: string }>;
  signupAsRole: (data: { name: string; email: string; password: string; mobile: string; role: 'admin' | 'agent'; organizationName?: string; parentAdminId?: string }) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; error?: string; otp?: string }>;
  loginAsRole: (role: UserRole) => void;
  loginWithSocial: (provider: 'google' | 'github') => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; otp?: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  approveUser: (id: string, role: 'admin' | 'agent') => Promise<{ success: boolean; error?: string }>;
  rejectUser: (id: string, role: 'admin' | 'agent') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearPendingVerification: () => void;
  clearPendingPasswordReset: () => void;
  refreshPendingLists: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Validation schemas
export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const roleSignupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email is too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits').max(15, 'Mobile is too long'),
  organizationName: z.string().optional(),
});

// Mock users for demo purposes
const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  'superadmin@loanagent.com': {
    id: 'usr_superadmin_001',
    email: 'superadmin@loanagent.com',
    name: 'Super Admin (CEO)',
    role: 'superadmin',
    password: 'superadmin123',
    emailVerified: true,
  },
  'admin@loanagent.com': {
    id: 'usr_admin_001',
    email: 'admin@loanagent.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    emailVerified: true,
  },
  'agent@loanagent.com': {
    id: 'usr_agent_001',
    email: 'agent@loanagent.com',
    name: 'Rahul Sharma',
    role: 'agent',
    password: 'agent123',
    emailVerified: true,
    parentAdminId: 'usr_admin_001',
  },
  'customer@loanagent.com': {
    id: 'usr_cust_001',
    email: 'customer@loanagent.com',
    name: 'Priya Patel',
    role: 'customer',
    password: 'customer123',
    emailVerified: true,
  },
};

const STORAGE_KEY = 'loan_agent_auth';
const USERS_STORAGE_KEY = 'loan_agent_users';
const PENDING_VERIFICATION_KEY = 'loan_agent_pending_verification';
const PENDING_ADMINS_KEY = 'loan_agent_pending_admins';
const PENDING_AGENTS_KEY = 'loan_agent_pending_agents';

// Generate a 6-digit OTP
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, AuthUser & { password: string }>>({});
  const [pendingAdmins, setPendingAdmins] = useState<PendingRoleSignup[]>([]);
  const [pendingAgents, setPendingAgents] = useState<PendingRoleSignup[]>([]);
  const [pendingPasswordReset, setPendingPasswordReset] = useState<string | null>(null);

  const loadPendingLists = useCallback(() => {
    try {
      const storedPendingAdmins = localStorage.getItem(PENDING_ADMINS_KEY);
      if (storedPendingAdmins) {
        setPendingAdmins(JSON.parse(storedPendingAdmins));
      }
      const storedPendingAgents = localStorage.getItem(PENDING_AGENTS_KEY);
      if (storedPendingAgents) {
        setPendingAgents(JSON.parse(storedPendingAgents));
      }
    } catch (e) {
      console.error('Failed to load pending lists:', e);
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Load registered users
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
          setRegisteredUsers(JSON.parse(storedUsers));
        }

        // Check for stored JWT token first (MongoDB login)
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Verify token with backend
          const { data, error } = await apiClient.verifyToken(token);
          if (!error && data && data.decoded) {
            // Token is valid - user is logged in
            // Note: You may want to fetch user details from /api/users/:id
            // For now, we'll load from storage
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.user) {
                setUser(parsed.user);
              }
            }
          } else {
            // Token is invalid or expired - clear it
            localStorage.removeItem('auth_token');
          }
        } else {
          // Load current user session (fallback to old storage)
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.user) {
              setUser(parsed.user);
            }
          }
        }

        // Load pending verification
        const pendingEmail = localStorage.getItem(PENDING_VERIFICATION_KEY);
        if (pendingEmail) {
          setPendingVerification(pendingEmail);
        }

        // Load pending admin/agent lists
        loadPendingLists();
      } catch (e) {
        console.error('Failed to parse stored auth:', e);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [loadPendingLists]);

  const refreshPendingLists = useCallback(() => {
    loadPendingLists();
  }, [loadPendingLists]);

  const persistUser = useCallback((authUser: AuthUser | null) => {
    if (authUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: authUser, timestamp: Date.now() }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(authUser);
  }, []);

  const persistRegisteredUsers = useCallback((users: Record<string, AuthUser & { password: string }>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setRegisteredUsers(users);
  }, []);

  const persistPendingAdmins = useCallback((admins: PendingRoleSignup[]) => {
    localStorage.setItem(PENDING_ADMINS_KEY, JSON.stringify(admins));
    setPendingAdmins(admins);
  }, []);

  const persistPendingAgents = useCallback((agents: PendingRoleSignup[]) => {
    localStorage.setItem(PENDING_AGENTS_KEY, JSON.stringify(agents));
    setPendingAgents(agents);
  }, []);

  // Regular customer signup with email verification
  const signup = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string; otp?: string }> => {
    try {
      // Call MongoDB API to register
      const { data, error } = await apiClient.register(name, email, password, 'customer');

      if (error) {
        return { success: false, error };
      }

      if (data && data.token && data.user) {
        // Store JWT token
        localStorage.setItem('auth_token', data.token);

        // Create user object
        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: 'customer',
          emailVerified: true,
        };

        persistUser(user);
        // For now, auto-verify customers. In production, send real email with OTP
        const otp = '123456'; // Demo OTP
        return { success: true, otp };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
    }
  }, [persistUser]);

  // Admin/Agent signup - goes to verification queue
  const signupAsRole = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    mobile: string;
    role: 'admin' | 'agent';
    organizationName?: string;
    parentAdminId?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call MongoDB API to register
      const { data: responseData, error } = await apiClient.register(
        data.name,
        data.email,
        data.password,
        data.role
      );

      if (error) {
        return { success: false, error };
      }

      if (responseData && responseData.user) {
        // For admin/agent, create pending entry in local state
        // In production, backend would handle approval workflow
        const newPending: PendingRoleSignup = {
          id: responseData.user.id,
          email: data.email.toLowerCase().trim(),
          name: data.name.trim(),
          password: data.password,
          mobile: data.mobile,
          role: data.role,
          organizationName: data.organizationName,
          parentAdminId: data.parentAdminId,
          status: 'pending',
          createdAt: Date.now(),
        };

        if (data.role === 'admin') {
          persistPendingAdmins([...pendingAdmins, newPending]);
        } else {
          persistPendingAgents([...pendingAgents, newPending]);
        }

        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('SignupAsRole error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
    }
  }, [pendingAdmins, pendingAgents, persistPendingAdmins, persistPendingAgents]);

  const approveUser = useCallback(async (id: string, role: 'admin' | 'agent'): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const pendingList = role === 'admin' ? pendingAdmins : pendingAgents;
    const pending = pendingList.find(p => p.id === id);

    if (!pending) {
      return { success: false, error: 'Pending user not found.' };
    }

    // Create new user
    const newUser: AuthUser & { password: string } = {
      id: `usr_${Date.now()}`,
      email: pending.email,
      name: pending.name,
      role: role,
      password: pending.password,
      emailVerified: true,
      mobile: pending.mobile,
      organizationName: pending.organizationName,
      parentAdminId: pending.parentAdminId,
    };

    // Save to registered users
    const updatedUsers = { ...registeredUsers, [pending.email]: newUser };
    persistRegisteredUsers(updatedUsers);

    // Remove from pending list
    const updatedPending = pendingList.filter(p => p.id !== id);
    if (role === 'admin') {
      persistPendingAdmins(updatedPending);
    } else {
      persistPendingAgents(updatedPending);
    }

    return { success: true };
  }, [pendingAdmins, pendingAgents, registeredUsers, persistRegisteredUsers, persistPendingAdmins, persistPendingAgents]);

  const rejectUser = useCallback(async (id: string, role: 'admin' | 'agent'): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const pendingList = role === 'admin' ? pendingAdmins : pendingAgents;
    const updatedPending = pendingList.filter(p => p.id !== id);

    if (role === 'admin') {
      persistPendingAdmins(updatedPending);
    } else {
      persistPendingAgents(updatedPending);
    }

    return { success: true };
  }, [pendingAdmins, pendingAgents, persistPendingAdmins, persistPendingAgents]);

  const verifyEmail = useCallback(async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const normalizedEmail = email.toLowerCase().trim();
    const pendingDataStr = localStorage.getItem(`pending_${normalizedEmail}`);

    if (!pendingDataStr) {
      return { success: false, error: 'No pending verification found. Please sign up again.' };
    }

    const pendingData: PendingVerification = JSON.parse(pendingDataStr);

    if (Date.now() > pendingData.expiresAt) {
      localStorage.removeItem(`pending_${normalizedEmail}`);
      return { success: false, error: 'Verification code expired. Please request a new one.' };
    }

    if (pendingData.otp !== otp.trim()) {
      return { success: false, error: 'Invalid verification code.' };
    }

    const newUser: AuthUser & { password: string } = {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      name: pendingData.name,
      role: 'customer',
      password: pendingData.password,
      emailVerified: true,
    };

    const updatedUsers = { ...registeredUsers, [normalizedEmail]: newUser };
    persistRegisteredUsers(updatedUsers);

    localStorage.removeItem(`pending_${normalizedEmail}`);
    localStorage.removeItem(PENDING_VERIFICATION_KEY);
    setPendingVerification(null);

    const { password: _, ...userWithoutPassword } = newUser;
    persistUser(userWithoutPassword);

    return { success: true };
  }, [registeredUsers, persistRegisteredUsers, persistUser]);

  const resendOtp = useCallback(async (email: string): Promise<{ success: boolean; error?: string; otp?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const normalizedEmail = email.toLowerCase().trim();
    const pendingDataStr = localStorage.getItem(`pending_${normalizedEmail}`);

    if (!pendingDataStr) {
      return { success: false, error: 'No pending verification found. Please sign up again.' };
    }

    const pendingData: PendingVerification = JSON.parse(pendingDataStr);
    const newOtp = generateOtp();
    pendingData.otp = newOtp;
    pendingData.expiresAt = Date.now() + 10 * 60 * 1000;

    localStorage.setItem(`pending_${normalizedEmail}`, JSON.stringify(pendingData));

    return { success: true, otp: newOtp };
  }, []);

  const clearPendingVerification = useCallback(() => {
    if (pendingVerification) {
      localStorage.removeItem(`pending_${pendingVerification}`);
      localStorage.removeItem(PENDING_VERIFICATION_KEY);
      setPendingVerification(null);
    }
  }, [pendingVerification]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call MongoDB API
      const { data, error } = await apiClient.login(email, password);

      if (error) {
        return { success: false, error };
      }

      if (data && data.token && data.user) {
        // Store JWT token
        localStorage.setItem('auth_token', data.token);

        // Create user object
        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role as UserRole,
          emailVerified: true,
        };

        persistUser(user);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  }, [persistUser]);

  const loginAsRole = useCallback(async (role: UserRole) => {
    const roleCredentials: Record<UserRole, { email: string; password: string }> = {
      superadmin: { email: 'superadmin@loanagent.com', password: 'superadmin123' },
      admin: { email: 'admin@loanagent.com', password: 'admin123' },
      agent: { email: 'agent@loanagent.com', password: 'agent123' },
      customer: { email: 'customer@loanagent.com', password: 'customer123' },
    };

    const creds = roleCredentials[role];
    const result = await login(creds.email, creds.password);
    if (!result.success) {
      console.error(`Failed to login as ${role}:`, result.error);
    }
  }, [login]);

  const loginWithSocial = useCallback(async (provider: 'google' | 'github'): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const socialUser: AuthUser = {
      id: `usr_social_${Date.now()}`,
      email: provider === 'google' ? 'user@gmail.com' : 'user@github.com',
      name: provider === 'google' ? 'Google User' : 'GitHub User',
      role: 'customer',
      emailVerified: true,
      avatar: provider === 'google' 
        ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
        : 'https://api.dicebear.com/7.x/avataaars/svg?seed=github',
    };

    persistUser(socialUser);
    return { success: true };
  }, [persistUser]);

  const requestPasswordReset = useCallback(async (email: string): Promise<{ success: boolean; error?: string; otp?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = MOCK_USERS[normalizedEmail] || registeredUsers[normalizedEmail];

    if (!existingUser) {
      return { success: false, error: 'No account found with this email.' };
    }

    const otp = generateOtp();
    const resetData: PendingPasswordReset = {
      email: normalizedEmail,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    localStorage.setItem(`reset_${normalizedEmail}`, JSON.stringify(resetData));
    setPendingPasswordReset(normalizedEmail);

    return { success: true, otp };
  }, [registeredUsers]);

  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const normalizedEmail = email.toLowerCase().trim();
    const resetDataStr = localStorage.getItem(`reset_${normalizedEmail}`);

    if (!resetDataStr) {
      return { success: false, error: 'No password reset request found.' };
    }

    const resetData: PendingPasswordReset = JSON.parse(resetDataStr);

    if (Date.now() > resetData.expiresAt) {
      localStorage.removeItem(`reset_${normalizedEmail}`);
      return { success: false, error: 'Reset code expired. Please request a new one.' };
    }

    if (resetData.otp !== otp.trim()) {
      return { success: false, error: 'Invalid reset code.' };
    }

    if (registeredUsers[normalizedEmail]) {
      const updatedUsers = {
        ...registeredUsers,
        [normalizedEmail]: { ...registeredUsers[normalizedEmail], password: newPassword },
      };
      persistRegisteredUsers(updatedUsers);
    }

    localStorage.removeItem(`reset_${normalizedEmail}`);
    setPendingPasswordReset(null);

    return { success: true };
  }, [registeredUsers, persistRegisteredUsers]);

  const clearPendingPasswordReset = useCallback(() => {
    if (pendingPasswordReset) {
      localStorage.removeItem(`reset_${pendingPasswordReset}`);
      setPendingPasswordReset(null);
    }
  }, [pendingPasswordReset]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    persistUser(null);
  }, [persistUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        pendingVerification,
        pendingPasswordReset,
        pendingAdmins,
        pendingAgents,
        login,
        signup,
        signupAsRole,
        verifyEmail,
        resendOtp,
        loginAsRole,
        loginWithSocial,
        requestPasswordReset,
        resetPassword,
        approveUser,
        rejectUser,
        logout,
        clearPendingVerification,
        clearPendingPasswordReset,
        refreshPendingLists,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
