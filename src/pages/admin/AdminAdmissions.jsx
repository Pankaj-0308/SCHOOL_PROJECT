import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Grid,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Divider,
  CircularProgress,
  Chip,
  IconButton,
  TextField,
  Tooltip,
  Link
} from '@mui/material';
import {
  Person as PersonIcon,
  Class as ClassIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import api from '../../api/client';

const AdminAdmissions = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Dialog states
  const [approveDialog, setApproveDialog] = useState({ open: false, admission: null, classNumber: '' });
  const [rejectDialog, setRejectDialog] = useState({ open: false, admission: null, reason: '' });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admissions/pending');
      setPending(data || []);
      setError('');
    } catch (e) {
      setError('Failed to load pending admissions');
      showSnackbar('Failed to load pending admissions', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => { load(); }, [load]);

  const handleApproveClick = (admission) => {
    setApproveDialog({
      open: true,
      admission,
      classNumber: admission.requestedClass || ''
    });
  };

  const handleRejectClick = (admission) => {
    setRejectDialog({
      open: true,
      admission,
      reason: ''
    });
  };

  const confirmApprove = async () => {
    if (!approveDialog.classNumber) {
      showSnackbar('Class number is required', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const { data } = await api.post(`/admissions/${approveDialog.admission._id}/approve`, {
        classNumber: Number(approveDialog.classNumber)
      });

      showSnackbar(`Student approved! ID: ${data.student?.studentId}`, 'success');
      setPending(prev => prev.filter(a => a._id !== approveDialog.admission._id));
      setApproveDialog({ open: false, admission: null, classNumber: '' });
    } catch (e) {
      showSnackbar(e?.response?.data?.message || 'Failed to approve', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReject = async () => {
    setActionLoading(true);
    try {
      await api.post(`/admissions/${rejectDialog.admission._id}/reject`, { reason: rejectDialog.reason });

      showSnackbar('Admission request rejected', 'success');
      setPending(prev => prev.filter(a => a._id !== rejectDialog.admission._id));
      setRejectDialog({ open: false, admission: null, reason: '' });
    } catch (e) {
      showSnackbar('Failed to reject admission', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Admission Requests
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and process student admission applications
          </Typography>
        </Box>
        <Chip
          label={`${pending.length} Pending`}
          color="warning"
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" p={6}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : pending.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'background.default', borderStyle: 'dashed' }}>
          <PersonIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">No pending admission requests</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pending.map((admission) => (
            <Grid item xs={12} md={6} lg={4} key={admission._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {admission.user?.name || 'Unknown User'}
                      </Typography>
                      <Box display="flex" alignItems="center" color="text.secondary" gap={1}>
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">{admission.user?.email}</Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={`Class ${admission.requestedClass || '?'}`}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">Documents Submitted:</Typography>
                  {admission.documents && admission.documents.length > 0 ? (
                    <Stack direction="column" spacing={1}>
                      {admission.documents.map((doc, index) => {
                        const docName = typeof doc === 'string' ? doc.split('/').pop() || `Document ${index + 1}` : (doc.name || `Document ${index + 1}`);
                        const docUrl = typeof doc === 'string' ? doc : doc.url;
                        return (
                          <Box key={index} display="flex" alignItems="center" gap={1}>
                            <Chip
                              icon={<DescriptionIcon />}
                              label={docName}
                              component="a"
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="outlined"
                              size="small"
                              clickable
                              color="primary"
                            />
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.disabled">No documents uploaded</Typography>
                  )}

                  {admission.testScore !== undefined && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" fontWeight="bold">Test Score: {admission.testScore}</Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, bgcolor: 'background.default', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleRejectClick(admission)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleApproveClick(admission)}
                  >
                    Approve
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onClose={() => setApproveDialog({ ...approveDialog, open: false })}>
        <DialogTitle>Approve Admission</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 300 }}>
          <Typography variant="body1" paragraph>
            Assign Class:
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Class Number"
            value={approveDialog.classNumber}
            onChange={(e) => setApproveDialog({ ...approveDialog, classNumber: e.target.value })}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            This will create a new Student account and assign them to Class {approveDialog.classNumber}.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialog({ ...approveDialog, open: false })}>Cancel</Button>
          <Button variant="contained" color="success" onClick={confirmApprove} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Confirm Approval'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ ...rejectDialog, open: false })}>
        <DialogTitle>Reject Application</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 300 }}>
          <TextField
            fullWidth
            label="Reason for Rejection (Optional)"
            multiline
            rows={3}
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ ...rejectDialog, open: false })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmReject} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : 'Reject Application'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminAdmissions;
