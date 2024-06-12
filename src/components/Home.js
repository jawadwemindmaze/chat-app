import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const Home = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <HomeIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Welcome to the App
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button
                                component={RouterLink}
                                to="/login"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                component={RouterLink}
                                to="/signup"
                                fullWidth
                                variant="contained"
                                color="secondary"
                            >
                                Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Home;
