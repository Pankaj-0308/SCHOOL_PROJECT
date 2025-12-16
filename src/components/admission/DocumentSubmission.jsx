import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../../api/client';

const DocumentSubmission = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [activeStep, setActiveStep] = useState(2);
  const [documents, setDocuments] = useState({
    previousCertificate: null,
    birthCertificate: null,
    addressProof: null,
    photo: null
  });
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    parentName: '',
    address: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check class to adjust steps visualization if needed
    const reqClass = localStorage.getItem('requestedClass');
    if (reqClass && Number(reqClass) < 3) {
      setActiveStep(1); // Skip 'Test' step visually if we want, or just keep it standard
    }
  }, []);

  const steps = ['Create Account', 'Entrance Test', 'Submit Documents', 'Verification', 'Admission'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      if (files[0].size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [name]: 'File size should be less than 5MB' });
        return;
      }
      setDocuments({ ...documents, [name]: files[0] });
      if (errors[name]) setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.parentName.trim()) newErrors.parentName = "Parent's name is required";
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      Object.entries(documents).forEach(([key, file]) => {
        if (file) formDataToSend.append(key, file);
      });

      const reqClass = localStorage.getItem('requestedClass');
      if (reqClass) formDataToSend.append('requestedClass', reqClass);

      await api.post('/admissions/submit-documents', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/admission/status');
    } catch (error) {
      console.error(error);
      setErrors({ ...errors, submit: 'Failed to submit documents. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const FileUploadBox = ({ name, label, file }) => (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        textAlign: 'center',
        borderStyle: 'dashed',
        borderColor: errors[name] ? 'error.main' : file ? 'success.main' : 'grey.400',
        bgcolor: file ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'rgba(33, 150, 243, 0.05)'
        }
      }}
    >
      <input
        type="file"
        name={name}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer'
        }}
      />
      {file ? (
        <Box display="flex" flexDirection="column" alignItems="center" color="success.main">
          <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2" fontWeight="bold">{file.name}</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" color="text.secondary">
          <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2">{label}</Typography>
          <Typography variant="caption">(Max 5MB)</Typography>
        </Box>
      )}
      {errors[name] && <Typography color="error" variant="caption" display="block" mt={1}>{errors[name]}</Typography>}
    </Paper>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 6
    }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#1a237e', color: 'white', p: 4, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold">Complete Your Application</Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Please provide your details and upload valid documents</Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">Personal Details</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} error={!!errors.fullName} helperText={errors.fullName} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth type="date" label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} InputLabelProps={{ shrink: true }} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Parent/Guardian Name" name="parentName" value={formData.parentName} onChange={handleInputChange} error={!!errors.parentName} helperText={errors.parentName} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} error={!!errors.phone} helperText={errors.phone} required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} error={!!errors.email} helperText={errors.email} required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Address" name="address" multiline rows={3} value={formData.address} onChange={handleInputChange} error={!!errors.address} helperText={errors.address} required />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">Upload Documents</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FileUploadBox name="previousCertificate" label="Previous School Certificate" file={documents.previousCertificate} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FileUploadBox name="birthCertificate" label="Birth Certificate" file={documents.birthCertificate} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FileUploadBox name="addressProof" label="Address Proof" file={documents.addressProof} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FileUploadBox name="photo" label="Passport Size Photo" file={documents.photo} />
                    </Grid>
                  </Grid>
                </Grid>

                {errors.submit && (
                  <Grid item xs={12}>
                    <Alert severity="error">{errors.submit}</Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" size="large" onClick={() => navigate('/admission')}>Cancel</Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={uploading}
                      sx={{
                        background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
                        boxShadow: '0 3px 5px 2px rgba(26, 35, 126, .3)',
                        px: 6
                      }}
                    >
                      {uploading ? <CircularProgress size={24} color="inherit" /> : 'Submit Application'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default DocumentSubmission;