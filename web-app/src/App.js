import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Bills from './pages/Bills';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Wiki from './pages/Wiki';

// Layout
import MainLayout from './components/layouts/MainLayout';

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navbar />
        <Container
          component="main"
          sx={{
            flexGrow: 1,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="home/:homeId" element={<Home />} />
              <Route path="home/:homeId/bills" element={<Bills />} />
              <Route path="home/:homeId/documents" element={<Documents />} />
              <Route path="settings" element={<Settings />} />
              <Route path="wiki" element={<Wiki />} />
            </Route>
          </Routes>
        </Container>
        <Footer />
      </Box>
    </AuthProvider>
  );
}

export default App;
