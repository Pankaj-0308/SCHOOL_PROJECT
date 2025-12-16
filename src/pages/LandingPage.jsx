import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Stack, Card, CardContent, CardActionArea, Fade, Grow, Dialog, DialogContent, IconButton, CardMedia } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import api, { API_BASE } from '../api/client';

const features = [
  {
    title: 'Smart Admissions',
    desc: 'Online tests, document submission, and automated results.',
    route: '/admission',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Dashboards',
    desc: 'Dedicated dashboards for students, teachers, and admins.',
    route: '/features',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Results & Gallery',
    desc: 'View academic results and explore campus life in pictures.',
    route: '/results',
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Careers',
    desc: 'Browse and manage job opportunities at our school.',
    route: '/jobs',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Contact & Directions',
    desc: 'Get in touch and find the best route to our campus.',
    route: '/contact',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Student Life',
    desc: 'Discover the vibrant community and activities.',
    route: '/gallery',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
  }
];

const facilities = [
  {
    title: 'Library',
    desc: 'A peaceful space with a rich collection of books, journals, and digital resources for all grades.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Digital Lab',
    desc: 'Modern computers and high-speed internet for coding, research, and interactive learning.',
    image: API_BASE.replace('/api', '') + '/site-images/digital_lab.jpg',
  },
  {
    title: 'Chemistry Lab',
    desc: 'Well-equipped lab for safe, hands-on experiments and experiential learning in chemistry.',
    image: 'https://images.unsplash.com/photo-1581091215367-59ab6b52d1b4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Physics Lab',
    desc: 'Apparatus and setups for exploring mechanics, optics, electricity, and modern physics concepts.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Biology Lab',
    desc: 'Microscopy, models, and specimens to discover the living world through observation and practice.',
    image: 'https://images.unsplash.com/photo-1559757175-08c5f5f6895a?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Sports Facilities',
    desc: 'Playgrounds and indoor spaces for games, athletics, and fitness programs across age groups.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const heroImage = API_BASE.replace('/api', '') + '/site-images/school.jpg';
  const [viewer, setViewer] = useState({ open: false, item: null });




  return (
    <Box sx={{ backgroundColor: '#eef6ff' }}>
      <Box sx={{
        position: 'relative',
        color: 'common.white',
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 10 },
        overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(2,6,23,0.55), rgba(2,6,23,0.35)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <Container>
          <Fade in timeout={800}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography variant="h2" sx={{ maxWidth: 900 }}>
                Welcome to Our School
              </Typography>
              <Typography variant="h6" sx={{ maxWidth: 900, color: 'rgba(255,255,255,0.88)' }}>
                Learn, grow, and achieve in a vibrant community. Join our digital campus to manage admissions, academics, and more.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" onClick={() => navigate('/signup')}>Get Started</Button>
                <Button variant="outlined" color="inherit" onClick={() => navigate('/admission')}>Start Admission</Button>
              </Stack>
            </Stack>
          </Fade>
        </Container>
        <Box sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(1200px 400px at 50% -200px, rgba(59,130,246,0.15), transparent)',
          pointerEvents: 'none',
        }} />
      </Box>

      {/* Facilities Section */}
      <Box sx={{
        background: '#eef6ff',
        backgroundImage: `linear-gradient(rgba(2,6,23,0.25), rgba(2,6,23,0.25)), url(${API_BASE.replace('/api', '') + '/site-images/school2.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 2, md: 6 } }}>
          <Fade in timeout={700}>
            <Stack sx={{ mb: 3 }} alignItems="center" textAlign="center">
              <Typography variant="h4" sx={{ color: 'common.white' }}>Our Facilities</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 800 }}>
                We provide modern learning spaces and resources to nurture curiosity, creativity, and overall development.
              </Typography>
            </Stack>
          </Fade>
          {/* Desktop: 3 rows with left/right columns; Mobile: stacked list */}
          <Box
            sx={{
              minHeight: { xs: 'auto', md: '90vh' },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '300px 1fr 300px' },
              gridTemplateRows: { xs: 'auto', md: 'repeat(3, 1fr)' },
              alignItems: 'center',
              gap: { xs: 2, md: 2 },
              px: { xs: 0, md: 2 },
            }}
          >
            {facilities.slice(0, 3).map((f, i) => (
              <Grow in timeout={500 + i * 120} key={`left-${f.title}`}>
                <Card
                  sx={{
                    gridColumn: { md: '1' },
                    gridRow: { md: i + 1 },
                    borderRadius: 3,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                    bgcolor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.45)',
                    transition: 'background-color 0.2s, transform 0.12s',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)', transform: 'translateY(-2px)' },
                  }}
                >
                  <CardActionArea onClick={() => setViewer({ open: true, item: f })}>
                    <CardContent sx={{ color: 'rgba(255,255,255,0.95)' }}>
                      <Typography variant="h6" sx={{ mb: 1, color: 'rgba(255,255,255,0.98)' }}>{f.title}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.82)' }}>{f.desc}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            ))}

            {facilities.slice(3, 6).map((f, i) => (
              <Grow in timeout={600 + i * 120} key={`right-${f.title}`}>
                <Card
                  sx={{
                    gridColumn: { md: '3' },
                    gridRow: { md: i + 1 },
                    borderRadius: 3,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                    bgcolor: 'transparent',
                    border: '1px solid rgba(255,255,255,0.45)',
                    transition: 'background-color 0.2s, transform 0.12s',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)', transform: 'translateY(-2px)' },
                  }}
                >
                  <CardActionArea onClick={() => setViewer({ open: true, item: f })}>
                    <CardContent sx={{ color: 'rgba(255,255,255,0.95)' }}>
                      <Typography variant="h6" sx={{ mb: 1, color: 'rgba(255,255,255,0.98)' }}>{f.title}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.82)' }}>{f.desc}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            ))}
          </Box>
        </Container>
      </Box>



      <Box sx={{ background: '#eef6ff' }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 2, md: 4 } }}>
          <Stack sx={{ mb: 2 }} alignItems="center" textAlign="center">
            <Typography variant="h4">Explore More</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 800 }}>
              Quick access to key areas of the platform for students, teachers, and visitors.
            </Typography>
          </Stack>

          <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 10px 24px rgba(16,24,40,0.08)', p: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 3,
              }}
            >
              {features.map((f, i) => (
                <Grow in timeout={500 + i * 120} key={f.title}>
                  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 6px 18px rgba(16,24,40,0.08)', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }} onClick={() => navigate(f.route)}>
                      <CardMedia component="img" image={f.image} alt={f.title} sx={{ height: 170, objectFit: 'cover' }} />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>{f.title}</Typography>
                        <Typography color="text.secondary">{f.desc}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grow>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Feature detail overlay viewer */}
      <Dialog
        open={viewer.open}
        onClose={() => setViewer({ open: false, item: null })}
        fullWidth
        maxWidth="lg"
        BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.85)' } }}
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      >
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <IconButton color="default" onClick={() => setViewer({ open: false, item: null })} sx={{ bgcolor: 'rgba(255,255,255,0.24)' }}>
            <CloseIcon htmlColor="#fff" />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          {viewer.item && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' }, gap: 0, bgcolor: 'transparent' }}>
              <Box sx={{ bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={viewer.item.image}
                  alt={viewer.item.title}
                  style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                />
              </Box>
              <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'rgba(255,255,255,0.98)' }}>
                <Typography variant="h5" sx={{ mb: 1 }}>{viewer.item.title}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>{viewer.item.desc}</Typography>
                <Stack direction="row" spacing={1}>
                  {viewer.item.route && (
                    <Button variant="contained" onClick={() => { setViewer({ open: false, item: null }); navigate(viewer.item.route); }}>Open</Button>
                  )}
                  <Button variant="outlined" color="inherit" onClick={() => setViewer({ open: false, item: null })}>Close</Button>
                </Stack>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>


    </Box>
  );
};

export default LandingPage;