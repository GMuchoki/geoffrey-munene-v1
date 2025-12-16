import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Forum from '../models/Forum.js'

dotenv.config()

const forums = [
  {
    name: 'Business Growth',
    description: 'Share strategies, tips, and experiences about growing your business',
    category: 'business-growth',
    icon: 'chart-bar',
    isActive: true,
  },
  {
    name: 'Remote Work',
    description: 'Discuss remote work best practices, tools, and challenges',
    category: 'remote-work',
    icon: 'briefcase',
    isActive: true,
  },
  {
    name: 'Productivity',
    description: 'Tips, tools, and techniques to boost your productivity',
    category: 'productivity',
    icon: 'bolt',
    isActive: true,
  },
  {
    name: 'Content Strategy',
    description: 'Share content creation strategies, marketing tips, and best practices',
    category: 'content-strategy',
    icon: 'document-text',
    isActive: true,
  },
  {
    name: 'Networking',
    description: 'Connect with other entrepreneurs and professionals',
    category: 'networking',
    icon: 'user-group',
    isActive: true,
  },
  {
    name: 'Tools & Resources',
    description: 'Share and discover useful tools and resources',
    category: 'tools-resources',
    icon: 'wrench-screwdriver',
    isActive: true,
  },
  {
    name: 'General Discussion',
    description: 'General discussions and community chat',
    category: 'general',
    icon: 'chat-bubble-left-right',
    isActive: true,
  },
]

const seedForums = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoffrey-munene')
    console.log('Connected to MongoDB')

    // Clear existing forums (optional - comment out if you want to keep existing)
    // await Forum.deleteMany({})
    // console.log('Cleared existing forums')

    // Insert forums
    for (const forumData of forums) {
      const existingForum = await Forum.findOne({ name: forumData.name })
      if (!existingForum) {
        await Forum.create(forumData)
        console.log(`Created forum: ${forumData.name}`)
      } else {
        console.log(`Forum already exists: ${forumData.name}`)
      }
    }

    console.log('Forums seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding forums:', error)
    process.exit(1)
  }
}

seedForums()

