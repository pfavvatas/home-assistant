import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import axios from 'axios';

const ElectricityRecords = ({ homeId }) => {
  const [records, setRecords] = useState([]);
  const [open, setOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    startDate: new Date(),
    endDate: new Date(),
    kwhUsed: '',
    cost: '',
    notes: '',
  });

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`/api/homes/${homeId}/electricity`);
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch electricity records:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [homeId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/homes/${homeId}/electricity`, newRecord);
      handleClose();
      fetchRecords();
      setNewRecord({
        startDate: new Date(),
        endDate: new Date(),
        kwhUsed: '',
        cost: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to create electricity record:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Electricity Records</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Record
        </Button>
      </Box>

      <Grid container spacing={2}>
        {records.map((record) => (
          <Grid item xs={12} sm={6} md={4} key={record.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Period: {format(new Date(record.startDate), 'MMM d, yyyy')} -{' '}
                  {format(new Date(record.endDate), 'MMM d, yyyy')}
                </Typography>
                <Typography variant="body1">
                  Usage: {record.kwhUsed} kWh
                </Typography>
                <Typography variant="body1">
                  Cost: €{record.cost.toFixed(2)}
                </Typography>
                {record.notes && (
                  <Typography variant="body2" color="textSecondary">
                    Notes: {record.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Electricity Record</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box mb={2}>
                <DatePicker
                  label="Start Date"
                  value={newRecord.startDate}
                  onChange={(date) => setNewRecord({ ...newRecord, startDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Box>
              <Box mb={2}>
                <DatePicker
                  label="End Date"
                  value={newRecord.endDate}
                  onChange={(date) => setNewRecord({ ...newRecord, endDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Box>
            </LocalizationProvider>
            <Box mb={2}>
              <TextField
                label="kWh Used"
                type="number"
                step="0.01"
                fullWidth
                value={newRecord.kwhUsed}
                onChange={(e) => setNewRecord({ ...newRecord, kwhUsed: e.target.value })}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Cost (€)"
                type="number"
                step="0.01"
                fullWidth
                value={newRecord.cost}
                onChange={(e) => setNewRecord({ ...newRecord, cost: e.target.value })}
              />
            </Box>
            <TextField
              label="Notes"
              multiline
              rows={3}
              fullWidth
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Record
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ElectricityRecords; 