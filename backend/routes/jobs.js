const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email')
      .populate('applications.user', 'name email')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applied jobs for current user
router.get('/applied', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ 'applications.user': req.user.id })
      .populate('postedBy', 'name email')
      .populate('applications.user', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('applications.user', 'name email');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (protected)
router.post('/', auth, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user.id,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job (protected, only by poster)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (protected, only by poster)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for job (protected)
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(app => app.user.toString() === req.user.id);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied' });
    }

    job.applications.push({ user: req.user.id });
    await job.save();

    res.json({ message: 'Application submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;