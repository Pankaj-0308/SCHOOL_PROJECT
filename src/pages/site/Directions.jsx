import React from 'react';
import { Container, Typography, Paper, Stack, Fade } from '@mui/material';

const Directions = () => (
  <Container sx={{ py: { xs: 6, md: 10 } }}>
    <Fade in timeout={700}>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">How to Reach Us</Typography>
        <Typography color="text.secondary">
          Find directions to the school campus and contact information for assistance.
        </Typography>
      </Stack>
    </Fade>
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6">Address</Typography>
      <Typography>123 School Road, Education City, State, 123456</Typography>
      <Typography>Phone: +91 98765 43210</Typography>
      <Typography>Email: info@ourschool.edu</Typography>
    </Paper>
    <Paper sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <iframe
        title="School Location"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019112!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3ASchool!2sSchool!5e0!3m2!1sen!2sin!4v1680000000000"
      />
    </Paper>
  </Container>
);

export default Directions;
