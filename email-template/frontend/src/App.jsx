import React, { useState } from "react";
import axios from "axios";
import { Button, InputGroup, FormControl, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FaSave, FaDownload, FaUpload } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

// Styled component for button customization
const StyledButton = styled(Button)`
  margin: 10px;
  font-size: 1.2rem;
  background-color: #007bff;
  border-color: #007bff;

  &:hover {
    background-color: #0056b3;
  }
`;

// Centered container for the main content
const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
`;

// Styled header
const StyledHeader = styled.div`
  width: 100%;
  padding: 20px;
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: white;
  text-align: center;
  font-family: "Arial", sans-serif;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderLogo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const HeaderSubtitle = styled.div`
  font-size: 1.2rem;
  font-style: italic;
  color: #e0e0e0;
`;

function App() {
  const [layout, setLayout] = useState("");
  const [emailData, setEmailData] = useState({
    title: "",
    content: "",
    footer: "",
    imageUrl: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image upload using react-dropzone
  const handleImageUpload = async (files) => {
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/uploadImage", formData);
      setEmailData({ ...emailData, imageUrl: response.data.imageUrl });
      setSelectedImage(file.name);
      setLoading(false);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      setLoading(false);
      toast.error("Image upload failed.");
    }
  };

  // Fetch the email layout from the backend
  const fetchLayout = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/getEmailLayout");
      setLayout(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch layout.");
    }
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageUpload,
    accept: "image/*",
  });

  // Save configuration
  const saveConfig = async () => {
    try {
      await axios.post("http://localhost:5000/uploadEmailConfig", emailData);
      toast.success("Configuration saved!");
    } catch (error) {
      toast.error("Failed to save configuration.");
    }
  };

  // Render and download the template
  const downloadTemplate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/renderAndDownloadTemplate", { emailData }, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template.html");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Failed to download template.");
    }
  };

  return (
    <CenteredContainer>
      {/* Stunning Header */}
      <StyledHeader>
        <HeaderLogo>Email Designer Pro</HeaderLogo>
        <HeaderSubtitle>Create and Customize Your Email Templates</HeaderSubtitle>
      </StyledHeader>

      <div className="container" style={{ width: "100%", maxWidth: "900px" }}>
        <Button onClick={fetchLayout} variant="primary" className="my-3">Load Template</Button>
        <div dangerouslySetInnerHTML={{ __html: layout }} />

        <InputGroup className="mb-3">
          <FormControl
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <FormControl
            as="textarea"
            name="content"
            placeholder="Content"
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <FormControl
            type="text"
            name="footer"
            placeholder="Footer"
            onChange={handleChange}
          />
        </InputGroup>

        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <StyledButton variant="secondary">
            <FaUpload /> Upload Image
          </StyledButton>
        </div>

        {selectedImage && <p>Selected Image: {selectedImage}</p>}

        <div className="my-3">
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <StyledButton onClick={saveConfig}>
                <FaSave /> Save Config
              </StyledButton>
              <StyledButton onClick={downloadTemplate}>
                <FaDownload /> Download Template
              </StyledButton>
            </>
          )}
        </div>

        <ToastContainer />
      </div>
    </CenteredContainer>
  );
}

export default App;
