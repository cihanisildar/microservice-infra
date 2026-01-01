# Generate self-signed SSL certificate for local development
# In production, use Let's Encrypt or proper SSL certificates

$sslDir = "ssl"
if (-not (Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir
}

# Check if OpenSSL is installed
$opensslPath = Get-Command openssl -ErrorAction SilentlyContinue

if (-not $opensslPath) {
    Write-Host "❌ OpenSSL not found. Please install OpenSSL first." -ForegroundColor Red
    Write-Host "   Download from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Yellow
    exit 1
}

# Generate certificate
& openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout "$sslDir/key.pem" `
  -out "$sslDir/cert.pem" `
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

Write-Host "✅ Self-signed SSL certificate generated in $sslDir/ directory" -ForegroundColor Green
Write-Host "⚠️  For production, replace with proper SSL certificates!" -ForegroundColor Yellow
