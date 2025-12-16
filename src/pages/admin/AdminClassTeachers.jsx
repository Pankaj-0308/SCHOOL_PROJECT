import React, { useEffect, useMemo, useState } from 'react';
import { Container, Typography, Paper, Stack, TextField, MenuItem, Button, Grid, Chip } from '@mui/material';
import api from '../../api/client';

const classes = Array.from({ length: 12 }, (_, i) => i + 1);

const AdminClassTeachers = () => {
  const [classNumber, setClassNumber] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [mapping, setMapping] = useState([]); // [{subject, teacher}]
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async (cls) => {
    setLoading(true);
    try {
      const [subsRes, teachRes, mapRes] = await Promise.all([
        api.get(`/subjects/${cls}`),
        api.get('/admin/teachers'),
        api.get(`/admin/class/${cls}/subject-teachers`),
      ]);
      setSubjects(Array.isArray(subsRes.data) ? subsRes.data : []);
      setTeachers(Array.isArray(teachRes.data) ? teachRes.data : []);
      const raw = Array.isArray(mapRes.data) ? mapRes.data : [];
      // normalize to include teacherId for easier save
      setMapping(raw.map(x => ({ subject: x.subject, teacherId: x.teacher?._id || '' })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(classNumber); }, [classNumber]);

  const teacherOptions = useMemo(() => teachers.map(t => ({ id: t._id, label: `${t.name} (${t.email})` })), [teachers]);

  const setTeacher = (subject, teacherId) => {
    setMapping(prev => {
      const other = prev.filter(x => x.subject !== subject);
      return [...other, { subject, teacher: teacherOptions.find(o=>o.id===teacherId) || null, teacherId }];
    });
  };

  const save = async () => {
    const assignments = subjects.map(s => ({ subject: s, teacherId: mapping.find(m=>m.subject===s)?.teacherId })).filter(x=>x.teacherId);
    if (assignments.length !== 5) {
      alert('Please select 5 teachers for 5 subjects.');
      return;
    }
    setSaving(true);
    try {
      await api.post(`/admin/class/${classNumber}/subject-teachers`, { assignments });
      alert('Saved subject-teacher assignments.');
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container sx={{ py: { xs: 6, md: 8 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h4">Class Teachers</Typography>
        <TextField select label="Class" size="small" value={classNumber} onChange={(e)=>setClassNumber(Number(e.target.value))} sx={{ width: 160 }}>
          {classes.map(c => (<MenuItem key={c} value={c}>{`Class ${c}`}</MenuItem>))}
        </TextField>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Grid container spacing={2}>
              {subjects.map(s => {
                const sel = mapping.find(m => m.subject === s)?.teacherId || '';
                return (
                  <Grid item xs={12} md={6} key={s}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1">{s}</Typography>
                      <TextField select size="small" value={sel} onChange={(e)=>setTeacher(s, e.target.value)}>
                        <MenuItem value="">-- Select Teacher --</MenuItem>
                        {teacherOptions.map(o => (<MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>))}
                      </TextField>
                    </Stack>
                  </Grid>
                );
              })}
            </Grid>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" onClick={save} disabled={saving}>Save</Button>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
              {subjects.map(s => {
                const tId = mapping.find(m=>m.subject===s)?.teacherId;
                const label = teacherOptions.find(o=>o.id===tId)?.label || 'Unassigned';
                return <Chip key={s} label={`${s}: ${label}`} />;
              })}
            </Stack>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AdminClassTeachers;
