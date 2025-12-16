import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import api from '../../api/client';

const AdmissionStatus = () => {
  const [status, setStatus] = useState('loading');
  const [admission, setAdmission] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await api.get('/admissions/status');
        setAdmission(data);
        setStatus(data?.status || 'not_found');
      } catch (err) {
        console.error('Error checking status:', err);
        setError('Failed to load admission status. Please try again later.');
        setStatus('error');
      }
    };

    checkStatus();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main' }} />;
      case 'rejected': return <CancelIcon sx={{ fontSize: 60, color: 'error.main' }} />;
      default: return <PendingIcon sx={{ fontSize: 60, color: 'warning.main' }} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Admission Approved';
      case 'rejected': return 'Application Rejected';
      case 'verified': return 'Under Review';
      case 'documents': return 'Documents Pending';
      case 'test': return 'Test Pending';
      default: return 'Application Pending';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'verified': return 'info';
      default: return 'warning';
    }
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f7fa">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 8
    }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#1a237e', color: 'white', p: 4, textAlign: 'center' }}>
            <SchoolIcon sx={{ fontSize: 48, mb: 1, opacity: 0.8 }} />
            <Typography variant="h4" fontWeight="bold">Application Status</Typography>
          </Box>

          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 3 }}>
              <StatusIcon status={status} />
            </Box>

            <Typography variant="h5" color="text.primary" gutterBottom fontWeight="bold">
              {getStatusText(status)}
            </Typography>

            <Chip
              label={status.toUpperCase()}
              color={getStatusColor(status)}
              variant="outlined"
              sx={{ mb: 4, fontWeight: 'bold' }}
            />

            {status === 'not_found' && (
              <Button variant="contained" color="primary" onClick={() => navigate('/admission')}>
                Start New Application
              </Button>
            )}

            {(status === 'verified' || status === 'documents' || status === 'test') && (
              <Alert severity="info" variant="outlined" sx={{ width: '100%', mb: 2 }}>
                Your application is currently being processed. You will be notified once a decision has been made.
              </Alert>
            )}

            {status === 'rejected' && (
              <Alert severity="error" variant="outlined" sx={{ width: '100%' }}>
                We regret to inform you that your admission has not been approved at this time.
              </Alert>
            )}

            {status === 'approved' && admission && (
              <Card sx={{ width: '100%', bgcolor: '#f1f8e9', borderRadius: 2, border: '1px solid #c5e1a5' }}>
                <CardContent>
                  <Typography variant="h6" color="success.main" gutterBottom fontWeight="bold" display="flex" alignItems="center">
                    <CheckCircleIcon sx={{ mr: 1 }} /> Welcome to the Family!
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Your admission has been officially approved. Please use the credentials below to access your student portal.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="white" borderRadius={1} border="1px solid #e0e0e0">
                      <Box>
                        <Typography variant="caption" color="text.secondary">Student ID</Typography>
                        <Typography variant="h6" fontWeight="bold" fontFamily="monospace">{admission.studentId}</Typography>
                      </Box>
                      <Tooltip title="Copy ID">
                        <IconButton onClick={() => handleCopy(admission.studentId)}>
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {admission.tempPassword && (
                      <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="white" borderRadius={1} border="1px solid #e0e0e0">
                        <Box>
                          <Typography variant="caption" color="text.secondary">Temporary Password</Typography>
                          <Typography variant="h6" fontWeight="bold" fontFamily="monospace">{admission.tempPassword}</Typography>
                        </Box>
                        <Tooltip title="Copy Password">
                          <IconButton onClick={() => handleCopy(admission.tempPassword)}>
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  <Box mt={3} display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{ borderRadius: 20, px: 4 }}
                    >
                      Login to Student Portal
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Box mt={4}>
              <Button onClick={() => navigate('/')}>Back to Home</Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdmissionStatus;
