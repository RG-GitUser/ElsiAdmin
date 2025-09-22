
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const SpreadsheetEditor = () => {
    const location = useLocation();
    const { folder } = location.state || {};

    return (
        <Box>
            <Typography variant="h4">Spreadsheet Editor</Typography>
            {folder && (
                <Typography variant="h6">Saving to: {folder.name}</Typography>
            )}
            {/* Add your spreadsheet editor component here */}
        </Box>
    );
};

export default SpreadsheetEditor;
