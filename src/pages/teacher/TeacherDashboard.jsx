import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Paper, Stack, List, ListItem,
  ListItemText, Chip, Avatar, Box, Divider, Card, CardContent,
  CircularProgress, useTheme, Button
} from '@mui/material';
import {
  Class as ClassIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import api from '../../api/client';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      // Fetch profile to get name and assigned classes
      const { data: profile } = await api.get('/auth/me'); // Assuming valid endpoint, or use /teacher/me if available
      setTeacher(profile);

      // Fetch teachers list to find self and full populated details if needed, 
      // or rely on a specific endpoint. 
      // For now, let's assume we can get class details.
      // If /teacher/me/class returns single, we might need a new endpoint for multiple.
      // Let's rely on what we can get.

      // Try fetching schedule to infer classes if specific endpoint is missing
      const { data: scheduleData } = await api.get('/teacher/schedule');
      const uniqueClasses = [...new Set(scheduleData?.entries?.map(e => e.classNumber) || [])].sort((a, b) => a - b);
      setAssignedClasses(uniqueClasses);

      // Fetch students (all students from assigned classes)
      const { data: studentsData } = await api.get('/teacher/students');
      setStudents(studentsData || []);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={0} sx={{
      height: '100%',
      borderRadius: 4,
      border: `1px solid ${alpha(color, 0.2)}`,
      bgcolor: alpha(color, 0.05),
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{
        position: 'absolute',
        right: -20,
        top: -20,
        opacity: 0.1,
        color: color,
        transform: 'rotate(15deg)'
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 120 } })}
      </Box>
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Avatar sx={{ bgcolor: color, color: '#fff', mb: 2, width: 48, height: 48 }}>
          {icon}
        </Avatar>
        <Typography variant="h3" fontWeight={800} sx={{ color: color, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome back, {teacher?.name?.split(' ')[0] || 'Teacher'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600 }}>
          Here's what's happening in your classes today. You have {assignedClasses.length} active classes assigned.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assigned Classes"
            value={assignedClasses.length}
            icon={<ClassIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={students.length}
            icon={<PeopleIcon />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Classes Today"
            value={0} // Placeholder for calculated today's classes
            icon={<ScheduleIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Actions"
            value={students.filter(s => !s.verified).length} // Placeholder
            icon={<AssignmentIcon />}
            color={theme.palette.error.main}
          />
        </Grid>
      </Grid>

      {/* Main Content Area */}
      <Grid container spacing={4}>
        {/* Student Directory */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Student Directory</Typography>
                <Typography variant="body2" color="text.secondary">List of students across all your assigned classes</Typography>
              </Box>
              <Chip label={`${students.length} Students`} size="small" color="primary" sx={{ borderRadius: 2 }} />
            </Box>
            <List sx={{ p: 0, maxHeight: 600, overflow: 'auto' }}>
              {students.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No students found in your assigned classes.</Typography>
                </Box>
              ) : (
                students.map((student, index) => (
                  <React.Fragment key={student._id}>
                    <ListItem sx={{ py: 2, px: 3, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" fontWeight={600}>{student.name}</Typography>
                            {student.verified ?
                              <VerifiedIcon sx={{ fontSize: 16, color: 'success.main' }} /> :
                              <PendingIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                            }
                          </Stack>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {student.email} • ID: {student.studentId || 'N/A'}
                          </Typography>
                        }
                      />
                      <Chip
                        label={`Class ${student.classId?.classNumber || '?'}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    </ListItem>
                    {index < students.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions / Side Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', mb: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Quick Actions</Typography>
            <Stack spacing={2}>
              <Button variant="outlined" startIcon={<ScheduleIcon />} fullWidth sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}>
                View Full Schedule
              </Button>
              <Button variant="outlined" startIcon={<AssignmentIcon />} fullWidth sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 2 }}>
                Create Assignment
              </Button>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: 'info.main' }}><ClassIcon /></Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>Class Info</Typography>
                <Typography variant="caption" color="text.secondary">Your Teaching Assignments</Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              You are currently assigned to teach <strong>English, Math</strong> in classes:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {assignedClasses.map(c => (
                <Chip key={c} label={`Class ${c}`} color="primary" size="small" />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDashboard;