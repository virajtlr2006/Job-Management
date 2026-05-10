import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/CreateJob';
import Applications from './pages/Applications';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
          <Navbar />
          <main className="mx-auto max-w-screen-xl px-6 py-12 lg:px-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <ToastContainer
            position="bottom-right"
            theme="dark"
            toastClassName="!bg-zinc-900 !border !border-zinc-800 !text-zinc-100 !rounded-2xl !text-sm"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;