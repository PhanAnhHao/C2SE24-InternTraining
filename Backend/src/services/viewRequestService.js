const crypto = require('crypto');
const ViewRequest = require('../models/ViewRequest');
const Account = require('../models/Account');
const Student = require('../models/Student');
const User = require('../models/User');
const Business = require('../models/Business');
const sendEmail = require('../utils/sendEmail');

// Define default URLs
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const generateToken = () => crypto.randomBytes(32).toString('hex');

const createViewRequest = async (accountId, studentId) => {
    try {
        console.log('Starting createViewRequest with accountId:', accountId, 'studentId:', studentId);
        
        // 1. Từ accountId, tìm user
        const businessUser = await User.findOne({ idAccount: accountId });
        if (!businessUser) {
            throw new Error('Business user not found');
        }
        console.log('Found business user:', businessUser);

        // 2. Từ user._id, tìm business
        const business = await Business.findOne({ userId: businessUser._id });
        if (!business) {
            throw new Error('Business not found');
        }
        console.log('Found business:', business);

        // 3. Tìm student
        const student = await Student.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }
        console.log('Found student:', student);

        // 4. Từ student.userId, tìm thông tin user của student
        const studentUser = await User.findById(student.userId);
        if (!studentUser) {
            throw new Error('Student user not found');
        }
        console.log('Found student user:', studentUser);

        // 5. Tạo request token và view request
        const requestToken = generateToken();
        console.log('Generated token:', requestToken);

        const viewRequest = await ViewRequest.create({
            business: business._id,
            student: studentId,
            requestToken
        });

        // 6. Cấu hình URL cho email để direct approve/reject
        // Sinh viên sẽ click vào URL trong email và được xử lý trực tiếp (không qua frontend)
        const approveUrl = `${BACKEND_URL}/api/view-requests/approve/${requestToken}`;
        const rejectUrl = `${BACKEND_URL}/api/view-requests/reject/${requestToken}`;
        
        console.log('Sending email with direct API URLs:', { approveUrl, rejectUrl });
        
        try {
            const emailResult = await sendEmail({
                to: studentUser.email,
                subject: 'Request to View Your Profile',
                htmlContent: `
                    <p>Hello ${studentUser.userName},</p>
                    <p>${businessUser.userName} (${business.idBusiness}) has requested to view your profile information.</p>
                    <p>Please click one of the following buttons to respond:</p>
                    <div style="margin: 20px 0;">
                        <a href="${approveUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Approve</a>
                        <a href="${rejectUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reject</a>
                    </div>
                    <p>This request will expire in 24 hours.</p>
                `
            });
            console.log('Email send result:', emailResult);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        return viewRequest;
    } catch (error) {
        console.error('Error in createViewRequest:', error);
        throw error;
    }
};

const handleViewRequestResponse = async (requestToken, isApproved) => {
    try {
        console.log('Starting handleViewRequestResponse with token:', requestToken);
        console.log('isApproved:', isApproved);

        // Find view request by token
        const viewRequest = await ViewRequest.findOne({ requestToken });
        console.log('Found viewRequest:', viewRequest);

        if (!viewRequest) {
            throw new Error('Invalid or expired request token');
        }

        if (viewRequest.status !== 'pending') {
            throw new Error('Request has already been processed');
        }

        viewRequest.status = isApproved ? 'approved' : 'rejected';
        console.log('Updated status to:', viewRequest.status);

        if (isApproved) {
            // Generate access token and set expiration
            viewRequest.accessToken = generateToken();
            viewRequest.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            console.log('Generated new access token:', viewRequest.accessToken);

            // Get business directly using its ID from the view request
            const business = await Business.findById(viewRequest.business);
            console.log('Found business:', business);
            if (!business) {
                throw new Error('Business not found');
            }

            // Get business user info
            const businessUser = await User.findById(business.userId);
            console.log('Found business user:', businessUser);
            if (!businessUser) {
                throw new Error('Business user not found');
            }

            // Get student directly using its ID from the view request
            const student = await Student.findById(viewRequest.student);
            console.log('Found student:', student);
            if (!student) {
                throw new Error('Student not found');
            }

            // Get student user info
            const studentUser = await User.findById(student.userId);
            console.log('Found student user:', studentUser);
            if (!studentUser) {
                throw new Error('Student user not found');
            }

            // URL để doanh nghiệp truy cập xem thông tin sinh viên
            const accessUrl = `${FRONTEND_URL}/business/view-student/${viewRequest.accessToken}`;
            console.log('Access URL:', accessUrl);

            try {
                await sendEmail({
                    to: businessUser.email,
                    subject: 'Access Granted to View Student Profile',
                    htmlContent: `
                        <p>Hello ${businessUser.userName},</p>
                        <p>Your request to view ${studentUser.userName}'s profile has been approved.</p>
                        <p>You can access the profile using the following link:</p>
                        <p><a href="${accessUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Profile</a></p>
                        <p>This link will expire in 24 hours.</p>
                    `
                });
                console.log('Approval email sent successfully');
            } catch (emailError) {
                console.error('Error sending approval email:', emailError);
                throw emailError;
            }
        } else {
            // Handling rejection
            const business = await Business.findById(viewRequest.business);
            console.log('Found business for rejection:', business);
            if (!business) {
                throw new Error('Business not found');
            }

            // Get business user info
            const businessUser = await User.findById(business.userId);
            console.log('Found business user for rejection:', businessUser);
            if (!businessUser) {
                throw new Error('Business user not found');
            }

            // Get student directly
            const student = await Student.findById(viewRequest.student);
            if (!student) {
                throw new Error('Student not found');
            }

            // Get student user info
            const studentUser = await User.findById(student.userId);
            if (!studentUser) {
                throw new Error('Student user not found');
            }

            try {
                // Notify business about rejection
                await sendEmail({
                    to: businessUser.email,
                    subject: 'Profile View Request Rejected',
                    htmlContent: `
                        <p>Hello ${businessUser.userName},</p>
                        <p>Your request to view ${studentUser.userName}'s profile has been rejected.</p>
                        <p>Please respect the student's privacy decision.</p>
                    `
                });
                console.log('Rejection email sent successfully');
            } catch (emailError) {
                console.error('Error sending rejection email:', emailError);
                throw emailError;
            }
        }

        await viewRequest.save();
        console.log('ViewRequest saved successfully');
        return viewRequest;
    } catch (error) {
        console.error('Error in handleViewRequestResponse:', error);
        throw error;
    }
};

const validateAccessToken = async (accessToken) => {
    try {
        console.log('Validating access token:', accessToken);
        
        const viewRequest = await ViewRequest.findOne({
            accessToken,
            status: 'approved',
            expiresAt: { $gt: new Date() }
        });
        
        console.log('ViewRequest result:', viewRequest);
        
        if (!viewRequest) {
            throw new Error('Invalid or expired access token');
        }

        return viewRequest;
    } catch (error) {
        console.error('ValidateAccessToken error:', error);
        throw error;
    }
};

module.exports = {
    createViewRequest,
    handleViewRequestResponse,
    validateAccessToken
}; 