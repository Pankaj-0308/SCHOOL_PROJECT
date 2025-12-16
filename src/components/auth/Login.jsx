import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  IconButton,
  InputAdornment,
  Fade,
  Grow
} from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import './Login.css';

const API = 'http://localhost:5000/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role: routeRole } = useParams();
  const { login: setAuthUser } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const normalizedRole = routeRole ? String(routeRole).toLowerCase() : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      // If on a role-specific route, enforce matching role
      if (normalizedRole && data.role !== normalizedRole) {
        setError(`This page only allows ${normalizedRole} login. You attempted to log in as ${data.role}.`);
        setLoading(false);
        return;
      }
      // Persist token and role for authenticated routes
      localStorage.setItem('currentUser', JSON.stringify({
        token: data.token,
        role: data.role,
        verified: data.verified,
        classAssigned: data.classAssigned,
        studentId: data.studentId,
        email: formData.email,
      }));
      // Update context immediately so ProtectedRoute detects auth without a reload
      setAuthUser({
        token: data.token,
        role: data.role,
        verified: data.verified,
        classAssigned: data.classAssigned,
        studentId: data.studentId,
        email: formData.email,
      });
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (data.role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    if (normalizedRole === 'student') return <SchoolIcon sx={{ fontSize: 40, color: '#2575fc' }} />;
    if (normalizedRole === 'teacher') return <PersonIcon sx={{ fontSize: 40, color: '#f50057' }} />;
    if (normalizedRole === 'admin') return <LockIcon sx={{ fontSize: 40, color: '#ff9800' }} />;
    return <SchoolIcon sx={{ fontSize: 40, color: '#6a11cb' }} />;
  };

  return (
    <Box className="login-container">
      <Container component="main" maxWidth="xs">
        <Grow in={true} timeout={800}>
          <Paper
            elevation={6}
            className="login-paper"
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            <Box sx={{
              mb: 2,
              p: 2,
              borderRadius: '50%',
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getRoleIcon()}
            </Box>

            <Typography component="h1" variant="h5" sx={{ fontWeight: 800, color: '#1a237e', mb: 1, letterSpacing: '-0.5px' }}>
              Welcome Back
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              {normalizedRole
                ? `Please sign in to your ${normalizedRole} account`
                : 'Sign in to access your dashboard'}
            </Typography>

            {!normalizedRole && (
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                {['student', 'teacher', 'admin'].map((role) => (
                  <Button
                    key={role}
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/login/${role}`)}
                    sx={{
                      borderRadius: 10,
                      textTransform: 'capitalize',
                      borderColor: 'rgba(0,0,0,0.12)',
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: '#2575fc',
                        color: '#2575fc',
                        bgcolor: 'rgba(37, 117, 252, 0.04)'
                      }
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </Box>
            )}

            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#2575fc',
                    },
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#2575fc',
                    },
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                className="submit-button"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #2575fc 30%, #6a11cb 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1c5cc9 30%, #5e0eb5 90%)',
                    transform: 'scale(1.02)'
                  }
                }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>

              <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/signup')}
                    sx={{
                      color: '#2575fc',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Create Account
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grow>
      </Container>
    </Box>
  );
};

export default Login;