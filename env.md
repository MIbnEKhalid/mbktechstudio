# Configuration Guide

## Gmail Settings
```properties
GMAIL_USER=username@gmail.com
GMAIL_PASS=abcdefghijklmnop
```
> **Note:** GMAIL_PASS is an app password, not your Gmail account password.  
> Generate it from Google Account > Security > App Passwords

## Database Settings
```properties
DATABASE_URL=postgresql://username:password@server.domain/db_name
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
> **Options:** main, docs, unilib, portfolio, privacy  
> Active only when `localenv=true`  
> Select based on target domain host
