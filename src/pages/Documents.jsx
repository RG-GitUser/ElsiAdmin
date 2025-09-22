import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Modal,
  TextField,
  Breadcrumbs,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  UploadFile as UploadFileIcon,
  CreateNewFolder as CreateNewFolderIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import useDocumentStore from '../store/documentStore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Documents() {
  const { fileSystem, setFileSystem } = useDocumentStore();
  const [currentPath, setCurrentPath] = useState(['root']);
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateFolder = () => {
    if (folderName) {
      const newFileSystem = JSON.parse(JSON.stringify(fileSystem)); // Deep copy
      let currentLevel = newFileSystem;
      for (const part of currentPath) {
        currentLevel = currentLevel[part].children;
      }
      currentLevel[folderName] = { type: 'folder', children: {} };
      setFileSystem(newFileSystem);
      setFolderName('');
      handleClose();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newFileSystem = JSON.parse(JSON.stringify(fileSystem)); // Deep copy
      let currentLevel = newFileSystem;
      for (const part of currentPath) {
        currentLevel = currentLevel[part].children;
      }
      currentLevel[file.name] = { type: 'file' };
      setFileSystem(newFileSystem);
    }
  };

  const handleFolderClick = (name) => {
    setCurrentPath([...currentPath, name]);
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleDeleteClick = (name) => {
    setItemToDelete(name);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = () => {
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem)); // Deep copy
    let currentLevel = newFileSystem;
    for (const part of currentPath) {
      currentLevel = currentLevel[part].children;
    }
    delete currentLevel[itemToDelete];
    setFileSystem(newFileSystem);
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };


  let currentLevel = fileSystem;
  for (const part of currentPath) {
    currentLevel = currentLevel[part].children;
  }
  const currentItems = Object.keys(currentLevel).map((key) => ({
    name: key,
    type: currentLevel[key].type,
  }));

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Documents
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          {currentPath.map((part, index) => (
            <Link
              key={index}
              component="button"
              onClick={() => handleBreadcrumbClick(index)}
            >
              {part}
            </Link>
          ))}
        </Breadcrumbs>
        <Box>
        <Button
          variant="contained"
          startIcon={<CreateNewFolderIcon />}
          sx={{ mr: 1 }}
          onClick={handleOpen}
        >
          Create Folder
        </Button>
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={handleUploadClick}
        >
          Upload File
        </Button>
        </Box>
        
      </Box>
      <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

      {currentPath.length > 1 && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => handleBreadcrumbClick(currentPath.length - 2)}
        >
          Back
        </Button>
      )}

      <List>
        {currentItems.map((item, index) => (
          <ListItem
            key={index}
            button={item.type === 'folder'}
            onClick={() => item.type === 'folder' && handleFolderClick(item.name)}
          >
            <ListItemIcon>
              {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
            </ListItemIcon>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteClick(item.name)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Folder
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Folder Name"
            type="text"
            fullWidth
            variant="standard"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <Button onClick={handleCreateFolder}>Create</Button>
        </Box>
      </Modal>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{itemToDelete}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Documents;
