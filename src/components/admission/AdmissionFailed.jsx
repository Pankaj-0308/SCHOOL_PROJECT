import React from 'react';
import { Container, Typography, Paper, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdmissionFailed = () => {
  const navigate = useNavigate();
  return (
    <Container sx={{ py: 6 }}>
      <Paper sx={{ p: 3, maxWidth: 640, mx: 'auto', textAlign: 'center' }}>
        <Stack spacing={2}>
          <Typography variant="h4">Admission Test Result</Typography>
          <Typography color="text.secondary">
            Unfortunately, you did not meet the minimum passing score this time. You may review your preparation and try again later.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" onClick={() => navigate('/')}>Go to Home</Button>
            <Button variant="outlined" onClick={() => navigate('/admission/test')}>Retake Test</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AdmissionFailed;
