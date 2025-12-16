import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Testimonial from '../models/Testimonial.js'
import connectDB from '../config/database.js'

dotenv.config()

const sampleTestimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Digital Marketing Manager',
    text: "Geoffrey's tips helped me land my first remote job in just 3 months! His YouTube videos are incredibly practical and easy to follow. The resume builder tool on this site was a game-changer for my application.",
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=47',
    published: true,
    featured: true,
  },
  {
    name: 'James K.',
    role: 'Software Developer',
    text: "The AI tools on this site saved me hours of work. The resume builder is amazing and helped me get multiple interview calls! I've been following Geoffrey's content for months and it's been invaluable for my career transition.",
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=12',
    published: true,
    featured: true,
  },
  {
    name: 'Alex L.',
    role: 'Freelance Designer',
    text: "I've been following Geoffrey's content for a year now. His blog posts and job listings have been game-changers for my career transition. The remote work resources here are top-notch and completely free!",
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=33',
    published: true,
    featured: true,
  },
]

async function addTestimonials() {
  try {
    await connectDB()
    console.log('Connected to database')

    // Clear existing testimonials (optional - remove if you want to keep existing ones)
    // await Testimonial.deleteMany({})
    // console.log('Cleared existing testimonials')

    // Check if testimonials already exist
    const existingCount = await Testimonial.countDocuments()
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing testimonials. Skipping insertion.`)
      console.log('If you want to add these testimonials, delete existing ones first or modify the script.')
      process.exit(0)
    }

    // Insert testimonials
    const testimonials = await Testimonial.insertMany(sampleTestimonials)
    console.log(`✅ Successfully added ${testimonials.length} testimonials:`)
    
    testimonials.forEach((testimonial, index) => {
      console.log(`  ${index + 1}. ${testimonial.name} - ${testimonial.role}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding testimonials:', error)
    process.exit(1)
  }
}

addTestimonials()

