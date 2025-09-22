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
  Paper,
  Collapse
} from "@mui/material";
import { Edit, Delete, Folder, ExpandMore, ChevronRight, Share, PictureAsPdf } from "@mui/icons-material";
import useTemplatesStore from "../store/templatesStore";
import TemplateDialog from "../components/TemplateDialog";
import ShareTemplateDialog from "../components/ShareTemplateDialog";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  const handleExportAll = () => {
    const dataStr = JSON.stringify(templates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'templates.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  const handleExportPdf = (template) => {
    const input = document.createElement('div');
    input.innerHTML = template.content;
    document.body.appendChild(input);
    
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save(`${template.name}.pdf`);
        document.body.removeChild(input);
      });
  };

  const filteredTemplates = templates.filter(
    (template) =>
      (template.name &&
        template.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.description &&
        template.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const canCreateTemplate = userRole.toLowerCase() === "admin";

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Templates
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1}}>
            <Button
            variant="outlined"
            onClick={handleExportAll}
            >
            Export All
            </Button>
            {canCreateTemplate && (
                <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog()}
                >
                Create New Template
                </Button>
            )}
        </Box>
      </Box>

      <Box>
        {templateFolders.map((folder) => (
            <Paper key={folder} elevation={3} sx={{ borderRadius: 2, mb: 2 }}>
                <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    borderTopLeftRadius: 'inherit',
                    borderTopRightRadius: 'inherit',
                }}
                onClick={() => handleFolderClick(folder)}
                >
                {openFolder === folder ? <ExpandMore sx={{ mr: 1 }} /> : <ChevronRight sx={{ mr: 1 }} />}
                <Folder sx={{ mr: 1 }} />
                <Typography variant="h6">{folder}</Typography>
                </Box>
                <Collapse in={openFolder === folder} timeout="auto" unmountOnExit>
                <List dense sx={{ py: 1 }}>
                    {filteredTemplates
                    .filter((template) => template.folder === folder)
                    .map((template) => (
                        <ListItemButton
                        key={template.id}
                        onClick={() => handleOpenDialog(template)}
                        sx={{ pl: 4, mx: 2, borderRadius: 1}}
                        >
                        <ListItemText
                            primary={template.name || "N/A"}
                            secondary={template.description || "N/A"}
                        />
                        {(user && template.owner === user.uid) || userRole.toLowerCase() === 'admin' ? (
                            <Box sx={{ display: 'flex'}}>
                                <IconButton
                                edge="end"
                                aria-label="edit"
                                size="small"
                                onClick={(e) => {e.stopPropagation(); handleOpenDialog(template)} }
                                >
                                <Edit fontSize="small"/>
                                </IconButton>
                                <IconButton
                                edge="end"
                                aria-label="share"
                                size="small"
                                onClick={(e) => {e.stopPropagation(); handleOpenShareDialog(template)} }
                                >
                                <Share fontSize="small"/>
                                </IconButton>
                                <IconButton
                                edge="end"
                                aria-label="export"
                                size="small"
                                onClick={(e) => {e.stopPropagation(); handleExportPdf(template)} }
                                >
                                <PictureAsPdf fontSize="small"/>
                                </IconButton>
                                <IconButton
                                edge="end"
                                aria-label="delete"
                                size="small"
                                onClick={(e) => {e.stopPropagation(); deleteTemplate(template.id)} }
                                >
                                <Delete fontSize="small"/>
                                </IconButton>
                            </Box>
                            ) : null}
                        </ListItemButton>
                    ))}
                </List>
                </Collapse>
            </Paper>
        ))}
      </Box>

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
