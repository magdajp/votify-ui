import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
/*import PrivateRoute from './PrivateRoute';*/
/*import Dashboard from './Dashboard';*/
import AuthPage from './pages/AuthPage';
import React from 'react';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<AuthPage />} />
                {/*<PrivateRoute path="/dashboard" element={<Dashboard />} />*/}
            </Routes>
        </Router>
    );
};

export default App;
