import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';

export default function AccessStudentProfile() {
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                // Lấy access token từ localStorage
                let accessToken = localStorage.getItem('token');
                if (!accessToken) {
                    accessToken = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
                }
                if (!accessToken) {
                    setError('No access token found. Please log in.');
                    setLoading(false);
                    return;
                }

                console.log('Using access token:', accessToken);
                const response = await fetch(`http://localhost:5000/api/view-requests/access/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    credentials: 'include', // Hỗ trợ cookie nếu backend dùng
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    setStudentProfile(data.data);
                    console.log('Student Profile:', data.data);
                } else {
                    setError(data.message || 'Failed to fetch student profile.');
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching student profile:', err);
                if (err.message.includes('401') || err.message.includes('authorization denied')) {
                    setError('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    localStorage.removeItem('authToken');
                    setTimeout(() => navigate('/login'), 3000);
                } else if (err.message.includes('ECONNREFUSED')) {
                    setError('Cannot connect to server. Please ensure the backend is running on port 5000.');
                } else {
                    setError('Error fetching student profile: ' + err.message);
                }
                setLoading(false);
            }
        };

        fetchStudentProfile();
    }, [token, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography color="error">{error}</Typography>
                {error.includes('log in') && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/login')}
                        sx={{ mt: 2 }}
                    >
                        Go to Login
                    </Button>
                )}
                {error.includes('backend') && (
                    <Typography sx={{ mt: 2 }}>
                        Start backend with: <code>npm start</code> or <code>node index.js</code>
                    </Typography>
                )}
            </Box>
        );
    }

    if (!studentProfile) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <Typography>No student profile data available.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
            <Typography variant="h4" gutterBottom>
                Student Profile
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Student Information</Typography>
                <Typography><strong>Student ID:</strong> {studentProfile.studentId}</Typography>
                <Typography><strong>Age:</strong> {studentProfile.age}</Typography>
                <Typography><strong>School:</strong> {studentProfile.school}</Typography>
                <Typography><strong>Course:</strong> {studentProfile.course}</Typography>
                <Typography><strong>English Skill:</strong> {studentProfile.englishSkill}</Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>Personal Information</Typography>
                <Typography><strong>Name:</strong> {studentProfile.personalInfo.name}</Typography>
                <Typography><strong>Email:</strong> {studentProfile.personalInfo.email}</Typography>
                <Typography><strong>Location:</strong> {studentProfile.personalInfo.location}</Typography>
                <Typography><strong>Phone:</strong> {studentProfile.personalInfo.phone}</Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>Request Information</Typography>
                <Typography><strong>Request ID:</strong> {studentProfile.requestInfo.requestId}</Typography>
                <Typography>
                    <strong>Expires At:</strong> {new Date(studentProfile.requestInfo.expiresAt).toLocaleString()}
                </Typography>
            </Paper>
        </Box>
    );
}