# Elsi - AI-Powered Ticket Support System

## Overview

Elsi is a modern, AI-powered ticket support system designed to streamline customer service and issue resolution. This document outlines the plan for creating a new ticket support page within the Elsi application.

## Current Project Status

### Implemented Features:

*   **Authentication:** User login and registration functionality.
*   **Dashboard:** A central hub for users to access various features.
*   **Document Management:** A system for creating, editing, and managing documents.
*   **User Management:** A page for viewing and managing users.
*   **Settings:** A page for configuring application settings.
*   **Ticket Support:** A page for creating and managing support tickets.

### Design and Styling:

*   **Component Library:** Material-UI for a consistent and modern look and feel.
*   **Theming:** A custom theme with a purple color palette.
*   **Layout:** A responsive dashboard layout with a sidebar for navigation.

## Plan: Ticket Support Page

This section outlines the plan for creating the new ticket support page.

### 1. Routing

*   A new route has been added to the main application router (`src/App.jsx`) to handle the ticket support page:
    *   `path="/support"` renders the `TicketSupport` component.
*   The old `/tickets` route has been removed.

### 2. Components

*   **`TicketSupport.jsx` (Page Component):**
    *   This is the main component for the ticket support page.
    *   It contains a button to open a new ticket dialog and a table for displaying existing tickets.
*   **`TicketDialog.jsx` (Component):**
    *   A dialog for creating a new ticket.
    *   Fields include: Title, Description, and Priority (Low, Medium, High).
*   **`TicketsTable.jsx` (Component):**
    *   A table for displaying a list of existing tickets.
    *   Columns will include: Ticket ID, Title, Priority, Status (Open, In Progress, Closed), and Date Created.
    *   A delete button has been added to each row to allow for the deletion of tickets. A confirmation dialog is included to prevent accidental deletions.
*   **`Dashboard.jsx` (Component):**
    *   The dashboard navigation has been updated to include a link to the new "Support" page.

### 3. State Management

*   A new Zustand store has been created to manage the state of the tickets (`src/store/ticketsStore.js`).
*   The store will handle:
    *   Fetching tickets from a data source (initially a mock data file, later a Firebase backend).
    *   Adding new tickets.
    *   Updating the status of existing tickets.
    *   Deleting tickets.

### 4. Styling

*   The new components will be styled using Material-UI to match the existing design of the application.
*   The `TicketsTable.jsx` component will use the Material-UI `Table` component.

### 5. Mock Data

*   Initially, a mock data file (`src/data/tickets.js`) will be created to provide data for the `TicketsTable.jsx` component. This will allow for the development and testing of the UI without a live backend.
