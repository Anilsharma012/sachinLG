import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    agentCode: {
      type: String,
      unique: true,
      required: true,
    },
    assignedCustomers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
      },
    ],
    commission: {
      totalEarnings: {
        type: Number,
        default: 0,
      },
      pendingAmount: {
        type: Number,
        default: 0,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
    },
    performance: {
      loansProcessed: {
        type: Number,
        default: 0,
      },
      successRate: {
        type: Number,
        default: 0,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Agent', agentSchema);
