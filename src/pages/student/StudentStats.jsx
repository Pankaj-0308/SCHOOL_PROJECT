import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, Grid, Chip } from '@mui/material';
import api from '../../api/client';

const StudentStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/student/stats');
      setStats(data);
      setError('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load stats');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 2 }}>My Statistics</Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : stats ? (
        <>


          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Assignments by Subject</Typography>
            <Grid container spacing={2}>
              {(stats.assignmentsBySubject || []).map((s) => (
                <Grid item xs={12} md={6} lg={4} key={s.subject}>
                  <Paper sx={{ p: 2 }} variant="outlined">
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>{s.subject}</Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`Total ${s.total}`} />
                      <Chip color="success" label={`Submitted ${s.submitted}`} />
                      <Chip color="warning" label={`Pending ${s.pending}`} />
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      ) : null}
    </Container>
  );
};

export default StudentStats;
