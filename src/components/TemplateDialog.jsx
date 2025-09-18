
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import useTemplatesStore from "../store/templatesStore";

function TemplateDialog({ open, onClose, template }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const { addTemplate, updateTemplate } = useTemplatesStore();

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description);
    } else {
      setName("");
      setDescription("");
    }
    setError(null);
  }, [template, open]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Name is a required field.");
      return;
    }

    if (template) {
      updateTemplate(template.id, { name, description });
    } else {
      addTemplate({ name, description });
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TemplateDialog;
