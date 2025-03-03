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
import { Link as RouterLink } from 'react-router-dom';
import '../styles/markdown.css';
import { useTranslation } from 'react-i18next';

const wikiContent = `# Home Assistant Web Application Wiki

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Management](#user-management)
3. [Home Management](#home-management)
4. [Electricity Tracking](#electricity-tracking)
5. [Documents and Bills](#documents-and-bills)

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### Accessing the Application
1. Open your web browser
2. Navigate to the application URL (default: http://localhost:3000)
3. You'll be redirected to the login page if not authenticated

## User Management

### Registration
1. Click "Register" on the login page
2. Fill in the required information:
   - First Name
   - Last Name
   - Email address
   - Password (must be secure)
3. Submit the form
4. You'll be automatically logged in and redirected to the dashboard

### Login
1. Visit the login page
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to your dashboard

## Home Management

### Adding a New Home
1. From the dashboard, click "Add Home"
2. Fill in the home details:
   - Name (e.g., "My Apartment")
   - Address
3. Click "Create" to save

### Viewing Home Details
1. From the dashboard, click on any home card
2. You'll see the home details page with:
   - Basic information
   - Electricity records
   - Shared electricity bills
   - Documents
   - Bills

## Electricity Tracking

### Individual Home Electricity Records

#### Adding a New Record
1. Navigate to the home details page
2. Find the "Electricity Records" section
3. Click "Add Record"
4. Fill in the details:
   - Start Date
   - End Date
   - kWh Used
   - Cost (€)
   - Optional Notes
5. Click "Add Record" to save

#### Viewing Records
- All records are displayed in cards showing:
  - Period (start and end dates)
  - Usage in kWh
  - Cost in euros
  - Any additional notes

### Shared Building Electricity Bills

#### Creating a Shared Bill
1. Navigate to the home details page
2. Find the "Shared Electricity Bills" section
3. Click "Add Shared Bill"
4. Fill in the building details:
   - Building Name
   - Start Date
   - End Date
   - Total Cost (€)
5. Enter kWh usage for each apartment
6. The system automatically calculates each apartment's share
7. Click "Add Bill" to save

#### Viewing Shared Bills
- Each shared bill shows:
  - Building name
  - Total usage and cost
  - Your apartment's usage
  - Your share of the cost
  - Period covered

### Tips for Electricity Tracking
- Enter readings regularly (monthly recommended)
- Keep bills for reference
- Use notes field for important information
- Compare usage patterns over time
- Check shared bills promptly

## Documents and Bills

### Adding Documents
1. Navigate to the home details page
2. Go to the Documents section
3. Click "Add Document"
4. Fill in:
   - Title
   - Upload file or enter content
   - Select document type
5. Click "Save"

### Managing Bills
1. Go to the Bills section
2. Click "Add Bill"
3. Enter:
   - Type (Electricity, Internet, etc.)
   - Amount
   - Due Date
4. Mark as paid when processed

## Best Practices
1. Regular Updates
   - Enter electricity readings monthly
   - Update shared bills promptly
   - Keep documents organized

2. Data Accuracy
   - Double-check meter readings
   - Verify bill amounts
   - Keep original documents

3. Security
   - Use strong passwords
   - Log out when done
   - Don't share account credentials

## Support
If you encounter any issues:
1. Check this wiki for guidance
2. Contact system administrator
3. Report bugs through appropriate channels`;

const Wiki = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Paper elevation={2}>
          <Box p={4}>
            <Box mb={4}>
              <Typography variant="h4" gutterBottom>
                {t('wiki.title')}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {t('wiki.welcome')}
              </Typography>
            </Box>

            {/* Language Settings Section */}
            <Box mb={4}>
              <Typography variant="h5" gutterBottom>
                {t('wiki.languageSection.title')}
              </Typography>
              <Typography variant="body1" paragraph>
                {t('wiki.languageSection.description')}
              </Typography>
              <List>
                {t('wiki.languageSection.steps', { returnObjects: true }).map((step, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${index + 1}. ${step}`} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {t('wiki.languageSection.availableLanguages')}
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary={t('wiki.languageSection.languages.en')} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={t('wiki.languageSection.languages.el')} />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Rest of the Wiki content */}
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