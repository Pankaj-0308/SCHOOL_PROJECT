
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, TextField, MenuItem, Button,
  Stack, Grid, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, Box, InputAdornment, IconButton, Chip, useTheme,
  CircularProgress, Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Class as ClassIcon,
  Category as CategoryIcon,
  Key as KeyIcon,
  Delete as DeleteIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Verified as VerifiedIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import api from '../../api/client';

const AdminAddTeacher = () => {
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '', classNumber: '', subject: '' });
  const [teachers, setTeachers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/teachers');
      setTeachers(Array.isArray(data) ? data : []);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.password) return;
    setSubmitting(true);
    try {
      await api.post('/admin/add-teacher', {
        name: newTeacher.name,
        email: newTeacher.email,
        password: newTeacher.password,
        classNumber: Number(newTeacher.classNumber) || undefined,
        subject: newTeacher.subject || undefined,
      });
      setNewTeacher({ name: '', email: '', password: '', classNumber: '', subject: '' });
      await fetchTeachers();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Are you sure you want to remove this teacher?')) return;
    try {
      await api.post('/admin/delete-teacher', { teacherId: id });
      await fetchTeachers();
    } catch (e) {
      console.error(e);
    }
  };

  const subjects = [
    'Mathematics', 'Science', 'English', 'Social Studies', 'Hindi',
    'Computer', 'Sanskrit', 'Physics', 'Chemistry', 'Biology',
    'Geography', 'History', 'Economics', 'Civics', 'Physical Education', 'Art', 'Music'
  ];

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        {/* Left Side: Add Form */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              New Faculty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Onboard a new teacher to the platform.
            </Typography>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><BadgeIcon color="action" /></InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  label="Temporary Password"
                  type="password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><KeyIcon color="action" /></InputAdornment>,
                  }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Subject"
                      select
                      value={newTeacher.subject}
                      onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><CategoryIcon color="action" fontSize="small" /></InputAdornment>,
                      }}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {subjects.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Class (Opt)"
                      type="number"
                      value={newTeacher.classNumber}
                      onChange={(e) => setNewTeacher({ ...newTeacher, classNumber: e.target.value })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><ClassIcon color="action" fontSize="small" /></InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAddTeacher}
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                  sx={{ mt: 2, borderRadius: 2, height: 48, fontWeight: 700 }}
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Grid>

        {/* Right Side: List */}
        <Grid item xs={12} lg={8}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Faculty Directory</Typography>
              <Typography variant="body2" color="text.secondary">{teachers.length} Active Teachers</Typography>
            </Box>
            <TextField
              placeholder="Search teachers..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                sx: { bgcolor: 'background.paper', borderRadius: 2 }
              }}
              sx={{ width: 250 }}
            />
          </Stack>

          <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
            ) : filteredTeachers.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No teachers found.</Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredTeachers.map((t, index) => (
                  <React.Fragment key={t._id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      sx={{
                        p: 2,
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                        transition: 'background-color 0.2s'
                      }}
                      secondaryAction={
                        <IconButton edge="end" color="error" onClick={() => handleDeleteTeacher(t._id)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, fontWeight: 700 }}>
                          {t.name?.[0]?.toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle1" fontWeight={600}>{t.name}</Typography>
                            {t.classAssigned && <Chip size="small" label={`Class ${t.classAssigned}`} color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />}
                            {t.subject && <Chip size="small" label={t.subject} icon={<SchoolIcon sx={{ fontSize: '0.8rem !important' }} />} sx={{ height: 20, fontSize: '0.65rem', pl: 0.5 }} />}
                          </Stack>
                        }
                        secondary={
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" fontFamily="monospace">{t.email}</Typography>
                            {t.verified && <VerifiedIcon color="success" sx={{ fontSize: '0.9rem' }} />}
                          </Stack>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminAddTeacher;
