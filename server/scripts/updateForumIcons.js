import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Forum from '../models/Forum.js'

dotenv.config()

// Mapping of forum names to React Icon names
const iconMapping = {
  'Business Growth': 'chart-bar',
  'Remote Work': 'briefcase',
  'Productivity': 'bolt',
  'Content Strategy': 'document-text',
  'Networking': 'user-group',
  'Tools & Resources': 'wrench-screwdriver',
  'General Discussion': 'chat-bubble-left-right',
}

const updateForumIcons = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/geoffrey-munene')
    console.log('Connected to MongoDB')

    // Update each forum with the new icon
    for (const [forumName, iconName] of Object.entries(iconMapping)) {
      const forum = await Forum.findOne({ name: forumName })
      if (forum) {
        forum.icon = iconName
        await forum.save()
        console.log(`✅ Updated "${forumName}" icon to: ${iconName}`)
      } else {
        console.log(`⚠️  Forum "${forumName}" not found`)
      }
    }

    // Also update any forums that still have emoji icons
    // Check for forums with icons that are not React Icon names
    const validIconNames = Object.values(iconMapping)
    const allForums = await Forum.find({})
    const emojiForums = allForums.filter(forum => 
      forum.icon && 
      !validIconNames.includes(forum.icon) &&
      !forum.icon.match(/^[a-z-]+$/) // Not a valid icon name format (lowercase with hyphens)
    )

    if (emojiForums.length > 0) {
      console.log(`\nFound ${emojiForums.length} forum(s) with emoji icons. Updating...`)
      
      for (const forum of emojiForums) {
        // Try to find a matching icon based on category
        let defaultIcon = 'chat-bubble-left-right' // default
        
        if (forum.category === 'business-growth') {
          defaultIcon = 'chart-bar'
        } else if (forum.category === 'remote-work') {
          defaultIcon = 'briefcase'
        } else if (forum.category === 'productivity') {
          defaultIcon = 'bolt'
        } else if (forum.category === 'content-strategy') {
          defaultIcon = 'document-text'
        } else if (forum.category === 'networking') {
          defaultIcon = 'user-group'
        } else if (forum.category === 'tools-resources') {
          defaultIcon = 'wrench-screwdriver'
        }
        
        forum.icon = defaultIcon
        await forum.save()
        console.log(`✅ Updated "${forum.name}" icon to: ${defaultIcon}`)
      }
    }

    console.log('\n✨ Forum icons updated successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error updating forum icons:', error)
    process.exit(1)
  }
}

updateForumIcons()

