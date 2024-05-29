import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ChecklistManager from './components/ChecklistManager';
import ChecklistDetails from './components/ChecklistDetails';
import NewChecklistForm from './components/NewChecklistForm';
import AboutMe from './components/AboutMe';
import TripCheck from './components/TripCheck';

const Home = () => <h2>Home</h2>;
const Dashboard = () => <h2>Dashboard</h2>;

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<AboutMe />} />
                    <Route path="/tripcheck" element={<TripCheck />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/checklist" element={<ChecklistManager />} />
                    <Route path="/checklist/new" element={<NewChecklistForm />} />
                    <Route path="/checklist/:checklistId/items" element={<ChecklistDetails />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
