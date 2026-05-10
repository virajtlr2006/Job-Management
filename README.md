# Job Management Website

A full-stack MERN (MongoDB, Express.js, React, Node.js) job management website where employers can post jobs and job seekers can apply for positions.

## Features

- **User Authentication**: Register and login as either employer or job seeker
- **Job Posting**: Employers can create and manage job listings
- **Job Search**: Job seekers can browse and search for available positions
- **Job Applications**: Job seekers can apply for jobs they're interested in
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- React Router (routing)
- Axios (HTTP client)
- Tailwind CSS (styling)
- React Toastify (notifications)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (authentication)
- bcryptjs (password hashing)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-management
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/jobmanagement
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (employers only)
- `PUT /api/jobs/:id` - Update job (employers only)
- `DELETE /api/jobs/:id` - Delete job (employers only)
- `POST /api/jobs/:id/apply` - Apply for a job (job seekers only)

## Project Structure

```
job-management/
├── backend/
│   ├── models/
│   │   ├── Job.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── jobs.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── CreateJob.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.