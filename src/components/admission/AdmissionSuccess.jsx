import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './AdmissionSuccess.css';

const AdmissionSuccess = () => {
  const navigate = useNavigate();
  const [studentId] = useState(localStorage.getItem('studentId'));

  useEffect(() => {
    // Check if admission is actually complete
    if (!localStorage.getItem('admissionComplete')) {
      navigate('/admission');
    }
  }, [navigate]);

  return (
    <div className="admission-success">
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom className="page-title">
          Admission Success
        </Typography>

        <Stepper activeStep={4} className="admission-stepper">
          <Step>
            <StepLabel>Create Account</StepLabel>
          </Step>
          <Step>
            <StepLabel>Take Entrance Test</StepLabel>
          </Step>
          <Step>
            <StepLabel>Submit Documents</StepLabel>
          </Step>
          <Step>
            <StepLabel>Receive Student ID</StepLabel>
          </Step>
        </Stepper>

        <Paper elevation={3} className="success-content">
          <Box className="success-header">
            <span className="checkmark">✓</span>
            <Typography variant="h5" gutterBottom>
              Congratulations!
            </Typography>
            <Typography variant="subtitle1">
              Your admission process has been completed successfully.
            </Typography>
          </Box>

          <Box className="student-id-section">
            <Typography variant="h6" gutterBottom>
              Your Student ID:
            </Typography>
            <Typography variant="h4" className="student-id">
              {studentId}
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Please save this ID. You will need it to log in to your student portal.
            </Alert>
          </Box>

          <Box className="next-steps">
            <Typography variant="h6" gutterBottom>
              Next Steps:
            </Typography>
            <ol>
              <li>Visit the student portal using your new student ID</li>
              <li>Complete your profile setup</li>
              <li>Check your class schedule</li>
              <li>Access your learning materials</li>
            </ol>
          </Box>

          <Box className="action-buttons">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/student/dashboard')}
            >
              Go to Student Portal
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => window.print()}
            >
              Print Details
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default AdmissionSuccess;