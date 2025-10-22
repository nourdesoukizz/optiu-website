# OptiU Waitlist Setup

## Overview
The waitlist system allows users to sign up with their email, name, and company to join the OptiU waitlist. All submissions are stored in a CSV file for easy management.

## Files Created
- `waitlist.html` - The waitlist signup form page
- `waitlist-server.js` - Node.js server to handle form submissions
- `package.json` - Node.js dependencies
- `data/waitlist.csv` - CSV file where emails are stored (created automatically)

## Setup Instructions

### 1. Install Node.js Dependencies
```bash
npm install
```

### 2. Start the Waitlist Server
```bash
npm start
```

The server will run on `http://localhost:3001`

### 3. Serve the Website
You can continue using your existing http-server for the website:
```bash
http-server -p 4000 -c-1 --cors
```

## API Endpoints

### POST /api/waitlist
Accepts waitlist submissions with the following JSON structure:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "company": "Company Name (optional)",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/waitlist/count
Returns the current number of waitlist signups:
```json
{
  "count": 42
}
```

### GET /api/health
Health check endpoint:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Data Storage

Waitlist data is stored in `data/waitlist.csv` with the following columns:
- Email
- Name  
- Company
- Timestamp

## Features

- ✅ Email validation
- ✅ Duplicate email prevention
- ✅ CSV data export
- ✅ Responsive design
- ✅ Error handling
- ✅ Success messages
- ✅ CORS enabled

## Usage

1. Users click "Join the Waitlist" button on the Opti page
2. They're redirected to `waitlist.html` 
3. Fill out the form with email, name, and optional company
4. Data is submitted to the Node.js server
5. Server validates and stores data in CSV file
6. User sees success confirmation

## Accessing Waitlist Data

The CSV file is located at `data/waitlist.csv` and can be opened in Excel, Google Sheets, or any CSV viewer for analysis and management.