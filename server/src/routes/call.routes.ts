import express from 'express';
import { 
  initiateCall, 
  getCallById, 
  getUserCalls, 
  getCallTranscript, 
  getCallRecording
} from '../controllers/call.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Initiate a new call
router.post('/initiate', initiateCall);

// Get call by ID
router.get('/:callId', getCallById);

// Get all calls for authenticated user
router.get('/', getUserCalls);

// Get call transcript
router.get('/:callId/transcript', getCallTranscript);

// Get call recording (if available)
router.get('/:callId/recording', getCallRecording);

export default router; 