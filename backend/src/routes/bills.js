import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create new bill
router.post('/:homeId', authenticateUser, async (req, res) => {
  try {
    const { homeId } = req.params;
    const { type, amount, dueDate } = req.body;

    // Check if user is member of the home
    const userHome = await prisma.userHome.findFirst({
      where: {
        homeId,
        userId: req.user.id
      }
    });

    if (!userHome) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bill = await prisma.bill.create({
      data: {
        type,
        amount,
        dueDate: new Date(dueDate),
        homeId
      }
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({ message: 'Error creating bill' });
  }
});

// Get bills for a home
router.get('/home/:homeId', authenticateUser, async (req, res) => {
  try {
    const { homeId } = req.params;

    // Check if user is member of the home
    const userHome = await prisma.userHome.findFirst({
      where: {
        homeId,
        userId: req.user.id
      }
    });

    if (!userHome) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bills = await prisma.bill.findMany({
      where: {
        homeId
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    res.json(bills);
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({ message: 'Error fetching bills' });
  }
});

// Update bill
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, dueDate, isPaid } = req.body;

    // Get bill with home
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        home: {
          include: {
            members: true
          }
        }
      }
    });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Check if user is member of the home
    const isMember = bill.home.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBill = await prisma.bill.update({
      where: { id },
      data: {
        type,
        amount,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        isPaid,
        reminderSet: false // Reset reminder when bill is updated
      }
    });

    res.json(updatedBill);
  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({ message: 'Error updating bill' });
  }
});

// Delete bill
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Get bill with home
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        home: {
          include: {
            members: {
              where: {
                role: 'OWNER'
              }
            }
          }
        }
      }
    });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Check if user is owner of the home
    const isOwner = bill.home.members.some(member => member.userId === req.user.id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.bill.delete({
      where: { id }
    });

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Delete bill error:', error);
    res.status(500).json({ message: 'Error deleting bill' });
  }
});

// Get upcoming bills
router.get('/upcoming', authenticateUser, async (req, res) => {
  try {
    const upcomingBills = await prisma.bill.findMany({
      where: {
        home: {
          members: {
            some: {
              userId: req.user.id
            }
          }
        },
        isPaid: false,
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
        }
      },
      include: {
        home: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    res.json(upcomingBills);
  } catch (error) {
    console.error('Get upcoming bills error:', error);
    res.status(500).json({ message: 'Error fetching upcoming bills' });
  }
});

// Mark bill as paid
router.patch('/:id/pay', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Get bill with home
    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        home: {
          include: {
            members: true
          }
        }
      }
    });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Check if user is member of the home
    const isMember = bill.home.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedBill = await prisma.bill.update({
      where: { id },
      data: {
        isPaid: true,
        reminderSet: false
      }
    });

    res.json(updatedBill);
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({ message: 'Error marking bill as paid' });
  }
});

export default router; 