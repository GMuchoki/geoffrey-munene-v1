# Remowork - Remote Work Platform

A modern, full-featured personal website and remote work platform built with the MERN stack (MongoDB, Express.js, React, Node.js). Features include a blog system, AI-powered career tools, remote job listings, YouTube integration, and a comprehensive admin dashboard for content management.

## 🌟 Features

- **Homepage** - Modern landing page with hero section, services, blog preview, and testimonials
- **Blog System** - Full CRUD blog management with categories, search, and pagination
- **AI-Powered Tools** - Resume builder, cover letter generator, email writer, interview prep, and more
- **Learn Section** - YouTube video integration with playlists and tutorials
- **Remote Jobs** - Curated remote job listings from Adzuna API + manual job management
- **Admin Dashboard** - Complete content management system with authentication
- **Contact Form** - Contact form with message management
- **Dark Mode** - Full dark/light theme support
- **SEO Optimized** - Dynamic meta tags, sitemap, robots.txt, and Open Graph tags
- **Responsive Design** - Mobile-first, fully responsive across all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Helmet Async** - SEO management
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation

### APIs & Services
- **OpenAI API** - AI-powered tools
- **Adzuna API** - Remote job listings
- **YouTube Data API** - Video integration

## 📁 Project Structure

```
remowork-v1/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SEO.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogDetail.jsx
│   │   │   ├── Tools.jsx
│   │   │   ├── Learn.jsx
│   │   │   ├── RemoteJobs.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/         # Admin dashboard pages
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminBlogs.jsx
│   │   │       ├── AdminBlogForm.jsx
│   │   │       ├── AdminJobs.jsx
│   │   │       ├── AdminJobForm.jsx
│   │   │       └── AdminContacts.jsx
│   │   ├── contexts/          # React contexts
│   │   │   ├── ThemeContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── services/          # API service functions
│   │   │   └── api.js
│   │   ├── styles/            # Tailwind CSS style files
│   │   │   ├── main.css
│   │   │   ├── app.css
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   └── package.json
├── server/                    # Express.js backend API
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── contactController.js
│   │   ├── jobsController.js
│   │   ├── toolsController.js
│   │   └── youtubeController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication
│   ├── models/                # Mongoose models
│   │   ├── Admin.js
│   │   ├── Blog.js
│   │   ├── Contact.js
│   │   ├── Job.js
│   │   └── Project.js
│   ├── routes/                # Express routes
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── adminBlogRoutes.js
│   │   ├── adminJobRoutes.js
│   │   └── ...
│   ├── scripts/
│   │   ├── createAdmin.js
│   │   └── seedBlogs.js
│   ├── server.js              # Express app entry point
│   ├── railway.json           # Railway deployment config
│   └── package.json
├── package.json               # Root package.json
├── README.md
├── ADMIN_SETUP.md             # Admin dashboard setup guide
├── RAILWAY_DEPLOYMENT.md      # Railway deployment guide
├── DEPLOYMENT.md              # General deployment guide
└── SEO_AUDIT.md               # SEO audit report
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- **npm** or **yarn** package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd remowork-v1
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   
   Or install them separately:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables**

   **Backend** - Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/remowork
   JWT_SECRET=your-very-secure-random-secret-key-here
   FRONTEND_URL=http://localhost:5173
   
   # Optional API Keys
   OPENAI_API_KEY=your_openai_api_key
   ADZUNA_APP_ID=your_adzuna_app_id
   ADZUNA_API_KEY=your_adzuna_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```
   
   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/remowork
   ```

   **Frontend** (optional) - Create a `.env` file in the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Create admin account**
   ```bash
   cd server
   npm run create-admin
   ```
   Default credentials: `admin` / `admin123` (change after first login!)

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

### Individual Commands

- **Start only the backend**: `npm run server`
- **Start only the frontend**: `npm run client`
- **Build for production**: 
  - Frontend: `npm run build` (from root) or `cd client && npm run build`
  - Backend: `cd server && npm start`

## 📡 API Endpoints

### Public Endpoints

#### Contact
- `POST /api/contact` - Create a new contact message
- `GET /api/contact` - Get all contact messages (admin only)

#### Blog
- `GET /api/blogs` - Get all published blog posts
- `GET /api/blogs/:id` - Get a single blog post
- Query params: `?featured=true`, `?category=category`, `?limit=10`

#### Jobs
- `GET /api/jobs` - Get remote jobs (Adzuna API + manual jobs)
- `GET /api/jobs/categories` - Get job categories
- Query params: `?search=term`, `?category=category`, `?page=1`

#### Tools
- `POST /api/tools/resume` - Generate resume
- `POST /api/tools/cover-letter` - Generate cover letter
- `POST /api/tools/email` - Generate email
- `POST /api/tools/interview-prep` - Interview preparation
- `POST /api/tools/skills-assessment` - Skills assessment
- `POST /api/tools/salary-negotiation` - Salary negotiation

#### YouTube
- `GET /api/youtube/videos` - Get YouTube videos
- `GET /api/youtube/playlists` - Get YouTube playlists

#### Health Check
- `GET /api/health` - Check if server is running

### Admin Endpoints (Protected)

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register admin (disable in production)
- `GET /api/admin/me` - Get current admin

#### Blog Management
- `GET /api/admin/blogs` - Get all blogs (including drafts)
- `GET /api/admin/blogs/:id` - Get single blog
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

#### Job Management
- `GET /api/admin/jobs` - Get all manual jobs
- `GET /api/admin/jobs/:id` - Get single job
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job

#### Contact Management
- `GET /api/admin/contacts` - Get all contacts
- `GET /api/admin/contacts/:id` - Get single contact
- `PUT /api/admin/contacts/:id` - Update contact status
- `DELETE /api/admin/contacts/:id` - Delete contact

## 🎨 Admin Dashboard

Access the admin dashboard at: `http://localhost:5173/admin/login`

