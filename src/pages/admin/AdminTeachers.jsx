
import React, { useEffect, useMemo, useState } from 'react';
import {
  Container, Typography, Grid, Card, CardActionArea, TextField, Stack, Chip, Dialog,
  DialogContent, DialogActions, Button, Avatar, Box, InputAdornment, Divider,
  IconButton, Tooltip, LinearProgress, Paper, useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Class as ClassIcon,
  Category as CategoryIcon,
  Verified as VerifiedIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  People as PeopleIcon,
  Subject as SubjectIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import api from '../../api/client';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [tempPass, setTempPass] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For refresh action
  // Add Teacher Dialog State
  const [openAdd, setOpenAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '', email: '', password: 'password123', subject: '',
    phone: '', qualification: '', experience: 0
  });

  const theme = useTheme();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/teachers');
      setTeachers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.subject) {
      alert("Please fill required fields (Name, Email, Subject)");
      return;
    }
    try {
      setAddLoading(true);
      await api.post('/admin/add-teacher', newTeacher);
      setOpenAdd(false);
      fetchTeachers();
      setNewTeacher({ name: '', email: '', password: 'password123', subject: '', phone: '', qualification: '', experience: 0 });
      alert("Teacher added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add teacher");
    } finally {
      setAddLoading(false);
    }
  };

  const handleGenerateTimetable = async () => {
    if (!window.confirm("This will optimize assignment of teachers and regenerate timetables for all classes based on current staff. Continue?")) return;
    try {
      setIsLoading(true);
      const { data } = await api.post('/admin/timetable/generate');
      alert(data.message);
      fetchTeachers(); // Refresh to show any updates
    } catch (err) {
      console.error(err);
      alert("Failed to generate timetable");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeachers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const cls = String(classFilter || '').trim();
    return teachers.filter(teacher => {
      const matchesSearch = !term ||
        (teacher.name && teacher.name.toLowerCase().includes(term)) ||
        (teacher.email && teacher.email.toLowerCase().includes(term));

      // Handle numeric classAssigned comparison carefully for legacy/single class
      // Also check populated assignedClasses array
      let matchesClass = !cls;
      if (cls) {
        // Direct match
        if (teacher.classAssigned && String(teacher.classAssigned) === cls) matchesClass = true;
        // Array match
        else if (teacher.assignedClasses && teacher.assignedClasses.length > 0) {
          matchesClass = teacher.assignedClasses.some(ac =>
            ac.class && String(ac.class.classNumber) === cls
          );
        }
      }

      return matchesSearch && matchesClass;
    });
  }, [teachers, searchTerm, classFilter]);

  const stats = useMemo(() => {
    return {
      total: teachers.length,
      active: teachers.filter(t => t.verified).length,
      subjects: new Set(teachers.map(t => t.subject).filter(Boolean)).size,
    };
  }, [teachers]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchTeachers();
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    if (!selected) return;
    try {
      const { data } = await api.post(`/admin/teacher/${selected._id}/reset-password`);
      setTempPass(data.tempPassword);
    } catch (err) {
      alert('Failed to reset password');
    }
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      {/* Header Section */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3} sx={{ mb: 5 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
            Teachers Directory
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your faculty, assignments, and credentials.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ClassIcon />}
            onClick={handleGenerateTimetable}
            disabled={isLoading}
            sx={{ borderRadius: 4, px: 3, py: 1.5, textTransform: 'none', fontWeight: 600, borderColor: theme.palette.divider }}
          >
            Optimize Timetable
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenAdd(true)}
            sx={{ borderRadius: 4, px: 4, py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600, boxShadow: theme.shadows[4] }}
          >
            Add New Teacher
          </Button>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Total Teachers', value: stats.total, icon: <PeopleIcon />, color: '#2196F3' },
          { label: 'Active Faculty', value: stats.active, icon: <VerifiedIcon />, color: '#00C853' },
          { label: 'Departments', value: stats.subjects, icon: <SubjectIcon />, color: '#FF9800' }
        ].map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${alpha(stat.color, 0.2)}`,
              bgcolor: alpha(stat.color, 0.05),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{stat.label}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: alpha(stat.color, 0.2), color: stat.color, width: 56, height: 56 }}>
                {stat.icon}
              </Avatar>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Search and Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                sx: { borderRadius: 2 }
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              SelectProps={{ native: true }}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              <option value="">All Classes</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>Class {i + 1}</option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Tooltip title="Refresh List">
              <IconButton onClick={handleRefresh} disabled={isLoading} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Teachers Grid */}
      {loading ? (
        <LinearProgress sx={{ borderRadius: 2 }} />
      ) : filteredTeachers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">No teachers found matching your criteria.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredTeachers.map((teacher) => (
            <Grid item xs={12} sm={3} md={3} lg={3} xl={3} key={teacher._id}>
              <Card elevation={0} sx={{
                height: '100%',
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main', boxShadow: theme.shadows[4] }
              }}>
                <CardActionArea onClick={() => setSelected(teacher)} sx={{ height: '100%', p: 2 }}>
                  <Stack alignItems="center" spacing={2}>
                    <Avatar
                      src={teacher.avatar}
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.main',
                        fontSize: '2rem',
                        fontWeight: 700,
                        boxShadow: theme.shadows[3]
                      }}
                    >
                      {teacher.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ textAlign: 'center', width: '100%' }}>
                      <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>{teacher.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>{teacher.email}</Typography>
                      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                        {teacher.verified ? (
                          <Chip icon={<VerifiedIcon sx={{ fontSize: '1rem !important' }} />} label="Verified" size="small" color="success" variant="outlined" sx={{ borderRadius: 2 }} />
                        ) : (
                          <Chip icon={<ErrorIcon sx={{ fontSize: '1rem !important' }} />} label="Pending" size="small" color="warning" variant="outlined" sx={{ borderRadius: 2 }} />
                        )}
                        {teacher.subject && (
                          <Chip label={teacher.subject} size="small" color="primary" variant="filled" sx={{ borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }} />
                        )}
                      </Stack>
                    </Box>
                    <Divider flexItem />
                    <Grid container>
                      <Grid item xs={6} sx={{ textAlign: 'center', borderRight: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="caption" display="block" color="text.secondary">CLASS</Typography>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {teacher.classAssigned
                            ? teacher.classAssigned
                            : (teacher.assignedClasses && teacher.assignedClasses.length > 0)
                              ? teacher.assignedClasses.map(ac => ac.class?.classNumber).filter(Boolean).join(', ')
                              : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" display="block" color="text.secondary">EMP ID</Typography>
                        <Typography variant="body2" fontWeight={600}>{teacher.employeeId || '—'}</Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Teacher Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <Box sx={{ textAlign: 'center', mb: 3, mt: 1 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56, mx: 'auto', mb: 2, boxShadow: theme.shadows[3] }}>
            <PersonAddIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={800} gutterBottom>Add New Faculty</Typography>
          <Typography variant="body2" color="text.secondary">Enter the credentials to onboard a new teacher.</Typography>
        </Box>
        <DialogContent sx={{ p: 2, overflowY: 'visible' }}>
          <Stack spacing={3}>
            <TextField
              label="Full Name"
              fullWidth
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <TextField
              label="Email Address"
              fullWidth
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Subject Specialization"
                fullWidth
                value={newTeacher.subject}
                onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                SelectProps={{ native: true }}
                InputProps={{ sx: { borderRadius: 3 } }}
              >
                <option value="">Select Subject</option>
                {['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </TextField>
              <TextField
                label="Phone Number"
                fullWidth
                value={newTeacher.phone}
                onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Qualification"
                fullWidth
                placeholder="e.g. M.Sc, B.Ed"
                value={newTeacher.qualification}
                onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                InputProps={{ sx: { borderRadius: 3 } }}
              />
              <TextField
                label="Experience (Yrs)"
                type="number"
                fullWidth
                value={newTeacher.experience}
                onChange={(e) => setNewTeacher({ ...newTeacher, experience: Number(e.target.value) })}
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Stack>
            <TextField
              label="Initial Password"
              fullWidth
              value={newTeacher.password}
              onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
              helperText="Default set to 'password123'"
              InputProps={{ sx: { borderRadius: 3 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setOpenAdd(false)}
            size="large"
            variant="outlined"
            sx={{ borderRadius: 3, px: 4, py: 1.5, color: 'text.secondary', borderColor: theme.palette.divider }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTeacher}
            variant="contained"
            size="large"
            sx={{ borderRadius: 3, px: 6, py: 1.5, fontSize: '1rem', fontWeight: 600, boxShadow: theme.shadows[4] }}
            disabled={addLoading}
          >
            {addLoading ? 'Creating...' : 'Create Profile'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        {selected && (
          <>
            <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white', textAlign: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: 'white', color: 'primary.main', fontSize: '3rem', fontWeight: 800, mx: 'auto', mb: 2, border: '4px solid rgba(255,255,255,0.2)' }}>
                {selected.name?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{selected.name}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>{selected.email}</Typography>
            </Box>
            <DialogContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>CONTACT & STATUS</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip icon={<EmailIcon />} label={selected.email} />
                    <Chip icon={<PhoneIcon />} label={selected.phone || 'No Phone'} />
                    <Chip label={selected.verified ? 'Verified Account' : 'Pending Verification'} color={selected.verified ? 'success' : 'warning'} />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <ClassIcon color="action" />
                    <Typography variant="h6">{selected.classAssigned || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary">Class Assigned</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                    <CategoryIcon color="action" />
                    <Typography variant="h6">{selected.subject || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary">Primary Subject</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {tempPass && (
                <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2, border: `1px dashed ${theme.palette.success.main}`, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>Temporary Password Generated</Typography>
                  <Typography variant="h5" sx={{ fontFamily: 'monospace', letterSpacing: 2, fontWeight: 700 }}>{tempPass}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Button onClick={() => { setSelected(null); setTempPass(''); }} size="large" sx={{ borderRadius: 2, color: 'text.secondary' }}>Close</Button>
              <Button onClick={handleResetPassword} variant="outlined" color="primary" size="large" sx={{ borderRadius: 2 }}>Reset Password</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminTeachers;
