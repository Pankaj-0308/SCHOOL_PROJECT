
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Chip, Stack, CircularProgress, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import api from '../../api/client';

const StudentTimetable = () => {
    const [timetable, setTimetable] = useState([]); // List of subjects with their schedules
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const { data } = await api.get('/student/timetable');
            setTimetable(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    // Flatten the structure: We have subjects -> schedule[].
    // We want to group by Day.
    const scheduleByDay = {}; // { 'monday': [ { subject, teacher, startTime, endTime, room } ... ] }

    timetable.forEach(item => {
        const subjectName = item.subject?.name || 'Unknown Subject';
        const teacherName = item.teacher?.name || 'Unknown Teacher';

        if (item.schedule && Array.isArray(item.schedule)) {
            item.schedule.forEach(entry => {
                const d = entry.day.toLowerCase();
                if (!scheduleByDay[d]) scheduleByDay[d] = [];
                scheduleByDay[d].push({
                    ...entry,
                    subjectName,
                    teacherName
                });
            });
        }
    });

    // Sort entries by startTime
    Object.keys(scheduleByDay).forEach(d => {
        scheduleByDay[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    if (loading) {
        return (
            <Container sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                    Weekly Timetable
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Your class schedule at a glance.
                </Typography>
            </Box>

            <Grid container spacing={3} justifyContent="center">
                {days.map((day, index) => (
                    <Grid item xs={12} sm={6} md={2.4} key={day}>
                        <Paper
                            elevation={0}
                            sx={{
                                height: '100%',
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 3,
                                overflow: 'hidden',
                                backgroundColor: alpha(theme.palette.background.paper, 0.6)
                            }}
                        >
                            <Box sx={{
                                p: 2,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{dayLabels[index]}</Typography>
                            </Box>

                            <Stack spacing={2} sx={{ p: 2 }}>
                                {(scheduleByDay[day] || []).length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No classes
                                    </Typography>
                                ) : (
                                    (scheduleByDay[day] || []).map((slot, i) => (
                                        <Paper key={i} elevation={2} sx={{ p: 1.5, borderRadius: 2, borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                {slot.subjectName}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                                                {slot.teacherName}
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Chip
                                                    label={`${slot.startTime} - ${slot.endTime}`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                />
                                            </Stack>
                                        </Paper>
                                    ))
                                )}
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default StudentTimetable;
