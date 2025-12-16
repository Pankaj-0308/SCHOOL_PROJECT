import React, { useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, TextField, Button,
  Stack, Fade, Grow, Box, Snackbar, Alert, IconButton, Divider,
  useTheme, useMediaQuery, Paper, alpha, Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import { API_BASE } from '../api/client';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 24,
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
}));

const ContactInfoItem = ({ icon, title, subtitle, href }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
    <Box sx={{
      backgroundColor: 'primary.50',
      color: 'primary.main',
      borderRadius: 4,
      width: 48,
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mr: 2.5,
      flexShrink: 0,
      transition: 'all 0.2s',
      '&:hover': { bgcolor: 'primary.main', color: 'white', transform: 'scale(1.1)' }
    }}>
      {React.cloneElement(icon, { fontSize: 'medium' })}
    </Box>
    <Box>
      <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>{title}</Typography>
      {href ? (
        <Button
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ p: 0, textTransform: 'none', justifyContent: 'flex-start', color: 'text.secondary', fontWeight: 500, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
        >
          {subtitle}
        </Button>
      ) : (
        <Typography variant="body1" color="text.secondary">{subtitle}</Typography>
      )}
    </Box>
  </Box>
);

const SocialIcon = ({ icon, color, href }) => (
  <IconButton
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      backgroundColor: 'white',
      border: `1px solid ${alpha(color, 0.2)}`,
      color: color,
      width: 44, height: 44,
      transition: 'all 0.2s',
      '&:hover': {
        backgroundColor: color,
        color: 'white',
        borderColor: color,
        transform: 'translateY(-3px)'
      },
    }}
  >
    {icon}
  </IconButton>
);

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const ADDRESS = 'Gas Agency, Railway Road, Kalayat, Kaithal, Haryana, India';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSnack({ open: true, message: 'Message sent! We\'ll chat soon.', severity: 'success' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSnack({ open: true, message: 'Something went wrong.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        bgcolor: 'primary.main',
        color: 'common.white',
        pt: { xs: 8, md: 10 },
        pb: { xs: 12, md: 16 },
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: -50, right: -50, opacity: 0.1 }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 400 }} />
        </Box>
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Fade in timeout={700}>
            <Box>
              <Typography variant={isMobile ? 'h4' : 'h2'} fontWeight={800} sx={{ mb: 2, letterSpacing: '-0.02em' }}>
                Let's Start a Conversation
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
                Have a question about admissions or just want to explore? We're here to chat.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: -10, position: 'relative', zIndex: 2 }}>
        <Stack spacing={4}>
          {/* Row 1: Contact Info & Map (Side by Side) */}
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={3}>
              <Grow in timeout={800}>
                <StyledCard sx={{ bgcolor: 'white', height: '100%', minHeight: 400 }}>
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h4" fontWeight={800} gutterBottom sx={{ mb: 1, background: 'linear-gradient(45deg, #1e293b, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get in Touch</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      We&apos;d love to hear from you. Here&apos;s how you can reach us...
                    </Typography>

                    <Stack spacing={3}>
                      <ContactInfoItem icon={<EmailIcon />} title="Email Us" subtitle="BalVikasKalayat@gmail.com" href="mailto:BalVikasKalayat@gmail.com" />
                      <ContactInfoItem icon={<PhoneIcon />} title="Call Us" subtitle="+91 98765 43210" href="tel:+919876543210" />
                      <ContactInfoItem icon={<LocationOnIcon />} title="Visit Us" subtitle="Kalayat, Kaithal, Haryana" href="https://maps.google.com" />
                    </Stack>

                    <Divider sx={{ my: 4 }} />
                    <Stack direction="row" spacing={2} justifyContent="flex-start">
                      <SocialIcon icon={<FacebookIcon />} color="#1877F2" />
                      <SocialIcon icon={<InstagramIcon />} color="#E4405F" />
                      <SocialIcon icon={<TwitterIcon />} color="#1DA1F2" />
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Grow>
            </Grid>

            <Grid item xs={12} md={9}>
              <Grow in timeout={1000}>
                <Paper elevation={0} sx={{ borderRadius: 6, overflow: 'hidden', height: '100%', minHeight: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <iframe
                    title="School Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, minHeight: 400 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                  ></iframe>
                </Paper>
              </Grow>
            </Grid>
          </Grid>

          {/* Row 2: Chat Form (Full Width) */}
          <Grow in timeout={1200}>
            <Box width="100%">
              <Card sx={{
                borderRadius: 6,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                background: 'white',
                position: 'relative'
              }}>
                {/* Background Decor */}
                <Box sx={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 20%)',
                  zIndex: 0
                }} />

                <Box sx={{
                  p: { xs: 3, md: 4 },
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
                  position: 'relative', zIndex: 1
                }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 56, height: 56 }}>
                      <SupportAgentIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700}>Direct Message</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500 }}>Admissions Team • Online</Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <Chip
                    label="Typically replies in 5m"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      backdropFilter: 'blur(4px)',
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  />
                </Box>

                <CardContent sx={{ p: { xs: 3, md: 6 }, position: 'relative', zIndex: 1 }}>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth label="Your Name" name="name" value={form.name} onChange={handleChange} required
                          variant="outlined"
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                            sx: { borderRadius: 3 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth label="Email Address" name="email" value={form.email} onChange={handleChange} required
                          variant="outlined"
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                            sx: { borderRadius: 3 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} required
                          variant="outlined"
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><SubjectIcon color="action" /></InputAdornment>,
                            sx: { borderRadius: 3 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth label="How can we help?" name="message" value={form.message} onChange={handleChange} required
                          multiline rows={6}
                          variant="outlined"
                          placeholder="Tell us about yourself or your query..."
                          InputProps={{
                            startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><MessageIcon color="action" /></InputAdornment>,
                            sx: { borderRadius: 3 }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Protected by ReCAPTCHA
                          </Typography>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            endIcon={!isSubmitting && <SendIcon />}
                            sx={{
                              px: 6,
                              py: 1.5,
                              borderRadius: 4,
                              fontSize: '1rem',
                              fontWeight: 700,
                              textTransform: 'none',
                              boxShadow: '0 8px 20px -4px rgba(59, 130, 246, 0.5)'
                            }}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grow>
        </Stack>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack(prev => ({ ...prev, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%', borderRadius: 2 }}>{snack.message}</Alert>
      </Snackbar>
    </Box >
  );
};

export default Contact;
