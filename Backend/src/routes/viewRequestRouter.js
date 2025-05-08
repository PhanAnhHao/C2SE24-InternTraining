const express = require('express');
const router = express.Router();
const viewRequestService = require('../services/viewRequestService');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const User = require('../models/User');

// Create a new view request
router.post('/request', auth, async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('User from auth:', req.user);
        
        const { studentId } = req.body;
        const accountId = req.user._id; // ID của account

        console.log('AccountId:', accountId);
        console.log('StudentId:', studentId);

        const viewRequest = await viewRequestService.createViewRequest(accountId, studentId);
        res.json({
            success: true,
            message: 'View request sent successfully',
            data: viewRequest
        });
    } catch (error) {
        console.error('Error in view request:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Handle student's response (approve/reject)
router.post('/response/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { approve } = req.body;

        console.log('Processing response for token:', token);
        console.log('Approve status:', approve);

        const viewRequest = await viewRequestService.handleViewRequestResponse(token, approve);
        res.json({
            success: true,
            message: `Request ${approve ? 'approved' : 'rejected'} successfully`,
            data: viewRequest
        });
    } catch (error) {
        console.error('Error processing response:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Direct approval handler for email links
router.get('/approve/:token', async (req, res) => {
    try {
        const { token } = req.params;
        console.log('Direct approval for token:', token);

        // Directly process the request with approve=true
        await viewRequestService.handleViewRequestResponse(token, true);
        
        // Return a simple confirmation page
        res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #28a745;">Request Approved Successfully</h1>
                    <p>You have approved the request to view your profile.</p>
                    <p>The business has been notified and will receive access to your profile information.</p>
                    <p><a href="${process.env.FRONTEND_URL || 'https://localhost:5173'}">Return to homepage</a></p>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error in direct approval:', error);
        res.status(400).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #dc3545;">Error</h1>
                    <p>${error.message}</p>
                    <p><a href="${process.env.FRONTEND_URL || 'https://localhost:5173'}">Return to homepage</a></p>
                </body>
            </html>
        `);
    }
});

// Direct rejection handler for email links
router.get('/reject/:token', async (req, res) => {
    try {
        const { token } = req.params;
        console.log('Direct rejection for token:', token);

        // Directly process the request with approve=false
        await viewRequestService.handleViewRequestResponse(token, false);
        
        // Return a simple confirmation page
        res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #dc3545;">Request Rejected</h1>
                    <p>You have rejected the request to view your profile.</p>
                    <p>The business has been notified that they will not have access to your profile information.</p>
                    <p><a href="${process.env.FRONTEND_URL || 'https://localhost:5173'}">Return to homepage</a></p>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error in direct rejection:', error);
        res.status(400).send(`
            <html>
                <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                    <h1 style="color: #dc3545;">Error</h1>
                    <p>${error.message}</p>
                    <p><a href="${process.env.FRONTEND_URL || 'https://localhost:5173'}">Return to homepage</a></p>
                </body>
            </html>
        `);
    }
});

// Validate access token and get student profile
router.get('/access/:token', auth, async (req, res) => {
    try {
        const { token } = req.params;
        const viewRequest = await viewRequestService.validateAccessToken(token);
        
        if (!viewRequest.student) {
            return res.status(400).json({
                success: false,
                message: 'ViewRequest missing student ID'
            });
        }
        
        // Lấy thông tin chi tiết của student
        const student = await Student.findById(viewRequest.student);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        if (!student.userId) {
            return res.status(404).json({
                success: false,
                message: 'Student missing userId reference'
            });
        }
        
        // Populate user data manually for better error handling
        const userData = await User.findById(student.userId);
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User data not found for this student'
            });
        }
        
        // Tạo đối tượng dữ liệu hồ sơ sinh viên an toàn
        const studentProfile = {
            studentId: student.idStudent || 'Not available',
            age: student.age || 'Not specified',
            school: student.school || 'Not specified',
            course: student.course || 'Not specified',
            englishSkill: student.englishSkill || 'Not specified',
            personalInfo: {
                name: userData.userName || 'Not available',
                email: userData.email || 'Not available',
                location: userData.location || 'Not specified',
                phone: userData.phone || 'Not specified'
            },
            requestInfo: {
                requestId: viewRequest._id,
                expiresAt: viewRequest.expiresAt
            }
        };
        
        res.json({
            success: true,
            message: 'Student profile accessed successfully',
            data: studentProfile
        });
    } catch (error) {
        console.error('Access error:', error);
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
});

// Endpoint thêm mới cho đường dẫn trong email
router.get('/student-profile/:token', auth, async (req, res) => {
    try {
        const { token } = req.params;
        const viewRequest = await viewRequestService.validateAccessToken(token);
        
        if (!viewRequest.student) {
            return res.status(400).json({
                success: false,
                message: 'ViewRequest missing student ID'
            });
        }
        
        // Lấy thông tin chi tiết của student
        const student = await Student.findById(viewRequest.student);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        if (!student.userId) {
            return res.status(404).json({
                success: false,
                message: 'Student missing userId reference'
            });
        }
        
        // Populate user data manually for better error handling
        const userData = await User.findById(student.userId);
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User data not found for this student'
            });
        }
        
        // Tạo đối tượng dữ liệu hồ sơ sinh viên an toàn
        const studentProfile = {
            studentId: student.idStudent || 'Not available',
            age: student.age || 'Not specified',
            school: student.school || 'Not specified',
            course: student.course || 'Not specified',
            englishSkill: student.englishSkill || 'Not specified',
            personalInfo: {
                name: userData.userName || 'Not available',
                email: userData.email || 'Not available',
                location: userData.location || 'Not specified',
                phone: userData.phone || 'Not specified'
            },
            requestInfo: {
                requestId: viewRequest._id,
                expiresAt: viewRequest.expiresAt
            }
        };
        
        res.json({
            success: true,
            message: 'Student profile accessed successfully',
            data: studentProfile
        });
    } catch (error) {
        console.error('Student profile access error:', error);
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
});

// Endpoint test không cần xác thực - CHỈ DÙNG CHO MỤC ĐÍCH TESTING
router.get('/test-access/:token', async (req, res) => {
    try {
        const { token } = req.params;
        console.log('--------- TEST ACCESS START ---------');
        console.log('Testing access with token:', token);
        
        const viewRequest = await viewRequestService.validateAccessToken(token);
        console.log('Found view request:', JSON.stringify(viewRequest, null, 2));
        
        if (!viewRequest.student) {
            return res.status(400).json({
                success: false,
                message: 'ViewRequest missing student ID'
            });
        }
        
        // Lấy thông tin chi tiết của student
        console.log('Finding student with ID:', viewRequest.student);
        const student = await Student.findById(viewRequest.student);
        console.log('Found student (before populate):', JSON.stringify(student, null, 2));
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        console.log('Student userId:', student.userId);
        if (!student.userId) {
            return res.status(404).json({
                success: false,
                message: 'Student missing userId reference'
            });
        }
        
        // Populate user data manually for better error handling
        const userData = await User.findById(student.userId);
        console.log('Found user data:', JSON.stringify(userData, null, 2));
        
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User data not found for this student'
            });
        }
        
        // Tạo đối tượng dữ liệu hồ sơ sinh viên an toàn, kiểm tra tất cả dữ liệu trước khi sử dụng
        const studentProfile = {
            studentId: student.idStudent || 'Not available',
            age: student.age || 'Not specified',
            school: student.school || 'Not specified',
            course: student.course || 'Not specified',
            englishSkill: student.englishSkill || 'Not specified',
            personalInfo: {
                name: userData.userName || 'Not available',
                email: userData.email || 'Not available',
                location: userData.location || 'Not specified',
                phone: userData.phone || 'Not specified'
            },
            requestInfo: {
                requestId: viewRequest._id,
                expiresAt: viewRequest.expiresAt
            }
        };
        
        console.log('Generated profile data:', JSON.stringify(studentProfile, null, 2));
        console.log('--------- TEST ACCESS END ---------');
        
        res.json({
            success: true,
            message: 'Student profile accessed successfully (TEST)',
            data: studentProfile
        });
    } catch (error) {
        console.error('Test access error:', error);
        res.status(401).json({
            success: false,
            message: error.message,
            stack: error.stack
        });
    }
});

module.exports = router; 