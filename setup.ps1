# Check if Node.js is installed
$nodeVersion = node --version
if (-not $?) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
}

# Check if Docker is installed and running
$dockerVersion = docker --version
if (-not $?) {
    Write-Host "Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
    exit 1
}

# Create necessary directories if they don't exist
if (-not (Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads"
    New-Item -ItemType Directory -Path "uploads\documents"
}

# Install backend dependencies
Write-Host "Installing backend dependencies..."
Set-Location backend
npm install

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    @"
# Database
DATABASE_URL="postgresql://homeassistant:homeassistant@postgres:5432/homeassistant"

# JWT
JWT_SECRET="development_secret_key"

# Server
PORT=4000
NODE_ENV=development

# Redis
REDIS_URL="redis://redis:6379"

# Frontend URLs (CORS)
FRONTEND_URL="http://localhost:3000"

# File Upload
MAX_FILE_SIZE=10485760

# OpenAI (for AI features)
OPENAI_API_KEY="your_openai_api_key_here"
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

# Install web app dependencies
Write-Host "Installing web app dependencies..."
Set-Location ..\web-app
npm install

# Create web app .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    @"
REACT_APP_API_URL=http://localhost:4000
REACT_APP_WS_URL=ws://localhost:4000
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

# Return to root directory
Set-Location ..

# Start Docker Compose
Write-Host "Starting Docker services..."
docker compose down
docker compose up --build -d

# Wait for services to be ready
Write-Host "Waiting for services to start..."
Start-Sleep -Seconds 10

# Run database migrations
Write-Host "Running database migrations..."
docker compose exec backend npx prisma migrate dev --name init

Write-Host "`nSetup complete! The application is now running.`n"
Write-Host "You can access:"
Write-Host "- Web interface: http://localhost:3000"
Write-Host "- API: http://localhost:4000"
Write-Host "`nTo stop the application, run: docker compose down" 