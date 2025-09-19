import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
  Grid,
  Paper,
  Collapse
} from "@mui/material";
import { Edit, Delete, Folder, ExpandMore, ChevronRight, Share } from "@mui/icons-material";
import useTemplatesStore from "../store/templatesStore";
import TemplateDialog from "../components/TemplateDialog";
import ShareTemplateDialog from "../components/ShareTemplateDialog";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const templateFolders = [
    "Demo",
    "Health",
    "Social Work",
    "Education",
    "Administration",
  ];

function Templates() {
  const {
    templates,
    loading,
    error,
    fetchTemplates,
    deleteTemplate,
  } = useTemplatesStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState("");
  const [openFolder, setOpenFolder] = useState(null);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role || "");
        }
      }
    };

    if (user) {
      fetchUserRole();
    }
  }, [user, db]);

  const handleOpenDialog = (template = null) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedTemplate(null);
    setDialogOpen(false);
  };

  const handleOpenShareDialog = (template) => {
    setSelectedTemplate(template);
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setSelectedTemplate(null);
    setShareDialogOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFolderClick = (folder) => {
    setOpenFolder(openFolder === folder ? null : folder);
  };

  const filteredTemplates = user
    ? templates.filter(
        (template) =>
          ((template.name &&
            template.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (template.description &&
              template.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
          (template.owner === user.uid ||
            (template.sharedWith && template.sharedWith.includes(user.uid)) || userRole === 'Admin')
      )
    : [];

  const canCreateTemplate = userRole === "Admin" || userRole === "Manager";

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Templates
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        {canCreateTemplate && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Create New Template
          </Button>
        )}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      <Grid container spacing={2}>
        {templateFolders.map((folder) => (
          <Grid item xs={12} key={folder}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => handleFolderClick(folder)}
            >
              {openFolder === folder ? <ExpandMore sx={{ mr: 2 }} /> : <ChevronRight sx={{ mr: 2 }} />}
              <Folder sx={{ mr: 2 }} />
              <Typography variant="h6">{folder}</Typography>
            </Paper>
            <Collapse in={openFolder === folder} timeout="auto" unmountOnExit>
              <List>
                {filteredTemplates
                  .filter((template) => template.folder === folder)
                  .map((template) => (
                    <ListItemButton
                      key={template.id}
                      onClick={() => handleOpenDialog(template)}
                    >
                      <ListItemText
                        primary={template.name || "N/A"}
                        secondary={template.description || "N/A"}
                      />
                      {(user && template.owner === user.uid) || userRole === 'Admin' && (
                          <>
                            <IconButton
                              edge="end"
                              aria-label="edit"
                              onClick={(e) => {e.stopPropagation(); handleOpenDialog(template)} }
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="share"
                              onClick={(e) => {e.stopPropagation(); handleOpenShareDialog(template)} }
                              sx={{ ml: 1 }}
                            >
                              <Share />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={(e) => {e.stopPropagation(); deleteTemplate(template.id)} }
                              sx={{ ml: 1 }}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        )}
                    </ListItemButton>
                  ))}
              </List>
            </Collapse>
          </Grid>
        ))}
      </Grid>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <TemplateDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        template={selectedTemplate}
        templateFolders={templateFolders}
      />

      <ShareTemplateDialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        template={selectedTemplate}
      />
    </Box>
  );
}

export default Templates;
