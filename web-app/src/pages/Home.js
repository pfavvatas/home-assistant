import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { homeId } = useParams();
  const { user } = useAuth();
  const [home, setHome] = useState(null);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [openEditHome, setOpenEditHome] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [editHomeData, setEditHomeData] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchHomeDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/homes/${homeId}`);
      setHome(response.data);
      setEditHomeData({
        name: response.data.name,
        address: response.data.address,
      });
    } catch (err) {
      setError('Failed to fetch home details');
    }
  }, [homeId]);

  useEffect(() => {
    fetchHomeDetails();
  }, [fetchHomeDetails]);

  const handleAddMember = async () => {
    try {
      await axios.post(
        `/api/homes/${homeId}/members`,
        { email: newMemberEmail }
      );
      setOpenAddMember(false);
      setNewMemberEmail('');
      setSuccess('Member added successfully');
      fetchHomeDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleUpdateHome = async () => {
    try {
      await axios.put(
        `/api/homes/${homeId}`,
        editHomeData
      );
      setOpenEditHome(false);
      setSuccess('Home updated successfully');
      fetchHomeDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update home');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete(
        `/api/homes/${homeId}/members/${userId}`
      );
      setSuccess('Member removed successfully');
      fetchHomeDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const isOwner = home?.members?.some(
    member => member.userId === user?.id && member.role === 'OWNER'
  );

  if (!home) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {home.name}
        </Typography>
        {isOwner && (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setOpenEditHome(true)}
          >
            Edit Home
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <Typography color="text.secondary">
                Address: {home.address}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Members
                </Typography>
                {isOwner && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddMember(true)}
                  >
                    Add Member
                  </Button>
                )}
              </Box>
              <List>
                {home.members?.map((member, index) => (
                  <React.Fragment key={member.userId}>
                    {index > 0 && <Divider />}
                    <ListItem
                      secondaryAction={
                        isOwner && member.userId !== user?.id && (
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveMember(member.userId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${member.user.firstName} ${member.user.lastName}`}
                        secondary={
                          <>
                            {member.user.email}
                            <br />
                            Role: {member.role}
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" align="center">
                    {home.bills?.length || 0}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    Active Bills
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" align="center">
                    {home.documents?.length || 0}
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    Documents
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Member Dialog */}
      <Dialog open={openAddMember} onClose={() => setOpenAddMember(false)}>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Member Email"
            type="email"
            fullWidth
            variant="outlined"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMember(false)}>Cancel</Button>
          <Button onClick={handleAddMember} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Home Dialog */}
      <Dialog open={openEditHome} onClose={() => setOpenEditHome(false)}>
        <DialogTitle>Edit Home</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Home Name"
            fullWidth
            variant="outlined"
            value={editHomeData.name}
            onChange={(e) => setEditHomeData({ ...editHomeData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={editHomeData.address}
            onChange={(e) => setEditHomeData({ ...editHomeData, address: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditHome(false)}>Cancel</Button>
          <Button onClick={handleUpdateHome} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 