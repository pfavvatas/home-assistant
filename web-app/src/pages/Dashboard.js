import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Home as HomeIcon,
  Receipt as BillIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [newHome, setNewHome] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user data including homes
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch homes');
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  // Fetch data when component mounts
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleCreateHome = async () => {
    try {
      await axios.post('/api/homes', newHome);
      setOpenDialog(false);
      setNewHome({ name: '', address: '' });
      // Fetch updated data instead of reloading
      fetchUserData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create home');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Fab
          color="primary"
          aria-label="add home"
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      {user?.homes?.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              No homes added yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ mt: 2 }}
            >
              Add Your First Home
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {user?.homes?.map((userHome) => (
            <Grid item xs={12} sm={6} md={4} key={userHome.home.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2">
                      {userHome.home.name}
                    </Typography>
                    <Chip
                      label={userHome.role}
                      color={userHome.role === 'OWNER' ? 'primary' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                    {userHome.home.address}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">
                          {userHome.home.bills?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bills
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">
                          {userHome.home.documents?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Documents
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">
                          {userHome.home.members?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Members
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate(`/home/${userHome.home.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<BillIcon />}
                    onClick={() => navigate(`/home/${userHome.home.id}/bills`)}
                  >
                    Bills
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DocumentIcon />}
                    onClick={() => navigate(`/home/${userHome.home.id}/documents`)}
                  >
                    Docs
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Home Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Home</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Home Name"
            fullWidth
            variant="outlined"
            value={newHome.name}
            onChange={(e) => setNewHome({ ...newHome, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={newHome.address}
            onChange={(e) => setNewHome({ ...newHome, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateHome} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 