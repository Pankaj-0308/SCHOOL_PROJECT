import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  MenuItem,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Step,
  StepContent,
  StepLabel,
  Stepper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AdmissionLanding = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [classNumber, setClassNumber] = useState('1');
  const [starting, setStarting] = useState(false);
  const [admissionStatus, setAdmissionStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        setUserData(currentUser);
        try {
          const { data } = await api.get('/admissions/status');
          if (data && data.status !== 'not_found') {
            setAdmissionStatus(data.status);
          }
        } catch (error) {
          console.error("Failed to fetch status", error);
        }
      }
    };
    fetchStatus();
  }, []);

  const handleStartAdmission = async () => {
    if (!userData) {
      navigate('/login');
      return;
    }

    // If already has admission, go to status
    if (admissionStatus) {
      navigate('/admission/status');
      return;
    }

    try {
      setStarting(true);
      localStorage.setItem('requestedClass', classNumber);

      const { data } = await api.post('/admissions/start', { requestedClass: Number(classNumber) });
      const status = data?.status;

      if (status === 'documents' || status === 'verified') {
        navigate('/admission/documents');
      } else {
        navigate('/admission/test');
      }
    } catch (e) {
      const res = e?.response;
      const msg = res?.data?.message;
      const admission = res?.data?.admission;

      if (res?.status === 400 && msg === 'Admission already in progress' && admission) {
        const status = admission.status;
        if (status === 'documents') navigate('/admission/documents');
        else if (status === 'test') navigate('/admission/test');
        else navigate('/admission/status');
      } else if (res?.status === 401) {
        navigate('/login');
      } else {
        alert(msg || 'Failed to start admission');
      }
    } finally {
      setStarting(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '90vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pt: 8,
      pb: 8
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h2" component="h1" sx={{
                fontWeight: 800,
                color: '#1a237e',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                Join Our Excellence
              </Typography>
              <Typography variant="h5" sx={{ color: '#546e7a', mb: 4, fontWeight: 500 }}>
                Begin your journey towards a brighter future. Apply now for the academic year 2024-25.
              </Typography>

              {!userData ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                    }}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderWidth: 2,
                      borderColor: '#1a237e',
                      color: '#1a237e',
                      '&:hover': { borderWidth: 2 }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              ) : (
                <Paper elevation={4} sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    Select Class to Apply
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      select
                      fullWidth
                      value={classNumber}
                      onChange={(e) => setClassNumber(e.target.value)}
                      variant="outlined"
                      label="Class"
                      sx={{ background: 'white' }}
                      disabled={!!admissionStatus}
                    >
                      {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => (
                        <MenuItem key={n} value={n}>{`Class ${n}`}</MenuItem>
                      ))}
                    </TextField>
                    <Button
                      variant="contained"
                      onClick={handleStartAdmission}
                      disabled={starting}
                      sx={{
                        minWidth: 150,
                        py: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                        boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)'
                      }}
                    >
                      {starting ? <CircularProgress size={24} color="inherit" /> :
                        admissionStatus ? 'Check Status' : 'Proceed'}
                    </Button>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    * Direct admission for Class 1 & 2 via document verification.
                    <br />
                    * Entrance test required for Class 3 and above.
                  </Typography>
                </Paper>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: 4,
              background: 'transparent',
              boxShadow: 'none',
              position: 'relative',
              overflow: 'visible'
            }}>
              {/* Abstract visual elements */}
              <Box sx={{
                position: 'absolute',
                top: -40,
                right: -40,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(33,150,243,0.2) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: 0
              }} />

              <Stepper orientation="vertical" nonLinear activeStep={-1} sx={{
                '& .MuiStepLabel-root .Mui-active': { color: '#1a237e' },
                '& .MuiStepIcon-root': { color: '#cfd8dc' },
                '& .MuiStepIcon-root.Mui-active': { color: '#1a237e' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#4caf50' },
              }}>
                <Step expanded active>
                  <StepLabel icon={<SchoolIcon />}>
                    <Typography variant="h6" fontWeight="bold">Apply Online</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography color="text.secondary">Select your desired class and start the application process.</Typography>
                  </StepContent>
                </Step>
                <Step expanded active>
                  <StepLabel icon={<DescriptionIcon />}>
                    <Typography variant="h6" fontWeight="bold">Submit Documents / Take Test</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography color="text.secondary">For Class 1-2: Submit documents.<br />For Class 3+: Take entrance test.</Typography>
                  </StepContent>
                </Step>
                <Step expanded active>
                  <StepLabel icon={<CheckCircleIcon />}>
                    <Typography variant="h6" fontWeight="bold">Verification</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography color="text.secondary">Admin reviews your application and documents.</Typography>
                  </StepContent>
                </Step>
                <Step expanded active>
                  <StepLabel icon={<BadgeIcon />}>
                    <Typography variant="h6" fontWeight="bold">Admission Granted</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography color="text.secondary">Receive Student ID & Password. Access Student Portal directly.</Typography>
                  </StepContent>
                </Step>
              </Stepper>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdmissionLanding;