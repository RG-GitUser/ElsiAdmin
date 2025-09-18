
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import useTemplatesStore from "../store/templatesStore";
import TemplateDialog from "../components/TemplateDialog";

function Templates() {
  const {
    templates,
    loading,
    error,
    fetchTemplates,
    deleteTemplate,
  } = useTemplatesStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleOpenDialog = (template = null) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedTemplate(null);
    setDialogOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      (template.name &&
        template.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (template.description &&
        template.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Templates
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add Template
        </Button>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <List>
        {filteredTemplates.map((template) => (
          <ListItem
            key={template.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenDialog(template)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteTemplate(template.id)}
                  sx={{ ml: 1 }}
                >
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={template.name || "N/A"}
              secondary={template.description || "N/A"}
            />
          </ListItem>
        ))}
      </List>
      <TemplateDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        template={selectedTemplate}
      />
    </Box>
  );
}

export default Templates;
