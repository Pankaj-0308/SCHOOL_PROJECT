import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, TextField, MenuItem, Grid, Card, CardMedia, CardContent } from '@mui/material';
import api from '../../api/client';

const StudentQuestionPapers = () => {
  const [subject, setSubject] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const url = subject ? `/student/question-papers?subject=${encodeURIComponent(subject)}` : '/student/question-papers';
        const { data } = await api.get(url);
        if (mounted) {
          setPapers(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (e) {
        if (mounted) {
          setError(e?.response?.data?.message || 'Failed to load question papers');
          setPapers([]);
        }
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [subject]);

  const subjects = ['', 'English', 'Mathematics', 'Science', 'Social Studies', 'Hindi'];

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h4">Question Papers</Typography>
        <TextField select size="small" label="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} sx={{ width: 220 }}>
          {subjects.map((s) => <MenuItem key={s || 'all'} value={s}>{s || 'All Subjects'}</MenuItem>)}
        </TextField>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : papers.length === 0 ? (
          <Typography color="text.secondary">No question papers</Typography>
        ) : (
          <Grid container spacing={2}>
            {papers.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Card>
                  {p.url ? (
                    <CardMedia component="img" height="160" image={p.url} alt={`${p.subject} ${p.year}`} />
                  ) : null}
                  <CardContent>
                    <Typography variant="subtitle1">{`${p.subject} (${p.year})`}</Typography>
                    <Typography variant="body2" color="text.secondary">{p.title}</Typography>
                    {!p.url && p.content ? (
                      <Typography variant="body2" sx={{ mt: 1 }}>{p.content}</Typography>
                    ) : null}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default StudentQuestionPapers;
