# Deployment Guide: Enem Essay Corrector (Static)

This guide provides comprehensive instructions for deploying the **Enem Essay Corrector** application as a static site on a custom Ubuntu server using NGINX. This is the recommended approach for its simplicity and performance.

## 1. Prerequisites

- **Ubuntu Server**: A server with Ubuntu 20.04 or later.
- **Domain/Subdomain**: A registered domain or subdomain pointing to your server's IP address.
- **Node.js**: Version 18.x or later for the build process.
- **pnpm**: For dependency management.
- **NGINX**: Installed on your server.
- **Certbot**: For obtaining and managing SSL certificates.

## 2. Build and Deployment Steps

### 2.1. Build the Application Locally

First, build the application on your local machine. This process embeds the necessary environment variables into the static files.

```bash
# Ensure your .env.local is configured with production keys
pnpm install
pnpm build
```
This will create a `dist/` directory containing all the static assets for the application.

### 2.2. Upload Files to the Server

Upload the contents of the `dist/` directory to a temporary location on your Ubuntu server.

```bash
# Example using scp
scp -r dist/* user@your_server_ip:/tmp/enem-essay-dist
```

### 2.3. Create Site Directory on Server

Create a directory on your server where the application files will live.

```bash
# SSH into your server
ssh user@your_server_ip

# Create the directory
sudo mkdir -p /var/www/your-subdomain.com

# Move files from the temporary location
sudo mv /tmp/enem-essay-dist/* /var/www/your-subdomain.com/

# Set proper ownership
sudo chown -R www-data:www-data /var/www/your-subdomain.com
```

## 3. NGINX Configuration for a Static Site

Configure NGINX to serve the static files and handle client-side routing.

### 3.1. Create NGINX Config File

Create a new NGINX configuration file:

```bash
sudo nano /etc/nginx/sites-available/your-subdomain.com.conf
```

### 3.2. Add Server Block

Add the following server block, which is optimized for a React single-page application:

```nginx
server {
    listen 80;
    server_name your-subdomain.com;

    root /var/www/your-subdomain.com;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.3. Enable the Site and Secure with SSL

Enable the site and use Certbot to obtain an SSL certificate and configure HTTPS.

```bash
sudo ln -s /etc/nginx/sites-available/your-subdomain.com.conf /etc/nginx/sites-enabled/
sudo certbot --nginx -d your-subdomain.com
```
Certbot will automatically update your NGINX configuration for HTTPS.

## 4. Supabase Configuration

**This is a critical step.** For authentication to work, you must update your Supabase project's URL configuration.

1.  Go to your **Supabase Dashboard**.
2.  Navigate to **Authentication** -> **URL Configuration**.
3.  Set the **Site URL** to your new domain: `https://your-subdomain.com`.

## 5. Testing and Verification

1.  **Test NGINX Config**: Run `sudo nginx -t` to ensure there are no syntax errors.
2.  **Restart NGINX**: Run `sudo systemctl restart nginx`.
3.  **Access the Site**: Open your browser and navigate to `https://your-subdomain.com`.
4.  **Test Authentication**: Verify that the Google OAuth login flow works correctly.
5.  **Test Core Functionality**: Upload an essay to ensure the OCR and AI evaluation features are operational.

Your application is now deployed as a secure, static site.