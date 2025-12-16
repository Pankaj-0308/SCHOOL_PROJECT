import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Paper, Stack, List, ListItem,
  ListItemText, TextField, Button, Avatar, Box, Chip, Divider,
  Card, CardContent, CircularProgress, useTheme, IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  Campaign as CampaignIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import api from '../../api/client';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [submissionContent, setSubmissionContent] = useState({});
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const { data: me } = await api.get('/student/me');
        setProfile(me);
        if (me?.classNumber) {
          await Promise.all([loadAssignments(), loadSubmissions()]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadAssignments = async () => {
    const { data } = await api.get('/student/assignments');
    setAssignments(data || []);
  };

  const loadSubmissions = async () => {
    const { data } = await api.get('/student/submissions');
    setSubmissions(data || []);
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const content = submissionContent[assignmentId];
    if (!content) return;
    await api.post(`/student/assignments/${assignmentId}/submit`, { content });
    setSubmissionContent((m) => ({ ...m, [assignmentId]: '' }));
    await loadSubmissions();
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome & Profile Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome, {profile?.name?.split(' ')[0] || 'Student'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Class {profile?.classNumber || 'N/A'} • Student ID: {profile?.studentId || '—'}
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Assignments Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{
            height: '100%',
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden'
          }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}><AssignmentIcon /></Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Pending Assignments</Typography>
                  <Typography variant="body2" color="text.secondary">Tasks that need your attention</Typography>
                </Box>
              </Stack>
            </Box>

            <List sx={{ p: 0 }}>
              {assignments.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No active assignments</Typography>
                </Box>
              ) : (
                assignments.map((a, i) => {
                  const isSubmitted = submissions.some(s => s.assignment?._id === a._id);
                  if (isSubmitted) return null; // Or filter properly before map

                  return (
                    <React.Fragment key={a._id}>
                      <ListItem alignItems="flex-start" sx={{ px: 3, py: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>{a.title}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                              <Chip label={a.subject} size="small" color="primary" variant="outlined" />
                              {a.dueDate && (
                                <Chip
                                  icon={<AccessTimeIcon />}
                                  label={`Due ${new Date(a.dueDate).toLocaleDateString()}`}
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary">{a.description}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TextField
                                size="small"
                                placeholder="Paste link..."
                                fullWidth
                                value={submissionContent[a._id] || ''}
                                onChange={(e) => setSubmissionContent((m) => ({ ...m, [a._id]: e.target.value }))}
                                sx={{ bgcolor: 'background.paper' }}
                              />
                              <IconButton
                                color="primary"
                                onClick={() => handleSubmitAssignment(a._id)}
                                disabled={!submissionContent[a._id]}
                              >
                                <SendIcon />
                              </IconButton>
                            </Stack>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {i < assignments.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  );
                }).filter(Boolean)
              )}
            </List>
          </Paper>
        </Grid>

        {/* Submissions & Sub-info */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={3} direction="column">
            {/* Quick Profile Card - Optional if header is enough, but user asked for equal balance */}
            {/* Keeping it simple with Submissions History */}

            <Grid item>
              <Paper elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'success.main' }}><CheckCircleIcon /></Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>Recent Submissions</Typography>
                      <Typography variant="body2" color="text.secondary">Work you have turned in</Typography>
                    </Box>
                  </Stack>
                </Box>
                <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                  {submissions.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">No submissions yet.</Typography>
                    </Box>
                  ) : (
                    submissions.map((s, i) => (
                      <React.Fragment key={s._id}>
                        <ListItem sx={{ px: 3, py: 2 }}>
                          <ListItemText
                            primary={<Typography variant="subtitle2">{s.assignment?.title || 'Unknown Assignment'}</Typography>}
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                Submitted on {new Date(s.submittedAt).toLocaleDateString()}
                              </Typography>
                            }
                          />
                          <Chip size="small" label="Done" color="success" variant="soft" />
                        </ListItem>
                        {i < submissions.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))
                  )}
                </List>
              </Paper>
            </Grid>

            <Grid item sx={{ mt: 3 }}>
              <Paper elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}><CampaignIcon /></Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>School Announcements</Typography>
                      <Typography variant="body2" color="text.secondary">Latest news and updates</Typography>
                    </Box>
                  </Stack>
                </Box>
                <List sx={{ p: 0 }}>
                  {[
                    { title: 'Annual Sports Meet', date: 'Dec 15', desc: 'Registration open for all track events.' },
                    { title: 'Winter Break', date: 'Dec 24', desc: 'School closed for winter holidays.' },
                    { title: 'Science Fair', date: 'Jan 10', desc: 'Submit your project proposals by Monday.' }
                  ].map((item, i) => (
                    <React.Fragment key={i}>
                      <ListItem sx={{ px: 3, py: 2 }}>
                        <ListItemText
                          primary={<Typography variant="subtitle2" fontWeight={600}>{item.title}</Typography>}
                          secondary={
                            <Stack spacing={0.5}>
                              <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                              <Typography variant="caption" color="primary" fontWeight={500}>{item.date}</Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                      {i < 2 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;