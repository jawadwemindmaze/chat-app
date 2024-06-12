import React, { useState, useEffect, useRef, useContext } from 'react';
import { Container, Typography, Box, Button, TextField, Grid, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const socket = io('http://localhost:4000'); // Connect to the Socket.IO server

socket.on('connect', () => {
    console.log('Connected to the server', socket.id);
});

socket.on('connect_error', (err) => {
    console.error('Connection error:', err);
});

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const Chat = () => {
    const { channel } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messageEndRef = useRef(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const currentChannel = channel || JSON.parse(localStorage.getItem('currentChannel'));
        if (!currentChannel) {
            navigate('/dashboard');
            return;
        }

        localStorage.setItem('currentChannel', JSON.stringify(currentChannel));
        socket.emit('joinRoom', currentChannel);

        const storedMessages = JSON.parse(localStorage.getItem(currentChannel)) || [];
        setMessages(storedMessages);

        socket.on('receiveMessage', (message) => {
            if (message.channel === currentChannel) {
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, message];
                    localStorage.setItem(currentChannel, JSON.stringify(updatedMessages));
                    return updatedMessages;
                });
            }
        });

        socket.on('typing', (data) => {
            console.log("typing");
            if (data.channel === currentChannel && data.username !== JSON.parse(localStorage.getItem('currentUser')).username) {
                setIsTyping(true);
            }
        });

        socket.on('stopTyping', (data) => {
            if (data.channel === currentChannel && data.username !== JSON.parse(localStorage.getItem('currentUser')).username) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, [channel, isAuthenticated, navigate]);

    const handleSend = () => {
        if (newMessage.trim() === '') return; // Prevent sending empty messages

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentChannel = JSON.parse(localStorage.getItem('currentChannel'));
        const message = {
            sender: currentUser.username,
            receiver: currentChannel.split('_').find(user => user !== currentUser.username),
            content: newMessage,
            timestamp: new Date().toISOString(),
            channel: currentChannel
        };

        socket.emit('sendMessage', message);
        socket.emit('stopTyping', { channel: currentChannel, username: currentUser.username });
        setNewMessage('');
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    const handleTyping = (event) => {
        setNewMessage(event.target.value);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentChannel = JSON.parse(localStorage.getItem('currentChannel'));

        if (event.target.value) {
            socket.emit('typing', { channel: currentChannel, username: currentUser.username });
        } else {
            socket.emit('stopTyping', { channel: currentChannel, username: currentUser.username });
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                    sx={{ alignSelf: 'flex-start', mb: 2 }}
                >
                    Back to Home
                </Button>
                <Typography component="h1" variant="h5">
                    Chat with {capitalizeFirstLetter(channel.split('_').find(user => user !== JSON.parse(localStorage.getItem('currentUser')).username))}
                </Typography>
                {isTyping && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>Typing...</Typography>
                    </Box>
                )}
                <Paper sx={{ p: 2, mt: 3, width: '100%', height: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.sender === JSON.parse(localStorage.getItem('currentUser')).username ? 'flex-end' : 'flex-start',
                                mb: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    p: 1,
                                    bgcolor: msg.sender === JSON.parse(localStorage.getItem('currentUser')).username ? 'primary.main' : 'grey.300',
                                    color: msg.sender === JSON.parse(localStorage.getItem('currentUser')).username ? 'white' : 'black',
                                    borderRadius: 1,
                                    maxWidth: '75%',
                                }}
                            >
                                <Typography variant="body2" gutterBottom>
                                    {msg.content}
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {new Date(msg.timestamp).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    ))}

                    <div ref={messageEndRef} />
                </Paper>
                <Box sx={{ mt: 3, width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <TextField
                                fullWidth
                                label="Type a message"
                                variant="outlined"
                                value={newMessage}
                                onChange={handleTyping}
                                onKeyPress={handleKeyPress}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleSend}
                            >
                                Send
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Chat;
