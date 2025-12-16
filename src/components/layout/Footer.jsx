import React from 'react';
import { Container, Box, Typography, Grid, Link, Stack, Divider, IconButton } from '@mui/material';
import { API_BASE } from '../../api/client';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
        borderTop: '1px solid',
        borderColor: 'rgba(255,255,255,0.1)',
        pt: 8,
        pb: 4,
        color: 'rgba(255,255,255,0.9)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Brand Column */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="img"
                  src={API_BASE.replace('/api', '') + '/site-images/logo.jpg'}
                  alt="Logo"
                  sx={{ height: 40, borderRadius: 1 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', color: '#fff' }}>
                  Bal Vikas Public School
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 300 }}>
                Empowering students with knowledge, character, and skills for a brighter tomorrow. Join our vibrant community of learners.
              </Typography>
              <Stack direction="row" spacing={1}>
                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                  <IconButton key={index} size="small" sx={{
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': { color: '#3b82f6', bgcolor: 'rgba(59,130,246,0.1)' }
                  }}>
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Links Columns */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5, color: '#fff' }}>
              Explore
            </Typography>
            <Stack spacing={1.5}>
              {['Admissions', 'Results', 'Careers', 'Directions'].map((text) => (
                <Link
                  key={text}
                  href={`/${text.toLowerCase()}`}
                  underline="none"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#3b82f6', transform: 'translateX(2px)' },
                    transition: 'all 0.2s'
                  }}
                >
                  {text}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5, color: '#fff' }}>
              Resources
            </Typography>
            <Stack spacing={1.5}>
              {[{ t: 'Events & Gallery', l: '/gallery' }, { t: 'Academic Calendar', l: '#' }, { t: 'School Facilities', l: '#' }, { t: 'Transport Policy', l: '#' }].map((item) => (
                <Link
                  key={item.t}
                  href={item.l}
                  underline="none"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#3b82f6', transform: 'translateX(2px)' },
                    transition: 'all 0.2s'
                  }}
                >
                  {item.t}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Column */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5, color: '#fff' }}>
              Get in Touch
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" display="block" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>ADDRESS</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>123 Education Lane, Knowledge City, State 400001</Typography>
              </Box>
              <Box>
                <Typography variant="caption" display="block" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>CONTACT</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>info@balvikas.edu</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>+91 98765 43210</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 8, mb: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Bal Vikas Public School. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((text) => (
              <Link key={text} href="#" underline="hover" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                {text}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
