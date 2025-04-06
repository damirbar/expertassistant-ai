import { Request, Response } from 'express';
import Expert, { IExpert } from '../models/expert.model';

// @desc    Create a new expert
// @route   POST /api/experts
// @access  Private
export const createExpert = async (req: Request, res: Response) => {
  try {
    const { name, phoneNumber, expertType, company, notes } = req.body;

    // Create expert
    const expert = await Expert.create({
      name,
      phoneNumber,
      expertType,
      company,
      notes,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: expert,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating expert',
    });
  }
};

// @desc    Get expert by ID
// @route   GET /api/experts/:expertId
// @access  Private
export const getExpertById = async (req: Request, res: Response) => {
  try {
    const expert = await Expert.findOne({
      _id: req.params.expertId,
      userId: req.user._id,
    });

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expert,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting expert',
    });
  }
};

// @desc    Get all experts for authenticated user
// @route   GET /api/experts
// @access  Private
export const getUserExperts = async (req: Request, res: Response) => {
  try {
    const { expertType } = req.query;

    // Build query
    const query: any = { userId: req.user._id };
    
    // Add expert type filter if provided
    if (expertType) {
      query.expertType = expertType;
    }

    const experts = await Expert.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: experts.length,
      data: experts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting experts',
    });
  }
};

// @desc    Update expert
// @route   PUT /api/experts/:expertId
// @access  Private
export const updateExpert = async (req: Request, res: Response) => {
  try {
    const { name, phoneNumber, expertType, company, notes } = req.body;

    // Find expert
    let expert = await Expert.findOne({
      _id: req.params.expertId,
      userId: req.user._id,
    });

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    // Update expert
    expert = await Expert.findByIdAndUpdate(
      req.params.expertId,
      {
        name,
        phoneNumber,
        expertType,
        company,
        notes,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: expert,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating expert',
    });
  }
};

// @desc    Delete expert
// @route   DELETE /api/experts/:expertId
// @access  Private
export const deleteExpert = async (req: Request, res: Response) => {
  try {
    // Find and delete expert
    const expert = await Expert.findOneAndDelete({
      _id: req.params.expertId,
      userId: req.user._id,
    });

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting expert',
    });
  }
}; 