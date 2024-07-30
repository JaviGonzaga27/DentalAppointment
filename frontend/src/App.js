import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Calendar from './components/Calendar'; // Asegúrate de crear este componente
import Users from './components/Users';
import Doctors from './components/Doctors';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="calendar" replace />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="patients" element={<Patients />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="users" element={<Users />} />
            <Route path="doctors" element={<Doctors />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;