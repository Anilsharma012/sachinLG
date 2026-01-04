import express from 'express';
import Customer from '../models/Customer.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all customers (admin/agent only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'agent', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const customers = await Customer.find().populate('userId', '-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('userId', '-password')
      .populate('loanApplications')
      .populate('documents');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Users can only view their own customer profile
    if (req.user.userId !== customer.userId._id.toString() && 
        !['admin', 'agent', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create customer profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, panNumber, aadharNumber, address } = req.body;

    const customer = new Customer({
      userId: req.user.userId,
      firstName,
      lastName,
      email,
      phone,
      panNumber,
      aadharNumber,
      address,
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Users can only update their own profile
    if (req.user.userId !== customer.userId.toString() && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { firstName, lastName, phone, panNumber, aadharNumber, address, employmentStatus, monthlyIncome } = req.body;

    Object.assign(customer, {
      firstName: firstName || customer.firstName,
      lastName: lastName || customer.lastName,
      phone: phone || customer.phone,
      panNumber: panNumber || customer.panNumber,
      aadharNumber: aadharNumber || customer.aadharNumber,
      address: address || customer.address,
      employmentStatus: employmentStatus || customer.employmentStatus,
      monthlyIncome: monthlyIncome || customer.monthlyIncome,
      updatedAt: new Date(),
    });

    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
