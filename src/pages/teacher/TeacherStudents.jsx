import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Paper, Stack, Grid, Box, useTheme, LinearProgress,
    TextField, Chip, Avatar, Card, CardContent, Divider, InputAdornment
} from '@mui/material';
import {
    School as SchoolIcon,
    Search as SearchIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import api from '../../api/client';

const TeacherStudents = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const theme = useTheme();

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        } else {
            setStudents([]);
        }
    }, [selectedClass]);

    const fetchClasses = async () => {
        try {
            const { data } = await api.get('/teacher/my-classes');
            setClasses(Array.isArray(data) ? data : []);
            if (data && data.length > 0) {
                // Default to first class
                setSelectedClass(data[0]);
            }
        } catch (e) { console.error(e); }
    };

    const fetchStudents = async (cNum) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/teacher/students/${cNum}`);
            setStudents(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 5 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>My Students</Typography>
                    <Typography variant="subtitle1" color="text.secondary">View and manage students in your classes.</Typography>
                </Box>
                <Box sx={{ width: 200 }}>
                    <TextField
                        select
                        label="Select Class"
                        fullWidth
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                    >
                        {classes.length === 0 && <option value="">No Classes Assigned</option>}
                        {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </TextField>
                </Box>
            </Stack>

            {/* Student Grid */}
            <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                <TextField
                    fullWidth
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                        sx: { borderRadius: 2 }
                    }}
                    size="small"
                />
            </Paper>

            {loading ? <LinearProgress /> : (
                <>
                    {filteredStudents.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <SchoolIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography color="text.secondary">
                                {selectedClass ? 'No students found in this class.' : 'Select a class to view students.'}
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredStudents.map(student => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={student._id}>
                                    <Card elevation={0} sx={{
                                        height: '100%',
                                        borderRadius: 4,
                                        border: `1px solid ${theme.palette.divider}`,
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[4] }
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                            <Avatar sx={{ width: 72, height: 72, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>
                                                {student.name?.[0]}
                                            </Avatar>
                                            <Typography variant="h6" fontWeight={700} noWrap>{student.name}</Typography>
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 1, color: 'text.secondary' }}>
                                                <EmailIcon fontSize="small" />
                                                <Typography variant="body2" noWrap>{student.email}</Typography>
                                            </Stack>
                                            <Divider sx={{ my: 2 }} />
                                            <Chip label={student.studentId || 'No ID'} size="small" variant="outlined" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}
        </Container>
    );
};

export default TeacherStudents;
