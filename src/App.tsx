import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Locations from './pages/Locations';
import LocationDetails from './pages/LocationDetails';
import CreateLocation from './pages/CreateLocation';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Saddle Brown
    },
    secondary: {
      main: '#D2B48C', // Tan
    },
    background: {
      default: '#F5F5DC', // Beige
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"MedievalSharp", cursive',
    },
    h2: {
      fontFamily: '"MedievalSharp", cursive',
    },
    h3: {
      fontFamily: '"MedievalSharp", cursive',
    },
    h4: {
      fontFamily: '"MedievalSharp", cursive',
    },
    h5: {
      fontFamily: '"MedievalSharp", cursive',
    },
    h6: {
      fontFamily: '"MedievalSharp", cursive',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/new" element={<CreateLocation />} />
            <Route path="/locations/:id" element={<LocationDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
