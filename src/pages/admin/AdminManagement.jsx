import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Paper, Stack, TextField, Button, Chip, Grid, Card, CardContent, Avatar, Box, IconButton, Tooltip, Divider } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../../api/client';

const AdminManagement = () => {
  const [mgmt, setMgmt] = useState([]);
  const [error, setError] = useState('');
  const [form16, setForm16] = useState({ name: '', email: '', password: '' });
  const [form612, setForm612] = useState({ name: '', email: '', password: '' });

  const load = async () => {
    try {
      const mRes = await api.get('/admin/management');
      const m = mRes.data;
      setMgmt(Array.isArray(m) ? m : []);
      setError('');
    } finally {}
  };

  useEffect(() => { load(); }, []);

  const createMgmt = async (role, data) => {
    if (!data.name || !data.email || !data.password) return alert('Please fill name, email, and password');
    try {
      await api.post('/admin/management/create', { ...data, role });
      setForm16({ name: '', email: '', password: '' });
      setForm612({ name: '', email: '', password: '' });
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to create');
    }
  };

  const deleteMgmt = async (userId) => {
    if (!userId) return;
    try {
      await api.post('/admin/management/delete', { userId });
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete');
    }
  };

  const resetPassword = async (userId) => {
    if (!userId) return;
    try {
      const { data } = await api.post(`/admin/teacher/${userId}/reset-password`);
      alert(`Temporary password: ${data.tempPassword}`);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to reset password');
    }
  };

  const current16 = useMemo(() => mgmt.find(x => x.managementRole === 'admissions-1-6') || null, [mgmt]);
  const current612 = useMemo(() => mgmt.find(x => x.managementRole === 'admissions-6-12') || null, [mgmt]);

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Management</Typography>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      <Stack spacing={2}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Admissions (Classes 1-6)</Typography>
            {current16 ? (
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{(current16.name || '?').charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" noWrap>{current16.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{current16.email}</Typography>
                    </Box>
                    <Tooltip title="Reset password (shows a new temporary password)">
                      <IconButton size="small" onClick={() => resetPassword(current16._id)} sx={{ ml: 'auto' }}>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" color="warning" label="Mgmt: 1-6" />
                    <Button color="error" variant="outlined" onClick={() => deleteMgmt(current16._id)}>Remove</Button>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">No management teacher yet. Add one:</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField size="small" label="Name" value={form16.name} onChange={(e)=>setForm16({...form16, name: e.target.value})} />
                  <TextField size="small" label="Email" value={form16.email} onChange={(e)=>setForm16({...form16, email: e.target.value})} />
                  <TextField size="small" label="Password" type="password" value={form16.password} onChange={(e)=>setForm16({...form16, password: e.target.value})} />
                  <Button variant="contained" onClick={()=>createMgmt('admissions-1-6', form16)}>Add</Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Paper>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Admissions (Classes 6-12)</Typography>
            {current612 ? (
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{(current612.name || '?').charAt(0).toUpperCase()}</Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" noWrap>{current612.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{current612.email}</Typography>
                    </Box>
                    <Tooltip title="Reset password (shows a new temporary password)">
                      <IconButton size="small" onClick={() => resetPassword(current612._id)} sx={{ ml: 'auto' }}>
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" color="warning" label="Mgmt: 6-12" />
                    <Button color="error" variant="outlined" onClick={() => deleteMgmt(current612._id)}>Remove</Button>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">No management teacher yet. Add one:</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <TextField size="small" label="Name" value={form612.name} onChange={(e)=>setForm612({...form612, name: e.target.value})} />
                  <TextField size="small" label="Email" value={form612.email} onChange={(e)=>setForm612({...form612, email: e.target.value})} />
                  <TextField size="small" label="Password" type="password" value={form612.password} onChange={(e)=>setForm612({...form612, password: e.target.value})} />
                  <Button variant="contained" onClick={()=>createMgmt('admissions-6-12', form612)}>Add</Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1} sx={{ mb: 1 }}>
            <Typography variant="h6">Management Teachers</Typography>
            <Typography variant="body2" color="text.secondary">These are the currently assigned management teachers.</Typography>
          </Stack>
          {mgmt.length === 0 ? (
            <Typography color="text.secondary">No management teachers assigned</Typography>
          ) : (
            <Grid container spacing={2}>
              {mgmt.map(t => (
                <Grid item key={t._id} xs={12} sm={6} md={4} lg={3}>
                  <Card>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar>{(t.name || '?').charAt(0).toUpperCase()}</Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="subtitle1" noWrap>{t.name}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>{t.email}</Typography>
                        </Box>
                        <Tooltip title="Reset password (shows a new temporary password)">
                          <IconButton size="small" onClick={() => resetPassword(t._id)} sx={{ ml: 'auto' }}>
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                      <Divider sx={{ my: 1.5 }} />
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip size="small" color="warning" label={t.managementRole === 'admissions-1-6' ? 'Mgmt: 1-6' : 'Mgmt: 6-12'} />
                        {t.subject ? <Chip size="small" color="secondary" label={t.subject} /> : null}
                        {t.classAssigned ? <Chip size="small" color="primary" label={`Class ${t.classAssigned}`} /> : <Chip size="small" label="Unassigned" />}
                        {t.verified ? <Chip size="small" color="success" label="Verified" /> : <Chip size="small" label="Pending" />}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

      </Stack>
    </Container>
  );
};

export default AdminManagement;
