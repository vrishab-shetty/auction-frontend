import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import AuctionDetailsPage from './features/auctions/pages/AuctionDetailsPage';
import { useAuthStore } from './store/authStore';

function Home() {
  const { user } = useAuthStore();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-white flex flex-col items-center justify-center p-4">
      <div className="bg-brand-primary p-12 rounded-lg shadow-2xl text-center max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold text-brand-white mb-6">
          Auction Management System
        </h1>
        <p className="text-brand-white/80 mb-8 text-lg">
          Secure, real-time bidding for everyone.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            to="/login" 
            className="bg-brand-secondary text-brand-primary px-8 py-3 rounded-lg font-bold hover:opacity-90 transition shadow-lg"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-brand-neutral text-brand-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition shadow-lg"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/login" />} />
        <Route path="/auctions/:auctionId" element={user ? <AuctionDetailsPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
