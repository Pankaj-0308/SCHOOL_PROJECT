import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Stack, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_BASE } from '../../api/client';

const NavBar = () => {
  const { isLoggedIn, role, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  const publicLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Features', to: '/features' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Results', to: '/results' },
    { label: 'Jobs', to: '/jobs' },
    { label: 'Contact', to: '/contact' },
  ];

  const homeOnly = [{ label: 'Home', to: '/' }];

  const roleLinksMap = {
    admin: [
      { label: 'Dashboard', to: '/admin/dashboard' },
      { label: 'Admissions', to: '/admin/admissions' },
      { label: 'Students', to: '/admin/students' },
      { label: 'Teachers', to: '/admin/teachers' },
      { label: 'Add Teacher', to: '/admin/teachers/add' },
      { label: 'Jobs', to: '/admin/jobs' },
    ],
    teacher: [
      { label: 'Dashboard', to: '/teacher/dashboard' },
      { label: 'Schedule', to: '/teacher/schedule' },
      { label: 'Assignments', to: '/teacher/assignments' },
      { label: 'My Students', to: '/teacher/students' },
    ],
    student: [
      { label: 'Dashboard', to: '/student/dashboard' },
      { label: 'Time Table', to: '/student/timetable' },
      { label: 'Submit', to: '/student/submit' },
      { label: 'Stats', to: '/student/stats' },
      { label: 'Papers', to: '/student/question-papers' },
      { label: 'Papers', to: '/student/question-papers' },
    ],
    general: [
      { label: 'Admission', to: '/admission' },
    ],
  };

  const roleLinks = isLoggedIn ? (roleLinksMap[role] || []) : [];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2, minHeight: 80 }}>
          {/* Logo Section */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 4,
              textDecoration: 'none',
              transform: 'scale(1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <img
              src={API_BASE.replace('/api', '') + '/site-images/logo.jpg'}
              alt="School Logo"
              style={{
                height: 42,
                width: 42,
                borderRadius: 10,
                marginRight: 12,
                boxShadow: theme.shadows[2]
              }}
            />
            <Box>
              <Typography
                variant="h6"
                className="gradient-text"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  fontSize: '1.25rem'
                }}
              >
                Bal Vikas
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                Public School
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Links */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {(isLoggedIn ? homeOnly : publicLinks).map((item) => (
              <Button
                key={item.to}
                component={RouterLink}
                to={item.to}
                variant={isActive(item.to) ? "contained" : "text"}
                color={isActive(item.to) ? "primary" : "inherit"}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 50,
                  fontSize: '0.9rem',
                  color: isActive(item.to) ? 'common.white' : 'text.secondary',
                  '&:hover': {
                    color: isActive(item.to) ? 'common.white' : 'primary.main',
                    backgroundColor: isActive(item.to) ? 'primary.main' : alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            {roleLinks.map((item) => (
              <Button
                key={item.to}
                component={RouterLink}
                to={item.to}
                variant={isActive(item.to) ? "contained" : "text"}
                color={isActive(item.to) ? "primary" : "inherit"}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 50,
                  fontSize: '0.9rem',
                  color: isActive(item.to) ? 'common.white' : 'text.secondary',
                  '&:hover': {
                    color: isActive(item.to) ? 'common.white' : 'primary.main',
                    backgroundColor: isActive(item.to) ? 'primary.main' : alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Auth Buttons */}
          <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
            {!isLoggedIn ? (
              <>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="text"
                  color="primary"
                >
                  Sign Up
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ px: 3 }}
                >
                  Login
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="error"
                onClick={logout}
                sx={{
                  borderRadius: 50,
                  borderColor: alpha(theme.palette.error.main, 0.3),
                  '&:hover': {
                    borderColor: theme.palette.error.main,
                    backgroundColor: alpha(theme.palette.error.main, 0.05)
                  }
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
