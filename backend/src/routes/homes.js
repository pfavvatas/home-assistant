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

// Create new home
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, address } = req.body;

    const home = await prisma.home.create({
      data: {
        name,
        address,
        members: {
          create: {
            userId: req.user.id,
            role: 'OWNER'
          }
        }
      },
      include: {
        members: true
      }
    });

    res.status(201).json(home);
  } catch (error) {
    console.error('Create home error:', error);
    res.status(500).json({ message: 'Error creating home' });
  }
});

// Get user's homes
router.get('/', authenticateUser, async (req, res) => {
  try {
    const homes = await prisma.home.findMany({
      where: {
        members: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        bills: true,
        documents: true
      }
    });

    res.json(homes);
  } catch (error) {
    console.error('Get homes error:', error);
    res.status(500).json({ message: 'Error fetching homes' });
  }
});

// Get specific home
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const home = await prisma.home.findFirst({
      where: {
        id,
        members: {
          some: {
            userId: req.user.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        bills: true,
        documents: true
      }
    });

    if (!home) {
      return res.status(404).json({ message: 'Home not found' });
    }

    res.json(home);
  } catch (error) {
    console.error('Get home error:', error);
    res.status(500).json({ message: 'Error fetching home' });
  }
});

// Update home
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;

    // Check if user is owner
    const userHome = await prisma.userHome.findFirst({
      where: {
        homeId: id,
        userId: req.user.id,
        role: 'OWNER'
      }
    });

    if (!userHome) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const home = await prisma.home.update({
      where: { id },
      data: { name, address },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.json(home);
  } catch (error) {
    console.error('Update home error:', error);
    res.status(500).json({ message: 'Error updating home' });
  }
});

// Add member to home
router.post('/:id/members', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    // Check if user is owner
    const userHome = await prisma.userHome.findFirst({
      where: {
        homeId: id,
        userId: req.user.id,
        role: 'OWNER'
      }
    });

    if (!userHome) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find user to add
    const userToAdd = await prisma.user.findUnique({
      where: { email }
    });

    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already a member
    const existingMember = await prisma.userHome.findFirst({
      where: {
        homeId: id,
        userId: userToAdd.id
      }
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    // Add member
    await prisma.userHome.create({
      data: {
        homeId: id,
        userId: userToAdd.id,
        role: 'MEMBER'
      }
    });

    const updatedHome = await prisma.home.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.json(updatedHome);
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Error adding member' });
  }
});

export default router; 