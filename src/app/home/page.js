'use client';

import React from 'react';

import { CalendarMonth, Share, Sports, WhatsApp } from '@mui/icons-material';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import createGameFormImg from '../../../public/assets/create-game.png';
import teamImg from '../../../public/assets/team-list.png';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

export default function LandingPage() {
  const router = useRouter();
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: '#121212', minHeight: '100vh', color: 'white' }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Grid container spacing={4} alignItems="center" sx={{ py: 8 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                Play-O-Time
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ mb: 4, color: 'grey.400' }}
              >
                Schedule games, manage teams, and share updates effortlessly
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  'mr': 2,
                  'bgcolor': 'white',
                  'color': 'black',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
                onClick={() => router.push('/register')}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  overflow: 'hidden',
                  bgcolor: 'transparent',
                }}
              >
                <Image
                  src={teamImg}
                  alt="Game Schedule Dashboard"
                  width={600}
                  height={400}
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Features Section */}
          <Box sx={{ py: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              textAlign="center"
              sx={{ mb: 6 }}
            >
              Key Features
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <CalendarMonth
                    sx={{ fontSize: 60, mb: 2, color: 'primary.main' }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Easy Scheduling
                  </Typography>
                  <Typography color="grey.400">
                    Create and manage game schedules with just a few clicks. Set
                    dates, times, and venues effortlessly.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Sports sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    Team Management
                  </Typography>
                  <Typography color="grey.400">
                    Organize teams, assign roles, and keep track of player
                    participation in every game.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Share sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    Easy Sharing
                  </Typography>
                  <Typography color="grey.400">
                    Share game details and player lists instantly via WhatsApp
                    or email.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* How It Works Section */}
          <Box sx={{ py: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              textAlign="center"
              sx={{ mb: 6 }}
            >
              How It Works
            </Typography>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={6}
                  sx={{
                    overflow: 'hidden',
                    bgcolor: 'transparent',
                  }}
                >
                  <Image
                    src={createGameFormImg}
                    alt="Create Game Form"
                    width={600}
                    height={400}
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ pl: { md: 4 } }}>
                  <Typography variant="h4" gutterBottom>
                    Create & Share Games
                  </Typography>
                  <Typography variant="body1" paragraph color="grey.400">
                    1. Set up your game with all the details
                  </Typography>
                  <Typography variant="body1" paragraph color="grey.400">
                    2. Invite players and assign roles
                  </Typography>
                  <Typography variant="body1" paragraph color="grey.400">
                    3. Share the game details via WhatsApp or email
                  </Typography>
                  <Typography variant="body1" paragraph color="grey.400">
                    4. Track registrations and updates in real-time
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<WhatsApp />}
                    size="large"
                    sx={{
                      'mt': 2,
                      'bgcolor': '#25D366',
                      '&:hover': {
                        bgcolor: '#128C7E',
                      },
                    }}
                  >
                    Share via WhatsApp
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'grey.400' }}>
              Join now and make game scheduling easier than ever
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                'bgcolor': 'white',
                'color': 'black',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
              onClick={() => router.push('/login')}
            >
              Create Your First Game
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
