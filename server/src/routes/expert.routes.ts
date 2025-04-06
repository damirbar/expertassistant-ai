import express from 'express';
import { 
  createExpert, 
  getExpertById, 
  getUserExperts, 
  updateExpert, 
  deleteExpert 
} from '../controllers/expert.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create a new expert
router.post('/', createExpert);

// Get expert by ID
router.get('/:expertId', getExpertById);

// Get all experts for authenticated user
router.get('/', getUserExperts);

// Update expert
router.put('/:expertId', updateExpert);

// Delete expert
router.delete('/:expertId', deleteExpert);

export default router; 