import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import { updateFileStatus, addFileToUser } from "../Redux/Slices/Slice";

const STATUS_COLORS = {
  Uploaded: "#8884d8",
  "In Progress": "#ff9800",
  Completed: "#4caf50",
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const files = users.flatMap((user) =>
    user.files.map((file) => ({
      ...file,
      client: user.email,
    }))
  );

  // Count files by status
  const statusCount = files.reduce(
    (acc, file) => {
      acc[file.status] = (acc[file.status] || 0) + 1;
      return acc;
    },
    { Uploaded: 0, "In Progress": 0, Completed: 0 }
  );

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleUploadClick = (file) => {
    setSelectedFile(file);
    setOpenUploadModal(true);
  };

  // 📩 Send email using "mailto:"
  const handleSendEmail = (file) => {
    const subject = encodeURIComponent("Your Translated File is Ready!");
    const body = encodeURIComponent(
      `Hello,\n\nYour translated file "${file.fileName}" is ready.\n\nYou can download it here: ${file.fileUrl}\n\nBest Regards,\nAdmin Team`
    );

    window.location.href = `mailto:${file.client}?subject=${subject}&body=${body}`;
  };

  const handleStatusChange = (file, newStatus) => {
    const updatedFile = { ...file, status: newStatus };
    dispatch(updateFileStatus({ email: file.client, file: updatedFile }));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - File Management
      </Typography>

      {/* Status Summary */}
      <Box display="flex" gap={3} mb={3}>
        {Object.entries(statusCount).map(([status, count]) => (
          <Chip
            key={status}
            label={`${status}: ${count}`}
            sx={{
              backgroundColor: STATUS_COLORS[status],
              color: "white",
              fontWeight: "bold",
            }}
          />
        ))}
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          maxHeight: "60vh",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "1px", // Thin scrollbar width
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f0f0f0", // Light gray track
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888", // Dark gray thumb
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555", // Darker thumb on hover
          },
          scrollbarWidth: "2px", // For Firefox
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>File Name</strong>
              </TableCell>
              <TableCell>
                <strong>Client</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.fileName}</TableCell>
                <TableCell>{file.client}</TableCell>
                <TableCell>
                  <Select
                    value={file.status}
                    onChange={(e) => handleStatusChange(file, e.target.value)}
                    variant="standard"
                    disableUnderline
                    sx={{
                      minWidth: 120,
                      color: STATUS_COLORS[file.status],
                      fontWeight: "bold",
                    }}
                  >
                    <MenuItem value="Uploaded">Uploaded</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleDownload(file.fileUrl)}
                  >
                    <DownloadIcon />
                  </IconButton>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleUploadClick(file)}
                    startIcon={<CloudUploadIcon />}
                    sx={{ ml: 1 }}
                    disabled={
                      file.status === "Uploaded" ||
                      file.status === "In Progress"
                    }
                  >
                    Upload Translated
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => handleSendEmail(file)}
                    startIcon={<SendIcon />}
                    sx={{ ml: 1 }}
                    disabled={file.status !== "Completed"} // Only allow sending when completed
                  >
                    Send Email
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;
