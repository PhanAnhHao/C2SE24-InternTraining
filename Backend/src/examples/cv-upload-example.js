// Example workflow for CV upload

/*
1. First, upload the CV document using a POST request to /api/upload-cv
   - Use multipart/form-data with a field named "document" containing the .pdf or .docx file
   - Example:
   
   // Frontend code example (using FormData)
   const formData = new FormData();
   formData.append('document', cvFile); // cvFile is the File object from a file input
   formData.append('studentId', userId); // Optional metadata
   
   const response = await fetch('/api/upload-cv', {
     method: 'POST',
     body: formData
   });
   
   const result = await response.json();
   // result will contain documentUrl, fileName, fileType, and uploadDate
   
2. After successful upload, update the user's profile with the CV information using PUT /users/:id/cv
   - Example:
   
   const updateResponse = await fetch(`/users/${userId}/cv`, {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       documentUrl: result.documentUrl,
       fileName: result.fileName,
       fileType: result.fileType,
       uploadDate: result.uploadDate
     })
   });
   
   const updatedUser = await updateResponse.json();
   // User profile now contains CV information
*/

/*
Example Response Format:

// From /api/upload-cv endpoint
{
  "documentUrl": "https://storage.googleapis.com/your-bucket/cv_documents/1620000000000_resume.pdf",
  "fileName": "resume.pdf",
  "fileType": "application/pdf",
  "uploadDate": "2023-05-13T10:30:00.000Z"
}

// From /users/:id/cv endpoint (updated user)
{
  "_id": "user-id",
  "userName": "John Doe",
  "email": "john@example.com",
  "location": "City, Country",
  "phone": "123-456-7890",
  "avatar": "avatar.jpg",
  "cv": {
    "url": "https://storage.googleapis.com/your-bucket/cv_documents/1620000000000_resume.pdf",
    "fileName": "resume.pdf",
    "fileType": "application/pdf",
    "uploadDate": "2023-05-13T10:30:00.000Z"
  },
  "idAccount": "account-id",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-05-13T10:30:00.000Z"
}
*/
