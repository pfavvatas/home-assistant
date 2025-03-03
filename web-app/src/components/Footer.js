import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { Info as InfoIcon, Close as CloseIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

// Import the changelog content
const changelogContent = `# Changelog

All notable changes to the Home Assistant project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-03-03

### Fixed
- Dashboard now properly loads homes data after login without requiring page refresh
- Fixed user data synchronization between auth context and dashboard
- Improved loading states in the dashboard component

### Changed
- Replaced page reload with proper data fetching in home creation
- Added loading spinner while fetching homes data
- Exposed setUser function in AuthContext for better state management

## [1.0.0] - 2024-03-03

### Added
- Initial release of Home Assistant application
- User authentication (register, login, logout)
- Home management features:
  - Create new homes
  - View homes in dashboard
  - Display home details (bills, documents, members)
- Basic navigation between views
- Material-UI integration for modern UI
- Responsive design for various screen sizes`;

export default function Footer() {
  const [openChangelog, setOpenChangelog] = useState(false);
  const version = '1.0.1';

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Version {version}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setOpenChangelog(true)}
          color="primary"
          sx={{ ml: 1 }}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Box>

      <Dialog
        open={openChangelog}
        onClose={() => setOpenChangelog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Changelog
          <IconButton onClick={() => setOpenChangelog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            <ReactMarkdown>{changelogContent}</ReactMarkdown>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
} 