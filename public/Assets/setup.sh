#!/bin/bash

# Update system and install dependencies
echo -e "\e[32mUpdating system and upgrading...\e[0m"
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
echo -e "\e[32mInstalling nodejs...\e[0m"
sudo apt install -y nodejs
echo -e "\e[32mInstalling git...\e[0m"
sudo apt install git -y
echo -e "\e[32mInstalling gh...\e[0m"
sudo apt install gh -y
echo -e "\e[32mInstalling pm2...\e[0m"
sudo npm install -g pm2
echo -e "\e[32mInstalling apache2...\e[0m"
sudo apt install apache2 -y
echo -e "\e[32mInstalling certbot...\e[0m"
sudo apt install certbot python3-certbot-apache -y
echo -e "\e[32mInstalling net-tools...\e[0m"
sudo apt install net-tools
sudo apt install lsof

cd /home 

# Clone the repository
echo -e "\e[32mCloning the repository...\e[0m"
sudo git clone https://username:${process.env.ScriptGithubToken}@github.com/MIbnEKhalid/Portal.MIbnEKhalid.github.io.git
sudo mv Portal.MIbnEKhalid.github.io PortalApp
cd PortalApp

echo -e "\e[32mSetting up project...\e[0m"
sudo npm install
sudo pm2 start index.js --name PortalApp
sudo pm2 startup
sudo pm2 save

# Configure Apache2 
echo -e "\e[32mConfiguring Apache2...\e[0m"

sudo tee /etc/apache2/sites-available/portal.mbktechstudio.com.conf > /dev/null <<EOL
<VirtualHost *:80>
    ServerName portal.mbktechstudio.com
    ServerAlias www.portal.mbktechstudio.com

    # Proxy settings
    ProxyPass / http://localhost:3030/
    ProxyPassReverse / http://localhost:3030/

    # Set up headers for WebSockets
    Header always set Upgrade \$http_upgrade
    Header always set Connection 'upgrade'
    RequestHeader set Host portal.mbktechstudio.com
    RequestHeader set X-Forwarded-For expr=%{REMOTE_ADDR}

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOL

# Enable Apache modules for proxy and SSL
echo -e "\e[32mEnabling Apache modules...\e[0m"
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod ssl

# Enable the site
echo -e "\e[32mEnabling the site...\e[0m"
sudo a2ensite portal.mbktechstudio.com.conf

# Restart Apache2 and configure SSL with Certbot
echo -e "\e[32mRestarting Apache2 and configuring SSL with Certbot...\e[0m"
sudo systemctl restart apache2
sudo certbot --apache -d portal.mbktechstudio.com -d www.portal.mbktechstudio.com --email support@mbktechstudio.com --agree-tos --no-eff-email

# Allow Apache through UFW firewall and enable UFW
echo -e "\e[32mAllowing Apache through UFW and enabling UFW...\e[0m"
sudo ufw allow 'Apache Full'
echo "y" | sudo ufw --force enable

sudo systemctl restart apache2
sudo pm2 restart PortalApp

echo -e "\e[32mSetup complete\e[0m"