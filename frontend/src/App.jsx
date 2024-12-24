// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import ClientDashboard from './pages/client/ClientDashboard';
import { ClientsProvider } from './store/ClientsContext';
import VideoChat from './pages/trainer/VideoChat';
import Messages from './pages/trainer/Messages';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Section */}
          

          {/* Trainer Section */}
          <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          <Route path="/workout-plans" element={<TrainerDashboard />} />
          <Route path="/trainer/video-chat" element={<VideoChat />} />
          <Route path="/trainer/messages" element={<Messages />} />
          

          {/* Client Section */}
          <Route path="/client-dashboard" element={<ClientDashboard />} />

          {/* Catch-All Route: Redirect unknown routes to the landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
