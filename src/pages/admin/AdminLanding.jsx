import React from 'react';
import { Container, Typography, Button, TextField, Box, Grid, Card, CardContent, Chip, Stack, Fade, Grow } from '@mui/material';

const AdminLanding = () => {
  return (
    <Box>
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 10 } }}>
        <Container>
          <Fade in timeout={700}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h2">Admin Portal</Typography>
              <Typography variant="h6" color="text.secondary">Manage your institution efficiently with comprehensive tools.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" href="/admin/dashboard">Access Dashboard</Button>
                <Button variant="outlined" href="/admin/admissions">Manage Admissions</Button>
              </Stack>
            </Stack>
          </Fade>
        </Container>
      </Box>

      <Container sx={{ mt: 4, mb: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grow in timeout={650}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ overflow: 'hidden' }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box component="a" href="/admin/students" sx={{ display: 'block', position: 'relative', textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ height: 220, backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <Box sx={{ p: 2 }}>
                          <Typography variant="h5">Students</Typography>
                          <Typography variant="body2" color="text.secondary">View classes, browse students, and open detailed profiles.</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ overflow: 'hidden' }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box component="a" href="/admin/teachers" sx={{ display: 'block', position: 'relative', textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ height: 220, backgroundImage: 'url(https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <Box sx={{ p: 2 }}>
                          <Typography variant="h5">Teachers</Typography>
                          <Typography variant="body2" color="text.secondary">Browse teachers and view assignments and details.</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grow>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grow in timeout={700}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Quick Statistics</Typography>
                  <Grid container spacing={2}>
                    {[{ n: '1,234', l: 'Total Students' }, { n: '98', l: 'Teachers' }, { n: '45', l: 'Classes' }, { n: '12', l: 'Departments' }].map((s, i) => (
                      <Grid item xs={6} key={s.l}>
                        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                          <Typography variant="h4">{s.n}</Typography>
                          <Typography color="text.secondary">{s.l}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grow in timeout={820}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
                    {['Add New User', 'Manage Classes', 'View Reports', 'System Settings'].map((a) => (
                      <Button key={a} variant="outlined">{a}</Button>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12}>
            <Grow in timeout={900}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
                  <Stack spacing={1.5}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Box>
                          <Typography variant="subtitle1">New user registration</Typography>
                          <Typography variant="body2" color="text.secondary">2 hours ago</Typography>
                        </Box>
                        <Chip label="Notification" size="small" color="primary" variant="outlined" />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grow in timeout={950}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Make Announcement</Typography>
                  <Stack spacing={2}>
                    <TextField label="Title" fullWidth />
                    <TextField label="Message" fullWidth multiline rows={4} />
                    <Button variant="contained">Post Announcement</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grow in timeout={1000}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>System Status</Typography>
                  <Stack spacing={1.5}>
                    {[{ n: 'Database', s: 'Operational', c: 'success' }, { n: 'API Services', s: 'Operational', c: 'success' }, { n: 'Storage', s: '85% Used', c: 'warning' }, { n: 'Last Backup', s: '2 hours ago', c: 'info' }].map((x) => (
                      <Box key={x.n} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography>{x.n}</Typography>
                        <Chip label={x.s} color={x.c} size="small" variant="outlined" />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminLanding;

