// Import required modules
const express = require("express");
const cors = require("cors"); 
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Initialize Express app
const app = express();

// Enable CORS for all routes and origins (you can restrict it to specific domains later)
app.use(cors());

// Middleware to parse JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (images uploaded to 'uploads' directory)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define storage configuration for image uploads using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Specify the upload destination
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Specify the filename with a timestamp
  },
});

// Initialize Multer with the defined storage and file filter for image files
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);  // Accept the file
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."), false);  // Reject the file
    }
  },
});

// API route to get the base HTML layout for email templates
app.get("/getEmailLayout", (req, res) => {
  const layoutPath = path.join(__dirname, "layout.html");

  // Read the layout file and send it as response
  fs.readFile(layoutPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load layout." });
    }
    res.status(200).send(data);
  });
});

// API route to upload an image
app.post("/uploadImage", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  
  // Send the URL of the uploaded image
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

// API route to save email configuration to a JSON file
app.post("/uploadEmailConfig", (req, res) => {
  const emailConfig = req.body;
  const configPath = path.join(__dirname, "emailConfig.json");

  // Write the email configuration to a JSON file
  fs.writeFile(configPath, JSON.stringify(emailConfig, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save email configuration." });
    }
    res.status(200).json({ message: "Configuration saved successfully." });
  });
});

// API route to render and download the email template with dynamic data
app.post("/renderAndDownloadTemplate", (req, res) => {
  const { emailData } = req.body;
  const layoutPath = path.join(__dirname, "layout.html");

  // Read the layout file and replace placeholders with emailData
  fs.readFile(layoutPath, "utf8", (err, layout) => {
    if (err) {
      return res.status(500).json({ error: "Failed to render template." });
    }

    // Replace placeholders in the layout with provided email data
    const renderedHtml = layout
      .replace("{{title}}", emailData.title || "")
      .replace("{{content}}", emailData.content || "")
      .replace("{{footer}}", emailData.footer || "")
      .replace("{{imageUrl}}", emailData.imageUrl || "");

    // Set the response headers to prompt the user to download the file as an HTML attachment
    res.setHeader("Content-Disposition", "attachment; filename=template.html");
    res.status(200).send(renderedHtml);
  });
});

// Start the server and listen on the specified port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