### Features
- **Blog Management** - Create, edit, delete, and publish blog posts
- **Job Management** - Add and manage remote job listings
- **Contact Messages** - View and manage contact form submissions
- **Authentication** - Secure JWT-based authentication

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed setup instructions.

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

1. Connect your GitHub repository
2. Set build command: `cd client && npm run build`
3. Set publish directory: `client/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### Backend Deployment (Railway)

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed Railway deployment guide.

**Quick Steps:**
1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repository
4. Set Root Directory: `server`
5. Add environment variables
6. Deploy!

For general deployment information, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes
- ✅ CORS configuration
- ✅ Input validation
- ✅ Request size limits
- ✅ Environment variable protection
- ✅ Error handling without exposing sensitive info

## 📊 SEO Features

- ✅ Dynamic page titles and meta descriptions
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Canonical URLs
- ✅ Semantic HTML structure

See [SEO_AUDIT.md](./SEO_AUDIT.md) for detailed SEO information.

## 🎯 Key Features Explained

### Blog System
- Full CRUD operations
- Category filtering
- Search functionality
- Pagination
- Featured posts
- Draft/publish status
- Markdown content support

### AI Tools
- Powered by OpenAI API
- Resume builder with customization
- Cover letter generator
- Professional email writer
- Interview preparation
- Skills assessment
- Salary negotiation tips

### Remote Jobs
- Integration with Adzuna API
- Manual job management
- Category filtering
- Search functionality
- Pagination
- Job details and application links

### Admin Dashboard
- Secure authentication
- Intuitive UI
- Real-time updates
- Status management
- Bulk operations support

## 🛠️ Development Notes

### Styling Approach
- ✅ **Separate CSS files** for each component and page
- ✅ **Tailwind `@apply` directive** used in CSS files
- ❌ **No inline Tailwind classes** in JSX components
- ✅ **Organized structure** in `styles/` directory
- ✅ **Dark mode support** with ThemeContext

### Code Organization
- Follows MVC (Model-View-Controller) pattern
- Clean separation of concerns
- Scalable folder structure
- Beginner-friendly code with comments
- Reusable components and contexts

## 📝 Environment Variables Reference

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/geoffrey-munene
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-...
ADZUNA_APP_ID=your_app_id
ADZUNA_API_KEY=your_api_key
YOUTUBE_API_KEY=your_youtube_key
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check your `MONGODB_URI` in the `.env` file
- Verify MongoDB is running (if local)
- Check MongoDB Atlas connection string (if cloud)
- Ensure network access is allowed in MongoDB Atlas

### Port Already in Use
- Change the `PORT` in server `.env` file
- Or kill the process using the port

### CORS Errors
- Make sure backend is running
- Check `FRONTEND_URL` matches your frontend URL exactly
- Verify CORS configuration in `server.js`

### Module Not Found
- Run `npm install` in both client and server directories
- Delete `node_modules` and `package-lock.json`, then reinstall

### Admin Login Not Working
- Verify JWT_SECRET is set
- Check admin account exists: `cd server && npm run create-admin`
- Check Railway logs for errors

### API Errors
- Check environment variables are set correctly
- Verify API keys are valid
- Check server logs for detailed error messages

## 📚 Documentation

- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Admin dashboard setup and usage
- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Railway deployment guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment information
- [SEO_AUDIT.md](./SEO_AUDIT.md) - SEO audit and improvements
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [ADZUNA_SETUP.md](./ADZUNA_SETUP.md) - Adzuna API setup guide

## 🎉 Features Roadmap

- [ ] Add rate limiting
- [ ] Add security headers (helmet.js)
- [ ] Add structured data (JSON-LD)
- [ ] Add image optimization
- [ ] Add email notifications
- [ ] Add analytics integration
- [ ] Add error tracking (Sentry)

## 📄 License

ISC

## 👤 Author

**Remowork** - Remote Work Platform

Helping people land remote jobs, build digital careers, and achieve work-life balance through practical guidance, tools, and resources.

## 🙏 Acknowledgments

- OpenAI for AI-powered tools
- Adzuna for job listings API
- YouTube Data API for video integration
- All open-source contributors

---

**Need help?** Check the documentation files or open an issue on GitHub.
