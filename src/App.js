import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Components/App.css';

import Footer from "./Components/Footer";
import Header from "./Components/Header";
import AuthForm from './Components/AuthForm';
import Dashboard from './Components/Dashboard';
import MainPage from './Components/MainPage';
import Settings from './Components/Setting';
import DataDeletionPolicy from './Components/DataDeletionPolicy';
import PrivacyPolicy from './Components/PrivacyPolicy';
import TotalPosts from './Components/TotalPosts';
import ScheduledPosts from './Components/ScheduledPosts';

function App() {
  return (
    <>
      <Router>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/data-deletion" element={<DataDeletionPolicy />} /> {/* Ensure correct route */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/posts" element={<TotalPosts />} />
            <Route path="/sch-posts" element={<ScheduledPosts />} />

          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
