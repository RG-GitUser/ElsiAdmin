import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import useTemplatesStore from "../store/templatesStore";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

function TemplateDialog({ open, onClose, template, templateFolders }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [folder, setFolder] = useState("");
  const [customFields, setCustomFields] = useState([]);
  const [error, setError] = useState(null);
  const [creatorName, setCreatorName] = useState("");
  const { addTemplate, updateTemplate } = useTemplatesStore();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCreatorName = async (uid) => {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data().name || "Unknown";
      } else {
        return "Unknown";
      }
    };

    if (template) {
      setName(template.name || "");
      setDescription(template.description || "");
      setFolder(template.folder || "");
      setCustomFields(template.customFields || []);
      if (template.createdBy) {
        fetchCreatorName(template.createdBy).then(setCreatorName);
      }
    } else {
      setName("");
      setDescription("");
      setFolder("");
      setCustomFields([]);
      setCreatorName(""); 
    }
    setError(null);
  }, [template, open, db]);

  const handleAddCustomField = () => {
    setCustomFields([...customFields, { id: Date.now(), name: "", value: "" }]);
  };

  const handleCustomFieldChange = (id, field, value) => {
    const newCustomFields = customFields.map((cf) => {
      if (cf.id === id) {
        return { ...cf, [field]: value };
      }
      return cf;
    });
    setCustomFields(newCustomFields);
  };

  const handleRemoveCustomField = (id) => {
    setCustomFields(customFields.filter((cf) => cf.id !== id));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is a required field.");
      return;
    }

    if (template) {
      updateTemplate(template.id, { name, description, folder, customFields });
    } else {
      const newTemplate = {
        name,
        description,
        folder,
        customFields,
      };
      addTemplate(newTemplate);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{template ? "Edit Template" : "Add Template"}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          error={!!error}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Folder</InputLabel>
          <Select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            label="Folder"
          >
            {templateFolders.map((folderName) => (
              <MenuItem key={folderName} value={folderName}>
                {folderName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Custom Fields</Typography>
          {customFields.map((field) => (
            <Box
              key={field.id}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <TextField
                margin="dense"
                label="Field Name"
                type="text"
                variant="standard"
                value={field.name}
                onChange={(e) =>
                  handleCustomFieldChange(field.id, "name", e.target.value)
                }
                sx={{ mr: 1 }}
              />
              <TextField
                margin="dense"
                label="Field Value"
                type="text"
                variant="standard"
                value={field.value}
                onChange={(e) =>
                  handleCustomFieldChange(field.id, "value", e.target.value)
                }
              />
              <IconButton onClick={() => handleRemoveCustomField(field.id)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button onClick={handleAddCustomField} startIcon={<Add />}>
          Add Field
        </Button>

        {template && (
          <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="h6" gutterBottom>Template Information</Typography>
            <Typography variant="body1">
              Created by: {creatorName}
            </Typography>
            <Typography variant="body1">
              Creation time: {template.createdAt?.toDate().toLocaleString()}
            </Typography>
            {template.updatedAt && (
              <Typography variant="body1">
                Last updated: {template.updatedAt?.toDate().toLocaleString()}
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TemplateDialog;