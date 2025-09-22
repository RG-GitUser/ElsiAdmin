import React, { useState } from 'react';
import { Typography, Container, Button } from '@mui/material';
import TicketsTable from '../components/TicketsTable';
import TicketDialog from '../components/TicketDialog';

const TicketSupport = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Ticket Support
      </Typography>
      <Typography variant="body1" gutterBottom>
        Submit a new ticket or view the status of your existing tickets.
      </Typography>
      <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Open New Ticket
      </Button>
      <TicketsTable />
      <TicketDialog open={dialogOpen} onClose={handleCloseDialog} />
    </Container>
  );
};

export default TicketSupport;
