# PeerPath 3.0 - Full Stack Application

A comprehensive peer-to-peer learning and collaboration platform built with React, Node.js, and MongoDB.

## Features

### 🔐 Authentication & User Management
- User registration with profile photo upload
- Secure login with JWT authentication
- User profiles with bio, skills, expertise, and year of study
- Profile editing and updates

### 🧑‍🏫 Mentorship System
- Ask and answer doubts
- View trending doubts with view counts
- Top helpers leaderboard
- Real-time doubt tracking

### 🤝 Project Collaboration
- Create and join projects
- Team member management
- Project status tracking
- Skill-based project matching

### 🗺️ Location-Based Ride Sharing
- Create and join ride shares
- Location-based matching
- Passenger management
- Real-time ride status

### 📊 Analytics & Statistics
- Weekly doubts solved chart using Recharts
- User statistics and achievements
- Progress tracking

### 🎨 Modern UI/UX
- Responsive design with modern animations
- Loading screens and transitions
- Consistent theme throughout the application

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Socket.IO** - Real-time features

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PeerPath3.0/main/GetStartedPage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/peerpath
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Run the application**

   **Option 1: Run frontend and backend separately**
   ```bash
   # Terminal 1 - Start backend
   npm run server
   
   # Terminal 2 - Start frontend
   npm run dev
   ```

   **Option 2: Run both together**
   ```bash
   npm run dev:full
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
PeerPath3.0/main/GetStartedPage/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   └── styles/            # CSS files
├── server/                # Backend source code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── uploads/           # File uploads
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Users
- `GET /api/users/top-helpers` - Get top helpers
- `GET /api/users/stats/:userId` - Get user statistics
- `GET /api/users/profile/:userId` - Get user profile

### Doubts
- `GET /api/doubts` - Get all doubts
- `POST /api/doubts` - Create new doubt
- `GET /api/doubts/:id` - Get specific doubt
- `POST /api/doubts/:id/solutions` - Add solution
- `PUT /api/doubts/:id/solutions/:solutionId/accept` - Accept solution

### Collaboration
- `GET /api/collaboration` - Get all projects
- `POST /api/collaboration` - Create new project
- `POST /api/collaboration/:id/join` - Join project
- `POST /api/collaboration/:id/leave` - Leave project

### Location
- `GET /api/location` - Get all rides
- `POST /api/location` - Create new ride
- `POST /api/location/:id/join` - Join ride
- `POST /api/location/:id/leave` - Leave ride

## Usage

### For Users
1. **Sign Up**: Create an account with username, password, and profile details
2. **Login**: Access your personalized dashboard
3. **Ask Doubts**: Post questions in the mentorship section
4. **Join Projects**: Collaborate on exciting projects
5. **Share Rides**: Find travel partners for your journey
6. **Track Progress**: View your statistics and achievements

### For Developers
1. **Frontend Development**: Modify React components in `src/`
2. **Backend Development**: Update API routes in `server/routes/`
3. **Database**: Modify models in `server/models/`
4. **Styling**: Update CSS files for design changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.

---

**Made with ❤️ by the PeerPath Team**
