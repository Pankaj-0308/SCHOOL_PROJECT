import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, TextField, MenuItem, Button, Grid, Chip, Box } from '@mui/material';
import api from '../../api/client';

const TeacherAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [classNumber, setClassNumber] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // studentId -> boolean
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [todayList, setTodayList] = useState([]); // today's classes from schedule

  const loadClasses = async () => {
    try {
      const { data } = await api.get('/teacher/my-classes');
      const cls = Array.isArray(data) ? data : [];
      // Also fetch schedule to build today's classes with times
      let schedule = null;
      try {
        const sres = await api.get('/teacher/schedule');
        schedule = sres.data || null;
      } catch {}
      if (schedule && Array.isArray(schedule.entries)) {
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const today = days[new Date().getDay()] || 'Mon';
        const todays = schedule.entries.filter(e => e.day === today);
        setTodayList(todays);
        const fromSched = Array.from(new Set(todays.map(e => e.classNumber)));
        const merged = Array.from(new Set([...(cls || []), ...fromSched])).sort((a,b)=>a-b);
        setClasses(merged);
        if (merged.length > 0) setClassNumber(String(merged[0]));
      } else {
        setClasses(cls);
        if (cls.length > 0) setClassNumber(String(cls[0]));
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load classes');
    }
  };

  const loadStudents = async (cls) => {
    if (!cls) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/teacher/students/${cls}`);
      setStudents(Array.isArray(data) ? data : []);
      // preset as present true
      const initial = {};
      (Array.isArray(data) ? data : []).forEach(s => { initial[s._id] = true; });
      setMarks(initial);
      setError('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load students');
      setStudents([]);
      setMarks({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClasses(); }, []);
  useEffect(() => { if (classNumber) loadStudents(classNumber); }, [classNumber]);

  const submit = async () => {
    try {
      await Promise.all(Object.entries(marks).map(([sid, present]) => api.post('/teacher/attendance/mark', { studentId: sid, classNumber: Number(classNumber), date, present })));
      alert('Attendance saved');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save attendance');
    }
  };

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h4">Attendance</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField select size="small" label="Class" value={classNumber} onChange={(e)=>setClassNumber(e.target.value)} sx={{ minWidth: 160 }}>
            {classes.map(c => <MenuItem key={c} value={String(c)}>{`Class ${c}`}</MenuItem>)}
          </TextField>
          <TextField size="small" type="date" label="Date" InputLabelProps={{ shrink: true }} value={date} onChange={(e)=>setDate(e.target.value)} />
          <Button variant="contained" onClick={submit} disabled={!classNumber || students.length===0}>Save</Button>
        </Stack>
      </Stack>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : students.length === 0 ? (
        <Typography color="text.secondary">No students</Typography>
      ) : (
        <Grid container spacing={2}>
          {students.map(s => (
            <Grid item xs={12} md={6} lg={4} key={s._id}>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack>
                    <Typography variant="subtitle1">{s.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.studentId || s.email}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Chip clickable onClick={()=>setMarks({...marks, [s._id]: true})} color={marks[s._id] ? 'success' : 'default'} label="Present" />
                    <Chip clickable onClick={()=>setMarks({...marks, [s._id]: false})} color={!marks[s._id] ? 'error' : 'default'} label="Absent" />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default TeacherAttendance;
