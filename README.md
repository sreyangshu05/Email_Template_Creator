# Email Designer Pro

Email Designer Pro is a powerful and user-friendly application designed to help you create, customize, and manage professional email templates with ease. The project features a responsive web interface paired with a robust backend API for image uploads, email configuration, and template rendering.

---

## Features

- **Dynamic Email Templates**: Customize email templates with placeholders for titles, content, footers, and images.
- **Image Upload Support**: Upload and manage images for your email designs using drag-and-drop functionality.
- **Save and Reuse Configurations**: Save email configurations as JSON files for future use.
- **Download Rendered Templates**: Render customized templates and download them as `.html` files.
- **Real-Time Feedback**: Get instant notifications for actions (e.g., upload success, save success, or errors) with toast messages.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- A modern web browser

### Backend Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/sreyangshu05/Email_Template_Creator/new/master
   cd Email_Template_Creator
   npm install
   npm run start
   cd frontend
   npm install
   npm run dev


### Usage:
- Upload Image: POST /uploadImage
- Save Email Configuration: POST /uploadEmailConfig
- Render and Download Template: POST /renderAndDownloadTemplate
- Get Email Layout: GET /getEmailLayout


### Frontend Features:
- Template Preview: Load base templates and preview changes in real-time.
- Image Upload: Drag and drop images to upload them to the server.
- Customization: Modify the email title, content, footer, and image dynamically using input fields.
- Download HTML: Render and download the final email template with the click of a button.

### Technologies Used:
- Node.js with Express.js: Server-side framework.
- Multer: File upload middleware for handling images.
- fs and path: File system operations.
- cors: Cross-Origin Resource Sharing.
- React.js: Interactive UI library.
- Axios: HTTP client for API requests.
- React-Bootstrap: UI components.
- React-Toastify: Notifications.
- Styled-Components: CSS-in-JS library.

### Example Workflow:
- Start the backend and frontend servers.
- Load the base email layout using the "Load Template" button.
- Customize the email: Add title, content, footer, and an optional image.
- Save the configuration for later use.
- Render the customized email and download it as an .html file.
