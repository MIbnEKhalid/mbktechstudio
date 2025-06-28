# Configuration Guide

## Gmail Settings
```properties
GMAIL_USER=username@gmail.com
GMAIL_PASS=abcdefghijklmnop
```
> **Note:** GMAIL_PASS is an app password, not your Gmail account password.  

> 1: Enable 2-Factor Authentication (2FA) on your Google account.

> 2: Go to your Google Account settings and search for "App Passwords".

> 3: Create a new app password, copy and paste it.

## Database Settings
```properties
DATABASE_URLO=postgresql://username:password@server.domain/db_name
DATABASE_URL1=postgresql://username:password@server.domain/db_name
```

## Environment Settings
```properties
localenv=true
```
> **Important:** Set to `true` for local testing only.  
> Use `false` or other value for production and unit testing.

## Site Settings
```properties
site=main
```
> **Options:** `main`, `docs`, `unilib`, `portfolio`, `privacy`, `api`, `portalapp` `download`

> Active only when `localenv=true`  
> Select based on target domain host





## Setup Script Settings
```properties
SetupScript_SECRET_TOKEN=password
SetupScript_Github_TOKEN=githubtoken
```
> **Note:** `SetupScript_SECRET_TOKEN` is used to download the `setup.sh` script.

## Main API Settings
```properties
Main_SECRET_TOKEN=password
```
> **Note:** `Main_SECRET_TOKEN` is used to authenticate restricted APIs.