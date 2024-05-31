import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import NavBar from './components/NavBar';
import ChecklistManager from './components/ChecklistManager';
import ChecklistDetails from './components/ChecklistDetails';
import NewChecklistForm from './components/NewChecklistForm';
import AboutMe from './components/AboutMe';
import TripCheck from './components/TripCheck';
import EditChecklistForm from './components/EditChecklistForm';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<AboutMe />} />
                    <Route path="/tripcheck" element={<TripCheck />} />
                    <Route path="/checklist" element={<ChecklistManager />} />
                    <Route path="/checklist/new" element={<NewChecklistForm />} />
                    <Route path="/checklist/:checklistId/items" element={<ChecklistDetails />} />
                    <Route path="/checklist/:checklistId/edit" element={<EditChecklistForm />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
