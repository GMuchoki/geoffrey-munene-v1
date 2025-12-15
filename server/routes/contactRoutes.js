import express from 'express'
import {
  createContact,
} from '../controllers/contactController.js'
import { body } from 'express-validator'

const router = express.Router()

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3 })
    .withMessage('Subject must be at least 3 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters'),
]

// Public route - only allow creating contact messages
// GET, PUT, DELETE are protected in /api/admin/contacts
router.post('/', contactValidation, createContact)

export default router

