import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import useTicketsStore from '../store/ticketsStore';

const TicketsTable = () => {
  const { tickets, updateTicketStatus, deleteTicket } = useTicketsStore();
  const [open, setOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const handleClickOpen = (ticketId) => {
    setTicketToDelete(ticketId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTicketToDelete(null);
  };

  const handleDelete = () => {
    deleteTicket(ticketToDelete);
    handleClose();
  };


  const getPriorityChipColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Open':
        return 'primary';
      case 'In Progress':
        return 'secondary';
      case 'Closed':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <>
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ticket ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.id}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>
                <Chip
                  label={ticket.priority}
                  color={getPriorityChipColor(ticket.priority)}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={ticket.status}
                  onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                  variant="standard"
                  sx={{
                    '.MuiSelect-select:focus': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </TableCell>
              <TableCell>{new Date(ticket.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleClickOpen(ticket.id)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this ticket?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TicketsTable;
