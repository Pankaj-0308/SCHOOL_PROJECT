import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Fade, Grow, Box, Avatar, Divider, Paper, Stack } from '@mui/material';
import { API_BASE } from '../api/client';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';

const authorities = [
  { name: 'Dr. A. Sharma', role: 'Principal', img: '', bio: 'Leading with vision and 20 years of educational experience.' },
  { name: 'Ms. R. Verma', role: 'Vice Principal', img: '', bio: 'Dedicated to curriculum innovation and student welfare.' },
  { name: 'Mr. K. Iyer', role: 'Administrator', img: '', bio: 'Ensuring seamless operations and state-of-the-art facilities.' },
  { name: 'Prof. N. Singh', role: 'Head of Department', img: '', bio: 'Fostering academic excellence across all disciplines.' },
];

const achievements = [
  { title: '95% Board Pass Rate', detail: 'Consistently topping district charts for the last 5 years.', icon: <SchoolIcon fontSize="inherit" /> },
  { title: 'National Olympiads', detail: '3 Gold medals in International Math & Science Olympiads 2024.', icon: <EmojiEventsIcon fontSize="inherit" /> },
  { title: 'Sports Excellence', detail: 'State champions in Football and Basketball.', icon: <SportsSoccerIcon fontSize="inherit" /> },
  { title: 'Cultural Hub', detail: 'Award-winning drama and debate society.', icon: <TheaterComedyIcon fontSize="inherit" /> },
];

const stats = [
  { k: 'Students', v: '1500+' },
  { k: 'Faculty', v: '120+' },
  { k: 'Years', v: '35+' },
  { k: 'Awards', v: '60+' },
];

const About = () => (
  <>
    {/* Modern Hero Section */}
    <Box sx={{
      position: 'relative',
      color: 'common.white',
      py: { xs: 12, md: 24 },
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.7)), url(${API_BASE.replace('/api', '') + '/site-images/school3.jpg'})`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center',
    }}>
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Fade in timeout={800}>
          <Box>
            <Typography variant="h1" sx={{
              fontSize: { xs: '3rem', md: '6rem' },
              fontWeight: 800,
              letterSpacing: '-0.02em',
              mb: 2,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              Our Legacy
            </Typography>
            <Typography variant="h5" sx={{
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 400,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Shaping minds and building character since 1988.
              A tradition of excellence, holistic development, and moral values.
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 } }}>

      {/* Principal's Message - New Section */}
      <Fade in timeout={1000}>
        <Grid container spacing={8} alignItems="center" sx={{ mb: 16 }}>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 20, left: 20, right: -20, bottom: -20, bgcolor: 'secondary.main', borderRadius: '50%', opacity: 0.1, zIndex: 0 }} />
              <Avatar
                sx={{
                  width: { xs: 200, md: 350 },
                  height: { xs: 200, md: 350 },
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: { xs: '5rem', md: '7rem' },
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                  border: '8px solid white',
                  zIndex: 1
                }}
              >
                {authorities[0].name.charAt(0)}
              </Avatar>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="overline" color="secondary" sx={{ fontWeight: 800, letterSpacing: 2 }}>
              FROM THE DESK OF THE PRINCIPAL
            </Typography>
            <Typography variant="h3" sx={{ mb: 4, mt: 1, fontWeight: 800, color: '#1e293b' }}>
              Inspiring Minds, <br /> Shaping Futures.
            </Typography>
            <Typography paragraph sx={{ fontSize: '1.25rem', lineHeight: 1.8, color: '#475569', fontStyle: 'italic', mb: 4 }}>
              "Education is not just about academic learning; it is about character building and holistic growth.
              At our school, we strive to create an environment where every student discovers their potential and
              learns to lead with empathy and integrity."
            </Typography>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>{authorities[0].name}</Typography>
              <Typography variant="body2" color="text.secondary">Principal</Typography>
            </Box>
          </Grid>
        </Grid>
      </Fade>

      <Divider sx={{ my: 8, borderColor: 'divider' }} />

      {/* Stats Section with Glassmorphism */}
      <Paper elevation={0} sx={{
        p: { xs: 4, md: 8 },
        mb: 16,
        borderRadius: 5,
        background: `linear-gradient(135deg, ${'#2563eb'} 0%, ${'#4f46e5'} 100%)`,
        color: 'white',
        boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.4)'
      }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {stats.map((s, i) => (
            <Grid item xs={6} md={3} key={s.k} sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{s.v}</Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: 1 }}>{s.k}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Leadership Section */}
      <Box sx={{ mb: 16 }}>
        <Stack spacing={2} textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b' }}>Our Leadership</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}>
            Meet the dedicated team guiding our institution towards excellence.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {authorities.map((a, i) => (
            <Grid item xs={12} sm={6} md={3} key={a.role}>
              <Grow in timeout={800 + i * 200}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  boxShadow: 'none',
                  bgcolor: 'transparent',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Avatar
                    sx={{ width: 140, height: 140, mb: 3, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.15)', bgcolor: 'white', color: 'primary.main', fontSize: '3rem', border: '4px solid white' }}
                  >
                    {a.name.charAt(0)}
                  </Avatar>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>{a.name}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 1 }}>{a.role}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{a.bio}</Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Achievements Grid */}
      <Box>
        <Typography variant="h3" sx={{ mb: 6, fontWeight: 800, color: '#1e293b' }}>Recent Highlights</Typography>
        <Grid container spacing={3}>
          {achievements.map((item, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Grow in timeout={1000 + i * 200}>
                <Paper sx={{
                  p: 4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 3,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'primary.main', transform: 'translateX(8px)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }
                }}>
                  <Box sx={{ fontSize: '2.5rem', color: 'primary.main', p: 1.5, bgcolor: 'primary.50', borderRadius: 2, display: 'flex' }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>{item.title}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>{item.detail}</Typography>
                  </Box>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Box>

    </Container>
  </>
);

export default About;
