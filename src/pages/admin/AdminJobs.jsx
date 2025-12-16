import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Stack, Chip, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import api from '../../api/client';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classNumbers, setClassNumbers] = useState(''); // comma-separated 1-12
  const [subjects, setSubjects] = useState(''); // comma-separated
  const [appsOpenForJob, setAppsOpenForJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (e) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createJob = async () => {
    try {
      const payload = {
        title,
        description,
        classNumbers: classNumbers.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !Number.isNaN(n)),
        subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
      };
      await api.post('/jobs', payload);
      setTitle(''); setDescription(''); setClassNumbers(''); setSubjects('');
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to create job');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      await load();
    } catch {
      alert('Failed to delete job');
    }
  };

  const openApplications = async (job) => {
    try {
      const { data } = await api.get(`/jobs/${job._id}/applications`);
      setApplications(data);
      setAppsOpenForJob(job);
    } catch {
      alert('Failed to load applications');
    }
  };

  const review = async (appId, decision) => {
    try {
      await api.post(`/jobs/applications/${appId}/review`, { decision });
      // refresh list
      if (appsOpenForJob) openApplications(appsOpenForJob);
    } catch {
      alert('Failed to review application');
    }
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Manage Jobs</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Create New Job</Typography>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={2} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Class Numbers (e.g., 5,6,7)" value={classNumbers} onChange={(e) => setClassNumbers(e.target.value)} fullWidth />
            <TextField label="Subjects (e.g., Math,Science)" value={subjects} onChange={(e) => setSubjects(e.target.value)} fullWidth />
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={createJob} disabled={!title.trim()}>Create Job</Button>
          </Stack>
        </Stack>
      </Paper>

      {loading ? (
        <Typography>Loading jobs...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} md={6} key={job._id}>
              <Paper sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{job.title}</Typography>
                    <IconButton onClick={() => deleteJob(job._id)} size="small" color="error"><DeleteIcon /></IconButton>
                  </Stack>
                  {job.description && <Typography color="text.secondary">{job.description}</Typography>}
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(job.classNumbers || []).map((c) => (
                      <Chip key={c} label={`Class ${c}`} size="small" />
                    ))}
                    {(job.subjects || []).map((s) => (
                      <Chip key={s} label={s} size="small" color="secondary" variant="outlined" />
                    ))}
                  </Stack>
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button variant="outlined" onClick={() => openApplications(job)}>View Applications</Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!appsOpenForJob} onClose={() => setAppsOpenForJob(null)} fullWidth maxWidth="sm">
        <DialogTitle>Applications for {appsOpenForJob?.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {applications.length === 0 && <Typography>No applications yet.</Typography>}
            {applications.map((a) => (
              <Paper key={a._id} sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">{a.teacher?.name} ({a.teacher?.email})</Typography>
                  {a.coverLetter && <Typography color="text.secondary">{a.coverLetter}</Typography>}
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Chip label={a.status} size="small" />
                    <Button size="small" variant="outlined" color="success" onClick={() => review(a._id, 'approved')}>Approve</Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => review(a._id, 'rejected')}>Reject</Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppsOpenForJob(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminJobs;
