import React, { useState } from 'react';
import {
  Container, Typography, Paper, Stack, Fade, Card, Box, Tabs, Tab, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Avatar, Grid, Divider
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';

const years = ['2024', '2023', '2022'];

const DUMMY_TOPPERS = {
  '10': {
    '2024': [
      { name: 'Aarav Sharma', score: '98.5%', img: '' },
      { name: 'Priya Singh', score: '97.2%', img: '' },
      { name: 'Rohan Gupta', score: '96.8%', img: '' },
    ],
    '2023': [
      { name: 'Ishita Patel', score: '99.0%', img: '' },
      { name: 'Rahul Verma', score: '97.5%', img: '' },
    ],
    '2022': [
      { name: 'Kavya Reddy', score: '98.2%', img: '' },
    ]
  },
  '12': {
    '2024': [
      { name: 'Sanya Malhotra', score: '99.2% (Science)', img: '' },
      { name: 'Vikram Singh', score: '98.0% (Commerce)', img: '' },
    ],
    '2023': [
      { name: 'Neha Gupta', score: '98.8% (Science)', img: '' },
    ],
    '2022': [
      { name: 'Amit Kumar', score: '97.6% (Arts)', img: '' },
    ]
  }
};

const ResultChecker = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('This is a demo. In a real app, this would show the specific student result.');
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Card sx={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        p: 4,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: -20, left: -20, opacity: 0.1 }}>
          <SchoolIcon sx={{ fontSize: 150 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Check Your Result</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
          Enter your Roll Number and select your Class to view your detailed marksheet.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<SearchIcon />}
          onClick={() => setOpen(true)}
          sx={{ px: 4, py: 1.5, borderRadius: 2 }}
        >
          Check Result Now
        </Button>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>View Result</DialogTitle>
        <form onSubmit={handleCheck}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField label="Roll Number" fullWidth required variant="outlined" />
              <TextField label="Academic Year" select SelectProps={{ native: true }} fullWidth>
                <option value="2024">2023-2024</option>
                <option value="2023">2022-2023</option>
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Searching...' : 'Get Result'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

const Results = () => {
  const [tabValue, setTabValue] = useState('10'); // '10' or '12'

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Fade in timeout={700}>
        <Stack sx={{ mb: 5, textAlign: 'center' }} alignItems="center">
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2, background: '-webkit-linear-gradient(45deg, #0F172A 30%, #3B82F6 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Academic Excellence
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="md">
            Celebrating the outstanding achievements of our students in Board Examinations.
          </Typography>
        </Stack>
      </Fade>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={6}>
          {/* Section 1: Result Checker (Centered) */}
          <Fade in timeout={800}>
            <Box>
              <ResultChecker />
            </Box>
          </Fade>

          {/* Section 2: Results List */}
          <Fade in timeout={1000}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h5" fontWeight={700}>Previous Year Results</Typography>
                  <Typography variant="body2" color="text.secondary">Use the tabs to switch classes</Typography>
                </Box>
                <Tabs
                  value={tabValue}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  indicatorColor="secondary"
                  textColor="secondary"
                  sx={{
                    '.MuiTab-root': { minHeight: 48, borderRadius: 2, mx: 0.5 },
                    '.Mui-selected': { bgcolor: 'secondary.50' }
                  }}
                >
                  <Tab icon={<SchoolIcon fontSize="small" />} iconPosition="start" label="Class 10" value="10" />
                  <Tab icon={<EmojiEventsIcon fontSize="small" />} iconPosition="start" label="Class 12" value="12" />
                </Tabs>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ minHeight: 400 }}>
                {years.map((year) => {
                  const toppers = DUMMY_TOPPERS[tabValue][year] || [];
                  return (
                    <Box key={year} sx={{ mb: 5 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Chip label={year} color="primary" sx={{ fontWeight: 'bold', fontSize: '1rem', px: 1 }} />
                        <Typography variant="h6" fontWeight={700} color="text.secondary">Toppers</Typography>
                      </Stack>

                      <Grid container spacing={3}>
                        {toppers.map((student, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 3,
                              border: '1px solid #e2e8f0',
                              boxShadow: 'none',
                              transition: 'all 0.2s',
                              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', borderColor: 'secondary.main' }
                            }}>
                              <Avatar
                                src={student.img}
                                sx={{ width: 80, height: 80, mb: 2, border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', bgcolor: 'primary.main', fontSize: '2rem' }}
                              >
                                {student.name.charAt(0)}
                              </Avatar>
                              <Typography variant="subtitle1" fontWeight="bold" textAlign="center">{student.name}</Typography>
                              <Chip size="small" label={student.score} color="secondary" sx={{ mt: 1, fontWeight: 800 }} />
                            </Card>
                          </Grid>
                        ))}
                        {toppers.length === 0 && (
                          <Grid item xs={12}>
                            <Typography color="text.secondary" fontStyle="italic">Data being updated...</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Fade>
        </Stack>
      </Container>
    </Container>
  );
};

export default Results;
