
import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { Folder, Article, Description, TableChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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

const steps = ['Select Folder', 'Choose Document Type'];

// Mock folder data
const folders = [
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'Projects' },
];

const documentTypes = [
    { name: 'Text Page', icon: <Article />, path: '/text-editor' },
    { name: 'Markdown', icon: <Description />, path: '/markdown-editor' },
    { name: 'Spreadsheet', icon: <TableChart />, path: '/spreadsheet-editor' },
];

const CreateDocumentModal = ({ open, handleClose }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const navigate = useNavigate();

    const handleSelectFolder = (folder) => {
        setSelectedFolder(folder);
        setActiveStep(1);
    };

    const handleSelectDocumentType = (docType) => {
        handleClose();
        navigate(docType.path, { state: { folder: selectedFolder } });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-document-modal-title"
        >
            <Box sx={style}>
                <Typography id="create-document-modal-title" variant="h6" component="h2">
                    Create New Document
                </Typography>
                <Stepper activeStep={activeStep} sx={{ my: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === 0 && (
                    <List>
                        {folders.map((folder) => (
                            <ListItemButton key={folder.id} onClick={() => handleSelectFolder(folder)}>
                                <ListItemIcon>
                                    <Folder />
                                </ListItemIcon>
                                <ListItemText primary={folder.name} />
                            </ListItemButton>
                        ))}
                    </List>
                )}
                {activeStep === 1 && (
                     <List>
                        {documentTypes.map((docType) => (
                            <ListItemButton key={docType.name} onClick={() => handleSelectDocumentType(docType)}>
                                <ListItemIcon>
                                    {docType.icon}
                                </ListItemIcon>
                                <ListItemText primary={docType.name} />
                            </ListItemButton>
                        ))}
                    </List>
                )}
                {activeStep === 1 && (
                    <Button onClick={handleBack} sx={{ mt: 2 }}>
                        Back
                    </Button>
                )}
            </Box>
        </Modal>
    );
};

export default CreateDocumentModal;
