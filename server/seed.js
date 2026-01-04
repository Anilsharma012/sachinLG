import User from './models/User.js';
import Customer from './models/Customer.js';
import Agent from './models/Agent.js';
import { connectDB } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🌱 Starting database seeding...\n');

    // Clear existing collections
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Agent.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // Create sample users
    console.log('Creating users...');
    const userAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@loanagent.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      isActive: true,
    });
    console.log('✓ Admin created:', userAdmin.email);

    const userAgent = await User.create({
      name: 'Rahul Sharma',
      email: 'agent@loanagent.com',
      password: 'agent123',
      role: 'agent',
      phone: '9123456789',
      isActive: true,
    });
    console.log('✓ Agent created:', userAgent.email);

    const userCustomer1 = await User.create({
      name: 'Priya Patel',
      email: 'customer1@loanagent.com',
      password: 'customer123',
      role: 'customer',
      phone: '9111111111',
      isActive: true,
    });
    console.log('✓ Customer 1 created:', userCustomer1.email);

    const userCustomer2 = await User.create({
      name: 'Amit Kumar',
      email: 'customer2@loanagent.com',
      password: 'customer123',
      role: 'customer',
      phone: '9222222222',
      isActive: true,
    });
    console.log('✓ Customer 2 created:', userCustomer2.email);

    // Create sample customers
    console.log('\nCreating customers...');
    const customer1 = await Customer.create({
      userId: userCustomer1._id,
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'customer1@loanagent.com',
      phone: '9111111111',
      panNumber: 'ABCDE1234F',
      aadharNumber: '123456789012',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
      },
      employmentStatus: 'employed',
      monthlyIncome: 50000,
      kycStatus: 'approved',
    });
    console.log('✓ Customer 1 created:', customer1.firstName);

    const customer2 = await Customer.create({
      userId: userCustomer2._id,
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'customer2@loanagent.com',
      phone: '9222222222',
      panNumber: 'XYZAB5678G',
      aadharNumber: '987654321098',
      address: {
        street: '456 Oak Avenue',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India',
      },
      employmentStatus: 'self-employed',
      monthlyIncome: 75000,
      kycStatus: 'pending',
    });
    console.log('✓ Customer 2 created:', customer2.firstName);

    // Create sample agent
    console.log('\nCreating agents...');
    const agent = await Agent.create({
      userId: userAgent._id,
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'agent@loanagent.com',
      phone: '9123456789',
      agentCode: 'AG001',
      assignedCustomers: [customer1._id, customer2._id],
      commission: {
        totalEarnings: 25000,
        pendingAmount: 10000,
        paidAmount: 15000,
      },
      performance: {
        loansProcessed: 12,
        successRate: 92,
      },
      status: 'active',
    });
    console.log('✓ Agent created:', agent.firstName);

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('  - Users created: 4');
    console.log('  - Customers created: 2');
    console.log('  - Agents created: 1');
    console.log('\n🔐 Test Credentials:');
    console.log('  Admin: admin@loanagent.com / admin123');
    console.log('  Agent: agent@loanagent.com / agent123');
    console.log('  Customer 1: customer1@loanagent.com / customer123');
    console.log('  Customer 2: customer2@loanagent.com / customer123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
