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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import axios from 'axios';

const SharedElectricityBills = ({ homeId }) => {
  const [bills, setBills] = useState([]);
  const [open, setOpen] = useState(false);
  const [homes, setHomes] = useState([]);
  const [newBill, setNewBill] = useState({
    buildingName: '',
    startDate: new Date(),
    endDate: new Date(),
    totalKwh: '',
    totalCost: '',
    homeUsages: [],
  });

  const fetchBills = async () => {
    try {
      const response = await axios.get(`/api/homes/${homeId}/shared-electricity`);
      setBills(response.data);
    } catch (error) {
      console.error('Failed to fetch shared electricity bills:', error);
    }
  };

  const fetchHomes = async () => {
    try {
      const response = await axios.get('/api/homes');
      setHomes(response.data);
      setNewBill(prev => ({
        ...prev,
        homeUsages: response.data.map(home => ({
          homeId: home.id,
          kwhUsed: '',
          cost: '',
        })),
      }));
    } catch (error) {
      console.error('Failed to fetch homes:', error);
    }
  };

  useEffect(() => {
    fetchBills();
    fetchHomes();
  }, [homeId]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleHomeUsageChange = (homeId, field, value) => {
    setNewBill(prev => ({
      ...prev,
      homeUsages: prev.homeUsages.map(usage =>
        usage.homeId === homeId ? { ...usage, [field]: value } : usage
      ),
    }));
  };

  const calculateTotalKwh = () => {
    return newBill.homeUsages.reduce((sum, usage) => sum + (parseFloat(usage.kwhUsed) || 0), 0);
  };

  const calculateHomeCost = (kwhUsed) => {
    const totalKwh = calculateTotalKwh();
    if (totalKwh === 0 || !newBill.totalCost) return 0;
    return (parseFloat(kwhUsed) / totalKwh) * parseFloat(newBill.totalCost);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const billData = {
        ...newBill,
        homeUsages: newBill.homeUsages.map(usage => ({
          ...usage,
          cost: calculateHomeCost(usage.kwhUsed),
        })),
      };
      await axios.post('/api/shared-electricity', billData);
      handleClose();
      fetchBills();
      setNewBill({
        buildingName: '',
        startDate: new Date(),
        endDate: new Date(),
        totalKwh: '',
        totalCost: '',
        homeUsages: homes.map(home => ({
          homeId: home.id,
          kwhUsed: '',
          cost: '',
        })),
      });
    } catch (error) {
      console.error('Failed to create shared electricity bill:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Shared Electricity Bills</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Shared Bill
        </Button>
      </Box>

      <Grid container spacing={2}>
        {bills.map((bill) => (
          <Grid item xs={12} key={bill.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {bill.bill.buildingName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Period: {format(new Date(bill.bill.startDate), 'MMM d, yyyy')} -{' '}
                  {format(new Date(bill.bill.endDate), 'MMM d, yyyy')}
                </Typography>
                <Typography variant="body1">
                  Total Usage: {bill.bill.totalKwh} kWh
                </Typography>
                <Typography variant="body1">
                  Total Cost: €{bill.bill.totalCost.toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Your Usage: {bill.kwhUsed} kWh
                </Typography>
                <Typography variant="body1">
                  Your Share: €{bill.cost.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Shared Electricity Bill</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box mb={2}>
              <TextField
                label="Building Name"
                fullWidth
                value={newBill.buildingName}
                onChange={(e) => setNewBill({ ...newBill, buildingName: e.target.value })}
              />
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box mb={2}>
                <DatePicker
                  label="Start Date"
                  value={newBill.startDate}
                  onChange={(date) => setNewBill({ ...newBill, startDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Box>
              <Box mb={2}>
                <DatePicker
                  label="End Date"
                  value={newBill.endDate}
                  onChange={(date) => setNewBill({ ...newBill, endDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Box>
            </LocalizationProvider>
            <Box mb={2}>
              <TextField
                label="Total Cost (€)"
                type="number"
                step="0.01"
                fullWidth
                value={newBill.totalCost}
                onChange={(e) => setNewBill({ ...newBill, totalCost: e.target.value })}
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Home Usage Distribution
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Home</TableCell>
                    <TableCell>kWh Used</TableCell>
                    <TableCell>Calculated Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newBill.homeUsages.map((usage) => {
                    const home = homes.find(h => h.id === usage.homeId);
                    const calculatedCost = calculateHomeCost(usage.kwhUsed);
                    return (
                      <TableRow key={usage.homeId}>
                        <TableCell>{home?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            step="0.01"
                            value={usage.kwhUsed}
                            onChange={(e) =>
                              handleHomeUsageChange(usage.homeId, 'kwhUsed', e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>€{calculatedCost.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Add Bill
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SharedElectricityBills; 