import { create } from 'zustand';
import { tickets as mockTickets } from '../data/tickets';

const useTicketsStore = create((set) => ({
  tickets: mockTickets,
  addTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, { ...ticket, id: state.tickets.length + 1, status: 'Open', createdAt: new Date().toISOString() }] })),
  createTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, { ...ticket, id: state.tickets.length + 1, status: 'Open', createdAt: new Date().toISOString() }] })),
  updateTicketStatus: (ticketId, newStatus) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ),
    })),
  deleteTicket: (ticketId) => 
    set((state) => ({ tickets: state.tickets.filter((ticket) => ticket.id !== ticketId) })), 
}));

export default useTicketsStore;
