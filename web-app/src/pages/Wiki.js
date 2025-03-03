import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

const wikiContent = `# Home Assistant Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Management](#user-management)
3. [Home Management](#home-management)
4. [Bills and Documents](#bills-and-documents)
5. [Best Practices](#best-practices)

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### First Steps
1. Register an account or log in if you already have one
2. Add your first home
3. Start managing your bills and documents

## User Management

### Registration
1. Click "Register" on the login page
2. Fill in your details:
   - Email address
   - Password (must be secure)
   - Name
3. Submit the registration form

### Login
1. Visit the login page
2. Enter your email and password
3. Click "Login"

## Home Management

### Adding a New Home
1. From the dashboard, click the "+" button
2. Enter home details:
   - Name (e.g., "My Apartment")
   - Address
3. Click "Create" to save

### Managing Homes
- View all your homes on the dashboard
- Click on a home to see its details
- Access bills and documents for each home
- View quick stats about bills and documents

### Home Members
- Add members to share home access
- Manage member permissions
- Remove members when needed

## Bills and Documents

### Managing Bills
1. Navigate to the Bills section
2. Add new bills with:
   - Amount
   - Due date
   - Category
   - Description
3. Track payment status
4. View bill history

### Document Management
1. Store important documents
2. Organize by categories
3. Easy access and sharing
4. Secure storage

## Best Practices

### Organization
- Keep bills up to date
- Regularly check due dates
- Organize documents by type
- Use clear names for files

### Security
- Use strong passwords
- Don't share login credentials
- Log out when finished
- Regularly review access

### Efficiency Tips
- Use quick actions from dashboard
- Check notifications regularly
- Keep documentation updated
- Back up important documents

## Need Help?
- Check this documentation first
- Contact support if needed
- Report any issues you find`;

const Wiki = () => {
  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Paper elevation={2}>
          <Box p={4}>
            <Box mb={4}>
              <Typography variant="h4" gutterBottom>
                Documentation
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Welcome to the Home Assistant documentation. Here you'll find everything you need to know about using the application.
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box className="markdown-body">
              <ReactMarkdown>{wikiContent}</ReactMarkdown>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Wiki; 