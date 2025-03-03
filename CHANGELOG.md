# Changelog

All notable changes to the Home Assistant project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2024-03-03

### Added
- Multi-language support:
  - English language support
  - Greek language support (Ελληνικά)
  - Language selector in navigation bar
  - Automatic language detection
  - Persistent language selection
- Translations for all UI elements:
  - Navigation items
  - Forms and buttons
  - Error messages
  - Documentation
  - Electricity tracking interface

### Changed
- Updated navigation bar with language selector
- Improved text formatting for multi-language support
- Enhanced user interface for better language switching

## [1.2.0] - 2024-03-03

### Added
- Integrated in-app documentation (Wiki) feature:
  - Comprehensive user guide
  - Step-by-step tutorials
  - Best practices and tips
  - Troubleshooting guide
- Added Documentation button in navigation bar
- Markdown styling for better readability

## [1.1.0] - 2024-03-03

### Added
- Electricity consumption tracking feature:
  - Track kWh usage and cost per period
  - Historical view of electricity consumption
  - Support for individual home tracking
  - Support for shared building bills with:
    - Per-apartment kWh tracking
    - Bill splitting functionality
    - Historical data for shared bills

### Changed
- Enhanced home details page with electricity consumption section
- Added new database tables for electricity tracking
- Updated API with new electricity-related endpoints

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
- Responsive design for various screen sizes

### Technical Features
- React frontend with Material-UI
- Node.js backend with Express
- PostgreSQL database with Prisma ORM
- Redis for session management
- Docker containerization
- JWT authentication
- Environment configuration
- API error handling
- Database migrations 