import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Stack, 
  TextField, 
  MenuItem, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Box
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Email as EmailIcon, 
  School as SchoolIcon, 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  People as PeopleIcon,
  Cake as CakeIcon,
  Transgender as TransgenderIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { deepPurple } from '@mui/material/colors';
import api from '../../api/client';

const AdminStudents = () => {
  const [classNumber, setClassNumber] = useState('1');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);

  const load = async (cls) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/students/${cls}`);
      setStudents(Array.isArray(data) ? data : []);
      setError('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(classNumber); }, [classNumber]);

  const showDetails = async (id) => {
    try {
      const { data } = await api.get(`/admin/student/${id}`);
      setDetails(data);
      setOpen(true);
    } catch (e) {
      setDetails(null);
      setError(e?.response?.data?.message || 'Failed to fetch details');
    }
  };

  return (
    <Container maxWidth={false} sx={{ 
      py: { xs: 4, md: 6 },
      px: { xs: 0, sm: 0, md: 0 },
      maxWidth: 1920
    }}>
      <Box sx={{ 
        maxWidth: 1440,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} 
               justifyContent={{ xs: 'center', sm: 'space-between' }}
               alignItems={{ xs: 'flex-start', sm: 'center' }} 
               sx={{ 
                 mb: 4,
                 maxWidth: 1440,
                 mx: 'auto',
                 px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }
               }} 
               spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>Student Directory</Typography>
            <Typography variant="subtitle1" color="text.secondary">Manage and view student information</Typography>
          </Box>
          <TextField 
            select 
            size="small" 
            label="Filter by Class" 
            value={classNumber} 
            onChange={(e) => setClassNumber(e.target.value)} 
            sx={{ minWidth: 200, bgcolor: 'background.paper', borderRadius: 1 }}
          >
            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => (
              <MenuItem key={n} value={n}>
                <Box display="flex" alignItems="center">
                  <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <span>Class {n}</span>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <Typography>Loading students...</Typography>
          </Box>
        ) : error ? (
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', bgcolor: 'error.light' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        ) : students.length === 0 ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" color="text.secondary">No students found in this class</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
            {students.map((student) => (
              <Grid item xs={12} sm={6} md={3} key={student._id} sx={{ display: 'flex' }}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardActionArea 
                    onClick={() => showDetails(student._id)}
                    sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 3,
                      textAlign: 'center'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mb: 2,
                        bgcolor: deepPurple[500],
                        fontSize: '2rem'
                      }}
                    >
                      {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                    </Avatar>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {student.name}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`ID: ${student.studentId || 'N/A'}`} 
                      sx={{ mb: 1, fontSize: '0.7rem' }} 
                      color="primary"
                      variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                      <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">Class {student.classAssigned || '—'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <EmailIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" noWrap sx={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {student.email || 'No email'}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Chip 
                        size="small" 
                        label={student.verified ? 'Verified' : 'Not Verified'} 
                        color={student.verified ? 'success' : 'default'}
                        icon={student.verified ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                        variant="outlined"
                      />
                      <Chip 
                        size="small" 
                        label={student.isApproved ? 'Approved' : 'Pending'} 
                        color={student.isApproved ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog 
          open={open} 
          onClose={() => setOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              minHeight: '60vh',
              maxHeight: '90vh',
              overflow: 'hidden'
            }
          }}
        >
          {details && (
            <>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
              }}>
                <DialogTitle sx={{ color: 'inherit', p: 0, m: 0 }}>Student Details</DialogTitle>
                <IconButton onClick={() => setOpen(false)} sx={{ color: 'inherit' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <DialogContent sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100%' }}>
                {/* Left Side - Profile */}
                <Box sx={{ 
                  width: { xs: '100%', md: '300px' }, 
                  p: 4, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRight: { md: '1px solid' },
                  borderColor: { md: 'divider' },
                  bgcolor: 'background.paper',
                  textAlign: 'center'
                }}>
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 3,
                      bgcolor: deepPurple[500],
                      fontSize: '3rem'
                    }}
                  >
                    {details.name ? details.name.charAt(0).toUpperCase() : 'S'}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>{details.name}</Typography>
                  <Chip 
                    label={`ID: ${details.studentId || 'N/A'}`} 
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip 
                      label={details.verified ? 'Verified' : 'Not Verified'} 
                      color={details.verified ? 'success' : 'default'}
                      icon={details.verified ? <CheckCircleIcon /> : <CancelIcon />}
                      size="small"
                    />
                    <Chip 
                      label={details.isApproved ? 'Approved' : 'Pending Approval'} 
                      color={details.isApproved ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Divider sx={{ width: '100%', my: 2 }} />
                  <Box sx={{ width: '100%', textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <SchoolIcon color="action" sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <div>
                        <Typography variant="caption" color="text.secondary">Class</Typography>
                        <Typography>Class {details.classAssigned || '—'}</Typography>
                      </div>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <EmailIcon color="action" sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <div>
                        <Typography variant="caption" color="text.secondary">Email</Typography>
                        <Typography noWrap>{details.email || '—'}</Typography>
                      </div>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <CakeIcon color="action" sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <div>
                        <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                        <Typography>{details.dob ? new Date(details.dob).toLocaleDateString() : '—'}</Typography>
                      </div>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TransgenderIcon color="action" sx={{ mr: 1.5, color: 'text.secondary' }} />
                      <div>
                        <Typography variant="caption" color="text.secondary">Gender</Typography>
                        <Typography>{details.gender || '—'}</Typography>
                      </div>
                    </Box>
                  </Box>
                </Box>

                {/* Right Side - Details */}
                <Box sx={{ 
                  flex: 1, 
                  p: 4,
                  overflowY: 'auto',
                  bgcolor: 'background.default'
                }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>Contact Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Contact Number</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon color="action" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography>{details.contactNo || '—'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Address</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <HomeIcon color="action" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                        <Typography>{details.address || '—'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Parent/Guardian</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleIcon color="action" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography>{details.parentName || '—'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Guardian Contact</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon color="action" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography>{details.guardianContact || '—'}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>Account Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Account Created</Typography>
                      <Typography>{details.createdAt ? new Date(details.createdAt).toLocaleString() : '—'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Last Updated</Typography>
                      <Typography>{details.updatedAt ? new Date(details.updatedAt).toLocaleString() : '—'}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
            </>
          )}
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminStudents;
