import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  updateFileStatus,
  addTranslatedFileToUser,
  refreshState,
} from "../Redux/Slices/Slice";
import { PickerOverlay } from "filestack-react";
import Tooltip from "@mui/material/Tooltip";
import MailIcon from "@mui/icons-material/Mail";

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
  const [translatedFile, setTranslatedFile] = useState(null);
  const apiKey = process.env.REACT_APP_API_KEY;

  const files = users.flatMap((user) =>
    user.files.map((file) => ({
      ...file,
      client: user.email,
    }))
  );

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

  const [openPicker, setOpenPicker] = useState(false);
  const handleUploadClick = (file) => {
    setSelectedFile(file);
    setOpenPicker(true);
  };

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setTranslatedFile(file);
  };

  const handleUploadSubmit = () => {
    if (!translatedFile || !selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const fileData = {
        id: new Date().getTime(),
        name: translatedFile.name,
        content: reader.result,
        uploadedAt: new Date().toISOString(),
      };

      dispatch(
        addTranslatedFileToUser({
          email: selectedFile.client,
          translatedFile: fileData,
        })
      );

      setOpenUploadModal(false);
      setTranslatedFile(null);
      setSelectedFile(null);
    };

    reader.readAsDataURL(translatedFile);
  };

  const handleFileUpload = (res) => {
    if (res.filesUploaded.length > 0) {
      const file = res.filesUploaded[0];

      const fileData = {
        id: new Date().getTime(),
        name: file.filename,
        url: file.url,
        uploadedAt: new Date().toISOString(),
      };

      dispatch(
        addTranslatedFileToUser({
          email: selectedFile.client,
          translatedFile: fileData,
        })
      );

      setOpenPicker(false);
      setSelectedFile(null);
    }
  };

  const getLatestData = () => {
    dispatch(refreshState());
  };

  useEffect(() => {
    getLatestData();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box display="flex" gap={3} mb={3} mt={3}>
        {Object.entries(statusCount).map(([status, count]) => (
          <Chip
            key={status}
            label={`${status} : ${count}`}
            sx={{
              backgroundColor: STATUS_COLORS[status],
              color: "white",
            }}
          />
        ))}
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          maxHeight: "65vh",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "1px",
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f0f0f0",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
          scrollbarWidth: "2px",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "35%" }}>
                <strong>File Name</strong>
              </TableCell>
              <TableCell sx={{ width: "20%" }}>
                <strong>Client</strong>
              </TableCell>
              <TableCell sx={{ width: "20%" }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell sx={{ width: "25%" }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell sx={{ width: "40%" }}>{file.fileName}</TableCell>
                <TableCell sx={{ width: "15%" }}>{file.client}</TableCell>
                <TableCell sx={{ width: "20%" }}>
                  <Select
                    value={file.status}
                    onChange={(e) => handleStatusChange(file, e.target.value)}
                    variant="standard"
                    disableUnderline
                    sx={{
                      minWidth: 120,
                      color: STATUS_COLORS[file.status],
                    }}
                  >
                    <MenuItem value="Uploaded">Uploaded</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </TableCell>
                <TableCell sx={{ width: "25%" }}>
                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: "12px" }}>
                        Download Original file
                      </Typography>
                    }
                    arrow
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleDownload(file.fileUrl)}
                      sx={{
                        ml: 1,
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "white",
                        },
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: "12px" }}>
                        Upload Translated file
                      </Typography>
                    }
                    arrow
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleUploadClick(file)}
                      disabled={file.status !== "Completed"}
                      sx={{
                        ml: 1,
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "white",
                        },
                      }}
                    >
                      <CloudUploadIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={
                      <Typography sx={{ fontSize: "12px" }}>
                        Send mail
                      </Typography>
                    }
                    arrow
                  >
                    <IconButton
                      color="default"
                      onClick={() => handleSendEmail(file)}
                      disabled={file.status !== "Completed"}
                      sx={{
                        ml: 1,
                        "&:hover": {
                          backgroundColor: "#1976d2",
                          color: "white",
                        },
                        color: "#1976d2",
                      }}
                    >
                      <MailIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {files.length < 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No clients have uploaded any files for translation yet.
          </Typography>
        </Box>
      )}

      <Dialog open={openUploadModal} onClose={() => setOpenUploadModal(false)}>
        <DialogTitle>Upload Translated File</DialogTitle>
        <DialogContent>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadSubmit}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {openPicker && (
        <PickerOverlay apikey={apiKey} onUploadDone={handleFileUpload} />
      )}
    </Container>
  );
};

export default AdminDashboard;
