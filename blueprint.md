# Project Blueprint

## Overview

This project is a comprehensive **Elsipogtog Employee Dashboard**. It serves as a central hub for managing employee information, roles, and for viewing key analytics. The application features a role-based access control system, allowing different levels of access for employees, managers, and administrators.

## Implemented Features

*   Firebase Authentication with email and password.
*   Firestore database for storing user data.
*   Role-based access control (in progress).
*   Light/Dark mode theme.
*   A responsive sidebar for navigation.

## Current Plan: Employee Dashboard Overhaul

The following steps will be taken to build out the full dashboard functionality:

1.  **Rebrand Dashboard:**
    *   Rename the main dashboard title to "Elsipogtog Employee Dashboard".
2.  **Enhance User Profiles:**
    *   Extend the user data model in Firestore to include:
        *   `department`
        *   `employeeId`
        *   `role` (e.g., 'employee', 'manager', 'admin')
    *   Create a "My Profile" page where users can view and update this information.
3.  **Add New Navigation Links:**
    *   Update the sidebar to include: "My Profile", "Permissions Management", and "Analytics".
4.  **Build Permissions Management Page:**
    *   Create a page accessible only to 'managers' and 'admins'.
    *   This page will allow them to:
        *   Search for any user.
        *   View a list of all users.
        *   Modify the `role` of other users.
5.  **Integrate Firebase Analytics:**
    *   Install and configure the Firebase Analytics SDK.
    *   Create a basic "Analytics" page to confirm integration.
6.  **Refine Security Rules:**
    *   Update Firestore security rules to enforce the new role-based permissions:
        *   Users can only read and write to their own profile.
        *   Managers and admins can read all user data and update specific fields like `role`.
7. **Export Templates to PDF**
    * Install `jspdf` and `html2canvas` to enable exporting templates to PDF.
    * Add an export button to each template item.
    * Implement the logic to convert the template content to a PDF and download it.
