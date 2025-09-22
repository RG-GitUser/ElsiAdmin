
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const TextEditor = () => {
    const location = useLocation();
    const { folder } = location.state || {};

    return (
        <Box>
            <Typography variant="h4">Text Editor</Typography>
            {folder && (
                <Typography variant="h6">Saving to: {folder.name}</Typography>
            )}
            {/* Add your text editor component here */}
        </Box>
    );
};

export default TextEditor;
