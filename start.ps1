# Check if Docker is running
$dockerVersion = docker --version
if (-not $?) {
    Write-Host "Docker is not installed or not running. Please start Docker Desktop first."
    exit 1
}

# Start Docker Compose services
Write-Host "Starting Home Assistant services..."
docker compose up -d

Write-Host "`nApplication is starting...`n"
Write-Host "You can access:"
Write-Host "- Web interface: http://localhost:3000"
Write-Host "- API: http://localhost:4000"
Write-Host "`nTo stop the application, run: docker compose down" 