import React, { useState, useEffect, useRef } from "react";
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
  Collapse,
} from "@mui/material";
import {
  Edit,
  Delete,
  Folder,
  ExpandMore,
  ChevronRight,
  Share,
  PictureAsPdf,
} from "@mui/icons-material";
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
  const { templates, loading, error, fetchTemplates, deleteTemplate } =
    useTemplatesStore();
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

  const handleExport = (template) => {
    const input = document.getElementById(`export-${template.id}`);
    html2canvas(input, {
      logging: true,
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.width / canvas.height;
      const pageAspectRatio = width / height;
      let renderWidth = width;
      let renderHeight = width / canvasAspectRatio;
      if (renderHeight > height) {
        renderHeight = height;
        renderWidth = height * canvasAspectRatio;
      }

      pdf.addImage(imgData, "PNG", 0, 0, renderWidth, renderHeight);
      pdf.save(`${template.name}.pdf`);
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
        />
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

      <Box>
        {templateFolders.map((folder) => (
          <Box key={folder} sx={{ mb: 2 }}>
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
              {openFolder === folder ? (
                <ExpandMore sx={{ mr: 2 }} />
              ) : (
                <ChevronRight sx={{ mr: 2 }} />
              )}
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
                      {(user && template.owner === user.uid) ||
                      userRole.toLowerCase() === "admin" ? (
                        <>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(template);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="share"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenShareDialog(template);
                            }}
                            sx={{ ml: 1 }}
                          >
                            <Share />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="export"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExport(template);
                            }}
                            sx={{ ml: 1 }}
                          >
                            <PictureAsPdf />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTemplate(template.id);
                            }}
                            sx={{ ml: 1 }}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      ) : null}
                    </ListItemButton>
                  ))}
              </List>
            </Collapse>
          </Box>
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

      {/* Hidden div for PDF export content */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
        }}
      >
        {templates.map((template) => (
          <div
            id={`export-${template.id}`}
            key={`export-${template.id}`}
            style={{
              width: "800px",
              fontFamily: "Arial, sans-serif",
              color: "#333",
            }}
          >
            <div
              style={{
                backgroundColor: "#1976d2",
                color: "white",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h1 style={{ margin: 0, fontSize: "2.5em" }}>{template.name}</h1>
            </div>
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "15px",
                  marginBottom: "20px",
                  borderRadius: "5px",
                }}
              >
                <p style={{ margin: 0 }}>{template.description}</p>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #ccc" }} />
              {template.customFields &&
                template.customFields.map((field, index) => (
                  <div
                    key={field.id}
                    style={{
                      marginBottom: "10px",
                      padding: "10px",
                      backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
                      borderRadius: "5px",
                    }}
                  >
                    <strong style={{ color: "#1565c0" }}>{field.name}:</strong>
                    <div style={{ marginTop: "5px" }}>{field.value}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}

export default Templates;
