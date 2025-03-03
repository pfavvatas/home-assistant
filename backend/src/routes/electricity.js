import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { checkHomeAccess } from '../middleware/homes.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all electricity records for a home
router.get('/homes/:homeId/electricity', authenticateToken, checkHomeAccess, async (req, res) => {
  try {
    const records = await prisma.electricityRecord.findMany({
      where: {
        homeId: req.params.homeId
      },
      orderBy: {
        startDate: 'desc'
      }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch electricity records' });
  }
});

// Add a new electricity record
router.post('/homes/:homeId/electricity', authenticateToken, checkHomeAccess, async (req, res) => {
  try {
    const { startDate, endDate, kwhUsed, cost, notes } = req.body;
    const record = await prisma.electricityRecord.create({
      data: {
        homeId: req.params.homeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        kwhUsed: parseFloat(kwhUsed),
        cost: parseFloat(cost),
        notes
      }
    });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create electricity record' });
  }
});

// Get shared electricity bills for a home
router.get('/homes/:homeId/shared-electricity', authenticateToken, checkHomeAccess, async (req, res) => {
  try {
    const sharedBills = await prisma.sharedElectricityHomeUsage.findMany({
      where: {
        homeId: req.params.homeId
      },
      include: {
        bill: true
      },
      orderBy: {
        bill: {
          startDate: 'desc'
        }
      }
    });
    res.json(sharedBills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shared electricity bills' });
  }
});

// Create a shared electricity bill
router.post('/shared-electricity', authenticateToken, async (req, res) => {
  try {
    const { buildingName, startDate, endDate, totalKwh, totalCost, homeUsages } = req.body;

    // Create the shared bill
    const sharedBill = await prisma.sharedElectricityBill.create({
      data: {
        buildingName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalKwh: parseFloat(totalKwh),
        totalCost: parseFloat(totalCost),
        homes: {
          create: homeUsages.map(usage => ({
            homeId: usage.homeId,
            kwhUsed: parseFloat(usage.kwhUsed),
            cost: parseFloat(usage.cost)
          }))
        }
      },
      include: {
        homes: true
      }
    });

    res.json(sharedBill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create shared electricity bill' });
  }
});

// Update a shared electricity bill
router.put('/shared-electricity/:billId', authenticateToken, async (req, res) => {
  try {
    const { buildingName, startDate, endDate, totalKwh, totalCost, homeUsages } = req.body;

    // Update the shared bill
    const sharedBill = await prisma.sharedElectricityBill.update({
      where: {
        id: req.params.billId
      },
      data: {
        buildingName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalKwh: parseFloat(totalKwh),
        totalCost: parseFloat(totalCost)
      }
    });

    // Update home usages
    await Promise.all(
      homeUsages.map(usage =>
        prisma.sharedElectricityHomeUsage.upsert({
          where: {
            billId_homeId: {
              billId: req.params.billId,
              homeId: usage.homeId
            }
          },
          update: {
            kwhUsed: parseFloat(usage.kwhUsed),
            cost: parseFloat(usage.cost)
          },
          create: {
            billId: req.params.billId,
            homeId: usage.homeId,
            kwhUsed: parseFloat(usage.kwhUsed),
            cost: parseFloat(usage.cost)
          }
        })
      )
    );

    res.json(sharedBill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update shared electricity bill' });
  }
});

export default router; 