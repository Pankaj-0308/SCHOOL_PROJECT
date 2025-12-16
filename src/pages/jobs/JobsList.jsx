import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Stack, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Fade, Box, Divider } from '@mui/material';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext.jsx';

const JobsList = () => {
  const { role, isLoggedIn } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyJob, setApplyJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const canApply = isLoggedIn && role === 'teacher';

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (e) {
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const submitApplication = async () => {
    if (!applyJob) return;
    try {
      await api.post(`/jobs/${applyJob._id}/apply`, { coverLetter });
      setApplyJob(null);
      setCoverLetter('');
      alert('Application submitted');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to apply');
    }
  };

  if (loading) return <Container sx={{ py: 6 }}><Typography>Loading jobs...</Typography></Container>;
  if (error) return <Container sx={{ py: 6 }}><Typography color="error">{error}</Typography></Container>;

  return (
    <Container sx={{ py: 6 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Open Teaching Positions</Typography>
      </Stack>
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={4} key={job._id}>
            <Fade in timeout={500}>
              <Paper sx={{
                p: 0,
                overflow: 'hidden',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
              }}>
                <Box sx={{ height: 140, bgcolor: 'grey.200', position: 'relative' }}>
                  <img
                    src={`https://source.unsplash.com/random/400x200?${job.title.includes('Math') ? 'mathematics' : job.title.includes('Science') ? 'science' : 'school'}`}
                    alt={job.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'}
                  />
                  <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    p: 2, pt: 6
                  }}>
                    <Typography variant="h6" color="white" fontWeight={600} noWrap>{job.title}</Typography>
                  </Box>
                </Box>
                <Stack spacing={2} sx={{ p: 2.5 }}>
                  {job.description && (
                    <Typography variant="body2" color="text.secondary" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: 60
                    }}>
                      {job.description}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ minHeight: 48 }}>
                    {(job.classNumbers || []).map((c) => (
                      <Chip key={c} label={`Class ${c}`} size="small" sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600 }} />
                    ))}
                    {(job.subjects || []).map((s) => (
                      <Chip key={s} label={s} size="small" variant="outlined" />
                    ))}
                  </Stack>
                  <Divider />
                  <Button variant="contained" disabled={!canApply} onClick={() => setApplyJob(job)} fullWidth disableElevation sx={{ borderRadius: 2 }}>
                    {canApply ? 'Apply Now' : 'Login to Apply'}
                  </Button>
                </Stack>
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!applyJob} onClose={() => setApplyJob(null)} fullWidth maxWidth="sm">
        <DialogTitle>Apply for {applyJob?.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Cover Letter (optional)"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyJob(null)}>Cancel</Button>
          <Button variant="contained" onClick={submitApplication}>Submit Application</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobsList;
