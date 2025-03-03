import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documents';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

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

// Upload document
router.post('/:homeId', authenticateUser, upload.single('file'), async (req, res) => {
  try {
    const { homeId } = req.params;
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if user is member of the home
    const userHome = await prisma.userHome.findFirst({
      where: {
        homeId,
        userId: req.user.id
      }
    });

    if (!userHome) {
      // Delete uploaded file if user is not authorized
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Not authorized' });
    }

    const document = await prisma.document.create({
      data: {
        title: title || req.file.originalname,
        fileUrl: req.file.path,
        fileType: path.extname(req.file.originalname).toLowerCase(),
        homeId
      }
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Upload document error:', error);
    // Delete uploaded file if database operation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Error uploading document' });
  }
});

// Get documents for a home
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

    const documents = await prisma.document.findMany({
      where: {
        homeId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// Get specific document
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        home: {
          include: {
            members: true
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is member of the home
    const isMember = document.home.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if file exists
    if (!fs.existsSync(document.fileUrl)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(path.resolve(document.fileUrl));
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Error fetching document' });
  }
});

// Delete document
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
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

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is owner of the home
    const isOwner = document.home.members.some(member => member.userId === req.user.id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete file from storage
    if (fs.existsSync(document.fileUrl)) {
      fs.unlinkSync(document.fileUrl);
    }

    await prisma.document.delete({
      where: { id }
    });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Error deleting document' });
  }
});

// Update document metadata
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        home: {
          include: {
            members: true
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user is member of the home
    const isMember = document.home.members.some(member => member.userId === req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: { title }
    });

    res.json(updatedDocument);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Error updating document' });
  }
});

export default router; 