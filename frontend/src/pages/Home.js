import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import axios from 'axios';
import ElectricityRecords from '../components/ElectricityRecords';
import SharedElectricityBills from '../components/SharedElectricityBills';

const Home = () => {
  const { homeId } = useParams();
  const [home, setHome] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await axios.get(`/api/homes/${homeId}`);
        setHome(response.data);
      } catch (error) {
        console.error('Failed to fetch home:', error);
      }
    };

    fetchHome();
  }, [homeId]);

  if (!home) {
    return (
      <Container>
        <Box mt={4}>
          <Typography variant="h4">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          {home.name}
        </Typography>
        <Paper>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              Home Details
            </Typography>
            <Typography>
              Address: {home.address}
            </Typography>
          </Box>
        </Paper>

        <Box mt={4}>
          <ElectricityRecords homeId={homeId} />
        </Box>

        <Box mt={4}>
          <SharedElectricityBills homeId={homeId} />
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 