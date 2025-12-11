import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      default: 'Remote',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    excerpt: {
      type: String,
      trim: true,
      default: '',
    },
    salary: {
      type: String,
      default: '',
    },
    hourlyRate: {
      type: String,
      default: '',
      trim: true,
    },
    contractType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      default: 'Full-time',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    applyUrl: {
      type: String,
      required: [true, 'Apply URL is required'],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      enum: ['manual', 'adzuna', 'himalayas'],
      default: 'manual',
    },
    externalId: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple null values
    },
    companyLogo: {
      type: String,
      trim: true,
    },
    pubDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Job = mongoose.model('Job', jobSchema)

export default Job

