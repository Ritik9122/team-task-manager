# Start Backend and Frontend Servers

Write-Host "🚀 Starting Team Task Manager..." -ForegroundColor Cyan

# Start Backend
Write-Host "`n📦 Starting Backend Server..." -ForegroundColor Yellow
$backendPath = "d:\4th year\team-task-manager\backend"

if (Test-Path $backendPath) {
    Push-Location $backendPath
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "Backend running on: http://localhost:5000" -ForegroundColor Green
    npm run dev &
    
    Pop-Location
} else {
    Write-Host "❌ Backend folder not found!" -ForegroundColor Red
}

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor Yellow
$frontendPath = "d:\4th year\team-task-manager\frontend"

if (Test-Path $frontendPath) {
    Push-Location $frontendPath
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "Frontend running on: http://localhost:3000" -ForegroundColor Green
    npm run dev &
    
    Pop-Location
} else {
    Write-Host "❌ Frontend folder not found!" -ForegroundColor Red
}

Write-Host "`n✅ Both servers are starting!" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep terminal open
Read-Host "Press Enter to continue"
