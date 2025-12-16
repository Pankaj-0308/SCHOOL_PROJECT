import React from 'react';
import { Container, Typography, Card, CardMedia, Grow, Fade, Stack, Box, IconButton, Dialog, DialogContent, CardActionArea } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { API_BASE } from '../../api/client';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [viewer, setViewer] = useState({ open: false, item: null });
  const serverBase = API_BASE.replace('/api', '');

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/site-images`);
        const data = await res.json();
        // data are paths like /site-images/file.jpg; make absolute
        const abs = (Array.isArray(data) ? data : []).map((p) =>
          p.startsWith('http') ? p : `${serverBase}${p}`
        );
        setImages(abs);
      } catch {
        setImages([]);
      }
    };
    run();
  }, [serverBase]);

  const fallback = [
    'https://images.unsplash.com/photo-1596495578065-4b1b1c5b3b51?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=1200&auto=format&fit=crop',
  ];

  const list = images.length ? images : fallback;

  // Group images into event sections based on filename keywords
  const groupsConfig = [
    { key: 'yoga', title: 'Yoga Event', desc: 'Students came together for guided yoga sessions focused on posture, breathing, and calmness. The event highlighted daily mindfulness habits and simple routines anyone can follow. These moments capture the energy, balance, and smiles from the practice.' },
    { key: 'dance', title: 'Dance Event', desc: 'A colorful celebration of culture and rhythm featuring solo and group performances. Months of practice by students are on display with coordinated steps and vibrant costumes. These frames showcase the excitement both on and off the stage.' },
    { key: 'rangoli', title: 'Rangoli Event', desc: 'Traditional rangoli designs filled the campus with color and creativity. Students worked in teams to craft patterns using flowers and natural powders. The gallery highlights intricate details, teamwork, and festive spirit.' },
    { key: 'janmastmi', title: 'Janmashtami Event', desc: 'The campus celebrated Janmashtami with themed decorations, songs, and skits. Students participated in creative activities that brought stories to life. These photos capture the joy and cultural richness of the day.' },
    { key: 'rakhi', title: 'Rakhi Celebration', desc: 'Rakhi-making workshops and exchanges underlined friendship and care. Handcrafted rakhis and notes were shared among classmates and teachers. The gallery reflects warmth, color, and meaningful bonds.' },
    { key: 'karate', title: 'Karate Event', desc: 'From basic katas to advanced demonstrations, students showcased discipline and skill. The event emphasized confidence, coordination, and respect. These pictures preserve action-filled moments and proud achievements.' },
    { key: 'model', title: 'Model Exhibition', desc: 'Students prepared science and craft models to explain concepts practically. Visitors explored interactive displays and asked curious questions. The images highlight creativity, learning, and collaborative effort.' },
    { key: 'photo', title: 'Photography Event', desc: 'A student-led photo walk captured campus life from fresh perspectives. From candid portraits to architecture, frames tell stories of our everyday. This collection presents the best shots curated by the club.' },
    { key: 'kid', title: 'Kids Activities', desc: 'Fun games, art corners, and simple challenges made for an engaging day. Younger students explored, created, and cheered each other on. These moments showcase play, teamwork, and tiny milestones.' },
    { key: 'independeceday', title: 'Independence Day', desc: 'Flag hoisting, cultural performances, and patriotic activities marked the celebration. These images capture the spirit, colors, and pride of the day.' },
  ];

  const fileName = (src) => decodeURIComponent(src.split('/').pop() || '').toLowerCase();

  const grouped = groupsConfig.map(({ key, title, desc }) => ({
    key,
    title,
    desc,
    items: list.filter((src) => fileName(src).includes(key)),
  }));

  // Only show configured groups that have items. Do not show generic buckets.
  const sections = grouped.filter((g) => g.items.length > 0);

  return (
    <Container sx={{ py: { xs: 6, md: 10 } }}>
      <Fade in timeout={700}>
        <Stack sx={{ mb: 3 }}>
          <Typography variant="h4">Our Campus Gallery</Typography>
          <Typography color="text.secondary">
            A glimpse of our classrooms, activities, and campus life.
          </Typography>
        </Stack>
      </Fade>

      {/* Overlay viewer with dimmed background (lightbox) */}
      <Dialog
        open={viewer.open}
        onClose={() => setViewer({ open: false, item: null })}
        fullWidth
        maxWidth="xl"
        BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0.85)' } }}
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      >
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}>
          <IconButton color="default" onClick={() => setViewer({ open: false, item: null })} sx={{ bgcolor: 'rgba(255,255,255,0.24)' }}>
            <CloseIcon htmlColor="#fff" />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          {viewer.item && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' }, gap: 0, bgcolor: 'transparent' }}>
              <Box sx={{ bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={viewer.item.src}
                  alt={viewer.item.title || 'Preview'}
                  style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                />
              </Box>
              <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'rgba(255,255,255,0.98)' }}>
                {viewer.item.title && (
                  <Typography variant="h5" sx={{ mb: 1 }}>{viewer.item.title}</Typography>
                )}
                {viewer.item.desc && (
                  <Typography color="text.secondary">{viewer.item.desc}</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {sections.map((section, si) => (
        <Box key={section.key} sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>{section.title}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{section.desc}</Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2,
          }}>
            {section.items.map((src, i) => (
              <Grow in timeout={600 + ((i + si) % 3) * 120} key={`${section.key}-${i}`}>
                <Card sx={{ overflow: 'hidden', cursor: 'zoom-in' }}>
                  <CardActionArea onClick={() => setViewer({ open: true, item: { src, title: section.title, desc: section.desc } })}>
                    <Box sx={{ position: 'relative', pt: '62%' }}>
                      <CardMedia
                        component="img"
                        image={src}
                        alt={fileName(src)}
                        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  </CardActionArea>
                </Card>
              </Grow>
            ))}
          </Box>
        </Box>
      ))}

      {/* End overlay viewer */}
    </Container>
  );
};

export default Gallery;
