import React, { useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Stack, Fade, Grow, Box, Dialog, DialogActions, Button, CardMedia, CardActionArea, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_BASE } from '../api/client';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkIcon from '@mui/icons-material/Work';

const featuresData = [
  {
    t: 'Role-based Panels',
    d: 'Tailored dashboards for Students, Teachers, and Admins.',
    img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    icon: <GroupsIcon fontSize="large" />,
    fullDesc: 'Experience a personalized interface designed for your specific role. Students can track their academic journey, teachers can manage classes efficiently, and administrators have full control over the institution\'s operations, all from a secure, dedicated dashboard.'
  },
  {
    t: 'Smart Admissions',
    d: 'Seamless online admission process with automated tracking.',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    icon: <AssignmentIcon fontSize="large" />,
    fullDesc: 'Say goodbye to paperwork. Our digitized admission system allows for easy application submission, document uploading, and real-time status tracking. Automated entrance test scheduling ensures a smooth intake process.'
  },
  {
    t: 'Live Attendance & Grades',
    d: 'Real-time performance tracking for parents and students.',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    icon: <SpeedIcon fontSize="large" />,
    fullDesc: 'Stay updated with instant attendance notifications and detailed grade reports. Our comprehensive gradebook provides insights into subject-wise performance, helping identify areas for improvement early on.'
  },
  {
    t: 'Digital Notice Board',
    d: 'Instant announcements for the entire school community.',
    img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80',
    icon: <SecurityIcon fontSize="large" />,
    fullDesc: 'Never miss an update. The digital notice board ensures that crucial announcements, exam schedules, and holiday notifications reach the right audience instantly, whether it\'s a specific class or the entire school.'
  },
  {
    t: 'Results & Achievements',
    d: 'Celebrating success with digital report cards and galleries.',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    icon: <EmojiEventsIcon fontSize="large" />,
    fullDesc: 'Access detailed examination results from anywhere. The integrated gallery showcases the vibrant school life, capturing moments from sports days, cultural fests, and award ceremonies.'
  },
  {
    t: 'Career Opportunities',
    d: 'Join our faculty through our dedicated careers portal.',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    icon: <WorkIcon fontSize="large" />,
    fullDesc: 'We are always looking for passionate educators. Our careers portal lists current openings and simplifies the application process, allowing aspiring teachers to become part of our prestigious institution.'
  },
];

const Features = () => {
  const [open, setOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleOpen = (feature) => {
    setSelectedFeature(feature);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedFeature(null), 200);
  };

  return (
    <>
      <Box sx={{
        position: 'relative',
        color: 'common.white',
        py: { xs: 12, md: 24 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8)), url(${API_BASE.replace('/api', '') + '/site-images/school2.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Abstract Background Shapes */}
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', filter: 'blur(80px)', opacity: 0.15 }} />
        <Box sx={{ position: 'absolute', bottom: 50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'linear-gradient(45deg, #06b6d4, #3b82f6)', filter: 'blur(60px)', opacity: 0.1 }} />

        <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Fade in timeout={800}>
            <Stack spacing={3} alignItems="center">
              <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 3, color: 'primary.light', textTransform: 'uppercase' }}>
                Why Choose Us
              </Typography>
              <Typography variant="h1" sx={{
                fontSize: { xs: '2.5rem', md: '5rem' },
                fontWeight: 900,
                lineHeight: 1.1,
                background: 'linear-gradient(to right, #fff 20%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Redefining <br /> Education
              </Typography>
              <Typography variant="h5" sx={{ maxWidth: 700, color: '#94a3b8', fontWeight: 400, lineHeight: 1.6 }}>
                An all-in-one ecosystem designed to empower students, teachers, and parents with cutting-edge tools and resources.
              </Typography>
            </Stack>
          </Fade>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 8, md: 16 }, mt: -12, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {featuresData.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={f.t}>
              <Grow in timeout={500 + i * 150}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  overflow: 'visible', // For hover effect
                  bgcolor: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    '& .icon-box': {
                      transform: 'scale(1.1) rotate(5deg)',
                      bgcolor: 'primary.main',
                      color: 'white'
                    }
                  }
                }}>
                  <CardActionArea onClick={() => handleOpen(f)} sx={{ flexGrow: 1, p: 1 }}>
                    <Box sx={{ position: 'relative', height: 220, borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                      <CardMedia
                        component="img"
                        height="100%"
                        image={f.img}
                        alt={f.t}
                        sx={{ transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.05)' } }}
                      />
                      <Box className="icon-box" sx={{
                        position: 'absolute',
                        bottom: -24,
                        right: 24,
                        width: 64,
                        height: 64,
                        borderRadius: '20px',
                        bgcolor: 'white',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        transition: 'all 0.4s ease'
                      }}>
                        {f.icon}
                      </Box>
                    </Box>
                    <CardContent sx={{ px: 2, pb: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#1e293b' }}>{f.t}</Typography>
                      <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.6 }}>{f.d}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Feature Details Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Grow}
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        {selectedFeature && (
          <Grid container>
            <Grid item xs={12} md={5} sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="100%"
                image={selectedFeature.img}
                alt={selectedFeature.t}
                sx={{ minHeight: 300, objectFit: 'cover' }}
              />
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                display: { xs: 'block', md: 'none' }
              }} />
            </Grid>
            <Grid item xs={12} md={7} sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>{selectedFeature.t}</Typography>
                <IconButton onClick={handleClose} size="small" sx={{ bgcolor: 'grey.100' }}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Typography variant="body1" paragraph sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, flexGrow: 1 }}>
                {selectedFeature.fullDesc}
              </Typography>

              <Box sx={{ mt: 3, p: 2.5, bgcolor: '#f0f9ff', borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon fontSize="small" /> Key Benefit
                </Typography>
                <Typography variant="body2" color="#334155">
                  Designed to streamline operations and enhance the learning experience for everyone involved.
                </Typography>
              </Box>

              <DialogActions sx={{ p: 0, mt: 4 }}>
                <Button onClick={handleClose} variant="contained" size="large" fullWidth sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}>
                  Explore Feature
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        )}
      </Dialog>
    </>
  );
};

export default Features;
