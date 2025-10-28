# Deployment Guide: Enem Essay Corrector

This guide documents the process of deploying the Enem Essay Corrector application to a Google Cloud VM instance.

## 1. Prerequisites

-   A Google Cloud Platform account with a configured VM instance.
-   `gcloud` CLI installed and authenticated on your local machine.
-   `pnpm` installed on your local machine.

## 2. Build the Application

First, build the Next.js application locally to ensure there are no build errors:

```bash
cd enem-essay-corrector
pnpm build
```

## 3. Server Setup

Connect to your VM instance and prepare the server for deployment.

### 3.1. Connect to the Server

```bash
gcloud compute ssh cpd-niteroi-proxy
```

### 3.2. Install Nginx

Install the Nginx web server:

```bash
sudo apt-get update && sudo apt-get install -y nginx
```

### 3.3. Create Application Directory

Create a directory to host the application files:

```bash
sudo mkdir -p /var/www/enem.octacity.org && sudo chown -R $(whoami):$(whoami) /var/www/enem.octacity.org
```

### 3.4. Install Node.js, pm2, and pnpm

Install `nvm` (Node Version Manager) to manage Node.js versions, then install the latest LTS version of Node.js, `pm2` to keep the application running, and `pnpm`:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
npm install -g pm2
npm install -g pnpm
```

## 4. Deploy Application Files

Package the application files and copy them to the server.

### 4.1. Create a Tarball

Create a compressed archive of the application, excluding the `.next` and `node_modules` directories:

```bash
tar --exclude=".next" --exclude="node_modules" -czvf enem-essay-corrector.tar.gz enem-essay-corrector
```

### 4.2. Copy to Server

Copy the tarball to the server:

```bash
gcloud compute scp enem-essay-corrector.tar.gz cpd-niteroi-proxy:/var/www/enem.octacity.org
```

### 4.3. Extract on Server

Extract the tarball on the server and remove the archive file:

```bash
cd /var/www/enem.octacity.org
tar --strip-components=1 -xzvf enem-essay-corrector.tar.gz
rm enem-essay-corrector.tar.gz
```

## 5. Install Dependencies

Install the application dependencies on the server:

```bash
cd /var/www/enem.octacity.org
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
pnpm install
```

## 6. Increase Swap Space

If the server has limited memory, you may need to increase the swap space to prevent the build process from failing.

```bash
sudo swapoff /swapfile
sudo rm /swapfile
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 7. Configure Environment

Create a `.env.local` file in the application's root directory on the server and add the necessary environment variables. **Ensure that `NEXT_PUBLIC_APP_URL` is set to your domain.**

```bash
# /var/www/enem.octacity.org/.env.local

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Google Vision API
GOOGLE_VISION_API_KEY=...
GOOGLE_APPLICATION_CREDENTIALS=...

# Google Gemini API
GEMINI_API_KEY=...

# App Configuration
NEXT_PUBLIC_APP_URL=https://enem.octacity.org
```

## 8. Build the Application on the Server

Build the application on the server to create the production build in the `.next` directory:

```bash
cd /var/www/enem.octacity.org
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
pnpm build
```

## 9. Configure Nginx

Create an Nginx configuration file to proxy requests to the Next.js application.

### 9.1. Create Nginx Configuration

Create a new Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/enem.octacity.org
```

Add the following content to the file:

```nginx
server {
    listen 80;
    server_name enem.octacity.org;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9.2. Enable the Site

Create a symbolic link to the configuration file in the `sites-enabled` directory:

```bash
sudo ln -s /etc/nginx/sites-available/enem.octacity.org /etc/nginx/sites-enabled/
```

### 9.3. Test and Restart Nginx

Test the Nginx configuration and restart the service:

```bash
sudo nginx -t && sudo systemctl restart nginx
```

## 10. Obtain SSL Certificate

Use Certbot to obtain a free SSL certificate from Let's Encrypt and automatically configure Nginx for HTTPS:

```bash
sudo certbot --nginx -d enem.octacity.org --non-interactive --agree-tos -m your-email@example.com
```

## 11. Start the Application

Start the application using `pm2`:

```bash
cd /var/www/enem.octacity.org
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
pm2 start pnpm --name "enem-essay-corrector" -- start -p 3003
```

## 12. Monitoring

You can monitor the application logs using the following command:

```bash
pm2 logs enem-essay-corrector