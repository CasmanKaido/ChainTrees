# ChainTrees Quick Start Script
# This script helps you get started with the ChainTrees project

Write-Host "🌳 ChainTrees - Quick Start Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Check if Bun is installed
Write-Host "Checking for Bun..." -ForegroundColor Yellow
if (Get-Command bun -ErrorAction SilentlyContinue) {
    $bunVersion = bun --version
    Write-Host "✅ Bun is installed (version: $bunVersion)" -ForegroundColor Green
} else {
    Write-Host "❌ Bun is not installed" -ForegroundColor Red
    Write-Host "Please install Bun from: https://bun.sh" -ForegroundColor Yellow
    Write-Host "Run: irm bun.sh/install.ps1 | iex" -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Check if Git is installed
Write-Host "Checking for Git..." -ForegroundColor Yellow
if (Get-Command git -ErrorAction SilentlyContinue) {
    $gitVersion = git --version
    Write-Host "✅ Git is installed ($gitVersion)" -ForegroundColor Green
} else {
    Write-Host "❌ Git is not installed" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Initialize Git repository:" -ForegroundColor White
Write-Host "   git init" -ForegroundColor Gray
Write-Host "   git remote add origin https://github.com/CasmanKaido/ChainTrees.git" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Create initial project structure:" -ForegroundColor White
Write-Host "   See COMMIT_CHECKLIST.md for detailed structure" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Get your WalletConnect Project ID:" -ForegroundColor White
Write-Host "   Visit: https://cloud.reown.com" -ForegroundColor Cyan
Write-Host "   - Sign up/Login" -ForegroundColor Gray
Write-Host "   - Create new project" -ForegroundColor Gray
Write-Host "   - Select 'AppKit'" -ForegroundColor Gray
Write-Host "   - Copy your Project ID" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Set up environment variables:" -ForegroundColor White
Write-Host "   Copy .env.example to .env and add your keys" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Start with Commit 1:" -ForegroundColor White
Write-Host "   Follow the COMMIT_CHECKLIST.md step by step" -ForegroundColor Gray
Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host ""
Write-Host "- README.md                 - Project overview" -ForegroundColor White
Write-Host "- PROJECT_PLAN.md           - Detailed plan" -ForegroundColor White
Write-Host "- COMMIT_CHECKLIST.md       - Step-by-step guide" -ForegroundColor White
Write-Host "- WALLETCONNECT_GUIDE.md    - WalletConnect reference" -ForegroundColor White
Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "🚀 Ready to build ChainTrees!" -ForegroundColor Green
Write-Host ""
Write-Host "Remember: NO EMPTY COMMITS! Every commit must be meaningful." -ForegroundColor Yellow
Write-Host ""
Write-Host "Good luck! 🌳💚" -ForegroundColor Green
