// Example workflow for password management (change and reset)

/*
1. Change Password Example (user must be logged in)
   - This is used in the user profile section
   - Requires the current password and new password
   - Example:
   
   // Frontend code example (using fetch)
   const changePassword = async () => {
     const response = await fetch('/auth/change-password', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}` // JWT token required
       },
       body: JSON.stringify({
         currentPassword: 'currentPassword123',
         newPassword: 'newPassword123'
       })
     });
     
     const result = await response.json();
     if (result.message) {
       // Show success message
       alert('Password successfully updated');
     } else {
       // Show error message
       alert(`Error: ${result.error}`);
     }
   };
   
2. Forgot Password Flow (Step 1) - Request Password Reset
   - Used on login page with a "Forgot Password?" link
   - Only requires the user's email
   - Example:
   
   const requestPasswordReset = async () => {
     const email = document.getElementById('email').value;
     
     const response = await fetch('/auth/forgot-password', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ email })
     });
     
     const result = await response.json();
     if (result.message) {
       // Show success message
       alert('Password reset email sent. Please check your inbox.');
     } else {
       // Show error message
       alert(`Error: ${result.error}`);
     }
   };

3. Verify Reset Token (Step 2) 
   - When user clicks the link in email, the frontend should verify if token is valid
   - Example:

   const verifyResetToken = async (token) => {
     const response = await fetch(`/auth/verify-reset-token/${token}`, {
       method: 'GET'
     });
     
     const result = await response.json();
     return result.valid; // true if token is valid, false otherwise
   };

4. Reset Password (Step 3)
   - User enters new password after token is verified
   - Example:
   
   const resetPassword = async (token, newPassword) => {
     const response = await fetch(`/auth/reset-password/${token}`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ newPassword })
     });
     
     const result = await response.json();
     if (result.message) {
       // Show success message and redirect to login
       alert('Password has been reset successfully. Please log in with your new password.');
       window.location.href = '/login';
     } else {
       // Show error message
       alert(`Error: ${result.error}`);
     }
   };
*/

/*
Example Response Formats:

// From /auth/change-password endpoint
{
  "message": "Password successfully updated"
}

// From /auth/forgot-password endpoint
{
  "message": "Password reset email sent"
}

// From /auth/verify-reset-token/:token endpoint
{
  "valid": true
}
// or
{
  "valid": false,
  "error": "Password reset token is invalid or has expired"
}

// From /auth/reset-password/:token endpoint
{
  "message": "Password has been reset successfully"
}

// Error responses
{
  "error": "Current password is incorrect"
}
// or
{
  "error": "User not found with that email"
}
// or
{
  "error": "Password reset token is invalid or has expired"
}
*/
