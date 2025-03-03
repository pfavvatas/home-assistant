# AI-Powered Home Assistant

A modern home management system with AI capabilities for managing homes, bills, documents, and more.

## Features

- 🏠 Multi-home management
- 👥 User management with roles (owner, member)
- 💰 Bill tracking and reminders
- 📄 Document management
- 🤖 AI-powered assistance
- 🔐 Secure authentication
- 📱 Mobile and web access

## Tech Stack

- **Backend:**
  - Node.js with Express
  - PostgreSQL with Prisma ORM
  - Redis for caching
  - Socket.IO for real-time updates
  - JWT authentication

- **Frontend:**
  - React (Web)
  - React Native (Mobile)
  - Socket.IO client

- **AI Features:**
  - OpenAI GPT for natural language processing
  - Voice recognition
  - Document analysis

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- PostgreSQL 15
- Redis 7

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd home-assistant
```

2. Create environment files:
```bash
cp backend/.env.example backend/.env
cp web-app/.env.example web-app/.env
```

3. Update environment variables in `.env` files with your configuration

4. Start the development environment:
```bash
docker-compose up --build
```

5. Initialize the database:
```bash
docker-compose exec backend npx prisma migrate dev
```

## Development

The development environment is set up with hot-reloading for both backend and frontend:

- Backend API: http://localhost:4000
- Web interface: http://localhost:3000

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Web App Development

```bash
cd web-app
npm install
npm start
```

## API Documentation

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Homes

- POST `/api/homes` - Create new home
- GET `/api/homes` - List user's homes
- GET `/api/homes/:id` - Get specific home
- PUT `/api/homes/:id` - Update home
- POST `/api/homes/:id/members` - Add member to home

### Bills

- POST `/api/bills/:homeId` - Create new bill
- GET `/api/bills/home/:homeId` - List home's bills
- PUT `/api/bills/:id` - Update bill
- DELETE `/api/bills/:id` - Delete bill
- GET `/api/bills/upcoming` - Get upcoming bills
- PATCH `/api/bills/:id/pay` - Mark bill as paid

### Documents

- POST `/api/documents/:homeId` - Upload document
- GET `/api/documents/home/:homeId` - List home's documents
- GET `/api/documents/:id` - Get specific document
- PUT `/api/documents/:id` - Update document metadata
- DELETE `/api/documents/:id` - Delete document

## Mobile App

The mobile app is built with React Native and Expo. Setup instructions:

1. Install Expo CLI:
```bash
npm install -g expo-cli
```

2. Install dependencies:
```bash
cd mobile-app
npm install
```

3. Start the development server:
```bash
npm start
```

4. Use the Expo Go app on your mobile device to scan the QR code

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 