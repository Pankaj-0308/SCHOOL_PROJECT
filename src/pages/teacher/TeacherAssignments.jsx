import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Stack, TextField, Button, Grid, Card, CardContent,
  CardActions, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider,
  InputAdornment, Box, useTheme, LinearProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import api from '../../api/client';

const TeacherAssignments = () => {
  const [list, setList] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ classNumber: '', subject: '', title: '', description: '', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [viewSubmissionsOpen, setViewSubmissionsOpen] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assignments, classes] = await Promise.all([
        api.get('/teacher/assignments'),
        api.get('/teacher/my-classes')
      ]);
      setList(Array.isArray(assignments.data) ? assignments.data : []);
      setMyClasses(Array.isArray(classes.data) ? classes.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignments = async () => {
    try {
      const { data } = await api.get('/teacher/assignments');
      setList(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const handleViewSubmissions = async (assignmentId) => {
    try {
      setViewSubmissionsOpen(true);
      setLoadingSubmissions(true);
      const { data } = await api.get(`/teacher/assignments/${assignmentId}/submissions`);
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Failed to load submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.classNumber || !form.subject || !form.title) {
      alert("Class, Subject and Title are required");
      return;
    }
    setSubmitting(true);
    try {
      // Ensure classNumber is a number
      const payload = { ...form, classNumber: Number(form.classNumber) };
      await api.post('/teacher/assignments', payload);
      setOpen(false);
      setForm({ classNumber: '', subject: '', title: '', description: '', dueDate: '' });
      loadAssignments();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter logic
  const filteredList = list.filter(item =>
    item.title?.toLowerCase().includes(filter.toLowerCase()) ||
    item.subject?.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatus = (dueDate) => {
    if (!dueDate) return { label: 'No Due Date', color: 'default' };
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', color: 'error' };
    if (diffDays === 0) return { label: 'Due Today', color: 'warning' };
    if (diffDays <= 3) return { label: `${diffDays} Days Left`, color: 'warning' };
    return { label: 'Active', color: 'success' };
  };

  if (loading) return <LinearProgress />;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 5 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Course Assignments</Typography>
          <Typography variant="subtitle1" color="text.secondary">Create and manage tasks for your students.</Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3, px: 4, py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600, boxShadow: theme.shadows[4] }}
        >
          Create Assignment
        </Button>
      </Stack>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
        <TextField
          fullWidth
          placeholder="Search assignments by title or subject..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
            sx: { borderRadius: 2 }
          }}
          size="small"
        />
      </Paper>

      {/* Grid */}
      {filteredList.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AssignmentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">No assignments found matching your criteria.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredList.map((item) => {
            const status = getStatus(item.dueDate);
            return (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card elevation={0} sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[4], borderColor: 'primary.main' }
                }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Stack direction="row" spacing={1}>
                      {item.classNumber && (
                        <Chip label={`Class ${item.classNumber}`} size="small" color="default" sx={{ fontWeight: 600, borderRadius: 1 }} />
                      )}
                      <Chip label={item.subject} size="small" color="primary" sx={{ fontWeight: 600, borderRadius: 1 }} />
                    </Stack>
                    <Chip label={status.label} size="small" color={status.color} variant="outlined" />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom lineClamp={2}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}>
                      {item.description || 'No description provided.'}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                      <EventIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        {item.dueDate ? new Date(item.dueDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'No Due Date'}
                      </Typography>
                    </Stack>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ px: 2, py: 1.5 }}>
                    <Button size="small" startIcon={<DescriptionIcon />}>View Details</Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleViewSubmissions(item._id)}
                    >
                      Check Submissions
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Submissions Dialog */}
      <Dialog open={viewSubmissionsOpen} onClose={() => setViewSubmissionsOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${theme.palette.divider}` }}>
          Assignment Submissions
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {loadingSubmissions ? <LinearProgress /> : (
            <Grid container>
              {submissions.length === 0 ? (
                <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                  <Typography color="text.secondary">No students found for this assignment class.</Typography>
                </Box>
              ) : submissions.map((sub, i) => (
                <React.Fragment key={sub.student?.id || i}>
                  <Grid item xs={12} sx={{ p: 2, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>{sub.student?.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{sub.student?.email}</Typography>
                      </Box>
                      <Chip
                        label={sub.status}
                        color={sub.status === 'Submitted' ? 'success' : 'warning'}
                        size="small"
                        variant={sub.status === 'Submitted' ? 'filled' : 'outlined'}
                      />
                      {sub.status === 'Submitted' && (
                        <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.content?.startsWith('http') ? (
                            <a href={sub.content} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem' }}>View Link</a>
                          ) : (
                            <Typography variant="caption" noWrap>{sub.content}</Typography>
                          )}
                        </Box>
                      )}
                      {sub.submittedAt && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                  <Divider />
                </React.Fragment>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setViewSubmissionsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${theme.palette.divider}` }}>Create New Assignment</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Target Class"
              fullWidth
              value={form.classNumber}
              onChange={(e) => setForm({ ...form, classNumber: e.target.value })}
              SelectProps={{ native: true }}
              helperText="Select the class you want to assign this to"
            >
              <option value="">Select Class</option>
              {myClasses.map(cNum => (
                <option key={cNum} value={cNum}>Class {cNum}</option>
              ))}
            </TextField>
            <TextField
              label="Subject"
              fullWidth
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Mathematics"
            />
            <TextField
              label="Assignment Title"
              fullWidth
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Description / Instructions"
              fullWidth
              multiline
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setOpen(false)} size="large" sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" size="large" disabled={submitting} sx={{ borderRadius: 2, px: 4 }}>
            {submitting ? 'Creating...' : 'Publish Task'}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default TeacherAssignments;
