import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Stack, Grid, Card, CardContent, Chip, Box, LinearProgress, useTheme } from '@mui/material';
import { AccessTime as TimeIcon, Room as RoomIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import api from '../../api/client';

const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const fullDays = { 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday' };

const TeacherSchedule = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const { data } = await api.get('/teacher/schedule');
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getDaySchedule = (day) => {
    return entries
      .filter(e => e.day === day)
      .sort((a, b) => (a.period - b.period));
  };

  if (loading) return <LinearProgress />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
          Weekly Timetable
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your classes and teaching hours efficiently.
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {daysOrder.map((day) => {
          const dailyItems = getDaySchedule(day);
          const isToday = new Date().toLocaleDateString('en-US', { weekday: 'short' }) === day;

          return (
            <Grid item xs={12} md={true} key={day} sx={{ minWidth: { md: '200px' } }}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  bgcolor: isToday ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                  border: `1px solid ${isToday ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <Box sx={{
                  p: 2,
                  bgcolor: isToday ? 'primary.main' : alpha(theme.palette.grey[500], 0.1),
                  color: isToday ? 'white' : 'text.primary',
                  textAlign: 'center'
                }}>
                  <Typography variant="h6" fontWeight={700}>{fullDays[day]}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>{dailyItems.length} Classes</Typography>
                </Box>

                {/* Slots */}
                <Stack spacing={2} sx={{ p: 2 }}>
                  {dailyItems.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center', opacity: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">No classes</Typography>
                    </Box>
                  ) : (
                    dailyItems.map((item, idx) => (
                      <Card
                        key={idx}
                        elevation={0}
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[2], borderColor: 'primary.main' }
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                            <Chip
                              label={`Class ${item.classNumber}`}
                              size="small"
                              color="primary"
                              sx={{ fontWeight: 700, borderRadius: 1 }}
                            />
                            <Chip
                              label={`P-${item.period}`}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 1, borderColor: 'divider' }}
                            />
                          </Stack>

                          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                            {item.subject}
                          </Typography>

                          <Stack spacing={0.5} mt={1}>
                            <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                              <TimeIcon sx={{ fontSize: 14 }} />
                              <Typography variant="caption" fontWeight={500}>
                                {item.startTime} - {item.endTime}
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                              <RoomIcon sx={{ fontSize: 14 }} />
                              <Typography variant="caption">
                                Room {item.classNumber}
                              </Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default TeacherSchedule;
