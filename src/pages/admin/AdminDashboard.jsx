import React, { useCallback, useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Stack, 
  Fade, 
  Box, 
  Divider,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  PendingActions as PendingIcon,
  EventAvailable as AttendanceIcon,
  Assessment as PerformanceIcon,
  GroupWork as GroupsIcon,
  EmojiEvents as ActivitiesIcon
} from '@mui/icons-material';

const API = 'http://localhost:5000/api';

const StatCard = ({ icon: Icon, title, value, color, loading = false }) => (
  <Paper 
    elevation={2} 
    sx={{ 
      p: 3, 
      height: '100%',
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3,
      },
    }}
  >
    <Box display="flex" alignItems="center" mb={1.5}>
      <Icon sx={{ color, mr: 1.5, fontSize: 32 }} />
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
    </Box>
    {loading ? (
      <LinearProgress />
    ) : (
      <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {value}
      </Typography>
    )}
  </Paper>
);

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState({ 
    totalTeachers: null, 
    totalStudents: null, 
    totalClasses: null, 
    pendingAdmissions: null,
    attendanceRate: null,
    activeClubs: null,
    upcomingEvents: null,
    avgPerformance: null
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/admin/stats`);
      const data = await res.json();
      
      // Mock data for demonstration - replace with actual API data
      const mockData = {
        totalTeachers: data?.totalTeachers ?? 42,
        totalStudents: data?.totalStudents ?? 1250,
        totalClasses: data?.totalClasses ?? 36,
        pendingAdmissions: data?.pendingAdmissions ?? 8,
        attendanceRate: 94.5, // Example data
        activeClubs: 12, // Example data
        upcomingEvents: 5, // Example data
        avgPerformance: 82.3 // Example data
      };
      
      setStats(mockData);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data if API fails
      setStats({
        totalTeachers: 42,
        totalStudents: 1250,
        totalClasses: 36,
        pendingAdmissions: 8,
        attendanceRate: 94.5,
        activeClubs: 12,
        upcomingEvents: 5,
        avgPerformance: 82.3
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statsData = [
    { 
      icon: SchoolIcon, 
      title: 'Total Teachers', 
      value: stats.totalTeachers, 
      color: theme.palette.primary.main 
    },
    { 
      icon: PeopleIcon, 
      title: 'Total Students', 
      value: stats.totalStudents, 
      color: theme.palette.secondary.main 
    },
    { 
      icon: ClassIcon, 
      title: 'Total Classes', 
      value: stats.totalClasses, 
      color: theme.palette.success.main 
    },
    { 
      icon: PendingIcon, 
      title: 'Pending Admissions', 
      value: stats.pendingAdmissions, 
      color: theme.palette.warning.main 
    },
    { 
      icon: AttendanceIcon, 
      title: 'Attendance Rate', 
      value: `${stats.attendanceRate}%`, 
      color: theme.palette.info.main 
    },
    { 
      icon: GroupsIcon, 
      title: 'Active Clubs', 
      value: stats.activeClubs, 
      color: theme.palette.error.main 
    },
    { 
      icon: ActivitiesIcon, 
      title: 'Upcoming Events', 
      value: stats.upcomingEvents, 
      color: theme.palette.success.main 
    },
    { 
      icon: PerformanceIcon, 
      title: 'Avg. Performance', 
      value: `${stats.avgPerformance}%`, 
      color: theme.palette.info.main 
    },
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Fade in timeout={700}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700,
              mb: 1.5,
              color: theme.palette.primary.main,
              fontSize: { xs: '1.8rem', sm: '2.125rem' }
            }}>
              School Overview
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ 
              maxWidth: '800px',
              lineHeight: 1.6,
              mx: 'auto',
              px: { xs: 2, sm: 0 }
            }}>
              Welcome back! Here's a quick overview of your school's performance and key metrics.
            </Typography>
          </Box>
        </Fade>
        
        {/* First Row of Stats */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
          {statsData.slice(0, 4).map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ display: 'flex' }}>
              <StatCard 
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                color={stat.color}
                loading={loading}
                sx={{ flex: 1 }}
              />
            </Grid>
          ))}
        </Grid>
        
        {/* Second Row of Stats */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
          {statsData.slice(4, 8).map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index + 4} sx={{ display: 'flex' }}>
              <StatCard 
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                color={stat.color}
                loading={loading}
                sx={{ flex: 1 }}
              />
            </Grid>
          ))}
        </Grid>

      {/* Bottom Content */}
      <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10} lg={8} xl={6}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                maxWidth: '800px',
                mx: 'auto',
                mb: 4
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'center' }}>Recent Activities</Typography>
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 1,
                backgroundColor: theme.palette.grey[50],
                p: 4,
                textAlign: 'center'
              }}>
                <Typography color="text.secondary">Activity feed will be displayed here</Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={10} lg={8} xl={6}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>Quick Stats</Typography>
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                px: { xs: 1, sm: 3 },
                maxWidth: '600px',
                mx: 'auto',
                width: '100%'
              }}>
                {[
                  { label: 'New students this month', value: '24', change: '+5% from last month' },
                  { label: 'Staff attendance', value: '96%', change: '2% increase' },
                  { label: 'Library books checked out', value: '187', change: '12 this week' },
                  { label: 'Parent engagement', value: '78%', change: '3% increase' },
                ].map((item, index) => (
                  <Box key={index}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        {item.value}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{item.change}</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, Math.max(10, Math.random() * 100))} 
                      sx={{ 
                        height: 4, 
                        mt: 0.5, 
                        borderRadius: 2,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.primary.main,
                        }
                      }} 
                    />
                    {index < 3 && <Divider sx={{ my: 1.5 }} />}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;