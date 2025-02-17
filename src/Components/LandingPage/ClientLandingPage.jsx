import React, { useState, useEffect } from "react";
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Radio,
  FormControlLabel,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { PickerOverlay } from "filestack-react";
import FilePresentIcon from "@mui/icons-material/FilePresent";

const STATUS_COLORS = {
  Uploaded: "#8884d8",
  "In Progress": "#ff9800",
  Completed: "#4caf50",
};

const MyFiles = () => {
  // Get the logged-in user
  const authenticatedUser =
    JSON.parse(localStorage.getItem("authenticatedUser")) || {};
  const userEmail = authenticatedUser.email || "";

  // Load only the logged-in user's files
  const [files, setFiles] = useState(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === userEmail);
    return user?.files || [];
  });

  const [translatedFiles, setTranslatedFiles] = useState(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === userEmail);
    return user?.translatedFile || [];
  });

  console.log(translatedFiles[0], "translatedFiles");

  const [openModal, setOpenModal] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fromLanguage, setFromLanguage] = useState("");
  const [toLanguage, setToLanguage] = useState("");
  const [tat, setTat] = useState("");

  // Update local storage when files change
  useEffect(() => {
    if (userEmail) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((u) => u.email === userEmail);
      if (userIndex !== -1) {
        users[userIndex].files = files;
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
  }, [files, userEmail]);

  const handleOpenPicker = () => {
    setOpenPicker(true);
  };

  const handleFileUpload = (res) => {
    if (res.filesUploaded.length > 0) {
      const file = res.filesUploaded[0];
      setUploadedFile(file);
      setOpenPicker(false);
      setOpenModal(true);
    }
  };

  const handleSubmit = () => {
    if (uploadedFile && fromLanguage && toLanguage && tat) {
      const newFile = {
        id: new Date().getTime(),
        fromLanguage,
        toLanguage,
        tat: `${tat} hours`,
        status: "Uploaded",
        fileName: uploadedFile.filename,
        fileUrl: uploadedFile.url,
        translatedFile: null,
      };

      setFiles([...files, newFile]);
      setOpenModal(false);
      setUploadedFile(null);
      setFromLanguage("");
      setToLanguage("");
      setTat("");
    }
  };

  const handleDelete = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const statusCount = files.reduce(
    (acc, file) => {
      acc[file.status] = (acc[file.status] || 0) + 1;
      return acc;
    },
    { Uploaded: 0, "In Progress": 0, Completed: 0 }
  );

  let apiKey = "AuxSCyn1SbGrSK5q1Rohgz";

  return (
    <Container sx={{ width: "100%", px: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Files
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        mt={3}
      >
        <Box display="flex" gap={3}>
          {Object.entries(statusCount).map(([status, count]) => (
            <Chip
              key={status}
              label={`${status}: ${count}`}
              sx={{
                backgroundColor: STATUS_COLORS[status],
                color: "white",
              }}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenPicker}
          startIcon={<CloudUploadIcon />}
        >
          Upload File
        </Button>
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
            <TableRow sx={{ height: "40px" }}>
              <TableCell>
                <strong>File Name</strong>
              </TableCell>
              <TableCell>
                <strong>From Language</strong>
              </TableCell>
              <TableCell>
                <strong>To Language</strong>
              </TableCell>
              <TableCell>
                <strong>TAT</strong>
              </TableCell>
              <TableCell>
                <strong>File Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id} sx={{ height: "40px" }}>
                <TableCell sx={{ py: 1 }}>{file.fileName}</TableCell>
                <TableCell sx={{ py: 1 }}>{file.fromLanguage}</TableCell>
                <TableCell sx={{ py: 1 }}>{file.toLanguage}</TableCell>
                <TableCell sx={{ py: 1 }}>{file.tat}</TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Chip
                    label={file.status}
                    variant="outlined"
                    sx={{
                      borderColor: STATUS_COLORS[file.status],
                      color: STATUS_COLORS[file.status],
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  {file.status === "Completed" && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      component="a"
                      href={translatedFiles[0]?.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<DownloadIcon />}
                      sx={{ ml: 1 }}
                    >
                      Translated
                    </Button>
                  )}
                  {file.status === "Uploaded" && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(file.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* File Picker */}
      {openPicker && (
        <PickerOverlay apikey={apiKey} onUploadDone={handleFileUpload} />
      )}

      {/* File Details Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>File Details</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Original Language"
            value={fromLanguage}
            onChange={(e) => setFromLanguage(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Translate To Language"
            value={toLanguage}
            onChange={(e) => setToLanguage(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Turnaround Time (TAT) in Hours"
            type="number"
            value={tat}
            onChange={(e) => setTat(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyFiles;
