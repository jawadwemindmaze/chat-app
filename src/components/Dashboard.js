import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const filteredUsers = storedUsers.filter(user => user.username !== currentUser.username);
        setUsers(filteredUsers);
    }, []);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    const handleStartChat = (username) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')).username;
        const lowerCaseChannel = [currentUser.toLowerCase(), username.toLowerCase()].sort().join('_');
        navigate(`/chat/${lowerCaseChannel}`);
    };

    return (
        <Container component="main">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Dashboard
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><Typography variant="h6">Username</Typography></TableCell>
                                <TableCell><Typography variant="h6">Chat</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                    sx={{ position: 'relative' }}
                                >
                                    <TableCell>{capitalizeFirstLetter(user.username)}</TableCell>
                                    <TableCell sx={{ width: '150px', position: 'relative' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            <Typography variant="body2">Chat</Typography>
                                            {hoveredRow === index && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleStartChat(user.username)}
                                                    sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
                                                >
                                                    Start Chat
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 4 }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;
