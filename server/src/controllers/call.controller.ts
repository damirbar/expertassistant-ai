import { Request, Response } from 'express';
import Call, { CallStatus, ICall } from '../models/call.model';
import Expert, { IExpert } from '../models/expert.model';
import { startCallService } from '../services/call.service';
import mongoose from 'mongoose';

// @desc    Initiate a new call
// @route   POST /api/calls/initiate
// @access  Private
export const initiateCall = async (req: Request, res: Response) => {
  try {
    const { goal, expertId, contextLinks, contextText } = req.body;

    // Validate request
    if (!goal || !expertId) {
      return res.status(400).json({
        success: false,
        message: 'Goal and expert ID are required',
      });
    }

    // Check if expert exists and belongs to user
    const expert = await Expert.findOne({
      _id: expertId,
      userId: req.user._id,
    }) as IExpert | null;

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    // Create call record
    const call = await Call.create({
      goal,
      expertId,
      userId: req.user._id,
      status: CallStatus.PENDING,
      contextLinks: contextLinks || [],
      contextText: contextText || '',
    }) as ICall;

    // Start call asynchronously
    startCallService(call._id.toString())
      .catch((error: Error) => {
        console.error('Error starting call:', error);
      });

    res.status(201).json({
      success: true,
      data: call,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error initiating call',
    });
  }
};

// @desc    Get call by ID
// @route   GET /api/calls/:callId
// @access  Private
export const getCallById = async (req: Request, res: Response) => {
  try {
    const call = await Call.findOne({
      _id: req.params.callId,
      userId: req.user._id,
    }) as ICall | null;

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found',
      });
    }

    res.status(200).json({
      success: true,
      data: call,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting call',
    });
  }
};

// @desc    Get all calls for authenticated user
// @route   GET /api/calls
// @access  Private
export const getUserCalls = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    // Build query
    const query: any = { userId: req.user._id };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    const calls = await Call.find(query)
      .sort({ createdAt: -1 })
      .populate('expertId', 'name phoneNumber expertType');

    res.status(200).json({
      success: true,
      count: calls.length,
      data: calls,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting calls',
    });
  }
};

// @desc    Get call transcript
// @route   GET /api/calls/:callId/transcript
// @access  Private
export const getCallTranscript = async (req: Request, res: Response) => {
  try {
    const call = await Call.findOne({
      _id: req.params.callId,
      userId: req.user._id,
    }) as ICall | null;

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found',
      });
    }

    if (!call.transcript) {
      return res.status(404).json({
        success: false,
        message: 'Transcript not available for this call',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        callId: call._id,
        transcript: call.transcript,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting transcript',
    });
  }
};

// @desc    Get call recording
// @route   GET /api/calls/:callId/recording
// @access  Private
export const getCallRecording = async (req: Request, res: Response) => {
  try {
    const call = await Call.findOne({
      _id: req.params.callId,
      userId: req.user._id,
    }) as ICall | null;

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found',
      });
    }

    if (!call.recordingUrl) {
      return res.status(404).json({
        success: false,
        message: 'Recording not available for this call',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        callId: call._id,
        recordingUrl: call.recordingUrl,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting recording',
    });
  }
}; 