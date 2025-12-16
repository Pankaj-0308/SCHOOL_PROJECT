import React, { useState } from 'react';
import { Container, Typography, Button, Box, Stack, Grid, Card, CardContent, Fade, Grow, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StudentLanding = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'courses', label: 'Courses' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'profile', label: 'Profile' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (_e, id) => setActiveSection(id);

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 10 } }}>
        <Container>
          <Fade in timeout={700}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography variant="h3">Student Panel</Typography>
              <Typography variant="subtitle1" color="text.secondary">Access your classes, assignments and stay updated with announcements.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" onClick={() => setActiveSection('courses')}>Explore Courses</Button>
                <Button variant="outlined" onClick={() => navigate('/student/dashboard')}>Go to Dashboard</Button>
              </Stack>
            </Stack>
          </Fade>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Tabs value={activeSection} onChange={handleNav} variant="scrollable" scrollButtons allowScrollButtonsMobile>
              {navItems.map((item) => (
                <Tab key={item.id} label={item.label} value={item.id} />
              ))}
            </Tabs>
          </Box>
        </Container>
      </Box>

      {activeSection === 'home' && (
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Grid container spacing={3} justifyContent="center">
            {['Announcements', 'Upcoming Exams'].map((t, i) => (
              <Grid item xs={12} md={5} key={t}>
                <Grow in timeout={600 + i * 120}>
                  <Card sx={{ height: '100%', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{t}</Typography>
                      <Typography color="text.secondary">Stay on top of your academics with the latest updates.</Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {activeSection === 'courses' && (
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Typography variant="h4" gutterBottom>Courses</Typography>
          <Grid container spacing={2}>
            {[{ t: 'Mathematics', d: 'Algebra, Geometry and Calculus modules.' }, { t: 'Physics', d: 'Mechanics, Waves and Thermodynamics.' }, { t: 'Chemistry', d: 'Organic, Inorganic and Physical Chemistry.' }].map((c, idx) => (
              <Grid item xs={12} sm={6} md={4} key={c.t}>
                <Grow in timeout={600 + (idx % 3) * 120}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{c.t}</Typography>
                      <Typography color="text.secondary">{c.d}</Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {activeSection === 'assignments' && (
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Typography variant="h4" gutterBottom>Pending Assignments</Typography>
          <Stack spacing={1.5}>
            {[{ t: 'Algebra Problem Set', d: 'Due: Tomorrow' }, { t: 'Physics Lab Report', d: 'Due: Next Monday' }, { t: 'Chemistry Quiz Prep', d: 'Due: Today' }].map((a, i) => (
              <Grow in timeout={600 + i * 100} key={a.t}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1"><strong>{a.t}</strong></Typography>
                    <Typography color="text.secondary">{a.d}</Typography>
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </Stack>
        </Container>
      )}

      {activeSection === 'schedule' && (
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Typography variant="h4" gutterBottom>Today's Schedule</Typography>
          <Stack spacing={1.5}>
            {[{ t: '09:00 AM', d: 'Physics - Mr. Iyer' }, { t: '10:00 AM', d: 'Chemistry - Mrs. Bose' }, { t: '11:00 AM', d: 'Biology - Mr. Francis' }, { t: '12:00 PM', d: 'GK / Moral Science - Ms. Rao' }, { t: '01:30 PM', d: 'Math - Mr. Sharma' }].map((s, i) => (
              <Grow in timeout={600 + i * 120} key={s.t}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">{s.t}</Typography>
                    <Typography color="text.secondary">{s.d}</Typography>
                  </CardContent>
                </Card>
              </Grow>
            ))}
          </Stack>
        </Container>
      )}

      {activeSection === 'profile' && (
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Typography variant="h4" gutterBottom>Your Profile</Typography>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography><strong>Name:</strong> Student Name</Typography>
                <Typography><strong>Class:</strong> XII-A</Typography>
                <Typography><strong>Roll No:</strong> 23</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      )}

      {activeSection === 'contact' && (
        <Container sx={{ py: { xs: 6, md: 8 } }}>
          <Typography variant="h4" gutterBottom>Contact</Typography>
          <Typography>For support, contact the school office at <a href="mailto:info@yourschool.com">info@yourschool.com</a> or call +1 234 567 8900.</Typography>
        </Container>
      )}
    </Box>
  );
};

export default StudentLanding;
