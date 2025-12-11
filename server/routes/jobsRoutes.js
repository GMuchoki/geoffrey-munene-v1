import express from 'express'
import {
  getRemoteJobs,
  getJobCategories,
  getJobById,
} from '../controllers/jobsController.js'

const router = express.Router()

// Routes
router.get('/', getRemoteJobs)
router.get('/categories', getJobCategories)
router.get('/:id', getJobById)

export default router

