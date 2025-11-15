#!/usr/bin/env bash
# Installation script for SWMS Complaint System

echo "🚀 Installing SWMS Complaint System Dependencies..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm or pnpm is installed
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    echo "✅ Package manager: pnpm ($(pnpm --version))"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "✅ Package manager: npm ($(npm --version))"
else
    echo "❌ Neither npm nor pnpm is installed."
    exit 1
fi

echo ""
echo "📦 Installing Resend package..."

# Install Resend
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm add resend
else
    npm install resend
fi

echo ""
echo "✅ Resend package installed successfully!"
echo ""
echo "📝 Next Steps:"
echo "1. Create .env.local file in project root"
echo "2. Add your Resend API key:"
echo "   RESEND_API_KEY=re_your_api_key_here"
echo "3. Add complaint email:"
echo "   COMPLAINT_EMAIL=swms.helpdesk@gmail.com"
echo "4. Add SWMS logo to public/swms.png"
echo ""
echo "📚 For detailed setup instructions, see COMPLAINT_SETUP.md"
echo ""
echo "🎉 Installation complete!"
