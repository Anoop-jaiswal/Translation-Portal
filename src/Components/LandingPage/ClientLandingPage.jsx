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
  Input,
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

const STATUS_COLORS = {
  Uploaded: "#8884d8",
  "In Progress": "#ff9800",
  Completed: "#4caf50",
};

const MyFiles = () => {
  const [files, setFiles] = useState(
    () => JSON.parse(localStorage.getItem("files")) || []
  );
  const [openModal, setOpenModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fromLanguage, setFromLanguage] = useState("");
  const [toLanguage, setToLanguage] = useState("");
  const [tat, setTat] = useState("");

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
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
        fileName: uploadedFile.name,
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

  return (
    <Container sx={{ width: "100%", px: 3, mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" gap={3}>
          {Object.entries(statusCount).map(([status, count]) => (
            <FormControlLabel
              key={status}
              control={
                <Radio
                  checked
                  sx={{
                    color: STATUS_COLORS[status],
                    "&.Mui-checked": {
                      color: STATUS_COLORS[status],
                    },
                  }}
                />
              }
              label={
                <Typography fontWeight="bold">
                  {status}: {count}
                </Typography>
              }
            />
          ))}
        </Box>

        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Upload File
          <Input
            type="file"
            sx={{ display: "none" }}
            onChange={handleFileUpload}
          />
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
              <TableCell sx={{ py: 1 }}>
                <strong>File Name</strong>
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                <strong>From Language</strong>
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                <strong>To Language</strong>
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                <strong>TAT</strong>
              </TableCell>
              <TableCell sx={{ py: 1 }}>
                <strong>File Status</strong>
              </TableCell>
              <TableCell sx={{ py: 1 }}>
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
                      borderColor: STATUS_COLORS[file.status], // Outline color
                      color: STATUS_COLORS[file.status], // Text color
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  {file.status === "Completed" && (
                    <IconButton color="primary">
                      <DownloadIcon />
                    </IconButton>
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
