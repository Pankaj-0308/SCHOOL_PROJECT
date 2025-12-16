import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, TextField, MenuItem, Grid, Card, CardContent, Stack, Fade, Grow } from '@mui/material';

const API = 'http://localhost:5000/api';

const TeacherLanding = () => {
  const [newStudents, setNewStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [classNumber, setClassNumber] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.classAssigned) {
      setClassNumber(user.classAssigned);
      fetchNewStudents(user.classAssigned);
    }
  }, []);

  const fetchNewStudents = async (classNum) => {
    const res = await fetch(`${API}/admin/new-students/${classNum}`);
    const data = await res.json();
    setNewStudents(data);
  };

  const handleSetStudentCredentials = async () => {
    await fetch(`${API}/admin/set-student-credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, password: studentPassword })
    });
    setStudentId('');
    setStudentPassword('');
    fetchNewStudents(classNumber);
  };

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 10 } }}>
        <Container>
          <Fade in timeout={700}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h3">Teacher Panel</Typography>
              <Typography variant="subtitle1" color="text.secondary">Set credentials for newly admitted students and manage your class.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" href="/teacher/dashboard">Go to Dashboard</Button>
                <Button variant="outlined" href="/teacher/announcements">Announcements</Button>
              </Stack>
            </Stack>
          </Fade>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grow in timeout={700}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Set New Student Credentials</Typography>
                  <Stack spacing={2}>
                    <TextField select label="Select New Student" value={studentId} onChange={(e) => setStudentId(e.target.value)} fullWidth>
                      {newStudents.map((s) => (
                        <MenuItem key={s._id} value={s._id}>{s.name} ({s.email})</MenuItem>
                      ))}
                    </TextField>
                    <TextField label="Set Student Password" type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} fullWidth />
                    <Button variant="contained" onClick={handleSetStudentCredentials} disabled={!studentId || !studentPassword}>Set Credentials</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grow in timeout={850}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>New Students in Class {classNumber || '-'}</Typography>
                  <Stack spacing={1.5}>
                    {newStudents.length === 0 && (
                      <Typography color="text.secondary">No pending students.</Typography>
                    )}
                    {newStudents.map((s) => (
                      <Box key={s._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Box>
                          <Typography variant="subtitle1">{s.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{s.email}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">{s.class}</Typography>
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

export default TeacherLanding;
