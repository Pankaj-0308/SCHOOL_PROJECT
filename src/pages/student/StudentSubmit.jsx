import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import api from '../../api/client';

const StudentSubmit = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/student/assignments');
      setAssignments(Array.isArray(data) ? data : []);
      if ((data || []).length > 0) setSelectedId(data[0]._id);
      setError('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load assignments');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!selectedId || !content.trim()) return;
    try {
      await api.post(`/student/assignments/${selectedId}/submit`, { content });
      setSuccess('Submitted successfully');
      setContent('');
    } catch (e) {
      setSuccess('');
      setError(e?.response?.data?.message || 'Failed to submit');
    }
  };

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h4">Submit Assignment</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField select SelectProps={{ native: true }} size="small" label="Assignment" value={selectedId} onChange={(e)=>setSelectedId(e.target.value)} sx={{ minWidth: 240 }}>
            {(assignments||[]).map(a => <option key={a._id} value={a._id}>{`${a.subject}: ${a.title}`}</option>)}
          </TextField>
          <Button variant="contained" onClick={submit} disabled={!selectedId || !content.trim()}>Submit</Button>
        </Stack>
      </Stack>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Assignments</Typography>
          <List>
            {(assignments||[]).map(a => (
              <ListItem key={a._id} button onClick={()=>setSelectedId(a._id)} selected={selectedId===a._id} divider>
                <ListItemText primary={`${a.subject}: ${a.title}`} secondary={a.description || ''} />
              </ListItem>
            ))}
          </List>
          <TextField fullWidth multiline minRows={4} label="Your answer (text or link)" value={content} onChange={(e)=>setContent(e.target.value)} sx={{ mt: 2 }} />
        </Paper>
      )}
      {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
    </Container>
  );
};

export default StudentSubmit;
