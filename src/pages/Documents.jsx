import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Folder as FolderIcon,
  Description as FileIcon,
  UploadFile as UploadFileIcon,
  CreateNewFolder as CreateNewFolderIcon
} from '@mui/icons-material';

function Documents() {
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Documents
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<CreateNewFolderIcon />}
          sx={{ mr: 1 }}
          onClick={() => alert('Create new folder clicked')}
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
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
      </Box>
      <List>
        <ListItem>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Personal" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Work" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FileIcon />
          </ListItemIcon>
          <ListItemText primary="performance-review.pdf" />
        </ListItem>
      </List>
    </Paper>
  );
}

export default Documents;
