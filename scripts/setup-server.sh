#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# One-time setup script for the AWS EC2 server.
# Run this ONCE after you first SSH into your instance:
#   chmod +x setup-server.sh && ./setup-server.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

REPO_URL="https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git"
APP_DIR="$HOME/namkeen420"
NODE_VERSION="20"

echo "━━━ 1 / System packages ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sudo apt-get update -y
sudo apt-get install -y git nginx curl

echo "━━━ 2 / Node.js ${NODE_VERSION} via nvm ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install $NODE_VERSION
nvm use $NODE_VERSION
nvm alias default $NODE_VERSION
node -v && npm -v

echo "━━━ 3 / PM2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -1 | sudo bash -
# Enables PM2 to survive reboots

echo "━━━ 4 / Clone repository ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

echo "━━━ 5 / Install dependencies & build ━━━━━━━━━━━━━━━━━━━━━━━━━"
# Create your .env.production.local here before building:
cat > .env.production.local << 'ENVEOF'
MONGODB_URI=REPLACE_ME
JWT_SECRET=REPLACE_ME
ADMIN_EMAIL=REPLACE_ME
ADMIN_PASSWORD=REPLACE_ME
NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER=REPLACE_ME
NEXT_PUBLIC_APP_URL=REPLACE_ME
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=REPLACE_ME
CLOUDINARY_API_KEY=REPLACE_ME
CLOUDINARY_API_SECRET=REPLACE_ME
ENVEOF
echo "⚠️  Edit .env.production.local with real values, then re-run from step 5."
echo "Press ENTER to continue once done."
read -r

npm ci
NODE_ENV=production npm run build
npm run seed   # creates admin user in the production DB

echo "━━━ 6 / Start app with PM2 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 start ecosystem.config.js --env production
pm2 save

echo "━━━ 7 / Nginx reverse proxy ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sudo tee /etc/nginx/sites-available/namkeen420 > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;          # replace _ with your domain once you have one

    client_max_body_size 10M;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/namkeen420 /etc/nginx/sites-enabled/namkeen420
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "✅ Setup complete!"
echo "   App running on port 3000, served via Nginx on port 80."
echo "   Public IP: $(curl -s http://checkip.amazonaws.com)"
echo ""
echo "Next steps:"
echo "  1. Point your domain DNS A record → the IP above"
echo "  2. Install SSL: sudo apt install certbot python3-certbot-nginx -y"
echo "            sudo certbot --nginx -d yourdomain.com"
