import express from 'express';
import Agent from '../models/Agent.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all agents
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const agents = await Agent.find()
      .populate('userId', '-password')
      .populate('assignedCustomers');

    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id)
      .populate('userId', '-password')
      .populate('assignedCustomers');

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create agent profile (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { userId, firstName, lastName, email, phone, agentCode } = req.body;

    const agent = new Agent({
      userId,
      firstName,
      lastName,
      email,
      phone,
      agentCode,
    });

    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update agent profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Agents can update their own profile, admins can update anyone
    if (req.user.userId !== agent.userId.toString() && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { firstName, lastName, phone, status } = req.body;

    Object.assign(agent, {
      firstName: firstName || agent.firstName,
      lastName: lastName || agent.lastName,
      phone: phone || agent.phone,
      status: status || agent.status,
      updatedAt: new Date(),
    });

    await agent.save();
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete agent (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
